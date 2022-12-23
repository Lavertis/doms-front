import moment from 'moment';
import {NotEditableAppointmentStatuses, statusNameToColor} from '../timetableUtils';
import {Appointment} from '../../../types/Appointments/Appointment';
import {TimetableData} from '../../../types/Timetable';
import {Dispatch, SetStateAction} from 'react';

export interface EventStates {
    addedEventIds: string[];
    setAddedEventIds: Dispatch<SetStateAction<string[]>>;
    changedEventIds: Set<string>;
    setChangedEventIds: Dispatch<SetStateAction<Set<string>>>;
}

export const backgroundGroupId = '650a33d0-13de-416f-991e-890c66c15930';
export const timetableColor = '#009688';
export const newAppointmentColor = '#fd0085';

export const timetableMapper = (timetableEntry: TimetableData) => ({
    id: timetableEntry.id,
    start: timetableEntry.startDateTime,
    end: timetableEntry.endDateTime,
    display: 'background',
    color: timetableColor,
    groupId: backgroundGroupId
});

export const appointmentMapper = (appointment: Appointment, editable: boolean = true) => ({
    id: appointment.id,
    title: `${appointment.type?.name}, (${appointment.status?.name.charAt(0).toUpperCase() + appointment.status!.name.slice(1).toLowerCase()})`,
    start: appointment.date,
    end: moment(appointment.date).add(appointment.type?.durationMinutes, 'minutes'),
    color: statusNameToColor[appointment.status!.name as keyof typeof statusNameToColor],
    editable: editable && !NotEditableAppointmentStatuses.includes(appointment.status!.name.toUpperCase())
});
