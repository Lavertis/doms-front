import React, {useEffect, useState} from 'react';
import {Appointment} from "../../../../types/appointment";
import moment from "moment/moment";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {FilterMatchMode} from "primereact/api";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {AxiosError, AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {uuidToBase64} from "../../../../utils/uuid-utils";
import {authRequest} from "../../../../services/api.service";


interface AppointmentHistoryProps {
    patientId: string;
}

const AppointmentHistory = ({patientId}: AppointmentHistoryProps) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const statuses = ['Rejected', 'Accepted', 'Pending', 'Cancelled', 'Completed']; // TODO temporary location
    const types = ['Checkup', 'Consultation']; // TODO temporary location

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
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
            status: lazyParams.filters.status.value,
            type: lazyParams.filters.type.value,
            dateStart: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[0]).toISOString(true) : null,
            dateEnd: lazyParams.filters.date.value ? moment(lazyParams.filters.date.value[1]).toISOString(true) : null,
        };

        if (patientId === undefined)
            return;
        authRequest.get(`appointments/search?patientId=${patientId}&status=Completed`, {params: queryParams})
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
    }, [lazyParams, patientId]);

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

    const dateTemplate = (rowData: Appointment) => {
        return <>{moment(rowData.date).format('DD-MM-YYYY')}</>;
    };

    const timeTemplate = (rowData: Appointment) => {
        return <>{moment(rowData.date).format('HH:mm')}</>;
    };

    const controlsTemplate = (rowData: Appointment) => {
        return (
            <div className="flex justify-content-center">
                <Button icon="pi pi-eye" onClick={() => goToDetails(rowData.id)}></Button>
            </div>
        );
    };

    const goToDetails = (appointmentId: string) => {
        navigate(`/appointments/${uuidToBase64(appointmentId)}`);
    }

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
        >
            <Column field="date" header="Date" filter filterElement={dateRowFilterTemplate} showFilterMatchModes={false}
                    body={dateTemplate}/>
            <Column field="date" header="Time" body={timeTemplate}/>
            <Column field="type" header="Type" filter filterElement={typeRowFilterTemplate}
                    showFilterMatchModes={false}/>
            <Column field="status" header="Status" filter filterElement={statusRowFilterTemplate}
                    showFilterMatchModes={false}/>
            <Column header="" body={controlsTemplate}/>
        </DataTable>
    );
}

export default AppointmentHistory;