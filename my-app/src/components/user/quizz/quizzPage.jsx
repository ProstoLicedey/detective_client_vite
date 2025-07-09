import React, { useContext, useEffect, useState } from "react";
import { getGameAPI } from "../../../http/gameAPI.js";
import { Context } from "../../../index.jsx";
import { Button, Input, notification, Radio, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { saveQuizzAnswerAPI } from "../../../http/questionQuizzAPI.js";

const { Title, Text } = Typography;

const QuizzPage = () => {
    const { user, timer } = useContext(Context);
    const [notif, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setLoading(true);
        getGameAPI(user.active, user.user.id)
            .then((response) => {
                user.setGame(response);
                setCurrentIndex(0);
                setAnswer("");
                setIsFinished(false);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                const errorMessage =
                    error?.response?.data?.message ||
                    "Произошла ошибка при выполнении запроса.";
                notif.error({ message: errorMessage });
            });
    }, [timer.timerActive]);

    if (!user.game || !user.game.questions || user.game.questions.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <Title level={2} style={{ color: "#FFFFFFD9" }}>Вопросы отсутствуют</Title>
                <Text style={{ fontSize: 18, color: "#FFFFFFD9" }}>Попробуйте позже или выберите другую игру.</Text>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div style={{ textAlign: "center", marginTop: 100 }}>
                <Title level={2} style={{ color: "#FFFFFFD9" }}>Тест завершён</Title>
                <Text style={{ fontSize: 18, color: "#FFFFFFD9" }}>Спасибо за участие!</Text>
            </div>
        );
    }


    const question = user.game.questions[currentIndex];
    const hasOptions = Array.isArray(question.answerOptions) && question.answerOptions.length > 0;

    const saveAnswerAndNext = async (value) => {
        const payload = [
            {
                questionId: question.id,
                text: value.toString().trim()
            }
        ];

        try {
            await saveQuizzAnswerAPI(payload, user.user.id);
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || "Не удалось сохранить ответ.";
            notif.error({ message: errorMessage });
            return;
        }

        // Переход к следующему вопросу или завершение
        if (currentIndex + 1 < user.game.questions.length) {
            setCurrentIndex(currentIndex + 1);
            setAnswer("");
        } else {
            setIsFinished(true);
        }
    };

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setAnswer(value);
        saveAnswerAndNext(value);
    };

    const handleTextSubmit = () => {
        if (!answer.trim()) {
            notif.error({ message: "Введите ответ перед отправкой." });
            return;
        }
        saveAnswerAndNext(answer);
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

            <div
                style={{
                    padding: 20,
                    borderRadius: 8,
                    background: "#2A2A2A",
                    border: "1px solid #3a3a3a",
                    marginTop: 30,
                }}
            >
                <div>
                    <Title level={4} style={{ color: "#FFFFFFD9", marginBottom: 5 }}>
                        Вопрос № {currentIndex + 1}
                    </Title>
                    <Text style={{ fontSize: 18, color: "#FFFFFFD9" }}>
                        {question.question}
                    </Text>
                </div>

                {hasOptions ? (
                    <Radio.Group
                        onChange={handleRadioChange}
                        value={answer}
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
                    <>
                        <Input.TextArea
                            rows={3}
                            placeholder="Введите ответ..."
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            style={{
                                backgroundColor: "#1E1F22",
                                color: "#FFFFFFD9",
                                marginTop: 10,
                                borderColor: "#00000040",
                            }}
                        />
                        <Button
                            type="primary"
                            onClick={handleTextSubmit}
                            style={{ marginTop: 15 }}
                        >
                            Отправить ответ
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default observer(QuizzPage);
