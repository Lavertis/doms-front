import {chartData} from "./chartData";

export interface Statistics {
    appointmentsCount: number;
    prescriptionsCount: number;
    doctorsPatientCount: number;
    appointmentTypesCount: chartData;
    patientCount: number;
    doctorCount: number;
    userCount: number;
}