import React, {useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, notification, Row, Select, Typography} from "antd";
import {createAddressrAPI} from "../../../http/addressesAPI.js";
import TextArea from "antd/es/input/TextArea";
import {createQuestionAPI} from "../../../http/questionAPI.js";
import {createGameAPI} from "../../../http/gameAPI.js";

const { Text} = Typography;
const {Option} = Select;

const GamesModal = ({open, onCancel}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [notif, contextHolder] = notification.useNotification();

    const createGame = () => {
        setLoading(true)
        form
            .validateFields()
            .then((values) => {

                createGameAPI(values.name, values.description)
                    .then((response) => {

                        setLoading(false)
                        onCancel()
                        form.resetFields();
                    })
                    .catch((error) => {

                        setLoading(false)
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
                    })
            })
            .catch(() => {
                setLoading(false)
                notif.error({
                    message: 'Пожалуйста заполните все обязательные поля'
                });
            })
    }



    return (
        <Modal
            title={"Добавление игры"}
            open={open}
            footer={null}
            onCancel={() => onCancel()}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                style={{width: '100%', maxWidth: 500, padding: '0 20px'}}
            >

                <Form.Item
                    label={"Название"}
                    name="name"
                    rules={[
                        {
                            message: '',
                            required: true,
                        },
                    ]}
                >
                    <Input maxLength={30} size={"large"} style={{width: '100%'}}/>
                </Form.Item>

                <Form.Item
                    label="Описание"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: '',
                        },
                    ]}
                    style={{width: '100%'}}
                >
                    <TextArea
                        showCount
                        maxLength={1000}
                        style={{height: 120, resize: 'none'}}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        onClick={createGame}
                        size={"large"}
                        style={{backgroundColor: '#5b8c00'}}
                        type={"primary"}
                        block
                        loading={loading}
                    >
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </Modal>
    );
};
export default GamesModal;