import {ADMIN_ROUTE, AUTH_ROUTE,  TIMER_ROUTE, USER_ROUTE} from "./utils/consts.js";
import UserPage from "./page/user/userPage.jsx";
import AdminPage from "./page/admin/adminPage.jsx";
import AuthPage from "./page/AuthPage..jsx";
import Timer from "./components/header/timer.jsx";


export const  userRoutes = [

    {
        path: USER_ROUTE,
        Component: UserPage
    },

]



export  const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: AdminPage
    },
    {
        path: TIMER_ROUTE,
        Component: Timer
    },
]

export  const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component:AuthPage
    },
    {
        path: TIMER_ROUTE,
        Component: Timer
    },
]
