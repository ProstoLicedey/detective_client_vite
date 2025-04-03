import React, {useContext, useState} from 'react';
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import {TimePicker, Button, Popconfirm, notification} from "antd";
import {CarOutlined, DeleteOutlined} from "@ant-design/icons";
import {Context} from "../../../index.jsx";
import {deleteTimerAPI, postTimer} from "../../../http/timerAPI.js";

const TimerAdmin = () => {
    const {timer} = useContext(Context);
    const [timerValue, setTimerValue] = useState(dayjs('02:00', 'HH:mm'));
    const [loading, setLoading] = useState(false);

    function deleteTimer() {
        if (!timer.timerActive) {
            return notification.error({
                message: "Сейчас нет активных таймеров",
            });
        }
        deleteTimerAPI()
            .then(() => {
                return notification.success({
                    message: 'Таймер удален',
                });
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            })

    }

    function createTimer() {
        setLoading(true)
        if (timer.timerActive) {
            setLoading(false)
            return notification.error({
                message: "Таймер уже запущен",
                description: 'Если вы хотите его перезапустить, сначала удалите текущий таймер'
            });
        }

        // Извлекаем часы и минуты из объекта timerValue
        const hours = timerValue.hour();
        const minutes = timerValue.minute();

        // Передаем только часы и минуты в postTimer
        postTimer(hours, minutes)
            .then(() => {
                setLoading(false)
                return notification.success({
                    message: 'Таймер успешно запущен',
                });
            })
            .catch((error) => {
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            })

    }


    return (<div style={{
        margin: '2%', display: 'flex', justifyContent: 'center',
    }}>
        <div style={{maxWidth: 400, padding: '2%', width: '100%', backgroundColor: '#1E1F22'}}>
            <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Таймер</Title>
            <TimePicker
                defaultValue={timerValue}
                format={'HH:mm'}
                size="large"
                style={{width: '100%'}}
                onChange={value => setTimerValue(value)} // Обновляем значение таймера
            />
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
                <Popconfirm
                    title={`Удалить таймер? Он удалится у всех`}
                    onConfirm={deleteTimer}
                    okText="Удалить"
                    cancelText="Отмена"
                    placement="bottom"
                    icon={<DeleteOutlined/>}
                    okButtonProps={{style: {backgroundColor: '#a8071a'}}}
                >
                    <Button type="primary" size="large"
                            style={{backgroundColor: '#a8071a', color: '#FFFFFFD9'}}>Удалить</Button>
                </Popconfirm>
                <Button
                    block
                    type="primary"
                    size="large"
                    onClick={createTimer}
                    loading={loading}
                    style={{backgroundColor: '#5b8c00', color: '#FFFFFFD9', marginLeft: 10}}
                >
                    Запустить
                </Button>
            </div>
        </div>
    </div>);
};

export default TimerAdmin;