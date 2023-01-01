import {FC, useEffect, useRef, useState} from 'react';
import {Button} from "primereact/button";
import ChatWindow from "./ChatWindow";

interface ChatProps {
}

const Chat: FC<ChatProps> = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: any) {
            // @ts-ignore
            if (ref.current && !ref.current.contains(event.target)) {
                setVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);


    return (
        <div ref={ref} style={{position: 'fixed', bottom: '24px', right: '24px'}}>
            <ChatWindow visible={visible}/>
            <Button icon="pi pi-comment" onClick={() => setVisible(true)}/>
        </div>
    );
}

export default Chat;