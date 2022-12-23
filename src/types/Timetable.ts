import {Doctor} from './Users/Doctor';

export interface DraggableEventData {
    id: string;
    title: string;
    color: string;
    editable?: boolean;
    durationMinutes: number;
}

export interface EventData {
    id: string;
    title?: string;
    startDateTime: string;
    endDateTime: string;
    color: string;
    editable?: boolean;
}

export interface TimetableData {
    id: string;
    startDateTime: string;
    endDateTime: string;
    doctorId: string;
    doctor?: Doctor;
}