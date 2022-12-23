import React, {FC, useEffect, useRef, useState} from 'react';
import {DraggableEventData} from '../../../types/Timetable';
import {Button} from 'primereact/button';
import Timetable from '../../../components/Timetable/Timetable';
import {useNavigate} from 'react-router-dom';
import {backgroundGroupId, EventStates, workHoursColor} from './utils';
import {Toast} from 'primereact/toast';
import {observer} from 'mobx-react-lite';
import EventContent from './EventContent';
import {
    onEventChangeCallback,
    onEventClickCallback,
    onEventReceiveCallback,
    onEventRemoveCallback,
    saveChanges,
    updateEventsCallback
} from './callbacks';


const draggableEventsData: DraggableEventData[] = [{
    id: 'ed22ca94-8596-4c06-b599-38e2cde84e48',
    title: 'Work hours',
    color: workHoursColor,
    editable: true,
    durationMinutes: 60
}];

interface DoctorTimetableProps {
}

const DoctorTimetable: FC<DoctorTimetableProps> = () => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [changedEventIds, setChangedEventIds] = useState<Set<string>>(new Set());
    const [addedEventIds, setAddedEventIds] = useState<string[]>([]);
    const [removedEventIds, setRemovedEventIds] = useState<string[]>([]);
    const calendarRef: any = React.createRef();
    const toast = useRef<any>(null);
    const eventStates: EventStates = {
        addedEventIds: addedEventIds,
        setAddedEventIds: setAddedEventIds,
        changedEventIds: changedEventIds,
        setChangedEventIds: setChangedEventIds,
        removedEventIds: removedEventIds,
        setRemovedEventIds: setRemovedEventIds
    };

    useEffect(() => {  // fetch events on first load
        let calendarApi = calendarRef.current.getApi();
        calendarApi.refetchEvents();
    }, [calendarRef]);

    const changeEditMode = (newState: boolean) => {
        setEditMode(newState);
        if (newState) {
            return;
        }

        // not in useEffect to avoid delay between switching modes and executing logic below
        const calendarApi = calendarRef.current.getApi();
        addedEventIds.forEach((eventId: string) => {
            calendarApi.getEventById(eventId).remove();
        });
    };

    const viewModeSidebar = () => <>
        <Button onClick={() => changeEditMode(true)}>Edit mode</Button>
    </>;
    const editModeSidebar = () => <>
        <Button className="mt-3" onClick={() => changeEditMode(false)}>View mode</Button>
        <Button className="mt-3" onClick={() => saveChanges(eventStates, calendarRef, toast, setEditMode)}>Save</Button>
    </>;

    return (
        <>
            <Toast ref={toast}/>
            <Timetable
                calendarRef={calendarRef}
                eventContent={(renderProperties: any) => <EventContent event={renderProperties.event}/>}
                eventSource={async (info: any, successCallback: any, failureCallback: any) => updateEventsCallback(info, successCallback, failureCallback, editMode)}
                sidebarContent={editMode ? editModeSidebar() : viewModeSidebar()}
                draggableEventsData={draggableEventsData}
                showDraggableEvents={editMode}
                showDropToRemoveDiv={editMode}
                backgroundGroupId={backgroundGroupId}
                onEventChangeCallback={(changeInfo: any) => onEventChangeCallback(changeInfo, eventStates)}
                onEventReceiveCallback={(info: any) => onEventReceiveCallback(info, eventStates)}
                onEventRemoveCallback={(removeInfo: any) => onEventRemoveCallback(removeInfo, eventStates)}
                onEventClickCallback={(eventInfo: any) => onEventClickCallback(eventInfo, navigate, editMode)}
            />
        </>
    );
};

export default observer(DoctorTimetable);