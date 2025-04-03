import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../../index.jsx";
import {Button, Card, Divider, Form, InputNumber, Modal, notification, Space, Typography} from "antd";
import {getAnsewrsAPI, getQuestionsAPI, postAnswerAPI} from "../../../http/questionAPI.js";
import {observer} from "mobx-react-lite";

const {Text} = Typography;

const AnswerModalAdmin = ({open, onCancel, answerId}) => {
    const {question, user} = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false); // Для открытия модального окна подтверждения

    const putQuestion = () => {
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
        if (answerId != null) {
            getAnsewrsAPI(answerId)
                .then((response) => {
                    question.setAnswers(response);
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
        }
    }, [update, answerId]);


    const handleSubmit = () => {
        setConfirmOpen(true); // Открыть окно подтверждения
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        putQuestion(); // Отправить данные, если подтверждено
    };

    const handleCancelConfirm = () => {
        setConfirmOpen(false); // Закрыть окно подтверждения без отправки
    };

    return (
        <Modal
            title="Проверка ответов"
            open={open}
            footer={null}
            onCancel={() => onCancel()}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                style={{width: '100%', maxWidth: 500,}}
                size={'small'}
            >
                {question.answers && question.answers.map((answer, index) => (
                    <Space direction="vertical" key={index} style={{width: '100%'}}>
                        <Card title={`${index + 1}) ${answer.question.question}`}
                              variant="borderless"
                              size={"small"}
                        >
                            <Text level={5}>{answer.answer}</Text>

                            <Divider/>
                            <Form.Item
                                key={`result-${index}`}
                                name={`result${index}`}
                                style={{display: 'flex', justifyContent: 'space-between', margin: 5}}
                            >
                                <Space size={"small"} style={{width: '100%'}}>
                                    <span style={{flex: 1}}>Результат:</span> {/* Лейбл слева */}
                                    <InputNumber

                                        value={answer.pointsAwarded}
                                        min={0}
                                        max={answer.question.numberPoints}
                                        suffix={"/" + answer.question.numberPoints}
                                    />
                                </Space>
                            </Form.Item>
                        </Card>

                    </Space>
                ))}

                <Form.Item>
                    <Button
                        onClick={handleSubmit}
                        size={"large"}
                        style={{backgroundColor: '#5b8c00'}}
                        type={"primary"}
                        block
                        loading={loading}
                    >
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>


    )
        ;
};

export default  observer(AnswerModalAdmin);