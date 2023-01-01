import {FC, useEffect, useRef} from 'react';
import {IMessage} from "../../types/message";
import UserStore from "../../store/user-store";
import {IUser} from "../../types/user";

interface MessageContainerProps {
    receiver: IUser | null;
    messages: IMessage[];
}

const MessageContainer: FC<MessageContainerProps> = (props) => {
    const dummy: any = useRef();

    useEffect(() => {
        dummy.current.scrollIntoView({behavior: "smooth"});
    }, [props.messages]);

    return (
        <div
            style={{
                overflowY: 'scroll',
                maxHeight: '200px',
                minHeight: '200px'
            }}
        >
            {props.messages.map((m, index) =>
                <div key={index}>
                    {
                        m.receiver.id !== UserStore.user?.id
                            ?
                            <div className="flex flex-row-reverse">
                                <div className="bg-primary  border-round p-2 m-1">
                                    {m.message}
                                </div>
                            </div>
                            :
                            <div className="flex">
                                <div className="bg-indigo-100 border-round p-2 m-1">
                                    {m.message}
                                </div>
                            </div>
                    }
                </div>
            )}
            <div ref={dummy}/>
        </div>
    );
}

export default MessageContainer;