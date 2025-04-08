import React, { Component } from 'react';
import { Navigate, BrowserRouter } from 'react-router-dom';
import { AUTH_ROUTE } from "../utils/consts.js";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // Можно также отправить информацию об ошибке на сервер для анализа
    }

    render() {
        if (this.state.hasError) {
            // Перенаправляем пользователя на страницу авторизации
            return (
                <BrowserRouter>
                    <Navigate to={AUTH_ROUTE} />
                </BrowserRouter>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;