import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, notification, Popconfirm, Table} from "antd";
import {Context} from "../../../index.jsx";
import {deleteQuestionAPI, getQuestionsAPI} from "../../../http/questionAPI.js";
import {DeleteOutlined} from "@ant-design/icons";
import QuestionModal from "./questionModal.jsx";
import Title from "antd/es/typography/Title.js";
import ruRu from "antd/locale/ru_RU.js";
import {observer} from "mobx-react-lite";
import {gameDeleteAPI, getGames} from "../../../http/gameAPI.js";
import GamesModal from "./gamesModal.jsx";

const GameAdmin = () => {
    const [update, setUpdate] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notif, contextHolder] = notification.useNotification(); // уведомления через хук
    const { question } = useContext(Context);

    useEffect(() => {
        getGames()
            .then((response) => {
                question.setQuestions(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage = error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.';
                notif.error({
                    message: errorMessage,
                });
            });
    }, [update, notif, question]); // добавлено notif в зависимости

    function deleteUser(id) {
        setLoading(true);
        deleteQuestionAPI(id)
            .then(() => {
                setLoading(false);
                setUpdate(update + 1);
                notif.success({
                    message: 'Вопрос удалён',
                });
            })
            .catch((error) => {
                setLoading(false);
                setUpdate(update + 1);
                const errorMessage = error?.response?.data?.message || 'Произошла ошибка при выполнении запроса.';
                notif.error({
                    message: errorMessage,
                });
            });
    }

    function deleteGame(id) {
        setLoading(true)
        gameDeleteAPI(id)
            .then((response) => {
                setLoading(false)
                setUpdate(update + 1)
                notif.success({
                    message: 'Вопрос удалён',
                });
            })
            .catch((error) => {
                setLoading(false)
                setUpdate(update + 1)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    notif.error({
                        message: errorMessage,
                    });
                } else {
                    notif.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            });

    }
    const columns = [
        {
            title: 'Номер',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
        },
        {
            title: 'Игра',
            dataIndex: 'name',
            key: 'name',
            width: '65%',
        },
        {
            title: 'Количество вопросов в игре',
            dataIndex: 'questionsCount',
            key: 'questionsCount',
            width: '10%',
        },
        {
            title: '',
            key: 'delete',
            width: '15%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <Popconfirm
                    title={`Удалить игру?`}
                    description={'Все вопросы игры будут также удалены'}
                    onConfirm={() => deleteGame(record.id)}
                    okText="Удалить"
                    cancelText="Отмена"
                    placement="left"
                    icon={<DeleteOutlined />}
                    okButtonProps={{ style: { backgroundColor: '#a8071a' } }}
                >
                    <Button style={{ backgroundColor: '#820014' }} type="primary">Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '96%', marginLeft: '2%', marginRight: '2%', maxWidth: 800 }}>
                <Title style={{ color: '#FFFFFFD9', textAlign: 'center' }} level={2}>Игры</Title>
                <Button
                    onClick={() => setModal(true)}
                    size={"large"}
                    style={{ backgroundColor: '#3f6600', margin: 10 }}
                    type={"primary"}
                >
                    Добавить игру +
                </Button>
                <ConfigProvider
                    locale={ruRu}
                    theme={{
                        components: {
                            Table: {
                                bodySortBg: '#2B2D30',
                                headerFilterHoverBg: '#2B2D30',
                                headerSortActiveBg: '#2B2D30',
                                headerSortHoverBg: '#2B2D30',
                                headerSplitColor: '#2B2D30',
                                headerBg: '#1E1F22',
                                headerColor: '#FFFFFFD9',
                                rowSelectedHoverBg: '#1E1F22',
                                rowExpandedBg: '#2B2D30',
                                rowHoverBg: '#2B2D30',
                                rowSelectedBg: '#2B2D30',
                                borderColor: '#00000040',
                            },
                        },
                    }}
                >
                    <Table
                        loading={loading}
                        onRow={(record) => ({
                            style: {
                                background: '#2B2D30',
                                color: '#FFFFFFD9',
                                borderColor: '#00000040'
                            },
                        })}
                        bordered
                        style={{ overflowX: 'auto', background: '#2B2D30' }}
                        columns={columns}
                        dataSource={question.questions}
                        rowKey="id"
                    />
                </ConfigProvider>
            </div>

            <GamesModal
                open={modal}
                onCancel={() => {
                    setUpdate(update + 1);
                    setModal(false);
                }}
            />
            {contextHolder}
        </div>
    );
};
export default observer(GameAdmin);