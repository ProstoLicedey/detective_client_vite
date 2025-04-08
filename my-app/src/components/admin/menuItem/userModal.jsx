import React from 'react';
import {Button, Form, Input, Modal, notification, Row} from "antd";
import {SyncOutlined} from "@ant-design/icons";
import {createUserAPI, loginAPI} from "../../../http/userAPI.js";
import {ADMIN_ROUTE, USER_ROUTE} from "../../../utils/consts.js";

const UserModal = ({open, onCancel}) => {

    const [form] = Form.useForm();
    const [notif, contextHolder] = notification.useNotification();

    const createUser = () => {
        form
            .validateFields()
            .then((values) => {

                createUserAPI(values.login, values.password)
                    .then((response) => {
                        onCancel()
                        form.setFieldsValue({login: '', password: ''});
                    })
                    .catch((error) => {
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
                    });
            })
            .catch(() => {
                notif.error({
                    message: 'Пожалуйста заполните все поля',
                    placement: 'top'
                });
            })
    }
    const generateRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 7; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        form.setFieldsValue({password: result})
    };

    return (
        <Modal
            title={"Добавление команды"}
            open={open}
            footer={null}
            onCancel={() => {
                onCancel();
            }}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                style={{width: '100%', maxWidth: 500, padding: '0 20px'}}
            >
                <Form.Item
                    label={"Логин"}
                    name="login"
                    rules={[
                        {
                            message: '',
                            required: true,
                        },
                    ]}
                >
                    <Input maxLength={30} size={"large"} style={{width: '100%'}}/>
                </Form.Item>

                <Row gutter={8} align="middle" style={{marginBottom: '16px'}}>
                    <Form.Item
                        label={"Пароль"}
                        name="password"
                        rules={[
                            {
                                message: '',
                                required: true,
                            },
                        ]}
                        style={{flex: 1, marginRight: '8px'}}
                    >
                        <Input.Password maxLength={100} size={"large"} style={{width: '100%'}}/>
                    </Form.Item>
                    <Button shape="circle" onClick={generateRandomPassword} style={{marginLeft: '8px'}}
                            size={"small"}><SyncOutlined style={{fontWeight: 'bold'}}/></Button>
                </Row>

                <Form.Item>
                    <Button onClick={createUser} size={"large"} style={{backgroundColor: '#5b8c00'}} type={"primary"}
                            block>Добавить</Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </Modal>
    );
};

export default UserModal;
