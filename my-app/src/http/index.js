import axios from "axios";

const $host = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL
});

$host.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log('Token not found in localStorage');
    }
    return config;
});

const $authHost = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

$authHost.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log('Token not found in localStorage');
    }
    return config;
});

export {
    $host,
    $authHost
};
