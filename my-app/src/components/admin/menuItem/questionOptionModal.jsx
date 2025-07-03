import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Modal,
    Space,
    notification
} from "antd";
import {createQuestionsQuizzOptionsAPI} from "../../../http/questionQuizzAPI.js";

const QuestionOptionModal = ({ open, onCancel, questionId }) => {
    const [form] = Form.useForm();
    const [notif, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);

    // Состояние правильного варианта (индекс от 0 до 3)
    const [correctIndex, setCorrectIndex] = useState(null);

    const handleFinish = async (values) => {
        const options = (values.options || [])
            .map((text, index) =>
                text ? { text, isCorrect: index === correctIndex } : null
            )
            .filter(Boolean);

        if (options.length < 2) {
            notif.error({ message: 'Минимум два варианта должны быть заполнены' });
            return;
        }

        if (correctIndex === null || !values.options[correctIndex]) {
            notif.error({ message: 'Выберите корректный правильный вариант' });
            return;
        }

        setLoading(true);

        try {
            await createQuestionsQuizzOptionsAPI(questionId, options);
            notif.success({ message: 'Варианты успешно добавлены' });
            onCancel();
            form.resetFields();
            setCorrectIndex(null);
        } catch (e) {
            notif.error({ message: 'Ошибка при добавлении вариантов' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal
            title="Добавить варианты ответа"
            open={open}
            onCancel={() => {
                form.resetFields();
                setCorrectIndex(null);
                onCancel();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark={false}
            >
                {[0, 1, 2, 3].map((i) => (
                    <Form.Item
                        key={i}
                        label={`Вариант ${i + 1}`}
                        name={['options', i]}
                        rules={i < 2 ? [{ required: true, message: 'Введите текст ответа' }] : []}
                    >
                        <Space style={{ display: 'flex', alignItems: 'center' }}>
                            <Input placeholder={`Введите текст варианта ${i + 1}`} />
                            <Checkbox
                                checked={correctIndex === i}
                                onChange={() => setCorrectIndex(i)}
                            >
                                Верный
                            </Checkbox>
                        </Space>
                    </Form.Item>
                ))}


                <Form.Item>
                    <Button
                        size="large"
                        style={{ backgroundColor: '#5b8c00' }}
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </Modal>
    );
};

export default QuestionOptionModal;
