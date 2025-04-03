import React, {useContext} from 'react';
import Title from "antd/es/typography/Title";
import {Button, Result} from "antd";
import {AUTH_ROUTE} from "../utils/consts.js";
import {Navigate, useNavigate} from "react-router-dom";
import {Context} from "../index.jsx";

const ErrorPage = () => {
    const navigate = useNavigate()
    const {user} = useContext(Context)

    return (
        <Result
            status="404"
            title="Ошибочка"
            subTitle="Мы не нашли такой странички, хотя очень старались. Или вам просто сюда нельзя)"
            extra={<Button onClick={() => navigate(AUTH_ROUTE)} type={'primary'}  style={{backgroundColor: '#722ed1',  height: '2em', fontSize:'1.4em'}}>Авторизация</Button>}
        />
    );
};

export default ErrorPage;