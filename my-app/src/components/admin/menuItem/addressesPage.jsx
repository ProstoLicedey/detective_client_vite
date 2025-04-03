import React, {useContext, useEffect, useRef, useState} from 'react';
import Title from "antd/es/typography/Title";
import {Context} from "../../../index.jsx";
import {Button, ConfigProvider, Input, notification, Popconfirm, Space, Switch, Table, Typography} from "antd";
import {DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {getAddressesAPI, userDeleteAPI} from "../../../http/addressesAPI.js";
import {observer} from "mobx-react-lite";
import UserModal from "./userModal.jsx";
import ModalsAddres from "./modalsAddres.jsx";
import ruRu from "antd/locale/ru_RU";

const {Text} = Typography;

const AddressesPage = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const searchInput = useRef(null);
    const [update, setUpdate] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const {admin} = useContext(Context);

    useEffect(() => {
        getAddressesAPI()
            .then((response) => {
                admin.setAddresses(response);
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            });
    }, [update]);

    function deleteUser(id) {
        setLoading(true)
        userDeleteAPI(id)
            .then((response) => {
                setLoading(false)
                setUpdate(update + 1)
                return notification.success({
                    message: 'Адрес удалён',
                });
            })
            .catch((error) => {
                setLoading(false)
                setUpdate(update + 1)
                if (error.response && error.response.data && error.response.data.message) {
                    const errorMessage = error.response.data.message;
                    return notification.error({
                        message: errorMessage,
                    });
                } else {
                    return notification.error({
                        message: 'Произошла ошибка при выполнении запроса.',
                    });
                }
            });

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
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Введите ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined style={{color: '#FFFFFFD9'}}/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Найти
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
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
            <SearchOutlined style={{color: filtered ? '#1677ff' : 'white'}}/>
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
            width: '10%',
            ...getColumnSearchProps('id'),
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Адрес',
            dataIndex: 'number',
            key: 'number',
            width: '15%',
            sorter: (a, b) => a.number.length - b.number.length,
            ...getColumnSearchProps('number'),
            render: (text, record) => (
                record.district + "-" + text
            )
        },
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            width: '35%',
            sorter: (a, b) => a.title.length - b.title.length,
            ...getColumnSearchProps('title'),

        },
        {
            title: 'Приложение',
            dataIndex: 'appendix',
            key: 'appendix',
            width: '25%',
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.appendix - b.appendix,
            render: (text, record) => (
                text != null ? `Приложение ${text}` : '-'
            )
        },
        {
            title: '',
            key: 'delete',
            width: '15%',
            sortDirections: ['descend', 'ascend'],
            render: (issued, record) => (
                <>
                    <Popconfirm
                        title={`Удалить адрес?`}
                        onConfirm={() => deleteUser(record.id)}
                        okText="Удалить"
                        cancelText="Отмена"
                        placement="left"
                        icon={<DeleteOutlined/>}
                        okButtonProps={{style: {backgroundColor: '#a8071a'}}}
                    >
                        <Button style={{backgroundColor: '#820014'}} type="primary">Удалить</Button>
                    </Popconfirm>
                </>
            )
        },
    ];

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div style={{width: '96%', marginLeft: '2%', marginRight: '2%', maxWidth: 800}}>
                <Title style={{color: '#FFFFFFD9', textAlign: 'center'}} level={2}>Адреса</Title>
                <Button
                    onClick={() => setModal(true)}
                    size={"large"}
                    style={{backgroundColor: '#3f6600', margin: 10}}
                    type={"primary"}
                >
                    Добавть адрес +
                </Button>
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
                                background: '#2B2D30',
                                color: '#FFFFFFD9',
                                borderColor: '#00000040'
                            },
                        })}
                        bordered
                        style={{overflowX: 'auto', background: '#2B2D30'}}
                        columns={columns}
                        dataSource={admin.addresses}
                        rowKey="id"
                        expandable={{
                            expandedRowRender: (record) => (
                                <Text style={{color: '#FFFFFFD9', borderRadius: 0, margin: 0}}>
                                    <pre style={{
                                        margin: 0,
                                        border: 'none',
                                        borderRadius: 0,
                                        backgroundColor: '#2B2D30'
                                    }}>{record.info}</pre>
                                </Text>
                            ),
                            expandedRowKeys: expandedRowKeys,
                            onExpand: (expanded, record) => {
                                setExpandedRowKeys(expanded ? [record.id] : []);
                            },
                        }}
                    />
                </ConfigProvider>
            </div>

            <ModalsAddres open={modal}
                       onCancel={() => {
                           setUpdate(update+1)
                           setModal(false);
                       }}
            />
        </div>
    );
}

export default observer(AddressesPage);
