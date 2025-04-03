import {makeAutoObservable} from "mobx";
export  default  class UserStore{
    constructor() {
        this._isAuth = false
        this._user = {}
        this._trips = []

        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this._isAuth = bool

    }
    setUser(user){
        this._user = user

    }
    setTrips(trips){
        this._trips = trips

    }

    get isAuth(){
        return this._isAuth
    }

    get user(){
        return this._user
    }
    get trips(){
        return this._trips
    }


}