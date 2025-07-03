import {makeAutoObservable} from "mobx";
export  default  class UserStore{
    constructor() {
        this._isAuth = false
        this._user = {}
        this._active = null
        this._trips = []
        this._game = {}

        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this._isAuth = bool

    }
    setUser(user){
        this._user = user

    }
    setActive(active){
        this._active = active

    }
    setTrips(trips){
        this._trips = trips

    }
    setGame(game){
        this._game = game

    }

    get isAuth(){
        return this._isAuth
    }

    get user(){
        return this._user
    }

    get active(){
        return this._active
    }
    get trips(){
        return this._trips
    }

    get game(){
        return this._game
    }


}