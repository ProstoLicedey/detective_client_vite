import React, {useContext, useEffect, useState} from "react";
import {getGameAPI} from "../../../http/gameAPI.js";
import {Context} from "../../../index.jsx";
import {Button, Input, notification, Radio, Space, Typography} from "antd";
import {observer} from "mobx-react-lite";
import {saveQuizzAnswerAPI} from "../../../http/questionQuizzAPI.js";

const {Title, Text} = Typography;

const QuizzPage = () => {
    const {user, timer} = useContext(Context);
    const [notif, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        setLoading(true);
        getGameAPI(user.active)
            .then((response) => {
                user.setGame(response);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage =
                    error?.response?.data?.message ||
                    "Произошла ошибка при выполнении запроса.";
                notif.error({message: errorMessage});
            });
    }, [timer.timerActive]);

    if (!user.game || !user.game.questions || user.game.questions.length === 0) {
        return (
            <div style={{textAlign: "center", marginTop: 50, color: "#FFFFFFD9"}}>
                <Title level={3}>Вопросы отсутствуют</Title>
            </div>
        );
    }

    const onRadioChange = (questionId, value) => {
        setAnswers((prev) => ({...prev, [questionId]: value}));
    };

    const onInputChange = (questionId, value) => {
        setAnswers((prev) => ({...prev, [questionId]: value}));
    };

    const onSaveAll = async () => {
        const unanswered = user.game.questions.filter((q) => !answers[q.id] || answers[q.id].toString().trim() === "");
        if (unanswered.length > 0) {
            notif.error({message: "Пожалуйста, ответьте на все вопросы."});
            return;
        }

        const payload = Object.entries(answers).map(([questionId, text]) => ({
            questionId: parseInt(questionId),
            text: text.toString().trim()
        }));

        try {
            await saveQuizzAnswerAPI(payload, user.user.id);
            notif.success({message: "Ответы успешно сохранены"});
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Не удалось сохранить ответы.";
            notif.error({message: errorMessage});
        }
    };

    return (
        <div
            style={{
                maxWidth: 800,
                margin: "30px auto",
                color: "#FFFFFFD9",
                fontFamily: "Roboto, sans-serif",
                textAlign: "left",
            }}
        >
            {contextHolder}
            <Title level={2} style={{ textAlign: "center", color: "#FFFFFFD9" }}>
                {user.game.name}
            </Title>

            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {user.game.questions.map((question, index) => {
                    const hasOptions =
                        Array.isArray(question.answerOptions) &&
                        question.answerOptions.length > 0;

                    return (
                        <div
                            key={question.id}
                            style={{
                                padding: 20,
                                borderRadius: 8,
                                background: "#2A2A2A",
                                border: "1px solid #3a3a3a",
                            }}
                        >
                            <div>
                                <Title level={4} style={{ color: "#FFFFFFD9", marginBottom: 5 }}>
                                    № {index + 1}
                                </Title>
                                <Text style={{ fontSize: 18, color: "#FFFFFFD9" }}>
                                    {question.question}
                                </Text>
                            </div>
                            {hasOptions ? (
                                <Radio.Group
                                    onChange={(e) =>
                                        onRadioChange(question.id, e.target.value)
                                    }
                                    value={answers[question.id]}
                                    style={{ marginTop: 10 }}
                                >
                                    {question.answerOptions.map((option) => (
                                        <Radio
                                            key={option.id}
                                            value={option.answerOptions}
                                            style={{
                                                display: "block",
                                                color: "#FFFFFFD9",
                                            }}
                                        >
                                            {option.answerOptions}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            ) : (
                                <Input.TextArea
                                    rows={3}
                                    placeholder="Введите ответ..."
                                    value={answers[question.id] || ""}
                                    onChange={(e) =>
                                        onInputChange(question.id, e.target.value)
                                    }
                                    style={{
                                        backgroundColor: "#1E1F22",
                                        color: "#FFFFFFD9",
                                        marginTop: 10,
                                        borderColor: "#00000040",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}

                <Button
                    type="primary"
                    onClick={onSaveAll}
                    loading={loading}
                    style={{ marginTop: 30, width: "100%" }}
                >
                    Сохранить все ответы
                </Button>
            </Space>
        </div>
    );

};

export default observer(QuizzPage);
