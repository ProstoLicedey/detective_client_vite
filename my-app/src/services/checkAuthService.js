import axios from "axios";

const checkAuthService = async (user) => {
    try {
        const deviceIdentifier = localStorage.getItem('deviceId');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}api/user/refresh/` + deviceIdentifier, { withCredentials: true });
        
        // Сохраняем токены
        await Promise.all([
            localStorage.setItem('token', response.data.accessToken),
            localStorage.setItem('refreshToken', response.data.refreshToken)
        ]);

        // Обновляем состояние пользователя
        user.setUser(response.data?.user || null);
        user.setIsAuth(!!response.data?.user);
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};

export default checkAuthService;
