import React, {FC} from 'react';
import moment from 'moment';
import {authRequest} from '../../../services/api.service';
import {statusNameToColor} from '../timetableUtils';
import appointmentStatusStore from '../../../store/appointment-status-store';
import {capitalizeFirstLetter} from '../../../utils/string-utils';
import {AppointmentStatuses} from '../../../enums/AppointmentStatuses';

interface EventContentProps {
    event: any;
}

const EventContent: FC<EventContentProps> = ({event}) => {
    if (event.display === 'background')
        return null;
    if (event.title === 'Work hours')
        return <div className="flex justify-content-between">
            <div>
                Work hours
            </div>
            <div onClick={() => event.remove()}>
                <i className="pi pi-trash"></i>
            </div>
        </div>;
    let appointmentStatus = '';
    let appointmentType = '';
    if (event.backgroundColor) {
        appointmentStatus = event.title.split('(')[1].split(')')[0].toUpperCase();
        appointmentType = event.title.split(',')[0].toUpperCase();
    }

    let duration = event.duration ?
        event.duration :
        moment.duration(moment(event._instance.range.end).diff(moment(event._instance.range.start))).asMinutes();

    const acceptButton = <span
        className="mr-1"
        onClick={() => {
            const acceptedStatusId = appointmentStatusStore.getByName(AppointmentStatuses.Accepted)!.id;
            authRequest.patch(`appointments/user/current/${event.id}`, {statusId: acceptedStatusId})
                .then(() => {
                    appointmentStatus = AppointmentStatuses.Accepted;
                    event.setProp('title', `${capitalizeFirstLetter(appointmentType)}, (${capitalizeFirstLetter(appointmentStatus)})`);
                    event.setProp('backgroundColor', statusNameToColor[appointmentStatus as keyof typeof statusNameToColor]);
                    event.setProp('borderColor', statusNameToColor[appointmentStatus as keyof typeof statusNameToColor]);
                });
        }}
    >
        <i className="pi pi-check"></i>
    </span>;

    const getCancelButton = (newStatus: string) => <span
        onClick={() => {
            const newStatusId = appointmentStatusStore.appointmentStatuses
                .find(appointmentStatus => appointmentStatus.name === newStatus)!.id;
            authRequest.patch(`appointments/user/current/${event.id}`, {statusId: newStatusId})
                .then(() => {
                    appointmentStatus = newStatus;
                    event.setProp('title', `${capitalizeFirstLetter(appointmentType)}, (${capitalizeFirstLetter(appointmentStatus)})`);
                    event.setProp('backgroundColor', statusNameToColor[appointmentStatus as keyof typeof statusNameToColor]);
                    event.setProp('borderColor', statusNameToColor[appointmentStatus as keyof typeof statusNameToColor]);
                });
        }}
    >
        <i className="pi pi-times"></i>
    </span>;

    return (
        <div className="flex justify-content-between">
            <div>
                {event.title} {duration > 31 && <br/>}
                {moment(event.startStr).format('hh:mm')}
            </div>
            <div>
                {appointmentStatus === AppointmentStatuses.Pending && acceptButton}
                {appointmentStatus === AppointmentStatuses.Pending && getCancelButton(AppointmentStatuses.Rejected)}
                {appointmentStatus === AppointmentStatuses.Accepted && getCancelButton(AppointmentStatuses.Cancelled)}
            </div>
        </div>
    );
};

export default EventContent;