import React from 'react';
import { ConfigProvider, Collapse, Typography } from "antd";
import Title from "antd/es/typography/Title";
import { CaretRightOutlined, RightOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";

const { Text } = Typography;

const TripItem = ({ thisTrip }) => {
    return (
        <ConfigProvider
            theme={{
                components: {
                    Collapse: {
                        headerBg: thisTrip.goodTrip ? '#5b8c00' : '#2B2D30',
                        contentBg: '#2B2D30',
                    },
                },
            }}
        >
            <Collapse
                items={[
                    {
                        key: thisTrip.id,
                        label: <Text style={{ color: '#FFFFFFD9' }}>{thisTrip.title}</Text>,
                        children: (
                            <>
                                {thisTrip.appendix && (
                                    <Text underline strong style={{ color: '#FFFFFFD9', borderRadius: 0 }}>
                                        {thisTrip.appendix}
                                    </Text>
                                )}
                                <Text style={{ color: '#FFFFFFD9', borderRadius: 0 }}>
                                    <pre style={{ margin: 0, border: 'none', borderRadius: 0, backgroundColor: '#2B2D30' }}>
                                        {thisTrip.info}
                                    </pre>
                                </Text>
                            </>
                        ),
                    },
                ]}
                expandIcon={({ isActive }) => <RightOutlined style={{ color: '#FFFFFFD9' }} rotate={isActive ? 90 : 0} />}
                style={{
                    width: '94%',
                    marginLeft: '3%',
                    marginRight: '3%',
                    borderColor: '#1E1F22',
                    borderWidth: 1,
                }}
                size="small"
                defaultActiveKey={[thisTrip.goodTrip ? thisTrip.id : null]}
            />
        </ConfigProvider>
    );
};

export default observer(TripItem);
