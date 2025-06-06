import AppRouter from "./components/AppRouter.jsx";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { Spin } from "antd";
import checkAuthService from "./services/checkAuthService.js";
import { Context } from "./index.jsx";
import { observer } from "mobx-react-lite";
import { ADMIN_ROUTE, USER_ROUTE, AUTH_ROUTE } from "./utils/consts.js";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            let deviceId = localStorage.getItem('deviceId');
            if (!deviceId) {
                const newDeviceId = uuidv4();
                localStorage.setItem('deviceId', newDeviceId);
            }

            if (localStorage.getItem('token')) {
                try {
                    const isAuthValid = await checkAuthService(user);
                    if (isAuthValid && user.user && Object.keys(user.user).length > 0) {
                        if (window.location.pathname === AUTH_ROUTE) {
                            navigate(user.user.role === 'admin' ? ADMIN_ROUTE : USER_ROUTE);
                        }
                    }
                } catch (error) {
                    console.error("Authentication failed:", error);
                    setError("Ошибка аутентификации. Пожалуйста, попробуйте снова.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [user, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
        <div style={{ backgroundColor: '#2B2D30', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Content>
                <AppRouter />
            </Content>
        </div>
    );
}

export default observer(App);
