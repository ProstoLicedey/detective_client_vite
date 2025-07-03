import React, {useContext, useEffect, useState} from 'react';
import HeaderPage from '../../components/header/HeaderPage.jsx';
import Trip from '../../components/user/trip.jsx';
import TripsList from '../../components/user/tripsList.jsx';
import {Divider, notification} from 'antd';
import {Context} from '../../index.jsx';
import {connectTrip} from '../../http/tripAPI.js';
import {observer} from 'mobx-react-lite';
import {getActiveGameAPI} from "../../http/gameAPI.js";
import QuizzPage from "../../components/user/quizz/quizzPage.jsx";
import Title from "antd/es/typography/Title.js";
import timer from "../../components/header/timer.jsx";

const UserPage = () => {
    const {user, timer} = useContext(Context);
    const [tripConnected, setTripConnected] = useState(false);
    const [notif, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getActiveGameAPI()
            .then((response) => {
                user.setActive(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.';
                notif.error({
                    message: errorMessage,
                });
            });
    }, [timer.timerActive, timer.timeFinish]);


    useEffect(() => {
        if (Object.keys(user.user).length !== 0 && !tripConnected) {
            connectTrip(user);
            setTripConnected(true);
        }
    }, [user.user, tripConnected]);

    return (
        <div>
            <div style={{position: 'fixed', width: '100%', zIndex: '100'}}>
                <HeaderPage/>
            </div>

            {user.active === 1 ? (
                <div>
                    <div style={{paddingTop: '80px', display: 'flex', justifyContent: 'center'}}>
                        <Trip/>

                    </div>
                    <Divider style={{backgroundColor: '#1E1F22', height: 1}}/>
                    <TripsList/>
                </div>

            ) : user.active > 1 ? (
                    <div style={{paddingTop: '80px', textAlign: 'center'}}>
                        <QuizzPage/>
                    </div>
            ) : (
                <div style={{paddingTop: '80px',  color: '#888'}}>
                    <Title style={{ color: '#FFFFFFD9', fontStyle: 'italic', textAlign: 'center' }} level={3}>Игра пока не началась</Title>
                </div>
            )}


        </div>
    );
};

export default observer(UserPage);
