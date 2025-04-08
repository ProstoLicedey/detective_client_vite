import React, {useContext, useEffect, useRef, useState} from 'react';
import Title from "antd/es/typography/Title";
import {Button, ConfigProvider, Input, notification, Space, Switch, Table} from "antd";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {connectTripAdmin, getTripsAdmin, putTrip} from "../../../http/tripAPI.js";
import {Context} from "../../../index.jsx";
import {observer} from "mobx-react-lite";
import ruRu from 'antd/locale/ru_RU';

const TripAdmin = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const {admin, user} = useContext(Context);
    const [tripAdminConnected, setTripAdminConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notif, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (Object.keys(user.user).length !== 0 && !tripAdminConnected) {
            connectTripAdmin(admin);
            setTripAdminConnected(true);
        }
    }, [user.user, tripAdminConnected]);

    useEffect(() => {
            getTripsAdmin()
                .then((response) => {
                    setLoading(false)
                    admin.setTrips(response)
                })
                .catch((error) => {
                    setLoading(false)
                    if (error.response && error.response.data && error.response.data.message) {
                        const errorMessage = error.response.data.message;
                        notif.error({
                            message: errorMessage,
                        });
                    } else {
``
                         notif.error({
                            message: 'Произошла ошибка при выполнении запроса.',
                        });
                    }
                })

        }, []
    );

    function updateIssued(id) {
        setLoading(true)
        putTrip(id)
            .then((response) => {
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    notif.error({
                        message: errorMessage,
                    });
                } else {
                    notif.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            })
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined style={{color: '#FFFFFFD9'}}/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Сброс
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : 'white',
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });


    const columns = [
        {
            title: 'Номер',
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Команда',
            dataIndex: 'team',
            key: 'team',
            width: '30%',
            sorter: (a, b) => a.team.length - b.team.length,
            ...getColumnSearchProps('team'),
            render: (text, record) => (
                text
            )
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: '25%',
            ...getColumnSearchProps('address'),
            sorter: (a, b) => a.address.length - b.address.length,

        },
        {
            title: 'Приложение',
            dataIndex: 'appendix',
            key: 'appendix',
            width: '20%',
            ...getColumnSearchProps('appendix'),
            sorter: (a, b) => {
                if (a.appendix === null) return 1; // null values go to the bottom
                if (b.appendix === null) return -1; // null values go to the bottom
                const numberA = parseInt(a.appendix.split(' ')[1], 10) || 0; // handle "Приложение 0"
                const numberB = parseInt(b.appendix.split(' ')[1], 10) || 0;
                return numberA - numberB;
            },
        },
        {
            title: 'Отдача',
            dataIndex: 'issued',
            key: 'issued',
            width: '15%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <>
                    {issued != null &&
                        <Switch disabled={!!issued} checked={!!issued} onChange={() => updateIssued(record.id)}/>
                    }
                </>
            )
        },
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
        }}>
            <div style={{
                width: '96%', marginLeft: '2%',
                marginRight: '2%', maxWidth: 1000
            }}>
                <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Поездки</Title>
                <ConfigProvider
                    locale={ruRu}
                    theme={{
                        components: {
                            Table: {
                                bodySortBg: '#2B2D30',
                                headerFilterHoverBg: '#2B2D30',
                                headerSortActiveBg: '#2B2D30',
                                headerSortHoverBg: '#2B2D30',
                                headerSplitColor: '#2B2D30',
                                headerBg: '#1E1F22',
                                headerColor: '#FFFFFFD9',
                                rowSelectedHoverBg: '#1E1F22',
                                rowExpandedBg: '#2B2D30',
                                rowHoverBg: '#2B2D30',
                                rowSelectedBg: '#2B2D30',
                                borderColor: '#00000040',

                            },
                        },
                    }}
                >
                    <Table
                        loading={loading}
                        onRow={(record) => ({
                            style: {
                                background: record.status,
                                color: '#FFFFFFD9',
                                borderColor: '#00000040'
                            },
                        })}
                        bordered
                        style={{overflowX: 'auto', background: '#2B2D30',}}
                        columns={columns}
                        dataSource={admin.trips}
                        responsive={{xs: true, sm: true, md: true, lg: true, xl: true, xxl: true}}
                    />
                </ConfigProvider>
            </div>
            {contextHolder}
        </div>
    );
}


export default observer(TripAdmin);
