import React, {useContext, useEffect, useState} from 'react';
import {Header} from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Logo from '../../assets/ToDo.png';
import {Button, Image, Modal, notification, Space, Tooltip} from 'antd';
import {useMediaQuery} from "react-responsive";
import Timer from "./timer.jsx";
import {Context} from "../../index.jsx";
import {logoutAPI} from "../../http/userAPI.js";
import {useNavigate} from "react-router-dom";
import {AUTH_ROUTE} from "../../utils/consts.js";
import AnswerModal from "../user/answerModal.jsx";
import {observer} from "mobx-react-lite";
import {getAddressesAPI} from "../../http/addressesAPI.js";
import {checkAnswerAPI} from "../../http/questionAPI.js";

const HeaderPage = () => {
    const {user, timer, question} = useContext(Context);
    const isMobile = useMediaQuery({maxWidth: 950});
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    const [update, setUpdate] = useState(0);
    const [modal, setModal] = useState(false);

    const [gameActive, setGameActive] = useState(false);


    const handleLogout = () => {
        // Вызываем функцию logout, если пользователь подтвердил выход
        logoutAPI().then(r => {
            localStorage.removeItem('token');
            user.setUser({})
            user.setIsAuth(false)
            navigate(AUTH_ROUTE)
        })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.message) {

                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage, placement: 'top'
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.', placement: 'top'
                    });
                }
            })
        setModalVisible(false); // Закрываем модальное окно после выхода
    };

    useEffect(() => {
        checkAnswerAPI(user.user.id)
            .then((response) => {
                question.setAnswerCheck(response.hasAnswers);

            })
            .catch((error) => {

                console.log(error);
            });
    }, [user.user.id]);

    return (<Header style={{
        display: 'flex',
        alignItems: 'center',
        height: '7%',
        justifyContent: 'space-between',
        backgroundColor: '#1E1F22',
        padding: isMobile ? '0 10px' : '0 20px'  // Adjust padding for mobile view
    }}>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <Image src={Logo}
                   style={{
                       width: "50px", height: "50px",
                   }}
                   preview={false}
                   alt="Логотип сайта"
            />
            {!isMobile && (<Title
                style={{
                    color: '#FFFFFFD9',
                    marginTop: '0.3vw',
                    marginBottom: '0.3vw',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                }}
                level={3}
            >
                Детектив ТоДо
            </Title>)}
        </div>

        <Timer header={true}/>
        <Space>
            {user.user.role == "user" &&
                <Tooltip title={!timer.timerActive ? "Сейчас игра не активна" : (question.answerCheck ? "вы уже дали ответ" :"")}>
                    <Button size={"large"}
                            onClick={() => setModal(true)}
                            disabled={!timer.timerActive || question.answerCheck}
                            style={{
                                backgroundColor: '#2B2D30',
                                color: !timer.timerActive ? '#FFFFFFA6' : '#FFFFFFD9',
                                padding: '0 20px'
                            }}
                    >
                        Бланк ответов
                    </Button>
                </Tooltip>
            }
            <Button size={"large"} style={{backgroundColor: "#2B2D30", color: '#FFFFFFD9', padding: '0 20px'}}
                    onClick={() => setModalVisible(true)}>
                {user.user.login}
            </Button>
        </Space>
        {/* Модальное окно для подтверждения выхода */
        }
        <Modal
            title="Выход из аккаунта"
            visible={modalVisible}
            onOk={handleLogout}
            onCancel={() => setModalVisible(false)}
            okText="Выйти"
            cancelText="Отмена"
            okButtonProps={{style: {backgroundColor: '#a8071a'}}}

        >
            <p>Вы уверены, что хотите выйти из аккаунта?</p>
        </Modal>
        <AnswerModal open={modal}
                     onCancel={() => {
                         setUpdate(update + 1)
                         setModal(false);
                     }}
        />
    </Header>)
        ;
};

export default observer(HeaderPage);
