import React from 'react';
import {Patient} from "../../../../types/patient";
import {LazyParams} from "../../../../types/data-table";
import {useNavigate} from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import {AxiosError} from "axios";
import {Doctor} from "../../../../types/doctor";
import {Button} from "primereact/button";
import {uuidToBase64} from "../../../../utils/uuid-utils";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

interface PatientListProps {
    patients: Patient[];
    loading: boolean;
    totalRecords: number;
    lazyParams: LazyParams;
    setLazyParams: (lazyParams: LazyParams) => void;
}

const PatientList = ({patients, loading, lazyParams, setLazyParams, totalRecords}: PatientListProps) => {
    const navigate = useNavigate();
    const axios = useAxios();
    const deletePatient = (patientId: string) => {
        axios.delete(`patients/${patientId}`)
            .then(() => {
                setLazyParams({...lazyParams});
            }).catch((err: AxiosError) => {
            console.log(err);
        });
    };

    const controlsTemplate = (rowData: Doctor) => {
        return <div className="flex justify-content-center">
            <Button
                className="p-button-danger mr-1"
                onClick={() => deletePatient(rowData.id)}
                icon="pi pi-trash"/>
            <Button
                onClick={() => navigate(`/patients/${uuidToBase64(rowData.id)}`)}
                icon='pi pi-eye'
            />
        </div>;
    };

    return (
        <DataTable
            value={patients}
            lazy
            paginator
            first={lazyParams.first}
            className="p-datatable-doctors"
            showGridlines
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            dataKey="id"
            filters={lazyParams.filters}
            filterDisplay="row"
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="No doctors found."
            onPage={(e: any) => {
                setLazyParams(e);
            }}
            onFilter={(e: any) => {
                e['page'] = 0;
                setLazyParams(e);
            }}
        >
            <Column
                field="firstName"
                header="First name"
                filter
                filterPlaceholder="Search by first name"
                showFilterMenuOptions={false}
                showFilterMenu={false}
            />
            <Column
                field="lastName"
                header="Last name"
                filter
                filterPlaceholder="Search by last name"
                showFilterMenuOptions={false}
                showFilterMenu={false}
            />
            <Column
                field="email"
                header="E-mail"
                filter
                filterPlaceholder="Search by e-mail"
                showFilterMenuOptions={false}
                showFilterMenu={false}
            />
            <Column header="Actions" body={controlsTemplate}/>
        </DataTable>
    );
};

PatientList.propTypes = {};

export default PatientList;
