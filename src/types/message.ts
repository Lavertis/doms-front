import {IUser} from "./user";

export interface IMessage {
    id: string;
    sender: IUser;
    receiver: IUser;
    createdAt: Date;
    message: string;
}