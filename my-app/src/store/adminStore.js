import {makeAutoObservable} from "mobx";
export  default  class AdminStore{
    constructor() {
        this._ = null
        this._timerActive = false
        this._trips = []
        this._users = []
        this._addresses = []

        makeAutoObservable(this)
    }

    setTimeFinish(timeFinish){
        this._timeFinish = timeFinish

    }
    setTimerActive(bool){
        this._timerActive = bool

    }
    setTrips(trips){
        this._trips = trips

    }
    setUsers(users){
        this._users = users

    }
    setAddresses(addresses){
        this._addresses = addresses

    }

    get timeFinish(){
        return this._timeFinish
    }
    get timerActive(){
        return this._timerActive
    }
    get trips(){
        return this._trips
    }
    get users(){
        return this._users
    }
    get addresses(){
        return this._addresses
    }

}