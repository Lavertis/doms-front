import moment from 'moment';
import {statusNameToColor} from '../timetableUtils';
import {Dispatch, SetStateAction} from 'react';

export interface EventStates {
    addedEventIds: string[];
    setAddedEventIds: Dispatch<SetStateAction<string[]>>;
    changedEventIds: Set<string>;
    setChangedEventIds: Dispatch<SetStateAction<Set<string>>>;
    removedEventIds: string[];
    setRemovedEventIds: Dispatch<SetStateAction<string[]>>;
}

export interface OperationResult {
    op: string;
    result: boolean;
    error: string;
}


export const backgroundGroupId = 'b00bbeef-37ec-4884-a7aa-aa419c7ad6b2';
export const workHoursColor = '#009688';

export const viewModeTimetableMapper = (timetableEntry: any) => ({
    id: timetableEntry.id,
    start: timetableEntry.startDateTime,
    end: timetableEntry.endDateTime,
    display: 'background',
    color: workHoursColor,
    groupId: backgroundGroupId
});

export const viewModeAppointmentMapper = (appointment: any) => ({
    id: appointment.id,
    title: `${appointment.type?.name}, (${appointment.status?.name.charAt(0).toUpperCase() + appointment.status!.name.slice(1).toLowerCase()})`,
    start: appointment.date,
    end: moment(appointment.date).add(appointment.type?.durationMinutes, 'minutes'),
    color: statusNameToColor[appointment.status!.name as keyof typeof statusNameToColor],
    editable: false
});

export const editModeTimetableMapper = (timetableEntry: any) => ({
    id: timetableEntry.id,
    title: 'Work hours',
    start: timetableEntry.startDateTime,
    end: timetableEntry.endDateTime,
    color: workHoursColor,
    editable: true
});

export const editModeAppointmentMapper = (appointment: any) => ({
    id: appointment.id,
    start: appointment.date,
    end: moment(appointment.date).add(1, 'hours'),
    backgroundColor: statusNameToColor[appointment.status as keyof typeof statusNameToColor],
    display: 'background',
    editable: false
});
