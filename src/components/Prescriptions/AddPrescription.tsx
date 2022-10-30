import React, {useRef} from 'react';
import {Button} from "primereact/button";
import {useFormik} from "formik";
import {Calendar} from 'primereact/calendar';
import AddDrugItem from "./AddDrugItem";
import {Drug} from "../../types/drugs";
import {cartesian} from "../../utils/math-utils";
import {Toast} from "primereact/toast";
import useAxios from "../../hooks/useAxios";

interface AddPrescriptionProps {
    patientId: string,
    appointmentId?: string,
    drugItems: Drug[],
    setDrugItems: (drugItems: Drug[]) => void
}

const AddPrescription = ({patientId, appointmentId, drugItems, setDrugItems}: AddPrescriptionProps) => {
    const dosages = cartesian([[0, 1, 2], [0, 1, 2], [0, 1, 2]]).slice(1).map(x => x.join('-'));
    const axios = useAxios();

    const setDrug = (drug: Drug, index: number) => {
        const localDrugItems = drugItems;
        localDrugItems[index] = drug;
        setDrugItems([...localDrugItems])
    };

    const formik = useFormik({
        initialValues: {
            fulfillmentDeadline: new Date()
        },
        validationSchema: null,
        onSubmit: values => {
            const data = {
                patientId: patientId,
                appointmentId: appointmentId,
                drugItems: drugItems,
                fulfillmentDeadline: values.fulfillmentDeadline
            }
            axios.post("prescriptions/doctor/current", data)
                .then(response => {
                    setDrugItems([]);
                })
        },
    });
    const toast = useRef<Toast>(null);

    const showError = (message: string) => {
        if (toast.current)
            (toast.current).show({severity: 'error', summary: 'Error Message', detail: message, life: 3000});
    }

    const addDrug = () => {
        if (drugItems.length === 5) {
            showError('One prescription can have at most 5 drugs');
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
