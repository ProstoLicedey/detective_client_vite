import {$host} from "./index.js";


export  const  createAddressrAPI = async (district, number, title, appendix,info) =>{

    return  await $host.post('api/addresses', {district, number, title, appendix, info})

}
export  const  getAddressesAPI = async () =>{
    const {data} =   await $host.get('api/addresses/', )
    return data
}

export  const  userDeleteAPI = async (id) =>{
    const {data} =   await $host.delete('api/addresses/' + id )
    return data
}
