import axios from 'axios';

const myAxios = axios.create({
    // baseURL: 'https://doms-back.herokuapp.com/api/',
    baseURL: 'https://localhost:7261/api/',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default myAxios;