import {$host} from "./index.js";

export  const  loginAPI = async (login, password) =>{
    const deviceIdentifier  = localStorage.getItem('deviceId');
    const {data} = await $host.post('api/user/login', {login, password, deviceIdentifier })
    return data
}

export  const  logoutAPI = async () =>{
    let token = localStorage.getItem( 'token');
    return  await $host.post('api/user/logout', {token})

}
export  const  createUserAPI = async (login, password) =>{

    return  await $host.post('api/user/create', {login, password})

}
export  const  userListAPI = async () =>{
    const {data} =   await $host.get('api/user/teams', )
    return data
}

export  const  userDeleteAPI = async (id) =>{
    const {data} =   await $host.delete('api/user/delete/' + id )
    return data;
}
