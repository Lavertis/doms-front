import {AppointmentStatuses} from '../../enums/AppointmentStatuses';

export const statusNameToColor = {
    [AppointmentStatuses.Pending]: '#F9A825',
    [AppointmentStatuses.Accepted]: '#2E7D32',
    [AppointmentStatuses.Completed]: '#1565C0',
    [AppointmentStatuses.Rejected]: '#D32F2F',
    [AppointmentStatuses.Cancelled]: '#757575',
};

export const NotEditableAppointmentStatuses: string[] = [
    AppointmentStatuses.Rejected,
    AppointmentStatuses.Cancelled,
    AppointmentStatuses.Completed
];