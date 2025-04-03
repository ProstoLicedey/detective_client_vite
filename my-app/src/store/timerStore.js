import {makeAutoObservable} from "mobx";
export  default  class TimerStore{
    constructor() {
        this._timeFinish = null
        this._timerActive = false

        makeAutoObservable(this)
    }

    setTimeFinish(timeFinish){
        this._timeFinish = timeFinish

    }
    setTimerActive(bool){
        this._timerActive = bool

    }

    get timeFinish(){
        return this._timeFinish
    }
    get timerActive(){
        return this._timerActive
    }

}