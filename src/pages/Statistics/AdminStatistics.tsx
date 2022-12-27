import React, {FC, useEffect, useRef, useState} from 'react';
import {Card} from "primereact/card";
import {Calendar, CalendarValueType} from "primereact/calendar";
import {Statistics} from "../../types/statistics";
import {Dropdown} from "primereact/dropdown";
import ChartComponent from "./ChartComponent";
import {Doctor} from "../../types/Users/Doctor";
import {authRequest} from "../../services/api.service";
import {observer} from "mobx-react-lite";
import {Toast} from "primereact/toast";

interface AdminStatisticsProps {
}

interface DoctorOptions {
    id: string,
    fullName: string
}

const AdminStatistics: FC<AdminStatisticsProps> = () => {
    const toast = useRef<Toast>(null);
    const [statisticsData, setStatisticsData] = useState<Statistics>(null!);
    const [dateRange, setDateRange] = useState<CalendarValueType>(undefined);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorOptions>();
    const [doctorsOption, setDoctorsOptions] = useState<object[]>([]);

    useEffect(() => {
        authRequest.get('/doctors',)
            .then((response) => {
                const data = response.data.records as Doctor[];
                const doctorsOptions: DoctorOptions[] = [];
                data.forEach(el => doctorsOptions.push({id: el.id, fullName: `${el.firstName} ${el.lastName}`}));
                setDoctorsOptions(doctorsOptions);
            })
            .catch(() => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Doctor list',
                    detail: 'Cannot get list of doctors',
                    life: 5000
                });
            });
    }, []);

    const onDoctorChange = (e: { value: DoctorOptions }) => {
        setSelectedDoctor(e.value);
    }

    const requestStatistics = () => {
        let params = null;
        if (selectedDoctor == null) {
            setStatisticsData({
                appointmentsCount: 0,
                doctorsPatientCount: 0,
                prescriptionsCount: 0,
                appointmentTypesCount: {},
                patientCount: 0,
                doctorCount: 0,
                userCount: 0
            } as Statistics);

            return;
        }

        if (Array.isArray(dateRange) && dateRange[1] === null)
            return;
        if (Array.isArray(dateRange)) {
            params = {
                dateStart: dateRange[0],
                dateEnd: dateRange[1]
            }
        }

        authRequest.get(`statistics/doctor/${selectedDoctor.id}`, {params: params})
            .then((response) => {
                console.log(response.data);
                const data = response.data as Statistics
                setStatisticsData(data);
            })
            .catch(() => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Statistics',
                    detail: 'Cannot get website statistics',
                    life: 5000
                });
            });
    }

    useEffect(() => {
        requestStatistics();
    }, [dateRange, selectedDoctor]); // eslint-disable-line react-hooks/exhaustive-deps

    if (statisticsData === null)
        return <></>
    return (
        <div className={"px-6 py-6 flex flex-column flex-grow card-container flex-wrap justify-content-center"}>
            <Toast ref={toast}/>
            <div className={"flex flex-wrap card-container justify-content-center"}>
                <div className="field mx-1">
                    <Calendar
                        readOnlyInput
                        id="range"
                        placeholder={"Date range"}
                        value={dateRange}
                        onChange={(e) => setDateRange(e.value)}
                        selectionMode="range"
                    />
                </div>
                <div className="field mx-1">
                    <Dropdown
                        value={selectedDoctor}
                        options={doctorsOption}
                        onChange={onDoctorChange}
                        optionLabel="fullName"
                        placeholder="Select doctor"
                    />
                </div>
            </div>
            <div className={"flex flex-wrap card-container justify-content-center"}>
                <h3>Doctor data</h3>
            </div>
            <div className={"flex flex-wrap card-container justify-content-center"}>
                <Card title={"Appointments"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-bookmark"></i>
                    {statisticsData.appointmentsCount}
                </Card>
                <Card title={"Prescriptions"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-book"></i>
                    {statisticsData.prescriptionsCount}
                </Card>
                <Card title={"Doctors patients"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-users"></i>
                    {statisticsData.doctorsPatientCount}
                </Card>
            </div>
            <ChartComponent data={statisticsData.appointmentTypesCount} totalCount={statisticsData.appointmentsCount}/>
            <div className={"flex flex-wrap card-container justify-content-center m-2"}>
                <h3>Site data</h3>
            </div>
            <div className={"flex flex-wrap card-container justify-content-center"}>
                <Card title={"Doctors"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-user-plus"></i>
                    {statisticsData.doctorCount}
                </Card>
                <Card title={"Patients"} className={"flex-grow-1 m-2 flex-wrap"}>
                    {/*TODO if value is 0 its string*/}
                    <i className="pi pi-fw pi-users"></i>
                    {statisticsData.patientCount}
                </Card>
                <Card title={"Users"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-angle-double-up"></i>
                    {statisticsData.userCount}
                </Card>
            </div>
        </div>
    );
};

export default observer(AdminStatistics);