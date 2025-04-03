import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../../index.jsx";
import { Space } from "antd";
import TripItem from "./tripItem.jsx";
import Title from "antd/es/typography/Title";

const TripsList = () => {
    const { user } = useContext(Context);

    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {user.trips.length === 0 ? (
                <Title style={{ color: '#FFFFFFD9', fontStyle: 'italic', textAlign: 'center' }} level={3}>Здесь будут ваши поездки</Title>
            ) : (

                <Space size={"large"} style={{ width: "100%"}} direction={"vertical"}>
                    <Title style={{color: '#FFFFFFD9', marginLeft:'3%', marginTop:'0', marginBottom:'0'}} level={3}>
                        Совершенные поездки (всего: {user.trips.length})
                    </Title>
                    {user.trips.map(trip => (
                        <TripItem key={trip.id} thisTrip={trip} style={{ width: '100%' }} />
                    ))}
                </Space>
            )}
        </div>
    );
};

export default observer(TripsList);
