import {useEffect} from 'react';
import useRefreshToken from './useRefreshToken';
import myAxios from '../api/Axios';

const useAxios = () => {
    const refreshToken = useRefreshToken();
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        const requestIntercept = myAxios.interceptors.request.use(
            config => {
                if (jwtToken && config.headers)
                    config.headers['Authorization'] = `Bearer ${jwtToken}`;
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = myAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevConfig = error.config;
                if (error.response.status === 401 && !prevConfig._retry) {
                    prevConfig._retry = true;
                    const newAccessToken = await refreshToken();
                    prevConfig.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return myAxios(prevConfig);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            myAxios.interceptors.request.eject(requestIntercept);
            myAxios.interceptors.response.eject(responseIntercept);
        };
    }, [jwtToken, refreshToken]);

    return myAxios;
};

export default useAxios;