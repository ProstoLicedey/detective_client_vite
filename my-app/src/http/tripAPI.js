import {$authHost, $host} from "./index.js";

export const postTrip = async (id, district, number) => {
    const response = await $authHost.post('api/trips/', {id, district, number})

    return response.data
}

export const getTrips = async (id) => {
    const {data} = await $host.get('/api/trips/forUser/' + id)
    return data
}
export const getTripsAdmin = async () => {
    const {data} = await $host.get('/api/trips/admin')
    return data
}
export const putTrip = async (id) => {
    const response = await $host.put('api/trips', {id});
    return response.data;
}

export const connectTrip = async (user) => {
    let eventSource = null;

    const connectToServer = () => {

        if (eventSource) {
            eventSource.close();
        }

        eventSource = new EventSource(`${import.meta.env.VITE_API_URL}api/trips/connect/` + user.user.id);

        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log(data);

            const tripExists = user.trips.some(trip => trip.id === data.id);

            if (!tripExists) {
                const updatedTrips = [data, ...user.trips];
                user.setTrips(updatedTrips);
                console.log(user.trips);
            } else {
                console.log(`Trip with id ${data.id} already exists`);
            }
        };

        eventSource.onerror = function (event) {
            console.error('Connection error. Attempting to reconnect...');
            eventSource.close();
            setTimeout(() => {
                connectToServer();
            }, 3000);
        };
    };

    connectToServer();
};


export const connectTripAdmin = async (admin) => {
    let eventSource = null;

    const establishConnection = () => {
        if (eventSource) {
            eventSource.close();
        }

        eventSource = new EventSource(`${(import.meta.env.VITE_API_URL)}api/trips/connectAdmin/`);

        eventSource.onmessage = function (event) {
            console.log(event)
            const data = JSON.parse(event.data);
            admin.setTrips(data); // Просто сохраняем полученные данные в admin.trips
            console.log(admin.trips)
        };

        eventSource.onerror = function (event) {
            console.error('Connection error. Attempting to reconnect... ');
            eventSource.close();
            setTimeout(establishConnection, 3000);
        };
    };
    setTimeout(establishConnection, 2000);
};






