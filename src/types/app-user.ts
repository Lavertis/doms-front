import {Patient} from "./patient";
import {Doctor} from "./doctor";

export interface AppUser {
    id: string,
    userName: string,
    normalizedUserName: string,
    twoFactorEnabled: boolean,
    lockoutEnd: Date,
    lockoutEnabled: boolean,
    accessFailedCount: number,
    patient?: Patient,
    doctor?: Doctor
}