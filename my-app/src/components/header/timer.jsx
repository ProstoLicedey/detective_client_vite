import React, {useRef, useEffect, useState, useContext} from 'react';
import Title from "antd/es/typography/Title";
import {connectTimer, getTimer} from "../../http/timerAPI.js";
import {Context} from "../../index.jsx";
import {observer} from "mobx-react-lite";
import moment from 'moment';
import {notification} from "antd";
import {useMediaQuery} from "react-responsive";

const Timer = ({header = false}) => {
        const timerRef = useRef(null);
        const [remains, setRemains] = useState('00:00:00');
        const isMobile = useMediaQuery({maxWidth: 950});
        const {timer} = useContext(Context)

        useEffect(() => {
            getTimer()
                .then((response) => {

                    if(response == null){
                        return setRemains('00:00:00')
                    }
                    timer.setTimeFinish(response)
                    const responseTime = moment(response);
                    const currentTime = moment();

                    const duration = moment.duration(responseTime.diff(currentTime));
                    let formattedTime;

                    if (duration.asMilliseconds() <= 0) {
                        formattedTime = "00:00:00";
                    } else {
                        formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                    }

                    setRemains(formattedTime);
                })
                .catch(() => {
                    setRemains('00:00:00')
                    return null;
                });
            connectTimer(timer)
        }, []);

        useEffect(() => {
            try {
                if (!timer.timeFinish || isNaN(Date.parse(timer.timeFinish))) {
                    console.log("Invalid date format");
                    setRemains("00:00:00");
                    return;
                }

                const responseTime = moment(timer.timeFinish);
                const currentTime = moment();

                const duration = moment.duration(responseTime.diff(currentTime));
                let formattedTime;

                if (duration.asMilliseconds() <= 0) {
                    formattedTime = "00:00:00";
                } else {
                    formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                }

                setRemains(formattedTime);
            } catch (error) {
                console.error("An error occurred:", error);
                setRemains("00:00:00");
            }
        }, [timer.timeFinish]);


        useEffect(() => {
            if (remains != "00:00:00") {
                timer.setTimerActive(true)
                if (remains === "00:10:00") {
                    notification.info({
                        message: 'У вас осталось 10 минут',
                        placement: 'top',
                        showProgress: true,
                    });
                }
                if (remains === "00:00:01") {
                    notification.warning({
                        message: 'Время вышло',
                        duration: 'Необходимо сдать бланки',
                        placement: 'top',
                        showProgress: true,
                    });
                }
                const timerInterval = setInterval(() => {

                    const responseTime = moment(timer.timeFinish);
                    const currentTime = moment();

                    const duration = moment.duration(responseTime.diff(currentTime));
                    let formattedTime;

                    if (duration.asMilliseconds() <= 0) {
                        formattedTime = "00:00:00";
                    } else {
                        formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm:ss");
                    }

                    setRemains(formattedTime);
                }, 1000);
                return () => clearInterval(timerInterval);
            } else {
                setRemains('00:00:00')
                timer.setTimerActive(false)
            }

        }, [remains]);

        const containerStyle = {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        };

        const titleStyleHeader = {
            color: remains === "00:00:00" ? "#a8071a" : "#FFFFFFD9",
            whiteSpace: "nowrap",
            margin: 0,
        };
        const titleStyleBig = {
                color: remains === "00:00:00" ? "#a8071a" : "#FFFFFFD9",
                fontSize: '40vh',
                lineHeight: '40vh',
                textAlign: 'center',
            }
        ;
        return (
            <div style={header ? null : containerStyle}>
                <Title ref={timerRef} style={header ? titleStyleHeader : titleStyleBig}
                       level={isMobile ? 4 : 1}
                >
                    {remains}
                </Title>
            </div>
        );
    }
;

export default observer(Timer);
