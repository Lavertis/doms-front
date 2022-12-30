import React, {useEffect, useState} from 'react';
import {Appointment} from '../../../types/Appointments/Appointment';
import {useNavigate} from 'react-router-dom';
import {FilterMatchMode} from 'primereact/api';
import moment from 'moment/moment';
import {AxiosError, AxiosResponse} from 'axios';
import {Dropdown} from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';
import {Button} from 'primereact/button';
import {uuidToBase64} from '../../../utils/uuid-utils';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {authRequest} from '../../../services/api.service';
import AppointmentStatusStore from '../../../store/appointment-status-store';
import AppointmentTypeStore from '../../../store/appointment-type-store';
import {PagedResponse} from '../../../types/PagedResponse';
import {capitalizeFirstLetter} from '../../../utils/string-utils';
import {observer} from 'mobx-react-lite';
import {AppointmentStatuses} from '../../../enums/AppointmentStatuses';

const PatientAppointmentsTable = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const navigate = useNavigate();

    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
        filters: {
            'status': {value: null, matchMode: FilterMatchMode.EQUALS},
            'type': {value: null, matchMode: FilterMatchMode.EQUALS},
            'date': {value: null, matchMode: FilterMatchMode.EQUALS},
        }
    });

    const [modalIsShown, setModalIsShown] = useState(false);
    const hideModal = () => setModalIsShown(false);
    const showModal = () => setModalIsShown(true);

    const [currentAppointmentId, setCurrentAppointmentId] = useState('');

    const cancelAppointment = () => {
        authRequest.patch(`appointments/user/current/${currentAppointmentId}`, {status: AppointmentStatuses.Cancelled})
            .then(() => {
                setLazyParams({...lazyParams});
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    };

    useEffect(() => {
        setLoading(true);
        const queryParams = {
            pageNumber: lazyParams.page + 1,
            pageSize: lazyParams.rows,
            status: lazyParams.filters.status.value ? (lazyParams.filters.status.value as string).toUpperCase() : null,
            type: lazyParams.filters.type.value,
            dateStart: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[0]).toISOString(true) : null,
            dateEnd: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[1]).toISOString(true) : null,
        };

        authRequest.get(`appointments/patient/current/search`, {params: queryParams})
            .then((response: AxiosResponse<PagedResponse<Appointment>>) => {
                setAppointments(response.data.records.map(appointment => {
                    appointment.status = AppointmentStatusStore.getById(appointment.statusId);
                    appointment.type = AppointmentTypeStore.getById(appointment.typeId);
                    appointment.doctor = {
                        id: '',
                        email: '',
                        phoneNumber: '',
                        createdAt: new Date(),
                        firstName: (appointment as any).doctorFirstName,  // TODO this is bad
                        lastName: (appointment as any).doctorLastName,
                    };

                    return appointment;
                }));
                setTotalRecords(response.data.totalRecords);
                setLoading(false);
            }).catch((err: AxiosError) => {
            if (err.response?.status === 416) {
                setAppointments([]);
                setTotalRecords(0);
                setLoading(false);
            }
        });
    }, [lazyParams]);

    const dropdownItemTemplate = (option: any) => {
        return <>{option}</>;
    };

    const statusRowFilterTemplate = (options: any) => {
        return <Dropdown
            value={options.value}
            options={AppointmentStatusStore.appointmentStatuses.map(appointmentStatus => capitalizeFirstLetter(appointmentStatus.name))}
            onChange={(e) => options.filterCallback(e.value)}
            itemTemplate={dropdownItemTemplate}
            placeholder="Select a status"
            className="p-column-filter"
            showClear
        />;
    };

    const dateRowFilterTemplate = (options: any) => {
        return <Calendar
            inline
            dateFormat="dd/mm/yy"
            selectionMode="range"
            value={options.value}
            placeholder="Pick a date range"
            onChange={(e) => options.filterCallback(e.value)}
        />;
    };

    const typeRowFilterTemplate = (options: any) => {
        return <Dropdown
            value={options.value}
            options={AppointmentTypeStore.appointmentTypes.map(appointmentType => capitalizeFirstLetter(appointmentType.name))}
            onChange={(e) => options.filterCallback(e.value)}
            itemTemplate={dropdownItemTemplate}
            placeholder="Select a type"
            className="p-column-filter"
            showClear
        />;
    };

    const dateTemplate = (rowData: Appointment) => {
        return <>{moment(rowData.date).format('DD-MM-YYYY')}</>;
    };

    const timeTemplate = (rowData: Appointment) => {
        return <>{moment(rowData.date).format('HH:mm')}</>;
    };

    const controlsTemplate = (rowData: Appointment) => {
        const isCancelButtonShown = () => ![
            AppointmentStatuses.Cancelled,
            AppointmentStatuses.Completed,
            AppointmentStatuses.Rejected
        ].includes(rowData.status!.name as AppointmentStatuses);
        const cancelButton = () => <Button label="" icon="pi pi-ban" className="p-button-danger" title="Cancel"
                                           onClick={() => {
                                               setCurrentAppointmentId(rowData.id);
                                               showModal();
                                           }}/>;

        const isViewButtonShown = () => AppointmentStatuses.Completed === rowData.status!.name as AppointmentStatuses;
        const viewButton = () => <Button label="" icon="pi pi-eye" className="p-button" title="View"
                                         onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}`)}/>;

        return <div className="flex justify-content-center">
            {isCancelButtonShown() && cancelButton()}
            {isViewButtonShown() && viewButton()}
        </div>;
    };

    return (
        <div>
            <DataTable
                value={appointments}
                lazy
                first={lazyParams.first}
                totalRecords={totalRecords}
                onPage={(e: any) => {
                    setLazyParams(e);
                }}
                onFilter={(e: any) => {
                    e['page'] = 0;
                    setLazyParams(e);
                }}
                loading={loading}
                paginator
                filters={lazyParams.filters}
                stripedRows
                showGridlines
                rows={lazyParams.rows}
                dataKey="id"
                responsiveLayout="scroll"
                className="my-8 shadow-1 border-round"
            >
                <Column
                    field="doctorName"
                    body={(rowData: Appointment) => `${rowData.doctor?.firstName} ${rowData.doctor?.lastName}`}
                    header="Doctor"
                />
                <Column
                    field="date"
                    header="Date"
                    filter
                    filterElement={dateRowFilterTemplate}
                    showFilterMatchModes={false}
                    body={dateTemplate}
                />
                <Column field="date" header="Time" body={timeTemplate}/>
                <Column
                    field="type"
                    header="Type"
                    body={(rowData: Appointment) => capitalizeFirstLetter(rowData.type?.name as string)}
                    filter
                    filterElement={typeRowFilterTemplate}
                    showFilterMatchModes={false}
                />
                <Column
                    field="status"
                    header="Status"
                    body={(rowData: Appointment) => capitalizeFirstLetter(rowData.status?.name as string)}
                    filter
                    filterElement={statusRowFilterTemplate}
                    showFilterMatchModes={false}
                />
                <Column header="Actions" body={controlsTemplate}/>
            </DataTable>
            <ConfirmationModal
                title={'Appointment cancellation'}
                message={'Are you sure you want to cancel this appointment?'}
                isShown={modalIsShown}
                confirmAction={cancelAppointment}
                hide={hideModal}
            />
        </div>
    );
};

export default observer(PatientAppointmentsTable);
