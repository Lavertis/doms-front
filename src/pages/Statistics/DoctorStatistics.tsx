import React, {FC, useEffect, useRef, useState} from 'react';
import {Card} from "primereact/card";
import {Calendar, CalendarValueType} from "primereact/calendar";
import {Statistics} from "../../types/statistics";
import ChartComponent from "./ChartComponent";
import {authRequest} from "../../services/api.service";
import {observer} from "mobx-react-lite";
import {Toast} from "primereact/toast";


interface DoctorStatisticsProps {
}

const DoctorStatistics: FC<DoctorStatisticsProps> = () => {
    const toast = useRef<Toast>(null);
    const [statisticsData, setStatisticsData] = useState<Statistics>(null!);
    const [dateRange, setDateRange] = useState<CalendarValueType>(undefined);

    const requestStatistics = () => {
        let params = null;
        if (Array.isArray(dateRange) && dateRange[1] === null) {
            return;
        }
        if (Array.isArray(dateRange)) {
            params = {
                dateStart: dateRange[0],
                dateEnd: dateRange[1]
            }
        }

        authRequest.get('statistics/doctor/current', {params: params})
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
    }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

    if (statisticsData === null)
        return <></>
    return (

        <div className={"px-6 py-6 flex flex-column flex-grow card-container flex-wrap"}>
            <Toast ref={toast}/>
            <div className="field flex flex-wrap justify-content-center">
                <Calendar
                    readOnlyInput
                    id="range"
                    placeholder={"Date range"}
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value)}
                    selectionMode="range"
                />
            </div>
            <div className="flex flex-wrap card-container justify-content-center">
                <Card title={"Appointments"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-bookmark"></i>
                    {statisticsData.appointmentsCount}
                </Card>
                <Card title={"Prescriptions"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-book"></i>
                    {statisticsData.prescriptionsCount}
                </Card>
                <Card title={"Patients"} className={"flex-grow-1 m-2 flex-wrap"}>
                    <i className="pi pi-fw pi-users"></i>
                    {statisticsData.doctorsPatientCount}
                </Card>
            </div>
            <ChartComponent data={statisticsData.appointmentTypesCount} totalCount={statisticsData.appointmentsCount}/>
        </div>
    );
};

export default observer(DoctorStatistics);