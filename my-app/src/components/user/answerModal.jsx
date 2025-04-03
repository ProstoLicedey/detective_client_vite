import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification, Typography } from "antd";
import { createAddressrAPI } from "../../http/addressesAPI.js";
import {getQuestionsAPI, postAnswerAPI} from "../../http/questionAPI.js";
import { Context } from "../../index.jsx";
import TextArea from "antd/es/input/TextArea";
const { Text } = Typography;

const AnswerModal = ({ open, onCancel, formData }) => {
    const { question, user } = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false); // Для открытия модального окна подтверждения

    const createAddres = () => {
        setLoading(true);
        form
            .validateFields()
            .then((values) => {
                const answers = question.questions.map((q, index) => ({
                    questionId: q.id,         // Assuming each question has an 'id' field
                    answerText: values[`answer${index}`], // Answer from the form
                    userId: user.user.id,     // Assuming user is available via context or props
                }));

                postAnswerAPI(answers)
                    .then((response) => {
                        setLoading(false);
                        onCancel();
                        form.resetFields();
                        question.setAnswerCheck(true);
                        return notification.success({
                            message: 'Ответы отправленны!',
                        });

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
            })
            .catch(() => {
                setLoading(false);
                return notification.error({
                    message: 'Пожалуйста, заполните все обязательные поля',
                });
            });
    };


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

    React.useEffect(() => {
        if (open) {
            form.setFieldsValue(formData); // Устанавливаем данные из состояния при открытии формы
        }
    }, [open, formData]);

    const handleSubmit = () => {
        setConfirmOpen(true); // Открыть окно подтверждения
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        createAddres(); // Отправить данные, если подтверждено
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false); // Закрыть окно подтверждения без отправки
    };

    return (
        <>
            {/* Модальное окно подтверждения */}
            <Modal
                title="Отправить ответы?"
                visible={confirmOpen}
                onOk={handleConfirm}
                onCancel={handleCancelConfirm}
                okText="Отправить"
                cancelText="Вернуться"
                okButtonProps={{style: {backgroundColor: '#5b8c00'}}}
                cancelButtonProps={{style: {backgroundColor: '#a8071a', color: '#FFFFFF'}}}
            >
                <p>Вы уверены, что хотите отправить ответы на проверку?</p>
            </Modal>

            <Modal
                title="Вопросы"
                open={open}
                footer={null}
                onCancel={() => onCancel()}  // Не сбрасывать данные формы здесь
            >
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    style={{ width: '100%', maxWidth: 500, padding: '0 20px' }}
                >
                    {/* Мапим каждый вопрос из question.questions() */}
                    {question.questions && question.questions.map((q, index) => (
                        <Form.Item
                            key={index}
                            label={`${index + 1}) ${q.question}`}
                            name={`answer${index}`}
                            rules={[{ required: true, message: 'Пожалуйста, ответьте на вопрос!' }]}
                        >
                            <TextArea
                                showCount
                                maxLength={50000}
                                style={{ height: 120, resize: 'none' }}
                            />
                        </Form.Item>
                    ))}

                    <Form.Item>
                        <Button
                            onClick={handleSubmit}
                            size={"large"}
                            style={{ backgroundColor: '#5b8c00' }}
                            type={"primary"}
                            block
                            loading={loading}
                        >
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AnswerModal;