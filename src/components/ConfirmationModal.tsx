import React, {FC} from 'react';
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

interface ConfirmationModalProps {
    title: string;
    message: string;
    isShown: boolean;
    confirmAction: () => void;
    hide: () => void;
    buttonType?: 'p-button-danger' | 'p-button-success' | 'p-button-secondary' | 'p-button-warning' | 'p-button-help' | 'p-button-info' | 'p-button-text';
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({title, message, isShown, confirmAction, hide, buttonType}) => {
    const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" onClick={hide} className="p-button-text"/>
                <Button
                    label="Yes"
                    icon="pi pi-check"
                    onClick={() => {
                        confirmAction();
                        hide();
                    }}
                    className={buttonType ?? ''}
                    autoFocus
                />
            </div>
        );
    }

    return (
        <div>
            <Dialog header={title} visible={isShown} style={{width: '50vw'}} footer={renderFooter} onHide={hide}>
                <p>{message}</p>
            </Dialog>
        </div>
    );
};

export default ConfirmationModal;
