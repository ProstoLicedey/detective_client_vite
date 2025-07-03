import {$host} from "./index.js";


export const getQuestionsQuizzAPI = async () => {
    const {data} = await $host.get('/api/questionsQuizz/');
    return data
}

export const createQuestionsQuizzOptionsAPI = async (questionId, options) => {
    return  await $host.post('api/questionsQuizz/options/', {questionId, options})
}

export  const  deleteQuestionsQuizzOptionsAPI = async (id) =>{

    const {data} =   await $host.delete('api/questionsQuizz/options/' + id )
    return data

}

export  const  saveQuizzAnswerAPI = async (payload, userId) =>{

    return  await $host.post('api/questionsQuizz/answers/', {payload, userId})

}