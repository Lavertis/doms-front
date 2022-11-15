import React from 'react';
import {useFormik} from "formik";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {QuickButton} from "../../../types/quick-button";

interface QuickButtonsEditProps {
    quickButtons: QuickButton[];
    addQuickButton: (quickButton: string) => Promise<boolean>;
    deleteQuickButton: (id: string) => void;
    toast: React.RefObject<Toast>;
}

const QuickButtonsEdit = ({quickButtons, addQuickButton, deleteQuickButton, toast}: QuickButtonsEditProps) => {
    const formik = useFormik({
        initialValues: {
            quickButton: ''
        },
        onSubmit: async values => {
            if (values.quickButton.length === 0) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Quick button',
                    detail: 'Cannot create empty quick button',
                    life: 5000
                });
                return;
            }
            if (quickButtons.map(quickButton => quickButton.value).includes(values.quickButton)) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Quick button',
                    detail: 'Quick button with this value already exists',
                    life: 5000
                });
                return;
            }

            if (await addQuickButton(values.quickButton)) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Quick button',
                    detail: 'Quick button created',
                    life: 5000
                });
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Quick button',
                    detail: 'Could not create quick button',
                    life: 5000
                });
            }
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="field mb-4 flex">
                    <InputText
                        id="quickButton"
                        name="quickButton"
                        value={formik.values.quickButton}
                        onChange={formik.handleChange}
                        className="w-6"
                    />
                    <Button type="submit" icon="pi pi-plus" className="w-auto ml-2 px-3"/>
                </div>
                <div className="flex flex-wrap">
                    {quickButtons.map((button, index) => (
                        <div key={index} className="p-tag p-tag-rounded p-tag-value mb-2 mr-2 px-3 py-2">
                            <span>{button.value}</span>
                            <div
                                className="ml-3 cursor-pointer flex"
                                onClick={() => deleteQuickButton(button.id)}>
                                <i className="pi pi-times"/>
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
};

export default QuickButtonsEdit;
