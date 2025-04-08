import React, { useContext, useState } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { loginAPI } from "../http/userAPI.js";
import { ADMIN_ROUTE, USER_ROUTE } from "../utils/consts.js";
import { useNavigate } from "react-router-dom";
import { Context } from "../index.jsx";

const AuthPage = () => {
    const [form] = Form.useForm();
    const { user } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notif, contextHolder] = notification.useNotification();

    const login = async () => {
        setLoading(true);
        form
            .validateFields()
            .then((values) => {
                loginAPI(values.login, values.password)
                    .then((response) => {
                        localStorage.setItem('token', response.accessToken);
                        user.setUser(response.user);
                        user.setIsAuth(true);

                        const role = response.user?.role;
                        if (role === 'admin') {
                            navigate(ADMIN_ROUTE);
                        } else {
                            navigate(USER_ROUTE);
                        }
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);

                            if (error.response?.data?.message) {
                                notif.error({
                                    message: error.response.data.message,
                                });
                            } else {
                                notif.error({
                                    message: 'Произошла ошибка при выполнении запроса.',
                                });
                            }
                    });
            })
            .catch(() => {
                setLoading(false);
                notif.error({
                        message: 'Пожалуйста заполните все обязательные поля',
                    });
            });
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                backgroundColor: '#2c2f33',
                minWidth: 300
            }}
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                style={{ width: '100%', maxWidth: 500, padding: '0 20px' }}
            >
                <Form.Item
                    label={<span style={{ color: '#FFFFFFD9', fontSize: '1.3rem' }}>Логин</span>}
                    name="login"
                    rules={[{ required: true, message: '' }]}
                >
                    <Input maxLength={30} size="large" />
                </Form.Item>
                <Form.Item
                    label={<span style={{ color: '#FFFFFFD9', fontSize: '1.3rem' }}>Пароль</span>}
                    name="password"
                    rules={[{ required: true, message: '' }]}
                >
                    <Input.Password maxLength={100} size="large" />
                </Form.Item>
                <Form.Item>
                    <Button
                        onClick={login}
                        size="large"
                        style={{ backgroundColor: '#5b8c00' }}
                        type="primary"
                        block
                        loading={loading}
                    >
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuthPage;
