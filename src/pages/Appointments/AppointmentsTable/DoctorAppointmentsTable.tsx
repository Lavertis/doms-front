import {FC, useEffect, useState} from 'react';
import {Appointment} from '../../../types/Appointments/Appointment';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {AxiosError, AxiosResponse} from 'axios';
import {FilterMatchMode} from 'primereact/api';
import {Dropdown} from 'primereact/dropdown';
import {Button} from 'primereact/button';
import moment from 'moment';
import {Calendar} from 'primereact/calendar';
import {useNavigate} from 'react-router-dom';
import {uuidToBase64} from '../../../utils/uuid-utils';
import {authRequest} from '../../../services/api.service';
import {observer} from 'mobx-react-lite';
import userStore from '../../../store/user-store';
import {PagedResponse} from '../../../types/PagedResponse';
import AppointmentStatusStore from '../../../store/appointment-status-store';
import AppointmentTypeStore from '../../../store/appointment-type-store';
import {capitalizeFirstLetter} from '../../../utils/string-utils';
import {AppointmentStatuses} from '../../../enums/AppointmentStatuses';

interface DoctorAppointmentsTableProps {
}

const DoctorAppointmentsTable: FC<DoctorAppointmentsTableProps> = () => {
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

        authRequest.get(`appointments/search?doctorId=${userStore.user?.id}`, {params: queryParams})
            .then((response: AxiosResponse<PagedResponse<Appointment>>) => {
                setAppointments(response.data.records.map((appointment) => {
                    appointment.status = AppointmentStatusStore.getById(appointment.statusId);
                    appointment.type = AppointmentTypeStore.getById(appointment.typeId);
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
            onChange={(e) => options.filterCallback(e.value.toUpperCase())}
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

    const isEditButtonShown = (rowData: Appointment) => {
        return ![
            AppointmentStatuses.Cancelled,
            AppointmentStatuses.Rejected,
            AppointmentStatuses.Completed
        ].includes(rowData.status?.name as AppointmentStatuses);
    }

    const isStartButtonShown = (rowData: Appointment) => {
        return ![
            AppointmentStatuses.Cancelled,
            AppointmentStatuses.Rejected,
            AppointmentStatuses.Pending
        ].includes(rowData.status?.name as AppointmentStatuses);
    }

    const controlsTemplate = (rowData: Appointment) => {
        return <div className="flex justify-content-center">
            {
                isEditButtonShown(rowData) &&
                <Button onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}/edit`)} icon="pi pi-cog"/>
            }
            {
                isStartButtonShown(rowData) &&
                <Button
                    className={'ml-1 ' + (rowData.status?.name === AppointmentStatuses.Completed ? 'p-button-info' : 'p-button-success')}
                    onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}`)}
                    icon={'pi ' + (rowData.status?.name === AppointmentStatuses.Completed ? 'pi-eye' : 'pi-caret-right')}
                />
            }
        </div>;
    };

    return (
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
            <Column field="patientFirstName" header="First name"/>
            <Column field="patientLastName" header="Last name"/>
            <Column
                field="date"
                header="Date"
                filter
                filterElement={dateRowFilterTemplate}
                showFilterMatchModes={false}
                body={dateTemplate}
            />
            <Column field="date" header="Time" body={timeTemplate}/>
            <Column field="patientPhoneNumber" header="Phone number"/>
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
    );
};

export default observer(DoctorAppointmentsTable);