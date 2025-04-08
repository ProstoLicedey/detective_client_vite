import {$host} from "./index.js";


export const getQuestionsAPI = async () => {
    const {data} = await $host.get('/api/questions/');
    return data
}

export const checkAnswerAPI = async (id) => {
    const {data} = await $host.get('/api/questions/answer/check/' + id);
    return data
}

export const postAnswerAPI = async (answers) => {
    return await $host.post('/api/questions/answer/', { answers });

}

export  const  deleteQuestionAPI = async (id) =>{
    const {data} =   await $host.delete('api/questions/' + id )
    return data
}

export  const  createQuestionAPI = async (question, numberPoints) =>{

    return  await $host.post('api/questions/', {question, numberPoints})

}

export  const  getAnsewrsAPI = async (id) =>{

    const {data} =   await $host.get('api/questions/answer/' + id)
    return data

}

export  const  putAnsewrsAPI = async (answers) =>{

    const {data} =   await $host.put('api/questions/answer/', { answers } )
    return data

}

export  const  daleteAnsewrsAPI = async (id) =>{

    const {data} =   await $host.delete('api/questions/answer/' + id )
    return data

}