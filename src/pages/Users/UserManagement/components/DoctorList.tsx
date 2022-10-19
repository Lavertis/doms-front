import React from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Doctor} from "../../../../types/doctor";
import {LazyParams} from "../../../../types/data-table";
import {Button} from "primereact/button";
import {uuidToBase64} from "../../../../utils/uuid-utils";
import {useNavigate} from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import {AxiosError} from "axios";


interface DoctorListProps {
    doctors: Doctor[];
    loading: boolean;
    totalRecords: number;
    lazyParams: LazyParams;
    setLazyParams: (lazyParams: LazyParams) => void;
}

const DoctorList = ({doctors, loading, lazyParams, setLazyParams, totalRecords}: DoctorListProps) => {
    const navigate = useNavigate();
    const axios = useAxios();
    const deleteDoctor = (doctorId: string) => {
        axios.delete(`doctors/${doctorId}`)
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
                onClick={() => deleteDoctor(rowData.id)}
                icon="pi pi-trash"/>
            <Button
                onClick={() => navigate(`/doctors/${uuidToBase64(rowData.id)}`)}
                icon='pi pi-eye'
            />
        </div>;
    };

    return (
        <DataTable
            value={doctors}
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
            <Column
                header="Actions"
                body={controlsTemplate}
            />
        </DataTable>
    );
};

export default DoctorList;
