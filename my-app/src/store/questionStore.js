import {makeAutoObservable} from "mobx";
export  default  class QuestionStore{
    constructor() {
        this._questions = []
        this._answers = []
        this._answerCheck = false

        makeAutoObservable(this)
    }


    setQuestions(questions){
        this._questions = questions

    }
    setAnswers(answers){
        this._answers = answers

    }

    setAnswerCheck(answerCheck){
        this._answerCheck = answerCheck

    }

    get questions(){
        return this._questions
    }

    get answerCheck(){
        return this._answerCheck
    }

    get answers(){
        return this._answers
    }

}