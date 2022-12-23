import {AppointmentType} from './AppointmentType';
import {AppointmentStatus} from './AppointmentStatus';
import {Doctor} from '../Users/Doctor';
import {Patient} from '../Users/Patient';

export interface Appointment {
    id: string;
    statusId: string;
    status?: AppointmentStatus;
    typeId: string;
    type?: AppointmentType;
    date: Date;
    description: string;
    interview: string;
    diagnosis: string;
    recommendations: string;
    patientId: string;
    patient?: Patient;
    doctorId: string;
    doctor?: Doctor;
}