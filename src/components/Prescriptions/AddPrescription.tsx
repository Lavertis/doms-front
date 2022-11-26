import React, {useRef} from 'react';
import {Button} from "primereact/button";
import {useFormik} from "formik";
import {Calendar} from 'primereact/calendar';
import AddDrugItem from "./AddDrugItem";
import {Drug} from "../../types/drugs";
import {cartesian} from "../../utils/math-utils";
import {Toast} from "primereact/toast";
import {authRequest} from "../../services/api.service";

interface AddPrescriptionProps {
    patientId: string,
    appointmentId?: string,
    drugItems: Drug[],
    setDrugItems: (drugItems: Drug[]) => void
    fetchPrescriptions: () => void
}

const AddPrescription = ({
                             patientId,
                             appointmentId,
                             drugItems,
                             setDrugItems,
                             fetchPrescriptions
                         }: AddPrescriptionProps) => {
    const dosages = cartesian([[0, 1, 2], [0, 1, 2], [0, 1, 2]]).slice(1).map(x => x.join('-'));

    const setDrug = (drug: Drug, index: number) => {
        const localDrugItems = drugItems;
        localDrugItems[index] = drug;
        setDrugItems([...localDrugItems])
    };

    const formik = useFormik({
        initialValues: {
            fulfillmentDeadline: new Date()
        },
        onSubmit: values => {
            const data = {
                patientId: patientId,
                appointmentId: appointmentId,
                drugItems: drugItems,
                fulfillmentDeadline: values.fulfillmentDeadline.toISOString()
            }
            if (values.fulfillmentDeadline < new Date(new Date().setDate(new Date().getDate() - 1))) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Prescription',
                    detail: 'Fulfillment date cannot be in the past',
                    life: 5000
                });
                return;
            }

            if (data.drugItems.length === 0) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Prescription',
                    detail: 'At least one drug item is required',
                    life: 5000
                });
                return;
            }

            for (let i = 0; i < data.drugItems.length; i++) {
                const drugItem = data.drugItems[i];
                const idx = i + 1;
                if (drugItem.rxcui === undefined) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Prescription',
                        detail: `Drug item ${idx} has no drug selected`,
                        life: 5000
                    });
                    return;
                }
                if (drugItem.quantity === 0) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Prescription',
                        detail: `Drug quantity of the ${idx} drug item is required`,
                        life: 5000
                    });
                    return;
                }
                if (drugItem.dosage === '') {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Prescription',
                        detail: `Drug dosage of the ${idx} drug item is required`,
                        life: 5000
                    });
                    return;
                }
            }
            authRequest.post("prescriptions/doctor/current", data)
                .then(() => {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Prescription',
                        detail: 'Prescription has been created',
                        life: 5000
                    });
                    setDrugItems([]);
                    fetchPrescriptions();
                })
        },
    });
    const toast = useRef<Toast>(null);

    const isFormFieldValid = (name: string) => !!(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);
    const getFormErrorMessage = (name: string) => {
        return isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name as keyof typeof formik.errors] as string}</small>;
    };

    const addDrug = () => {
        if (drugItems.length === 5) {
            toast.current?.show({
                severity: 'error',
                summary: 'Prescription',
                detail: `One prescription can have at most 5 drugs`,
                life: 5000
            });
            return;
        }
        const newDrugItems = drugItems;
        newDrugItems.push(
            {
                rxcui: undefined,
                dosage: dosages[0],
                name: "",
                alternative_name: "",
                quantity: 1
            }
        );
        setDrugItems([...newDrugItems]);
    }

    const removeDrug = (index: number) => {
        const newDrugItems = drugItems;
        newDrugItems.splice(index, 1);
        setDrugItems([...newDrugItems]);
    }

    return (
        <div>
            <Toast ref={toast}/>
            <div className="text-900 text-2xl font-medium text-black-alpha-80 text-center mb-3">
                New prescription
            </div>
            <hr/>
            <form onSubmit={formik.handleSubmit} className="flex flex-column">
                <div className="col-12 md:col-6 pl-0 mb-3">
                    <label htmlFor="fulfillmentDeadline" className="block text-900 font-medium mb-2">
                        Fulfillment deadline
                    </label>
                    <Calendar
                        id="fulfillmentDeadline"
                        dateFormat="dd/mm/yy"
                        value={formik.values.fulfillmentDeadline}
                        placeholder="Pick a date"
                        onChange={formik.handleChange}
                        showIcon
                    />
                    <div>{getFormErrorMessage('fulfillmentDeadline')}</div>
                </div>

                {drugItems.map((drugItem, index) =>
                    <div key={index /* this may cause problems after deleting drug item*/}>
                        <AddDrugItem
                            drug={drugItem}
                            drugIndex={index}
                            setDrug={setDrug}
                            removeDrug={removeDrug}
                            dosages={dosages}
                        />
                    </div>
                )}

                <Button
                    label="Add drug"
                    icon="pi pi-plus"
                    type="button"
                    className="w-auto align-self-start"
                    onClick={addDrug}
                />

                <Button
                    label="Create"
                    icon="pi pi-check-circle"
                    type="submit"
                    className="w-auto align-self-end p-button-success"
                />
            </form>
        </div>
    );
};

export default AddPrescription;
