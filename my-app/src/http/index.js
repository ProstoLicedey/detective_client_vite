import axios from "axios";

const $host = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL
});

$host.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const $authHost = axios.create({
    baseURL:import.meta.env.VITE_API_URL
});

const authInterceptor = config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
};
