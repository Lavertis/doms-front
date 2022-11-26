import React, {useRef} from 'react';
import {Button} from "primereact/button";
import {useFormik} from "formik";
import {Calendar} from 'primereact/calendar';
import {Toast} from "primereact/toast";
import {InputTextarea} from "primereact/inputtextarea";
import {authRequest} from "../../services/api.service";

interface AddSickLeaveProps {
    patientId: string,
    appointmentId?: string,
    fetchSickLeaves: () => void
}

const AddSickLeave = ({patientId, appointmentId, fetchSickLeaves}: AddSickLeaveProps) => {
    const formik = useFormik({
        initialValues: {
            dateStart: new Date(),
            dateEnd: new Date(),
            diagnosis: "",
            purpose: ""
        },
        validationSchema: null,
        onSubmit: values => {
            const data = {
                patientId: patientId,
                appointmentId: appointmentId,
                dateStart: values.dateStart,
                dateEnd: values.dateEnd,
                diagnosis: values.diagnosis,
                purpose: values.purpose
            }
            authRequest.post("sick-leaves/doctor/current", data)
                .then(() => {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sick leave',
                        detail: 'Sick leave created successfully',
                        life: 5000
                    });
                    fetchSickLeaves();
                })
                .catch(err => {
                    const arr = [];
                    for (const [fieldName, values] of (Object.entries(err.response.data.errors) as any)) {
                        const fieldNameLowerCased = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
                        arr.push(
                            {
                                fieldName: fieldNameLowerCased,
                                value: values[0]
                            }
                        );
                    }
                    showError(arr[0].value);
                });
        },
    });
    const toast = useRef<Toast>(null);

    const showError = (message: string) => {
        if (toast.current)
            (toast.current).show({severity: 'error', summary: 'Error Message', detail: message, life: 3000});
    }

    return (
        <div className="">
            <Toast ref={toast}/>
            <div className="text-center mb-5">
                <div className="text-900 text-2xl font-medium mb-3">New sick leave</div>
                <hr/>
            </div>
            <form onSubmit={formik.handleSubmit} className="flex flex-column">
                <div className="flex flex-column sm:flex-row justify-content-between mb-3 px-2">
                    <div className="ml-0 sm:mr-2 mb-3 sm:mb-0">
                        <label htmlFor="dateStart" className="block text-900 font-medium mb-2">
                            Start date
                        </label>
                        <Calendar
                            id="dateStart"
                            dateFormat="dd/mm/yy"
                            value={formik.values.dateStart}
                            placeholder="Pick a date"
                            onChange={formik.handleChange}
                            showIcon
                        />
                    </div>

                    <div className="ml-0 sm:ml-2">
                        <label htmlFor="dateEnd" className="block text-900 font-medium mb-2">
                            End date
                        </label>
                        <Calendar
                            id="dateEnd"
                            dateFormat="dd/mm/yy"
                            value={formik.values.dateEnd}
                            placeholder="Pick a date"
                            onChange={formik.handleChange}
                            showIcon
                        />
                    </div>
                </div>

                <div className="px-2">
                    <div className="mb-3">
                        <InputTextarea
                            name={"diagnosis"}
                            placeholder={"Diagnosis"}
                            rows={5}
                            cols={60}
                            className="w-full"
                            value={formik.values["diagnosis"]}
                            onChange={formik.handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <InputTextarea
                            name={"purpose"}
                            placeholder={"Purpose"}
                            rows={5}
                            cols={60}
                            className="w-full"
                            value={formik.values["purpose"]}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

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

export default AddSickLeave;
