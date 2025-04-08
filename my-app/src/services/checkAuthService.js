import axios from "axios";

const checkAuthService = async (user) => {

    try {

        const deviceIdentifier  = localStorage.getItem('deviceId');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}api/user/refresh/` + deviceIdentifier, {withCredentials: true})
        localStorage.setItem('token', response.refreshToken);

        user.setUser(response.data?.user? response.data?.user : null);
        user.setIsAuth(response.data?.user? true : false);

    } catch (e) {
        return false
        console.log(e);
        return false
    }
    return true

}
export default checkAuthService;
