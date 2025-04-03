import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {AUTH_ROUTE} from "../utils/consts.js";

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
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const navigate = useNavigate();
            navigate(AUTH_ROUTE);
            return null;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
