import axios from 'axios';
import {IJwtToken} from "../types/token";
import jwt from "jwt-decode";
import userStore from "../store/user-store";


export const request = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

request.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        throw error;
    },
);

export const authRequest = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

authRequest.interceptors.request.use(async (req) => {
    const token = userStore.user?.jwtToken;
    if (req && req.headers) {
        req.headers.Authorization = `bearer ${token}`;
    }

    const decodedToken: IJwtToken = jwt(token!);
    const isTokenExpired = Date.now() >= decodedToken.exp * 1000;
    if (isTokenExpired) {
        try {
            const response = await request({
                method: 'post',
                url: 'auth/refresh-token',
                withCredentials: true
            });

            if (req && req.headers) {
                userStore.getUserData(response.data.jwtToken).then();
                req.headers.Authorization = `bearer ${response.data.jwtToken}`;
            }
        } catch {
            userStore.logout();
        }
    }

    return req;
});

authRequest.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        throw error;
    },
);