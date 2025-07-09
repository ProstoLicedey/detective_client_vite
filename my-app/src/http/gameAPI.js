import {$authHost, $host} from "./index.js";

export const getGames = async () => {
    const {data} = await $host.get('/api/games/')
    return data
}

export const getGameAPI = async (id, userId) => {
    const { data } = await $host.get(`/api/games/${id}`, {
        params: { userId }
    });
    return data;
};



export const getActiveGameAPI = async () => {
    const {data} = await $host.get('/api/games/active')
    return data
}

export  const  createGameAPI = async (name, description) =>{

    return  await $host.post('api/games/create', {name, description})

}

export  const  gameDeleteAPI = async (id) =>{
    const {data} =   await $host.delete('api/games/delete/' + id )
    return data;
}
