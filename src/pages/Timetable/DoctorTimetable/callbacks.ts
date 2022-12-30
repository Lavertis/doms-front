import {Dispatch, SetStateAction} from 'react';
import moment from 'moment';
import {authRequest} from '../../../services/api.service';
import {AxiosError, AxiosResponse} from 'axios';
import {PagedResponse} from '../../../types/PagedResponse';
import {Appointment} from '../../../types/Appointments/Appointment';
import userStore from '../../../store/user-store';
import {TimetableData} from '../../../types/Timetable';
import {
    editModeAppointmentMapper,
    editModeTimetableMapper,
    EventStates,
    OperationResult,
    viewModeAppointmentMapper,
    viewModeTimetableMapper,
} from './utils';
import appointmentTypeStore from '../../../store/appointment-type-store';
import appointmentStatusStore from '../../../store/appointment-status-store';
import {uuidToBase64} from "../../../utils/uuid-utils";

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

export const onEventReceiveCallback = (info: any, eventStates: EventStates) => {
    eventStates.setAddedEventIds(prevState => {
        prevState.push(info.event.id);
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
    if (eventStates.changedEventIds.has(eventId)) {
        eventStates.setChangedEventIds(prevState => {
            prevState.delete(eventId);
            return prevState;
        });
    }
    eventStates.setRemovedEventIds(prevState => {
        prevState.push(eventId);
        return prevState;
    });
};

export const saveChanges = async (eventStates: EventStates, calendarRef: any, toast: any, setEditMode: Dispatch<SetStateAction<boolean>>) => {
    let allEvents = calendarRef.current.getApi().getEvents();

    let createdEvents = allEvents
        .filter((e: any) => eventStates.addedEventIds.includes(e.id))
        .map((e: any) => {
            e.remove();
            return ({
                startDateTime: moment(e.startStr).toISOString(),
                endDateTime: e.endStr ? moment(e.endStr).toISOString() : moment(e.startStr).add('1', 'hours').toISOString()
            });
        });
    let updatedEvents = allEvents.filter((e: any) => eventStates.changedEventIds
        .has(e.id))
        .map((e: any) => ({
            id: e.id,
            startDateTime: moment(e.startStr).toISOString(),
            endDateTime: e.endStr ? moment(e.endStr).toISOString() : moment(e.startStr).add('1', 'hours').toISOString()
        }));

    let allPromises: Promise<OperationResult>[] = [];
    if (createdEvents.length) {
        allPromises.push(saveCreatedEvents(createdEvents, eventStates) as Promise<OperationResult>);
    }
    if (updatedEvents.length) {
        allPromises.push(saveUpdatedEvents(updatedEvents, eventStates) as Promise<OperationResult>);
    }
    if (eventStates.removedEventIds.length) {
        allPromises.push(saveRemovedEvents(eventStates.removedEventIds, eventStates) as Promise<OperationResult>);
    }

    Promise.all(allPromises).then(async (results) => {
        const failedOps = results
            .filter((ele) => !ele.result)
            .map(async (ele) => {
                ele = (await (ele as any)[0]);
                return [ele.op, ele.error];
            });

        if (results.length === 0) {
            return;
        } else if (failedOps.length === results.length) {
            toast.current.show({closable: false, severity: 'error', summary: (failedOps[1] as any)[0]});
        } else if (failedOps.length) {
            toast.current.show({
                closable: false,
                severity: 'error',
                summary: `Failed to: ${failedOps}`,
                detail: (failedOps[1] as any)[0]
            });
        } else {
            toast.current.show({closable: false, severity: 'success', summary: 'Saved'});
        }
    });
    setEditMode(false);
};

export const saveCreatedEvents = (createdEvents: any, eventStates: EventStates) => {
    return authRequest.post('timetables/doctor/current/batch', createdEvents)
        .then(() => {
            eventStates.setAddedEventIds([]);
            return {op: 'add', result: true};
        })
        .catch((errorResponse: AxiosError) => {
            const errorMessage = Object.values((errorResponse.response?.data as any)['errors' as any])[0];
            return {op: 'add', result: false, error: errorMessage};
        });
};

export const saveUpdatedEvents = (updatedEvents: any, eventStates: EventStates) => {
    return authRequest.patch('timetables/batch', updatedEvents)
        .then(() => {
            eventStates.setChangedEventIds(new Set());
            return {op: 'update', result: true};
        })
        .catch((errorResponse: AxiosError) => {
            const errorMessage = Object.values((errorResponse.response?.data as any)['errors' as any])[0];
            return {op: 'update', result: false, error: errorMessage};
        });
};

export const saveRemovedEvents = (removedEventIds: string[], eventStates: EventStates) => {
    return authRequest.delete('timetables/batch', {data: eventStates.removedEventIds})
        .then(() => {
            eventStates.setRemovedEventIds([]);
            return {op: 'delete', result: true};
        })
        .catch((errorResponse: AxiosError) => {
            const errorMessage = Object.values((errorResponse.response?.data as any)['errors' as any])[0];
            return {op: 'delete', result: false, error: errorMessage};
        });
};

export const updateEventsCallback = async (info: any, successCallback: any, failureCallback: any, editMode: boolean) => {
    let appointmentQueryParams: any = { // TODO make appointment query params the same as timetable query params
        dateStart: moment.unix(info.start.valueOf() / 1000).toISOString(),
        dateEnd: moment.unix(info.end.valueOf() / 1000).toISOString()
    };
    let appointmentsResponse: AxiosResponse<PagedResponse<Appointment>> = await authRequest.get(
        `appointments/search?doctorId=${userStore.user?.id}`,
        {params: appointmentQueryParams}
    );
    let appointments = appointmentsResponse.data.records
        .map((appointment) => {
            appointment.type = appointmentTypeStore.getById(appointment.typeId);
            appointment.status = appointmentStatusStore.getById(appointment.statusId);

            return appointment;
        });

    let timetableQueryParams = { // TODO make appointment query params the same as timetable query params
        startDateTime: moment.unix(info.start.valueOf() / 1000).toISOString(),
        endDateTime: moment.unix(info.end.valueOf() / 1000).toISOString()
    };
    let timetablesResponse: AxiosResponse<TimetableData[]> = await authRequest.get(
        `timetables/doctor/${userStore.user?.id}`, // TODO dedicated endpoint ??
        {params: timetableQueryParams}
    );
    let timetables = timetablesResponse.data;
    // TODO handle errors

    let events: any[] = [];
    events = events.concat(timetables.map(editMode ? editModeTimetableMapper as any : viewModeTimetableMapper));
    events = events.concat(appointments.map(editMode ? editModeAppointmentMapper as any : viewModeAppointmentMapper));
    successCallback(events);
};

export const onEventClickCallback = (eventInfo: any, navigate: any, editMode: boolean) => {
    const event = eventInfo.event;
    if (event.display === 'background')
        return;
    if (editMode)
        return;
    if (eventInfo.jsEvent.path.filter((element: any) => element.className && element.className.split(' ').includes('pi')).length)
        return;

    navigate(`/appointments/${uuidToBase64(event.id)}/edit`);
};