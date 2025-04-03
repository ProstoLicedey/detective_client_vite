import React, {useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../../../index.jsx";
import {getAddressesAPI, userDeleteAPI} from "../../../http/addressesAPI.js";
import {Button, ConfigProvider, Input, notification, Popconfirm, Space, Table, Typography} from "antd";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import ruRu from "antd/locale/ru_RU";
import ModalsAddres from "./modalsAddres.jsx";
import {deleteQuestionAPI, getQuestionsAPI} from "../../../http/questionAPI.js";
import {observer} from "mobx-react-lite";
import QuestionModal from "./questionModal.jsx";
const { Text} = Typography;

const QuestionAdmin = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const searchInput = useRef(null);
    const [update, setUpdate] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const {question} = useContext(Context);

    useEffect(() => {
        getQuestionsAPI()
            .then((response) => {
                question.setQuestions(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            });
    }, [update]);


    function deleteUser(id) {
        setLoading(true)
        deleteQuestionAPI(id)
            .then((response) => {
                setLoading(false)
                setUpdate(update + 1)
                return notification.success({
                    message: 'Вопрос удалён',
                });
            })
            .catch((error) => {
                setLoading(false)
                setUpdate(update + 1)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    return notification.error({
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
            width: '10%',

        },
        {
            title: 'Вопрос',
            dataIndex: 'question',
            key: 'question',
            width: '65%',

        },

        {
            title: 'Количество баллов',
            dataIndex: 'numberPoints',
            key: 'numberPoints',
            width: '10%',

        },
        {
            title: '',
            key: 'delete',
            width: '15%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <>
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
                </>
            )
        },
    ];

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '96%', marginLeft: '2%', marginRight: '2%', maxWidth: 800}}>
                <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Вопросы</Title>
                <Button
                    onClick={() => setModal(true)}
                    size={"large"}
                    style={{backgroundColor: '#3f6600', margin: 10}}
                    type={"primary"}
                >
                    Добавть вопрос +
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

            <QuestionModal open={modal}
                          onCancel={() => {
                              setUpdate(update+1)
                              setModal(false);
                          }}
            />
        </div>
    );
}

export default observer(QuestionAdmin);