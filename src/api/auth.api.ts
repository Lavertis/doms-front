import {request} from "../services/api.service";

export interface SignInRequest {
    login: string;
    password: string;
}

export const signIn = async ({login, password}: SignInRequest): Promise<string | false> => {
    try {
        const signInResponse = await request.post('/auth/authenticate', {
            login,
            password,
        }, {
            withCredentials: true
        });
        return signInResponse.data.jwtToken;
    } catch {
        return false;
    }
};