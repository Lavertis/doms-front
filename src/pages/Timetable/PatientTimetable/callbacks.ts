import moment from 'moment';
import {AxiosError, AxiosResponse} from 'axios';
import {PagedResponse} from '../../../types/PagedResponse';
import {Appointment} from '../../../types/Appointments/Appointment';
import {authRequest} from '../../../services/api.service';
import {NotEditableAppointmentStatuses} from '../timetableUtils';
import {TimetableData} from '../../../types/Timetable';
import {appointmentMapper, EventStates, timetableMapper} from './utils';
import userStore from '../../../store/user-store';
import appointmentTypeStore from '../../../store/appointment-type-store';
import appointmentStatusStore from '../../../store/appointment-status-store';
import {Doctor} from '../../../types/Users/Doctor';
import {uuidToBase64} from "../../../utils/uuid-utils";

export const updateEventsCallback = async (info: any, successCallback: any, failureCallback: any, selectedDoctor?: Doctor) => {
    let appointmentQueryParams: any = { // TODO make appointment query params the same as timetable query params
        dateStart: moment.unix(info.start.valueOf() / 1000).toISOString(),
        dateEnd: moment.unix(info.end.valueOf() / 1000).toISOString()
    };
    if (selectedDoctor)
        appointmentQueryParams.doctorId = selectedDoctor.id;

    let appointmentsResponse: AxiosResponse<PagedResponse<Appointment>> = await authRequest.get(
        `appointments/patient/current/search`,
        {params: appointmentQueryParams}
    );
    let appointments = appointmentsResponse.data.records
        .map((appointment) => {
            appointment.type = appointmentTypeStore.getById(appointment.typeId);
            appointment.status = appointmentStatusStore.getById(appointment.statusId);

            return appointment;
        })
        .filter(appointment => !NotEditableAppointmentStatuses.includes(appointment.status!.name));

    let timetableQueryParams = { // TODO make appointment query params the same as timetable query params
        startDateTime: moment.unix(info.start.valueOf() / 1000).toISOString(),
        endDateTime: moment.unix(info.end.valueOf() / 1000).toISOString()
    };
    let timetables: TimetableData[] | null = null;
    if (selectedDoctor) {
        let timetablesResponse: AxiosResponse<TimetableData[]> = await authRequest.get(
            `timetables/doctor/${selectedDoctor.id}`,
            {params: timetableQueryParams}
        );
        timetables = timetablesResponse.data;
    }
    // TODO handle errors

    let events: any[] = [];
    if (timetables)
        events = events.concat(timetables.map(timetableMapper));
    events = events.concat(appointments.map((appointment) => appointmentMapper(appointment, !!selectedDoctor)));
    successCallback(events);
};

export const onEventClickCallback = (eventInfo: any, navigate: any) => {
    const event = eventInfo.event;
    if (event.display === 'background')
        return;
    if (eventInfo.jsEvent.path.filter((element: any) => element.className && element.className.split(' ').includes('pi')).length)
        return;
    // TODO check if newly added event


    navigate(`/appointments/${uuidToBase64(event.id)}/edit`);
};

export const onEventReceiveCallback = (info: any, eventStates: EventStates) => {
    eventStates.setAddedEventIds(prevState => {
        prevState.push(info.event.id);
        return prevState;
    });
};

export const onEventChangeCallback = (changeInfo: any, eventStates: EventStates) => {
    const eventId = changeInfo.event.id;

    const indexToRemove = eventStates.addedEventIds.indexOf(eventId);
    if (indexToRemove > -1) {
        return;
    }
    eventStates.setChangedEventIds(prevState => {
        prevState.add(eventId);
        return prevState;
    });
};

export const onEventRemoveCallback = (removeInfo: any, eventStates: EventStates) => {
    const eventId = removeInfo.event.id;

    const indexToRemove = eventStates.addedEventIds.indexOf(eventId);
    if (indexToRemove > -1) {
        eventStates.setAddedEventIds(prevState => {
            prevState.splice(indexToRemove, 1);
            return prevState;
        });
        return;
    }

};

export const saveAppointments = (calendarRef: any, toast: any, eventStates: EventStates, selectedDoctor?: Doctor) => {
    let allEvents = calendarRef.current.getApi().getEvents();

    let eventsToCreate = allEvents
        .filter((e: any) => eventStates.addedEventIds.includes(e.id))
        .map((e: any) => ({
            type: e.title.split(',')[0].toUpperCase(),
            startDateTime: moment(e.startStr).toISOString(),
            endDateTime: e.endStr ? moment(e.endStr).toISOString() : moment(e.startStr).add('1', 'hours').toISOString()
        }));
    let eventsToUpdate = allEvents.filter((e: any) => eventStates.changedEventIds
        .has(e.id))
        .map((e: any) => ({
            id: e.id,
            status: e.title.split('(')[1].split(')')[0].toUpperCase(),
            startDateTime: moment(e.startStr).toISOString(),
            endDateTime: e.endStr ? moment(e.endStr).toISOString() : moment(e.startStr).add('1', 'hours').toISOString()
        }));

    let allPromises: Promise<{ op: string; res: boolean; error: string }>[] = [];
    if (eventsToCreate.length) {
        allPromises.push(
            saveCreatedEvents(eventsToCreate, eventStates, selectedDoctor)
        );
    }
    if (eventsToUpdate.length) {
        allPromises.push(
            saveUpdatedEvents(eventsToUpdate, eventStates)
        );
    }

    Promise.all(allPromises).then(async (results) => {
        const failedOps = await results
            .filter((ele) => !ele.res)
            .map(async (ele) => {
                ele = (await (ele as any)[0]);
                return [ele.op, ele.error];
            })[0];

        if (results.length === 0) {
            return;
        }
        else if (failedOps.length === results.length) {
            toast.current.show({closable: false, severity: 'error', summary: (failedOps[0] as any)[1][0]});
        }
        else if (failedOps.length) {
            toast.current.show({
                closable: false,
                severity: 'error',
                summary: `Failed to: ${failedOps[0]}`,
                detail: (failedOps[1] as any)[0]
            });
        }
        else {
            toast.current.show({closable: false, severity: 'success', summary: 'Saved'});
        }
    });
};

export const saveCreatedEvents = (createdEvents: any, eventStates: EventStates, selectedDoctor?: Doctor) => {
    return createdEvents.map((event: any) => {
        let requestBody = {
            date: event.startDateTime,
            description: 'desc',
            patientId: userStore.user!.id,
            doctorId: selectedDoctor?.id,
            typeId: appointmentTypeStore.getByName(event.type)
        };

        return authRequest.post('appointments/patient/current/request', requestBody)
            .then(() => {
                eventStates.setAddedEventIds([]);
                return {op: 'add', res: true};
            })
            .catch((errorResponse: AxiosError) => {
                const errorMessage = Object.values((errorResponse.response?.data as any)['errors' as any])[0];
                return {op: 'add', res: false, error: errorMessage};
            });
    });
};

export const saveUpdatedEvents = (updatedEvents: any, eventStates: EventStates) => {
    return updatedEvents.map((event: any) => {
            let requestBody = {
                date: event.startDateTime,
                statusId: appointmentStatusStore.getByName(event.status)!.id
            };

            return authRequest.patch(`appointments/user/current`, requestBody)
                .then(() => {
                    eventStates.setChangedEventIds(new Set());
                    return {op: 'update', res: true};
                })
                .catch(() => {
                    return {op: 'update', res: false};
                });
        }
    );
};