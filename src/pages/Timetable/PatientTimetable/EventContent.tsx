import React, {FC} from 'react';
import moment from 'moment';
import {NotEditableAppointmentStatuses} from '../timetableUtils';
import {Doctor} from '../../../types/Users/Doctor';

interface EventContentProps {
    event: any;
    selectedDoctor?: Doctor;
}

const EventContent: FC<EventContentProps> = ({event, selectedDoctor}) => {
    if (event.display === 'background')
        return <></>;

    let appointmentStatus = event.title.split('(')[1].split(')')[0].toUpperCase();

    let duration = event.duration ? event.duration : moment.duration(moment(event._instance.range.end).diff(moment(event._instance.range.start))).asMinutes();

    return (
        <div className="flex justify-content-between">
            <div>
                {event.title} {duration > 31 && <br/>}
                {moment(event.startStr).format('hh:mm')}
            </div>
            {selectedDoctor && !NotEditableAppointmentStatuses.includes(appointmentStatus) &&
                <div onClick={() => event.remove()}>
                    <i className="pi pi-trash"></i>
                </div>}
        </div>
    );
};

export default EventContent;