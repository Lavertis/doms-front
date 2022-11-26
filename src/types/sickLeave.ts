export interface SickLeave {
    id: string,
    patientId:	string
    doctorId:	string
    appointmentId:	string
    dateStart:	Date
    dateEnd:	Date
    diagnosis:	string
    purpose:	string
    createdAt: Date
}