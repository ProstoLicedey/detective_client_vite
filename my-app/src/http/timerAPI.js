import {$authHost, $host} from "./index.js";

export const getTimer = async () => {
    const {data} = await $host.get('/api/timer/')
    return data
}

export const postTimer = async (hours, minutes, gameId) => {
    const response = await $authHost.post('api/timer', {hours, minutes, gameId});
    return response.data;
}

export const deleteTimerAPI = async () => {
    const response = await $authHost.delete('api/timer');
    return response.data;
}

export const connectTimer = async (timer) => {
    const connectToServer = () => {
        const eventSource = new EventSource(`${(import.meta.env.VITE_API_URL)}api/timer/connect/`);

        eventSource.onmessage = function (event) {
            const data = event.data;

            if(data === 'null') {
                timer.setTimeFinish(null);
            } else {
                timer.setTimeFinish(data);
            }
        };

        eventSource.onerror = function(event) {
            console.error('Connection error. Attempting to reconnect...');
            eventSource.close();
            setTimeout(() => {
                connectToServer();
            }, 3000);
        };
    };

    connectToServer(); 
};
