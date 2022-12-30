import {IUser} from '../types/user';
import jwt from 'jwt-decode';

import {action, makeObservable, observable} from 'mobx';
import {IJwtToken} from '../types/token';
import {signIn, SignInRequest} from '../api/auth.api';
import {request} from '../services/api.service';
import appointmentTypeStore from './appointment-type-store';
import appointmentStatusStore from './appointment-status-store';

class UserStore {
    user: IUser | null = null;

    constructor() {
        makeObservable(this, {user: observable, getUserData: action});
    }

    get isLoggedIn() {
        return this.user != null;
    }

    async getUserData(jwtToken: string) {
        if (!!jwtToken) {
            const decodedToken: IJwtToken = jwt(jwtToken);
            this.user = {
                email: decodedToken.email,
                id: decodedToken.sub,
                role: decodedToken.role,
                userName: decodedToken.name,
                jwtToken: jwtToken
            } as IUser;
        }
        appointmentTypeStore.fetchAppointmentTypes().then();  // TODO this is kinda retarded
        appointmentStatusStore.fetchAppointmentStatuses().then();
    }

    async signIn(signInData: SignInRequest): Promise<boolean> {
        const jwtToken = await signIn(signInData);
        if (jwtToken) {
            await this.getUserData(jwtToken);
            return true;
        }
        return false;
    }

    async refreshToken() {
        await request.post('auth/refresh-token', {}, {withCredentials: true})
            .then(async response => {
                const jwtToken = response.data.jwtToken;
                await this.getUserData(jwtToken);
            });
    }

    logout = () => {
        request.post("auth/logout", {}, {withCredentials: true})
            .then(() => {
                this.user = null;
            });
    };
}

const userStore = new UserStore();

export default userStore;