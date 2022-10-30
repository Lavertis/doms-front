import React, {useContext, useEffect, useState} from 'react';
import {Appointment} from "../../../types/appointment";
import {useNavigate} from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import {FilterMatchMode} from "primereact/api";
import {TokenContext} from "../../../App";
import moment from "moment/moment";
import {AxiosError, AxiosResponse} from "axios";
import {Dropdown} from "primereact/dropdown";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {uuidToBase64} from "../../../utils/uuid-utils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {AppointmentSearch} from "../../../types/appointment-search";
import ConfirmationModal from "../../../components/ConfirmationModal";

const PatientAppointmentsTable = () => {
    const [appointments, setAppointments] = useState<AppointmentSearch[]>([]);
    const navigate = useNavigate();
    const axios = useAxios();
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
    const {token} = useContext(TokenContext);

    const statuses = ['Rejected', 'Accepted', 'Pending', 'Cancelled', 'Completed']; // TODO temporary location
    const types = ['Checkup', 'Consultation']; // TODO temporary location

    const [modalIsShown, setModalIsShown] = useState(false);
    const hideModal = () => setModalIsShown(false);
    const showModal = () => setModalIsShown(true);

    const [currentAppointmentId, setCurrentAppointmentId] = useState('');

    const cancelAppointment = () => {
        axios.patch(`appointments/user/current/${currentAppointmentId}`, {status: 'Cancelled'})
            .then(() => {
                setLazyParams({...lazyParams});
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    }

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

        axios.get(`appointments/patient/current/search`, {params: queryParams})
            .then((response: AxiosResponse) => {
                let appointments: AppointmentSearch[] = response.data.records;
                appointments = appointments.map(appointment => {
                    return {
                        ...appointment,
                        doctorName: `${appointment.doctorFirstName} ${appointment.doctorLastName}`,
                    }
                });
                setAppointments(appointments);
                setTotalRecords(response.data.totalRecords);
                setLoading(false);
            }).catch((err: AxiosError) => {
            if (err.response?.status === 416) {
                setAppointments([]);
                setTotalRecords(0);
                setLoading(false);
            }
        });
    }, [axios, lazyParams, token]);

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
        const cancelButton = () => <Button label="Cancel" icon="pi pi-times" className="p-button-danger"
                                           onClick={() => {
                                               setCurrentAppointmentId(rowData.id);
                                               showModal();
                                           }}/>;
        const viewButton = () => <Button label="View" icon="pi pi-eye" className="p-button"
                                         onClick={() => navigate(`/appointments/${uuidToBase64(rowData.id)}`)}/>;

        return <div className="flex justify-content-center">
            {rowData.status !== "Completed" && rowData.status !== "Cancelled" && cancelButton()}
            {rowData.status === "Completed" && viewButton()}
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
                className="my-8"
            >
                <Column field="doctorName" header="Doctor"/>
                <Column field="date" header="Date" filter filterElement={dateRowFilterTemplate}
                        showFilterMatchModes={false}
                        body={dateTemplate}/>
                <Column field="date" header="Time" body={timeTemplate}/>
                <Column field="type" header="Type" filter filterElement={typeRowFilterTemplate}
                        showFilterMatchModes={false}/>
                <Column field="status" header="Status" filter filterElement={statusRowFilterTemplate}
                        showFilterMatchModes={false}/>
                <Column header="Actions" body={controlsTemplate}/>
            </DataTable>
            <ConfirmationModal
                title={"Appointment cancellation"}
                message={"Are you sure you want to cancel this appointment?"}
                isShown={modalIsShown}
                confirmAction={cancelAppointment}
                hide={hideModal}
            />
        </div>
    );
};

export default PatientAppointmentsTable;
