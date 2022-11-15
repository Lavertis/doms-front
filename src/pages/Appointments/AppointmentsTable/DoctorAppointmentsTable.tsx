import {FC, useEffect, useState} from 'react';
import {Appointment} from '../../../types/appointment';
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
import {authRequest} from "../../../services/api.service";
import {observer} from "mobx-react-lite";
import userStore from "../../../store/user-store";
import {AppointmentTypes} from "../../../enums/AppointmentTypes";
import {AppointmentStatuses} from "../../../enums/AppointmentStatuses";

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

    const statuses = [AppointmentStatuses.Rejected, AppointmentStatuses.Accepted, AppointmentStatuses.Pending, AppointmentStatuses.Cancelled, AppointmentStatuses.Completed]; // TODO temporary location
    const types = [AppointmentTypes.Checkup, AppointmentTypes.Consultation]; // TODO temporary location

    useEffect(() => {
        setLoading(true);
        const queryParams = {
            pageNumber: lazyParams.page + 1,
            pageSize: lazyParams.rows,
            status: lazyParams.filters.status.value,
            type: lazyParams.filters.type.value,
            dateStart: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[0]).toISOString(true) : null,
            dateEnd: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[1]).toISOString(true) : null,
        };

        authRequest.get(`appointments/search?doctorId=${userStore.user?.id}`, {params: queryParams})
            .then((response: AxiosResponse) => {
                setAppointments(response.data.records);
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
            options={statuses}
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
            options={types}
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
        return <div className="flex justify-content-center">
            <Button onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}/edit`)} icon="pi pi-cog"/>
            {rowData.status !== AppointmentStatuses.Pending && rowData.status !== AppointmentStatuses.Cancelled ?
                <Button
                    className={'ml-1 ' + (rowData.status === AppointmentStatuses.Completed ? "p-button-info" : "p-button-success")}
                    onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}`)}
                    icon={'pi ' + (rowData.status === AppointmentStatuses.Completed ? 'pi-eye' : 'pi-caret-right')}
                /> : null}
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
            className="my-8"
        >
            <Column field="patientFirstName" header="First name"/>
            <Column field="patientLastName" header="Last name"/>
            <Column field="date" header="Date" filter filterElement={dateRowFilterTemplate} showFilterMatchModes={false}
                    body={dateTemplate}/>
            <Column field="date" header="Time" body={timeTemplate}/>
            <Column field="patientPhoneNumber" header="Phone number"/>
            <Column field="type" header="Type" filter filterElement={typeRowFilterTemplate}
                    showFilterMatchModes={false}/>
            <Column field="status" header="Status" filter filterElement={statusRowFilterTemplate}
                    showFilterMatchModes={false}/>
            <Column header="Actions" body={controlsTemplate}/>
        </DataTable>
    );
};

export default observer(DoctorAppointmentsTable);