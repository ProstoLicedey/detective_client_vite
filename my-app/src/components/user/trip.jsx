import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Input, Select, Row, Col, Popconfirm, message, notification, Tooltip} from 'antd';
import {CarOutlined} from '@ant-design/icons';
import { getTrips, postTrip} from "../../http/tripAPI.js";
import {Context} from "../../index.jsx";
import {observer} from "mobx-react-lite";


const {Option} = Select;

const Trip = () => {
    const [form] = Form.useForm();
    const [popconfirmVisible, setPopconfirmVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user, timer} = useContext(Context);


    useEffect(() => {
        setLoading(true)
        getTrips(user.user.id)
            .then((response)=> {
                user.setTrips(response)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    // Если сервер вернул сообщение об ошибке
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                        placement: 'top'
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                        placement: 'top'
                    });
                }
            })
    }, []);

    const handleTrip = () => {
        setLoading(true)
        postTrip(user.user.id, form.getFieldValue('district'), form.getFieldValue('number'))
            .then(()=>  {
                form.resetFields()
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    // Если сервер вернул сообщение об ошибке
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                        placement: 'top'
                    });
                } else {
                    // Если нет специфического сообщения об ошибке от сервера
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                        placement: 'top'
                    });
                }
            });
        setPopconfirmVisible(false);
    };


    const handleOpenChange = (visible) => {
        const district = form.getFieldValue('district');
        const number = form.getFieldValue('number');
        if (!visible) {
            setPopconfirmVisible(false);
        } else if (!district || !number) {
            return notification.error({
                message: 'Введите район и номер дома',
                showProgress: true,
            });
            setPopconfirmVisible(false);
        } else {
            setPopconfirmVisible(true);
        }
    };

    return (
        <div style={{marginTop: '2%', backgroundColor: '#1E1F22', padding: '2%', maxWidth: 500, width:'100%'}}>
            <Tooltip title={!timer.timerActive ? "В данный момент совершать поездки нельзя" : ""}>
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    style={{width: '100%', maxWidth: 500, padding: '0 20px'}}
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={6}>
                            <Form.Item
                                name="district"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ]}
                            >
                                <Select disabled={!timer.timerActive} placeholder="Район" size="large"
                                        style={{width: '100%'}}>
                                    <Option value="CЗ">CЗ</Option>
                                    <Option value="С">С</Option>
                                    <Option value="СВ">СВ</Option>
                                    <Option value="З">З</Option>
                                    <Option value="Ц">Ц</Option>
                                    <Option value="В">В</Option>
                                    <Option value="ЮЗ">ЮЗ</Option>
                                    <Option value="Ю">Ю</Option>
                                    <Option value="ЮВ">ЮВ</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={18}>
                            <Form.Item
                                name="number"
                                rules={[
                                    {
                                        required: true,
                                        message: '',
                                    },
                                ]}
                            >
                                <Input  disabled={!timer.timerActive} maxLength={20} size="large"
                                       placeholder="Номер дома" style={{width: '100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item>
                                <Popconfirm
                                    visible={popconfirmVisible}
                                    title={`Вы собираетесь поехать по адресу ${form.getFieldValue(
                                        'district'
                                    )}-${form.getFieldValue('number')}`}
                                    onConfirm={handleTrip}
                                    onCancel={() => setPopconfirmVisible(false)}
                                    okText="Поехали"
                                    cancelText="Отмена"
                                    placement="bottom"
                                    icon={<CarOutlined/>}
                                    okButtonProps={{style: {backgroundColor: '#2B2D30'}}}
                                    onVisibleChange={handleOpenChange}
                                >
                                    <Button disabled={!timer.timerActive}
                                            size="large"
                                            style={{backgroundColor: '#2B2D30', color: !timer.timerActive ? '#FFFFFFA6' : '#FFFFFFD9' }}
                                            type="primary"
                                            block
                                            loading={loading}
                                    >
                                        <CarOutlined/> Посетить адрес
                                    </Button>
                                </Popconfirm>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Tooltip>
        </div>
    );
};

export default observer(Trip);
