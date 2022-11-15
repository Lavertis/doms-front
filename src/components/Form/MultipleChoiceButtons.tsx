import React from 'react';
import {Button} from "primereact/button";
import {MultipleChoiceItem} from "../../types/quick-button";

interface MultipleChoiceButtonsProps {
    availableValues: MultipleChoiceItem[],
    selectedValues: MultipleChoiceItem[],
    setValues: (values: MultipleChoiceItem[]) => void,
    disabled?: boolean
}

const MultipleChoiceButtons = (props: MultipleChoiceButtonsProps) => {
    const onSelectedChange = (item: MultipleChoiceItem) => {
        if (props.selectedValues.some(value => value.id === item.id))
            props.setValues(props.selectedValues.filter(value => value.id !== item.id));
        else
            props.setValues([...props.selectedValues, item]);
    }

    const buttonClassNames = ' p-button-rounded p-button-info m-1 p-button-sm';

    return (
        <div className="grid align-content-start">
            {props.availableValues.map(value => {
                const isSelected = props.selectedValues.some(s => s.id === value.id);
                const className = isSelected ? '' : 'p-button-outlined';
                return (
                    <Button
                        key={value.id}
                        label={value.name}
                        className={className + buttonClassNames}
                        onClick={() => onSelectedChange(value)}
                        disabled={props.disabled}
                        />
                    )
                }
            )}
        </div>
    );
}

export default MultipleChoiceButtons;