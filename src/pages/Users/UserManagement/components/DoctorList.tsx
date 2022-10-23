import React, {useState} from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Doctor} from "../../../../types/doctor";
import {LazyParams} from "../../../../types/data-table";
import {Button} from "primereact/button";
import {uuidToBase64} from "../../../../utils/uuid-utils";
import {useNavigate} from "react-router-dom";
import useAxios from "../../../../hooks/useAxios";
import ConfirmationModal from "../../../../components/ConfirmationModal";


interface DoctorListProps {
    doctors: Doctor[];
    loading: boolean;
    totalRecords: number;
    lazyParams: LazyParams;
    setLazyParams: (lazyParams: LazyParams) => void;
    allowDelete?: boolean;
}

const DoctorList = ({doctors, loading, lazyParams, setLazyParams, totalRecords, allowDelete}: DoctorListProps) => {
    const navigate = useNavigate();
    const axios = useAxios();
    const deleteDoctor = (doctorId: string) => {
        console.log("Sending delete request for doctor with id: " + doctorId);
        // axios.delete(`doctors/${doctorId}`)
        //     .then(() => {
        //         setLazyParams({...lazyParams});
        //     }).catch((err: AxiosError) => {
        //     console.log(err);
        // });
    };
    const [currentDoctorId, setCurrentDoctorId] = useState('');

    const [modalIsShown, setModalIsShown] = useState(false);
    const hideModal = () => setModalIsShown(false);
    const showModal = () => setModalIsShown(true);

    const controlsTemplate = (rowData: Doctor) => {
        const doctorId = uuidToBase64(rowData.id);
        return <div className="flex justify-content-center">
            <Button
                className="p-button-danger mr-1"
                onClick={() => {
                    setCurrentDoctorId(doctorId);
                    showModal();
                }}
                icon="pi pi-trash"/>
            <Button
                onClick={() => navigate(`/doctors/${doctorId}`)}
                icon='pi pi-eye'
            />
        </div>;
    };

    return (
        <div>
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
            <ConfirmationModal
                title={"Delete confirmation"}
                message={"Are you sure you want to delete this doctor?"}
                isShown={modalIsShown}
                confirmAction={() => deleteDoctor(currentDoctorId)}
                hide={hideModal}
            />
        </div>
    );
};

export default DoctorList;
