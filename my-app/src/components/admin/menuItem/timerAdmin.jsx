import React, { useContext, useState } from 'react';
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { TimePicker, Button, Popconfirm, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Context } from "../../../index.jsx";
import { deleteTimerAPI, postTimer } from "../../../http/timerAPI.js";

const TimerAdmin = () => {
    const { timer } = useContext(Context);
    const [timerValue, setTimerValue] = useState(dayjs('02:00', 'HH:mm'));
    const [loading, setLoading] = useState(false);
    const [notif, contextHolder] = notification.useNotification();

    const deleteTimer = async () => {
        if (!timer.timerActive) {
            notif.error({
                message: "Сейчас нет активных таймеров",
            });
            return;
        }

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

        setLoading(true);

        const hours = timerValue.hour();
        const minutes = timerValue.minute();

        try {
            await postTimer(hours, minutes);
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
            <div style={{ maxWidth: 400, padding: '2%', width: '100%', backgroundColor: '#1E1F22' }}>
                <Title style={{ color: '#FFFFFFD9', textAlign: 'center' }} level={2}>Таймер</Title>
                <TimePicker
                    value={timerValue}
                    format={'HH:mm'}
                    size="large"
                    style={{ width: '100%' }}
                    onChange={value => setTimerValue(value)}
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
            </div>
            {contextHolder}
        </div>
    );
};

export default TimerAdmin;
