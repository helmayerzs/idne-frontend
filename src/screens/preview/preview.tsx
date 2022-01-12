import React, {ReactNode, useCallback, useEffect} from 'react';
import {List, Avatar, Space, Tooltip, Popconfirm, message} from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {Trans} from "@lingui/macro";
import useSafeState from "../../utils/safe-state";
import {antdContext} from "#/utils/antdContext";
import {AxiosResponse} from "axios";
import {useAxios} from "../../utils/hooks";

const PreviewScreen = () => {

    const axiosInstance = useAxios(process.env.REACT_APP_API_BASE_URL  + "");

    const [data, setData] = useSafeState<dataType[]>([]);
    const [totalElement, setTotalElement] = useSafeState<number>(0);

    type dataType = {
        href: string,
        title: string,
        avatar: string,
        description: string,
        content: string,
        createdDate: string
    }

    useEffect( () => {loadData(1,20);}
        ,[]);

    const loadData = (page: any, size: any) => {

        if(axiosInstance.current != null){

            axiosInstance.current.post('/resource/posts/page', {

                query:null,
                start:  page,
                length: size,
                direction: 'asc',
                sorted_field: 'id'

            })
                .then(function (response : AxiosResponse<any>)
                {
                    console.log(response.data);
                    setData(response.data.data);
                    setTotalElement(response.data.recordsTotal);
                })
                .catch(function (error: any) {
                    console.log(error);//TODO::EndIt
                });

        }
    }

    return (
        <div style={{width: "1000px"}}>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    onChange: page => {
                        loadData(page, 10);
                    },
                    pageSize: 10,
                    total: (totalElement - 10),
                    showSizeChanger: false
                }}
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        key={item.title}
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />
                        }
                    >
                        <List.Item.Meta
                            title={<a href={item.href}>{item.title}</a>}
                            description={item.createdDate}
                        />
                        <div>
                            {
                                item.content.length > 500
                                    ? item.content.substring(0,500) + '...'
                                : item.content

                            }
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );
}
export default PreviewScreen;


