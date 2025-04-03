import React, { useState } from 'react';
import { Menu } from "antd";
import {
    AppstoreOutlined, BarChartOutlined,
    CarOutlined,
    ClockCircleOutlined, HomeOutlined,
    MailOutlined,
    OrderedListOutlined, QuestionCircleOutlined, TeamOutlined,
    UserOutlined
} from "@ant-design/icons";

const items = [
    {
        label: 'Поездки',
        key: 'trip',
        icon: <CarOutlined />,
    },
    {
        label: 'Таймер',
        key: 'timer',
        icon: <ClockCircleOutlined />,
    },
    {
        label: 'Команды',
        key: 'users',
        icon: <TeamOutlined />,
    },
    {
        label: 'Адреса',
        key: 'addresses',
        icon: <HomeOutlined /> ,
    },
    {
        label: 'Вопросы',
        key: 'questions',
        icon: <QuestionCircleOutlined /> ,
    },
];

const MenuPage = ({hash}) => {
    const [current, setCurrent] = useState(hash ? hash :'trip');

    const onClick = (e) => {
        if (e.key === undefined) {
            return;
        }
        if (e.item.props.confirm === 'confirm') {

            return;
        }
        window.location.hash = e.key;
        //close()
        setCurrent(e.key) ;
    };
    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            style={{ backgroundColor: '#2B2D30' }}

        >
            {items.map(item => (
                <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    style={{ color: '#FFFFFFD9', backgroundColor: '#2B2D30' }}
                >
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default MenuPage;
