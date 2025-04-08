import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
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
            return <Navigate to={AUTH_ROUTE} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
