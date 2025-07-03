import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../../index.jsx";
import {
    Button, Card, Divider, Form, InputNumber, Modal, notification,
    Popconfirm, Space, Typography
} from "antd";
import {
    getAnsewrsAPI, putAnsewrsAPI,
    daleteAnsewrsAPI // <--- добавили импорт
} from "../../../http/questionAPI.js";
import {observer} from "mobx-react-lite";

const {Text} = Typography;

const AnswerModalAdmin = ({open, onCancel, answerId}) => {
    const {question} = useContext(Context);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [notif, contextHolder] = notification.useNotification();
    useEffect(() => {
        let timer;
        if (confirmVisible) {
            setConfirmDisabled(true);
            timer = setTimeout(() => {
                setConfirmDisabled(false);
            }, 5000); // 5 секунд
        } else {
            setConfirmDisabled(true);
        }

        return () => clearTimeout(timer);
    }, [confirmVisible]);


    const putQuestion = () => {
        setLoading(true);
        form
            .validateFields()
            .then((values) => {
                const resultArray = question.answers.map((answer, index) => ({
                    answerId: answer.id,
                    pointsAwarded: values[`result${index}`],
                }));

                putAnsewrsAPI(resultArray)
                    .then(() => {
                        setLoading(false);
                        onCancel();
                        form.resetFields();
                        notif.success({
                            message: 'Результаты сохранены!',
                        });
                        question.setAnswerCheck(true);
                    })
                    .catch((error) => {
                        setLoading(false);
                        if (error.response?.data?.message) {
                           notif.error({
                                message: error.response.data.message,
                            });
                        }
                        notif.error({
                            message: 'Ошибка при сохранении результатов.',
                        });
                    });
            })
            .catch(() => {
                setLoading(false);
                notif.error({
                    message: 'Пожалуйста, заполните все обязательные поля',
                });
            });
    };

    const handleDelete = () => {
        if (!answerId) return;
        setLoading(true);
        daleteAnsewrsAPI(answerId)
            .then(() => {
                notif.success({message: 'Ответы удалены!'});
                question.setAnswers([]);
                form.resetFields();
                onCancel();
            })
            .catch((error) => {
                if (error.response?.data?.message) {
                    notif.error({
                        message: error.response.data.message,
                    });
                }
                notif.error({
                    message: 'Ошибка при удалении ответов.',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        if (answerId != null) {
            setLoading(true);
            getAnsewrsAPI(answerId)
                .then((response) => {
                    // Добавим новое поле "correctness"
                    const enrichedAnswers = response.map((answer) => {
                        const {answer: userAnswer, question: q} = answer;
                        const maxPoints = q.numberPoints;
                        const answerOptions = q.answerOptions;

                        let points = null;
                        let correctness = null;

                        if (answerOptions && answerOptions.length > 0) {
                            const rightAnswers = answerOptions
                                .filter(opt => opt.right)
                                .map(opt => opt.answerOptions.trim().toLowerCase());

                            const trimmedUserAnswer = (userAnswer || '').trim().toLowerCase();

                            if (rightAnswers.includes(trimmedUserAnswer)) {
                                points = maxPoints;
                                correctness = true;
                            } else {
                                points = 0;
                                correctness = false;
                            }
                        } else {
                            points = answer.pointsAwarded;
                        }

                        return {
                            ...answer,
                            pointsAwarded: points,
                            _correctness: correctness // временное поле для отображения смайлика
                        };
                    });

                    question.setAnswers(enrichedAnswers);

                    const formValues = {};
                    enrichedAnswers.forEach((a, i) => {
                        formValues[`result${i}`] = a.pointsAwarded;
                    });

                    form.setFieldsValue(formValues);
                })
                .catch((error) => {
                    if (error.response?.data?.message) {
                        notif.error({
                            message: error.response.data.message,
                        });
                    }
                    notif.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [update, answerId]);


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
                style={{width: '100%', maxWidth: 500}}
                size={'small'}
            >
                {question.answers && question.answers.map((answer, index) => (
                    <Space direction="vertical" key={index} style={{width: '100%'}}>
                        <Card
                            title={`${index + 1}) ${answer.question.question}`}
                            variant="borderless"
                            size={"small"}
                        >
                            <Text level={5}>
                                {answer.answer}{' '}
                                {answer._correctness === true && <span style={{color: 'green'}}>✅</span>}
                                {answer._correctness === false && <span style={{color: 'red'}}>❌</span>}
                            </Text>


                            <Divider/>
                            <Form.Item
                                label={"Баллы:"}
                                key={`result-${index}`}
                                name={`result${index}`}
                                style={{display: 'flex', justifyContent: 'space-between', margin: 5}}
                                rules={[{required: true, message: 'Пожалуйста, укажите баллы'}]}
                                initialValue={answer.pointsAwarded}
                            >
                                <InputNumber
                                    suffix={"/" + answer.question.numberPoints}
                                    min={0}
                                    max={answer.question.numberPoints}
                                />
                            </Form.Item>
                        </Card>
                    </Space>
                ))}

                <Form.Item>
                    <Space style={{width: '100%'}} direction="vertical">
                        <Button
                            onClick={putQuestion}
                            size="large"
                            style={{backgroundColor: '#5b8c00'}}
                            type="primary"
                            block
                            loading={loading}
                        >
                            Сохранить
                        </Button>
                        <Divider/>
                        <Popconfirm
                            title="Удалить все ответы?"
                            description="Вы уверены, что хотите удалить все ответы? Это действие необратимо."
                            onConfirm={handleDelete}
                            okButtonProps={{
                                style: {backgroundColor: '#a8071a'},
                                disabled: confirmDisabled,
                            }}
                            okText={confirmDisabled ? `Подождите...` : "Удалить"}
                            cancelText="Отмена"
                            onOpenChange={(visible) => setConfirmVisible(visible)}
                        >
                            <Button danger block loading={loading}>
                                Удалить ответы
                            </Button>
                        </Popconfirm>

                    </Space>
                </Form.Item>
            </Form>
            {contextHolder}
        </Modal>
    );
};

export default observer(AnswerModalAdmin);
