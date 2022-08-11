import myAxios from '../api/Axios';

const useRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');

    return async () => {
        const response = await myAxios.post('auth/refresh-token', {refreshToken: refreshToken});
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('jwtToken', response.data.jwtToken);
        return response.data.refreshToken;
    };
};

export default useRefreshToken;