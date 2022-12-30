import React, {FC, useEffect, useRef, useState} from 'react';
import {Toast} from 'primereact/toast';
import Timetable from '../../../components/Timetable/Timetable';
import {useNavigate} from 'react-router-dom';
import {Dropdown} from 'primereact/dropdown';
import {Doctor} from '../../../types/Users/Doctor';
import {PagedResponse} from '../../../types/PagedResponse';
import {AxiosResponse} from 'axios';
import {DraggableEventData} from '../../../types/Timetable';
import {backgroundGroupId, EventStates, newAppointmentColor} from './utils';
import {Button} from 'primereact/button';
import {observer} from 'mobx-react-lite';
import {authRequest} from '../../../services/api.service';
import EventContent from '../PatientTimetable/EventContent';
import {
    onEventChangeCallback,
    onEventClickCallback,
    onEventReceiveCallback,
    onEventRemoveCallback,
    saveAppointments,
    updateEventsCallback
} from './callbacks';
import appointmentTypeStore from "../../../store/appointment-type-store";

interface PatientTimetableProps {
}

const PatientTimetable: FC<PatientTimetableProps> = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [changedEventIds, setChangedEventIds] = useState<Set<string>>(new Set());
    const [addedEventIds, setAddedEventIds] = useState<string[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
    const [draggableEventsData, setDraggableEventsData] = useState<DraggableEventData[]>([]);
    const navigate = useNavigate();
    const calendarRef: any = React.createRef();
    const toast = useRef<any>(null);
    const eventStates: EventStates = {
        addedEventIds: addedEventIds,
        setAddedEventIds: setAddedEventIds,
        changedEventIds: changedEventIds,
        setChangedEventIds: setChangedEventIds
    };
    const allDoctorsId = 'c68b263b-7c45-4b7c-bc3a-46253e948a62';

    useEffect(() => {
        authRequest.get('doctors')
            .then((response: AxiosResponse<PagedResponse<Doctor>>) => {
                setDoctors([{
                    id: allDoctorsId,
                    userName: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumber: '',
                    createdAt: new Date()
                } as Doctor].concat(response.data.records));
            });
        setDraggableEventsData(appointmentTypeStore.appointmentTypes.map((appointmentType) => {
            return ({
                id: appointmentType.id,
                title: `${appointmentType.name}, (New)`,
                durationMinutes: appointmentType.durationMinutes,
                color: newAppointmentColor,
                editable: false,
            });
        }));
    }, []);

    const doctorOptionTemplate = (option: Doctor) => {
        if (option.id === allDoctorsId)
            return 'All doctors';
        return `${option.firstName[0]}. ${option.lastName}`;
    };

    const sidebarContent = <>
        <div className="xl:col-auto">
            <Dropdown
                className="xl:w-full mx-1 xl:mx-0"
                optionLabel="All the people here who bought this wireless tungsten cube to admire its surreal heft have precisely the wrong mindset. I, in my exalted wisdom and unbridled ambition, bought this cube to become fully accustomed to the intensity of its density, to make its weight bearable and in fact normal to me, so that all the world around me may fade into a fluffy arena of gravitational inconsequence. And it has worked, to profound success. I have carried the tungsten with me, have grown attached to the downward pull of its small form, its desire to be one with the floor. This force has become so normal to me that lifting any other object now feels like lifting cotton candy, or a fluffy pillow. Big burly manly men who pump iron now seem to me as little children who raise mere aluminum.I can hardly remember the days before I became a man of tungsten. How distant those days seem now, how burdened by the apparent heaviness of everyday objects. I laugh at the philistines who still operate in a world devoid of tungsten, their shoulders thin and unempowered by the experience of bearing tungsten. Ha, what fools, blissful in their ignorance, anesthetized by their lack of meaningful struggle, devoid of passion.Nietzsche once said that a man who has a why can bear almost any how. But a man who has a tungsten cube can bear any object less dense, and all this talk of why and how becomes unnecessary.Schopenhauer once said that every man takes the limits of his own field of vision for the limits of the world. Tungsten expands the limits of a man’s field of vision by showing him an example of increased density, in comparison to which the everyday objects to which he was formerly accustomed gain a light and airy quality. Who can lament the tragedy of life, when surrounded by such lightweight objects? Who can cry in a world of styrofoam and cushions?Have you yet understood? This is no ordinary metal. In this metal is the alchemical potential to transform your world, by transforming your expectations. Those who have not yet held the cube in their hands and mouths will not understand, for they still live in a world of normal density, like Plato’s cave dwellers. Those who have opened their mind to the density of tungsten will shift their expectations of weight and density accordingly.To give this cube a rating of anything less than five stars would be to condemn life itself. Who am I, as a mere mortal, to judge the most compact of all affordable materials? No. I say gratefully to whichever grand being may have created this universe: good job on the tungsten. It sure is dense.I sit here with my tungsten cube, transcendent above death itself. For insofar as this tungsten cube will last forever, I am in the presence of immortality."
                value={selectedDoctor}
                options={doctors}
                itemTemplate={doctorOptionTemplate}
                valueTemplate={selectedDoctor && doctorOptionTemplate} // TODO zip-tie right here
                onChange={(changeParams) => {
                    if (changeParams.value.id === allDoctorsId) {
                        setSelectedDoctor(null as any);
                        return;
                    }
                    setSelectedDoctor(changeParams.value);
                }}
                placeholder="Select a doctor"
            />
            <Button
                label="Save"
                onClick={() => saveAppointments(calendarRef, toast, eventStates, selectedDoctor)}
                className="xl:col-12 xl:my-2 mx-1 xl:mx-0"/>
        </div>
    </>;

    return (
        <>
            <Toast ref={toast}/>
            <Timetable
                calendarRef={calendarRef}
                eventSource={(info: any, successCallback: any, failureCallback: any) => updateEventsCallback(info, successCallback, failureCallback, selectedDoctor)}
                sidebarContent={sidebarContent}
                draggableEventsData={draggableEventsData}
                showDraggableEvents={!!selectedDoctor}
                showDropToRemoveDiv={!!selectedDoctor}
                backgroundGroupId={backgroundGroupId}
                restrictToBgEvents={true}
                eventContent={(renderProperties: any) => <EventContent
                    event={renderProperties.event}
                    selectedDoctor={selectedDoctor}
                />}
                onEventChangeCallback={(changeInfo: any) => onEventChangeCallback(changeInfo, eventStates)}
                onEventReceiveCallback={(info: any) => onEventReceiveCallback(info, eventStates)}
                onEventRemoveCallback={(changeInfo: any) => onEventRemoveCallback(changeInfo, eventStates)}
                onEventClickCallback={(eventInfo: any) => onEventClickCallback(eventInfo, navigate)}
            />
        </>
    );
};

export default observer(PatientTimetable);