import React, {useContext, useEffect, useState} from 'react';
import HeaderPage from "../../components/header/HeaderPage.jsx";
import MenuPage from "../../components/admin/menuPage.jsx";
import tripAdmin from "../../components/admin/menuItem/tripAdmin.jsx";
import timerAdmin from "../../components/admin/menuItem/timerAdmin.jsx";
import TripAdmin from "../../components/admin/menuItem/tripAdmin.jsx";
import TimerAdmin from "../../components/admin/menuItem/timerAdmin.jsx";
import UsersAdmin from "../../components/admin/menuItem/usersAdmin.jsx";
import AddressesPage from "../../components/admin/menuItem/addressesPage.jsx";
import {connectTimer, getTimer} from "../../http/timerAPI.js";
import moment from "moment/moment";
import {Context} from "../../index.jsx";
import {observer} from "mobx-react-lite";
import QuestionAdmin from "../../components/admin/menuItem/questionAdmin.jsx";
import QuestionQuizzAdmin from "../../components/admin/menuItem/qestionQuizzAdmin.jsx";
import GameAdmin from "../../components/admin/menuItem/gameAdmin.jsx";

const PLANS = {
    trip: TripAdmin,
    timer: TimerAdmin,
    users: UsersAdmin,
    addresses: AddressesPage,
    questionsDetective: QuestionAdmin,
    questionsQuizz: QuestionQuizzAdmin,
    games: GameAdmin,
}

const AdminPage = () => {
    const hashValue = window.location.hash.substring(1);
    const initialSelectedPlan = PLANS[hashValue] ? hashValue : 'trip';
    const [selectedPlan, setSelectedPlan] = useState(initialSelectedPlan);
    const {admin, user} = useContext(Context)





    useEffect(() => {
        const handleHashChange = () => {
            const hashValue = window.location.hash.substring(1);

            setSelectedPlan(PLANS[hashValue] ? hashValue : 'eventAdmin');
        };

        // Подписываемся на событие изменения hash при монтировании компонента
        window.addEventListener('hashchange', handleHashChange);


        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);


    const PlanView = PLANS[selectedPlan];
    return (
        <div>
            <HeaderPage/>
            <MenuPage hash={hashValue}/>
            <PlanView style={{backgroundColor: 'white'}}/>
        </div>
    );
};

export default observer(AdminPage);