import React, {useEffect} from 'react';
import {InputTextarea} from "primereact/inputtextarea";
import MultipleChoiceButtons from "../../../../components/Form/MultipleChoiceButtons";
import {MultipleChoiceItem} from "../../../../types/quick-button";

interface TextAreaWithMultipleChoiceButtonsProps {
    formik: any;
    availableValues: MultipleChoiceItem[];
    selectedValues: MultipleChoiceItem[];
    setSelectedValues: (values: MultipleChoiceItem[]) => void;
    fieldName: string;
    fieldPlaceholder?: string;
    disabled?: boolean;
}

const TextAreaWithMultipleChoiceButtons = ({
                                               formik,
                                               availableValues,
                                               selectedValues,
                                               setSelectedValues,
                                               fieldName,
                                               fieldPlaceholder,
                                               disabled
                                           }: TextAreaWithMultipleChoiceButtonsProps) => {

    const isFormFieldValid = (name: string) =>
        !(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.errors]);

    const getFormErrorMessage = (name: string) => {
        return !isFormFieldValid(name) &&
            <small className="p-error">{formik.errors[name as keyof typeof formik.errors]}</small>;
    };

    const [previousSelectedValuesCount, setPreviousSelectedValuesCount] = React.useState<number>(selectedValues.length);

    useEffect(() => {
        if (disabled && availableValues.length > 0) {
            const selectedValuesFromTextArea = formik.values[fieldName]
                .split(', ')
                .map((p: string) => {
                    return availableValues.find((v: MultipleChoiceItem) => v.name === p);
                });
            setSelectedValues(selectedValuesFromTextArea);
        }
    }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (disabled)
            return;
        if (formik.values[fieldName] !== "" && selectedValues.length === 0 && previousSelectedValuesCount > 0)
            formik.setFieldValue(fieldName, '');
        if (selectedValues.length > 0) {
            console.log('selectedValues', selectedValues);
            formik.setFieldValue(fieldName, selectedValues.map(p => p.name).join(', '));
        }
        setPreviousSelectedValuesCount(selectedValues.length);
    }, [selectedValues]); // eslint-disable-line react-hooks/exhaustive-deps

    const onClickClearHandler = () => {
        if (!disabled)
            setSelectedValues([]);
    }

    return (
        <div className="flex flex-column lg:flex-row">
            <div className={!disabled ? "lg:col-6 lg:pr-4" : "col-12"}>
                <div onClick={onClickClearHandler} className="w-full h-full">
                    <InputTextarea
                        name={fieldName}
                        placeholder={fieldPlaceholder}
                        value={formik.values[fieldName]}
                        onChange={formik.handleChange}
                        rows={5}
                        cols={60}
                        className="w-full h-full"
                        disabled={selectedValues.length > 0 || disabled}
                        autoResize
                    />
                </div>
                {getFormErrorMessage(fieldName)}
            </div>
            {!disabled &&
                <div className="lg:col-6 lg:pl-4 mt-4 lg:mt-0">
                    <MultipleChoiceButtons
                        availableValues={availableValues}
                        selectedValues={selectedValues}
                        setValues={setSelectedValues}
                        disabled={disabled}
                    />
                </div>
            }
        </div>
    );
};

export default TextAreaWithMultipleChoiceButtons;
