import {FC, useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {IUser} from "../../types/user";
import {InputText} from "primereact/inputtext";

interface SendMessageFromProps {
    receiver: IUser | null;

    sendMessage(receiverId: string, message: string): void;
}

const SendMessageForm: FC<SendMessageFromProps> = (props) => {
    const [receiver] = useState(props.receiver);
    const [message, setMessage] = useState('');
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setDisabled(message === '');
    }, [message]);

    return (
        <div>
            <form
                className="flex justify-content-between mt-3"
                onSubmit={e => {
                    e.preventDefault();
                    // @ts-ignore
                    props.sendMessage(receiver.id, message);
                    setMessage('');
                }}>
                <div className="w-full">
                    <InputText className="col-12"
                               placeholder="message..."
                               onChange={e => {
                                   setMessage(e.target.value)
                               }}
                               value={message}
                    />
                </div>
                <Button icon="pi pi-send" disabled={disabled} className="flex" type="submit"></Button>
            </form>
        </div>
    );
}

export default SendMessageForm;