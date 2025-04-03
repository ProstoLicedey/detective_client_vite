import React, {useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, notification, Row, Select, Typography} from "antd";
import {createAddressrAPI} from "../../../http/addressesAPI.js";
import TextArea from "antd/es/input/TextArea";
import {createQuestionAPI} from "../../../http/questionAPI.js";

const { Text} = Typography;
const {Option} = Select;

const QuestionModal = ({open, onCancel}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const createAddres = () => {
        setLoading(true)
        form
            .validateFields()
            .then((values) => {

                createQuestionAPI(values.question, values.numberPoints)
                    .then((response) => {

                        setLoading(false)
                        onCancel()
                        form.resetFields();
                    })
                    .catch((error) => {

                        setLoading(false)
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
                    })
            })
            .catch(() => {
                setLoading(false)
                return notification.error({
                    message: 'Пожалуйста заполните все обязательные поля'
                });
            })
    }

    return (
        <Modal
            title={"Добавление вопроса"}
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
                    label="Вопрос"
                    name="question"
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
                <Form.Item
                    label="Количество баллов"
                    name="numberPoints"
                    min={1}
                    rules={[
                        {
                            required: true,
                            message: '',
                        },
                    ]}
                    style={{width: '100%'}}
                >
                    <InputNumber
                        showCount
                        maxLength={1000}

                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        onClick={createAddres}
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
        </Modal>
    );
};
export default QuestionModal;