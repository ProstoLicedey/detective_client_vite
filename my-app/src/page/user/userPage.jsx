import React, { useContext, useEffect, useState } from 'react';
import HeaderPage from '../../components/header/HeaderPage.jsx';
import Trip from '../../components/user/trip.jsx';
import TripsList from '../../components/user/tripsList.jsx';
import {Divider, Skeleton} from 'antd';
import { Context } from '../../index.jsx';
import { connectTrip } from '../../http/tripAPI.js';
import { observer } from 'mobx-react-lite';

const UserPage = () => {
    const { user } = useContext(Context);
    const [tripConnected, setTripConnected] = useState(false);

    useEffect(() => {
        if (Object.keys(user.user).length !== 0 && !tripConnected) {
            connectTrip(user);
            setTripConnected(true);
        }
    }, [user.user, tripConnected]);

    return (
        <div>
            <div style={{ position: 'fixed', width: '100%', zIndex: '100' }}>
                <HeaderPage />
            </div>
            <div style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center' }}>
                <Trip />
            </div>
            <Divider style={{ backgroundColor: '#1E1F22', height: 1 }} />
            <TripsList />
        </div>
    );
};

export default observer(UserPage);
