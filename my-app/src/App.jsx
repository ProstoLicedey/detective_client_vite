import AppRouter from "./components/AppRouter.jsx";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import checkAuthService from "./services/checkAuthService.js";
import { Context } from "./index.jsx";
import { observer } from "mobx-react-lite";
import { ADMIN_ROUTE, USER_ROUTE, AUTH_ROUTE } from "./utils/consts.js";
import { v4 as uuidv4 } from 'uuid';

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Для отслеживания ошибок аутентификации
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.user) {
            return; // Выход из эффекта, если user еще не загружен
        }

        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            const newDeviceId = uuidv4();
            localStorage.setItem('deviceId', newDeviceId);
        }

        if (localStorage.getItem('token')) {
            checkAuthService(localStorage.getItem('token')) // Убедитесь, что передаете токен
                .then(() => {
                    if (user.user == null) {
                        return;
                    }
                    console.log(user.user);
                    if (window.location.pathname === AUTH_ROUTE) {
                        if (user.user?.role === 'admin') {
                            navigate(ADMIN_ROUTE);
                        } else {
                            navigate(USER_ROUTE);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Authentication failed:", error);
                    setError("Ошибка аутентификации. Пожалуйста, попробуйте снова.");
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return (
            <div >
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#2B2D30',
            minHeight: '100vh',
            width: '100%',
            overflowX: 'hidden',
            margin: 0,
            padding: 0
        }}>
            <Content>
                <AppRouter/>
            </Content>
        </div>

    );
}

export default observer(App);
