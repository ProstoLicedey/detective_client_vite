import React, {useContext, useEffect, useState} from 'react';
import {Button, ConfigProvider, notification, Popconfirm, Table} from "antd";
import {Context} from "../../../index.jsx";
import {deleteQuestionAPI} from "../../../http/questionAPI.js";
import {DeleteOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title.js";
import ruRu from "antd/locale/ru_RU.js";
import QuestionModal from "./questionModal.jsx";
import {observer} from "mobx-react-lite";
import {deleteQuestionsQuizzOptionsAPI, getQuestionsQuizzAPI} from "../../../http/questionQuizzAPI.js";
import QuestionOptionModal from "./questionOptionModal.jsx";

const QestionQuizzAdmin = () => {
    const [optionModalVisible, setOptionModalVisible] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [update, setUpdate] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notif, contextHolder] = notification.useNotification(); // уведомления через хук
    const {question} = useContext(Context);

    useEffect(() => {
        getQuestionsQuizzAPI()
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
    }, [update, notif, question]);

    const handleDeleteOptions = (questionId) => {
        setLoading(true);
        deleteQuestionsQuizzOptionsAPI(questionId)
            .then(() => {
                notif.success({ message: "Варианты ответа удалены" });
                setUpdate(update + 1);
            })
            .catch((error) => {
                const errorMessage = error?.response?.data?.message || 'Ошибка при удалении вариантов ответа.';
                notif.error({ message: errorMessage });
            })
            .finally(() => setLoading(false));
    };


    function deleteUser(id) {
        setLoading(true)
        deleteQuestionAPI(id)
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
            width: '7%',
        },
        {
            title: 'Вопрос',
            dataIndex: 'question',
            key: 'question',
            width: '28%',
        },
        {
            title: 'Игра',
            key: 'game',
            width: '27%',
            render: (_, record) => record.game?.name || '—',
        },
        {
            title: 'Количество баллов',
            dataIndex: 'numberPoints',
            key: 'numberPoints',
            width: '7%',

        },
        {
            title: 'Вариантов ответа',
            dataIndex: 'answerOptions',
            key: 'answerOptions',
            width: '10%',
            render: (_, record) => {
                const hasOptions = Array.isArray(record.answerOptions) && record.answerOptions.length > 0;

                if (hasOptions) {
                    return (
                        <Popconfirm
                            title="Варианты ответа уже заданы. Удалить их?"
                            onConfirm={() => handleDeleteOptions(record.id)}
                            okText="Удалить"
                            cancelText="Отмена"
                            placement="top"
                            okButtonProps={{style: {backgroundColor: '#a8071a'}}}
                            icon={<DeleteOutlined style={{ color: 'red' }} />}
                        >
                            <Button ghost style={{ width: '100%' }}>
                                {record.answerOptions.length}
                            </Button>
                        </Popconfirm>
                    );
                } else {
                    // Если вариантов нет, просто открываем модальное окно
                    return (
                        <Button
                            ghost
                            style={{ width: '100%' }}
                            onClick={() => {
                                setSelectedQuestionId(record.id);
                                setOptionModalVisible(true);
                            }}
                        >
                            Добавить +
                        </Button>
                    );
                }
            },
        },
        {
            title: '',
            key: 'delete',
            width: '10%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <Popconfirm
                    title={`Удалить вопрос?`}
                    onConfirm={() => deleteUser(record.id)}
                    okText="Удалить"
                    cancelText="Отмена"
                    placement="left"
                    icon={<DeleteOutlined/>}
                    okButtonProps={{style: {backgroundColor: '#a8071a'}}}
                >
                    <Button style={{backgroundColor: '#820014'}} type="primary">Удалить</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '96%', marginLeft: '2%', marginRight: '2%', maxWidth: 800}}>
                <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Вопросы квизового формата </Title>
                <Button
                    onClick={() => setModal(true)}
                    size={"large"}
                    style={{backgroundColor: '#3f6600', margin: 10}}
                    type={"primary"}
                >
                    Добавить вопрос +
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
                        style={{overflowX: 'auto', background: '#2B2D30'}}
                        columns={columns}
                        dataSource={question.questions}
                        rowKey="id"
                    />
                </ConfigProvider>
            </div>

            <QuestionModal
                open={modal}
                onCancel={() => {
                    setUpdate(update + 1);
                    setModal(false);
                }}
                quizzChech={true}
            />
            <QuestionOptionModal
                open={optionModalVisible}
                onCancel={() => {
                    setUpdate(update + 1);
                    setOptionModalVisible(false);
                }}
                questionId={selectedQuestionId}
            />

            {contextHolder}
        </div>
    );
};

export default observer(QestionQuizzAdmin);