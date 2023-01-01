import {FC, useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import UserStore from "../../store/user-store";
import {observer} from "mobx-react-lite";
import {authRequest} from "../../services/api.service";
import {AxiosResponse} from "axios";
import {IUser} from "../../types/user";
import {IMessage} from "../../types/message";
import {Card} from "primereact/card";
import {ListBox} from "primereact/listbox";

interface ChatWindowProps {
    visible: boolean;
}

const ChatWindow: FC<ChatWindowProps> = (props) => {
    const [connection, setConnection] = useState<HubConnectionState | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [receiver, setReceiver] = useState(null);
    const [users, setUsers] = useState<IUser[]>([]);

    const getMessages = async (receiver: IUser) => {
        authRequest.get(`chat-messages/user/current/` + receiver.id)
            .then((response: AxiosResponse) => {
                setMessages(response.data.records.map((val: any) => {
                    return {
                        id: val.id,
                        message: val.message,
                        sender: {id: val.senderId},
                        receiver: {id: val.receiverId},
                        createdAt: val.createdAt
                    }
                }));
            })
            .catch((e) => {
                console.log(e);
            });
    }

    const disconnect = async () => {
        // @ts-ignore
        if (connection === null || connection.status === HubConnectionState.Disconnected) {
            return;
        }
        // @ts-ignore
        connection.stop();
        setConnection(null);
        setReceiver(null);
    }

    const connect = async (receiver: IUser) => {
        console.log(receiver);
        try {
            if (receiver === null) {
                return;
            }
            if (UserStore.user === null) {
                return;
            }

            await getMessages(receiver);
            const connection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_API_URL + 'chat', {accessTokenFactory: () => UserStore.user?.jwtToken ?? ''})
                .configureLogging(LogLevel.Information)
                .build();


            connection.on('ReceiveMessage', (senderId, message) => {
                setMessages([...messages, {
                    message: message,
                    receiver: UserStore.user !== null ? UserStore.user : {id: ''} as IUser,
                    sender: {id: senderId} as IUser,
                    id: '',
                    createdAt: message.createdAt
                }]);
            })

            await connection.start();
            // @ts-ignore
            setConnection(connection);
        } catch (e) {
            console.log(e);
        }

    }

    const sendMessage = async (receiverId: string, message: string) => {
        try {
            if (connection === null) return;
            // @ts-ignore
            await connection.invoke("SendMessage", receiverId, message);
            setMessages([...messages, {
                message: message,
                sender: UserStore.user !== null ? UserStore.user : {id: ''} as IUser,
                receiver: {id: receiverId} as IUser,
                id: '',
                createdAt: new Date('now')
            }]);
        } catch (e) {
            console.log(e);
        }
    }

    const fetchUsers = async () => {
        let responseUsers: IUser[] = [];
        await authRequest.get('doctors')
            .then(async (response: AxiosResponse) => {
                responseUsers = [...responseUsers, ...response.data.records];
            });

        if (UserStore.user?.role === 'Doctor') {
            await authRequest.get('patients')
                .then((response: AxiosResponse) => {
                    responseUsers = [...responseUsers, ...response.data.records];
                });
        }

        responseUsers = responseUsers.filter((val: IUser) => val.id !== UserStore.user?.id);
        await setUsers(responseUsers);
    }

    useEffect(() => {
        fetchUsers().catch((e) => {
                console.log(e);
            }
        );
    }, []);

    return (
        <div style={{position: 'fixed', bottom: '100px', right: '24px', opacity: props.visible ? '1' : '0'}}>
            <div>
                <Card title={
                    <div className="flex justify-content-between mt-3">
                        <div className="w-17rem">
                            {receiver === null ? 'Pick a user' : `${receiver['firstName']} ${receiver['firstName']}`}
                        </div>
                        {connection !== null
                            ?
                            <Button style={{transform: "rotate(180deg)"}} icon="pi pi-reply" className="flex"
                                    type="submit" onClick={disconnect}/>
                            :
                            <></>
                        }
                    </div>
                }>

                    {connection !== null
                        ?
                        <div>
                            <MessageContainer messages={messages} receiver={receiver}/>
                            <SendMessageForm sendMessage={sendMessage} receiver={receiver}/>
                        </div>
                        :

                        <ListBox
                            value={receiver}
                            options={users}
                            onChange={async (e) => {
                                await setReceiver(e.value);
                                await connect(e.value);
                            }}
                            filter
                            optionLabel="firstName"
                            className="w-20rem"
                            listStyle={{maxHeight: '15rem'}}
                        />
                    }
                </Card>
            </div>
        </div>
    );
}

export default observer(ChatWindow);