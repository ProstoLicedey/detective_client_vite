import React, {useContext, useEffect, useState} from 'react';
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import {TimePicker, Button, Popconfirm, notification, Select, Space} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Context } from "../../../index.jsx";
import { deleteTimerAPI, postTimer } from "../../../http/timerAPI.js";
import {getQuestionsAPI} from "../../../http/questionAPI.js";
import {getGames} from "../../../http/gameAPI.js";
import {observer} from "mobx-react-lite";

const TimerAdmin = () => {
    const { timer, admin } = useContext(Context);
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [timerValue, setTimerValue] = useState(dayjs('02:00', 'HH:mm'));
    const [loading, setLoading] = useState(false);
    const [notif, contextHolder] = notification.useNotification();

    useEffect(() => {
        getGames()
            .then((response) => {
                admin.setGames(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.';
                notif.error({
                    message: errorMessage,
                });
            });
    }, []);

    const deleteTimer = async () => {

        try {
            await deleteTimerAPI();
            notif.success({
                message: 'Таймер удален',
            });
        } catch (error) {
            notif.error({
                message: error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.',
            });
        }
    };

    const createTimer = async () => {
        if (timer.timerActive) {
            notif.error({
                message: "Таймер уже запущен",
                description: 'Если вы хотите его перезапустить, сначала удалите текущий таймер'
            });
            return;
        }

        if (timer.timerActive) {
            notif.error({
                message: "Таймер уже запущен",
                description: 'Если вы хотите его перезапустить, сначала удалите текущий таймер'
            });
            return;
        }

        if (selectedGameId == null) {
            notif.error({
                message: "Выберите игру для запуска",
            });
            return;
        }
        setLoading(true);

        const hours = timerValue.hour();
        const minutes = timerValue.minute();

        try {
            await postTimer(hours, minutes, selectedGameId);
            notif.success({
                message: 'Таймер успешно запущен',
            });
        } catch (error) {
            notif.error({
                message: error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: '2%', display: 'flex', justifyContent: 'center' }}>
            {contextHolder}
            <Space  direction={'vertical'} style={{ maxWidth: 400, padding: '2%', width: '100%', backgroundColor: '#1E1F22' }}>
                <Title style={{ color: '#FFFFFFD9', textAlign: 'center' }} level={2}>Таймер</Title>
                <TimePicker
                    value={timerValue}
                    format={'HH:mm'}
                    size="large"
                    style={{ width: '100%' }}
                    onChange={value => setTimerValue(value)}
                />
                <Select
                    onChange={setSelectedGameId}
                    placeholder={"выберите игру"}
                    defaultValue={selectedGameId}
                    style={{ width: '100%' }}
                    options={admin.games.map(game => ({
                        label: game.name,
                        value: game.id
                    }))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <Popconfirm
                        title="Удалить таймер? Он удалится у всех"
                        onConfirm={deleteTimer}
                        okText="Удалить"
                        cancelText="Отмена"
                        placement="bottom"
                        icon={<DeleteOutlined />}
                        okButtonProps={{ style: { backgroundColor: '#a8071a' } }}
                    >
                        <Button
                            type="primary"
                            size="large"
                            style={{ backgroundColor: '#a8071a', color: '#FFFFFFD9' }}
                        >
                            Удалить
                        </Button>
                    </Popconfirm>
                    <Button
                        block
                        type="primary"
                        size="large"
                        onClick={createTimer}
                        loading={loading}
                        style={{ backgroundColor: '#5b8c00', color: '#FFFFFFD9', marginLeft: 10 }}
                    >
                        Запустить
                    </Button>
                </div>
            </Space>
            {contextHolder}
        </div>
    );
};

export default observer(TimerAdmin);
