import React, {useState} from 'react';
import {Menu} from "antd";
import {
    CarOutlined,
    ClockCircleOutlined,
    QuestionCircleOutlined,
    QuestionOutlined,
    SearchOutlined,
    TeamOutlined
} from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu.js";

const items = [
    {
        label: 'Команды',
        key: 'users',
        icon: <TeamOutlined/>,
    },
    {
        label: 'Процесс игры',
        key: 'timer',
        icon: <ClockCircleOutlined/>,
    },
    {
        label: 'Поездки',
        key: 'trip',
        icon: <CarOutlined/>,
    },
];

const MenuPage = ({hash}) => {
    const [current, setCurrent] = useState(hash ? hash : 'users');

    const onClick = (e) => {
        if (e.key === undefined) {
            return;
        }
        if (e.item.props.confirm === 'confirm') {

            return;
        }
        window.location.hash = e.key;

        setCurrent(e.key);
    };
    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{backgroundColor: '#2B2D30'}}
            theme="dark"
        >
            {items.map(item => (
                <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    mode="vertical"
                    style={{color: '#FFFFFFD9', backgroundColor: '#2B2D30'}}
                >
                    {item.label}
                </Menu.Item>
            ))}
            <SubMenu
                theme="dark"
                key="detective"
                icon={<SearchOutlined/>}
                title="Квиз игры"
                style={{color: '#FFFFFFD9', backgroundColor: '#2B2D30'}}
            >
                <Menu.Item key="games" >
                    Игры
                </Menu.Item>
                <Menu.Item key="questionsQuizz">
                    Вопросы
                </Menu.Item>
            </SubMenu>
            <SubMenu
                theme="dark"
                key="quizz"
                icon={<QuestionCircleOutlined/>}
                title="Детективная игра"
                style={{color: '#FFFFFFD9', backgroundColor: '#2B2D30'}}>
                <Menu.Item key="addresses">
                    Адреса
                </Menu.Item>
                <Menu.Item key="questionsDetective">
                    Вопросы детектива
                </Menu.Item>
            </SubMenu>
        </Menu>
    );
};

export default MenuPage;
