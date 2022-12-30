import React, {FC, useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import integrationPlugin, {Draggable} from '@fullcalendar/interaction';
import {DraggableEventData} from '../../types/Timetable';
import {Dropdown} from 'primereact/dropdown';
import {eventContainerId, removeEventDivId, timeLabel, workTimeEnd, workTimeStart} from './constants';
import moment from 'moment';

interface TimetableProps {
    calendarRef: any;
    eventSource: any;
    showDraggableEvents: boolean;
    eventContent?: any;
    onEventClickCallback?: any;
    onEventChangeCallback?: any;
    onEventReceiveCallback?: any;
    onEventRemoveCallback?: any;
    backgroundGroupId?: string;
    showDropToRemoveDiv?: boolean;
    draggableEventsData?: DraggableEventData[];
    restrictToBgEvents?: boolean;
    sidebarContent?: any;
}

const Timetable: FC<TimetableProps> = (
    {
        calendarRef,
        eventSource,
        sidebarContent,
        showDraggableEvents,
        onEventClickCallback,
        draggableEventsData,
        backgroundGroupId,
        eventContent,
        onEventChangeCallback,
        onEventRemoveCallback,
        onEventReceiveCallback,
        showDropToRemoveDiv = false,
        restrictToBgEvents = false
    }) => {
    const [selectedDraggableOption, setSelectedDraggableOption] = useState<DraggableEventData>();
    const [currentDraggable, setCurrentDraggable] = useState();

    useEffect(() => {
        if (draggableEventsData?.length)
            setSelectedDraggableOption(draggableEventsData[0] as any);
    }, [draggableEventsData]);

    useEffect(() => {
        let draggableEl = document.getElementById(eventContainerId);
        if (!draggableEventsData?.length)
            return;
        if (currentDraggable)
            (currentDraggable as any).destroy();

        let draggable = new Draggable(draggableEl!, {
            itemSelector: '.fc-event',
            eventData: (eventEl) => {
                let item = draggableEventsData?.find(i => i.id === eventEl.getAttribute('id'))!;
                const millisecondsInMinute = 60 * 1000;
                return {
                    id: item.id,
                    title: item.title,
                    duration: {milliseconds: item.durationMinutes * millisecondsInMinute},
                    durationEditable: item.editable,
                    color: item.color
                };
            }
        });
        setCurrentDraggable(draggable as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draggableEventsData]);

    const onDragStopCallback = (info: any) => {
        let removeEventDiv = document.getElementById(removeEventDivId);
        (removeEventDiv as any).classList.remove('pulse-animation');
        let removeEventDivBounding = removeEventDiv!.getBoundingClientRect();
        let dropX = info.jsEvent.clientX;
        let dropY = info.jsEvent.clientY;

        if (
            dropY >= removeEventDivBounding.top &&
            dropY <= removeEventDivBounding.bottom &&
            dropX >= removeEventDivBounding.left &&
            dropX <= removeEventDivBounding.right
        ) {
            info.event.remove();
        }
    };

    const onDragStartCallback = (info: any) => {
        let removeEventDiv = document.getElementById(removeEventDivId) as any;
        removeEventDiv.classList.add('pulse-animation');
    };

    return (
        <div className="mt-3 flex flex-column-reverse xl:flex-row">
            <div
                className="mt-4 xl:mt-0 xl:w-16rem shadow-1 border-round bg-white ml-3 text-center py-4 px-6 xl:px-3 xl:py-0 flex-wrap flex flex-row xl:flex-column justify-content-between xl:justify-content-start align-items-center"
                id={eventContainerId}>
                <h3 className="hidden xl:block">Actions</h3>
                {sidebarContent}
                <div className="flex xl:flex-column align-items-center xl:w-full">
                    {showDraggableEvents && <div className="xl:mt-5 mx-1 xl:mx-0">
                        <Dropdown
                            className="w-full"
                            value={selectedDraggableOption}
                            optionLabel="title"
                            options={draggableEventsData}
                            onChange={(changeParams) => {
                                setSelectedDraggableOption(changeParams.value);
                            }}
                        />
                    </div>}
                    {showDraggableEvents && selectedDraggableOption && <div className="xl:w-full">
                        <div
                            className="fc-event border-round p-3 text-white xl:my-2 mx-1 xl:mx-0 xl:w-100"
                            style={({background: selectedDraggableOption.color})}
                            key={selectedDraggableOption.id}
                            id={selectedDraggableOption.id}
                        >
                            New appointment
                        </div>
                    </div>}
                    {showDropToRemoveDiv &&
                        <div className="p-3 border-round shadow border-2 text-white mx-1 xl:mx-0  xl:w-full"
                             style={({
                                 background: '#BA2C73',
                                 borderColor: '#C41E3D'
                             })}
                             id={removeEventDivId}>
                            Drop to remove
                        </div>}
                </div>
            </div>
            <div className="mx-3">
                <div className="mx-auto bg-white border-round shadow-1 p-4">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[timeGridPlugin, integrationPlugin]}
                        height="auto"
                        initialView="timeGridWeek"
                        hiddenDays={[0, 6]}
                        firstDay={1}
                        editable={true}
                        droppable={true}
                        allDaySlot={false}
                        eventTimeFormat={timeLabel}
                        slotLabelFormat={timeLabel}
                        businessHours={
                            {
                                startTime: workTimeStart,
                                endTime: workTimeEnd
                            }
                        }
                        slotMinTime={
                            moment(workTimeStart, 'HH:mm')
                                .subtract(1, 'h')
                                .format('HH:mm')
                        }
                        slotMaxTime={
                            moment(workTimeEnd, 'HH:mm')
                                .add(1, 'h')
                                .subtract(1, 'm')
                                .format('HH:mm')
                        }
                        eventOverlap={(stillEvent, movingEvent) => stillEvent.display === 'background'}
                        eventConstraint={restrictToBgEvents ? (backgroundGroupId ?? 'b00bbeef-37ec-4884-a7aa-aa419c7ad6b2') : 'businessHours'}
                        events={eventSource}
                        eventContent={eventContent}
                        eventDragStop={onDragStopCallback}
                        eventReceive={onEventReceiveCallback}
                        eventChange={onEventChangeCallback}
                        eventRemove={onEventRemoveCallback}
                        eventClick={onEventClickCallback}
                        eventDragStart={onDragStartCallback}
                    />
                </div>
            </div>
        </div>
    );
};

export default Timetable;