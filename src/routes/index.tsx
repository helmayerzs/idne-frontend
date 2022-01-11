import useSafeState from '../utils/safe-state';
import {useAxios} from '../utils/hooks';
import * as React from 'react'
import en from '../locales/en/messages.json';
import hu from '../locales/hu/messages.json';
import {BrowserRouter as Router, Link, Switch} from 'react-router-dom';
import {useKeycloak} from '@react-keycloak/web'
import {PrivateRoute} from './utils'
import {Button, Col, Dropdown, Form, Layout, Menu, message, Modal, Row, Tooltip} from 'antd';

import {Language} from "../models/language/language";

import {Trans} from "@lingui/macro";


import "../routes/App.css";
import './App.css';
import 'antd/dist/antd.css';
import "../routes/index.css";
import logo from "../images/head_logo.png"
import huFlag from "../icons/hu.png";
import enFlag from "../icons/en.png";
import {
    DatabaseOutlined,
    HomeOutlined,
    MenuFoldOutlined, MenuUnfoldOutlined
} from "@ant-design/icons";
import {
    MessageOutlined,
    CalendarOutlined,
    AlertOutlined,
    CopyrightOutlined,
    ControlOutlined,
    ReconciliationOutlined,
    LogoutOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons/lib';

import {Footer} from "antd/lib/layout/layout";
import LandingScreen from "../screens/landing/landing";
import SupplierScreen from "../screens/suppliers/suppliers";
import isAuthorized from "../utils/is-authorized";

const {Header, Sider, Content} = Layout;

export const AppRouter = () => {

    const {initialized, keycloak} = useKeycloak();

    const [loggedUser, setLoggedUser] = useSafeState<any>('')
    const [collapsed, setCollapsed] = useSafeState(false)
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const [form] = Form.useForm();
    form.resetFields();

    React.useEffect(() => {

        if (keycloak && keycloak.tokenParsed) {

            let obj: any = JSON.parse(JSON.stringify(keycloak.tokenParsed));

            if (keycloak.tokenParsed != null) {
                setLoggedUser(obj.preferred_username);
                localStorage.setItem('username', obj.preferred_username);
            }
        }

    }, [initialized, keycloak]);

    const openWikiJs = () => {
        console.log(window.location.pathname);
        let pathname =
            ((window.location.pathname == "/" || window.location.pathname == "/landing")
                ? "/home"
                : window.location.pathname).replace( new RegExp("[0-9]+","gm"),"");

        window.open(process.env.REACT_APP_WIKI_URL + pathname, '_blank');
    }

    if (!initialized) {
        return <div>
            <Trans>Loading...</Trans>
        </div>
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={() => {
                console.log(window.location.origin);
                keycloak.redirectUri = window.location.origin;
                keycloak.logout();
                localStorage.clear();
            }}>
                <span style={{
                    fontSize: "small",
                    cursor: "pointer",
                    marginRight: 20
                }}>
                    <span style={{marginRight: 5}}><LogoutOutlined/></span><span><Trans>Logout</Trans></span></span>
            </Menu.Item>
        </Menu>
    );

    return (

        <Router>
            <Layout style={{minHeight: "100vh"}}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <Menu theme={"dark"} mode="inline" defaultSelectedKeys={['1']}>

                        {isAuthorized(keycloak,["IDNE_ADMIN"]) ?
                            <>
                            <Menu.Item key="1" icon={<HomeOutlined/>}>
                                <Link to="/landing"><Trans>Kezdőoldal</Trans></Link>
                            </Menu.Item>
                            <Menu.Item key="suppliers" icon={<MessageOutlined/>}>
                                <Link to="/suppliers"><Trans>Suppliers</Trans></Link>
                            </Menu.Item>
                            </>
                            : <></>
                        }

                    </Menu>
                </Sider>
                <Layout className="site-layout ">
                    <Header className="site-layout-background" style={{textAlign: "center", padding: 0}}>
                        <Row>
                            <Col span={10}>
                                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: 'trigger',
                                    onClick: toggleCollapse,
                                    style: {float: 'left'}
                                })}
                            </Col>
                            <Col span={4}>
                                    <span style={{textAlign: "center", width: 125}}>
                                        <img src={logo}/>
                                    </span>
                            </Col>
                            <Col span={10}>
                                    <span style={{float: 'right'}}>

                                        <Dropdown overlay={menu} placement="bottomLeft">
                                            <Button style={{border: 0}}><span
                                                style={{fontSize: 'large'}}>{loggedUser} </span></Button>
                                        </Dropdown>
                                    </span>
                            </Col>
                        </Row>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '12px 8px',
                            padding: 20
                        }}
                    >
                        <Switch>
                            <PrivateRoute roles={["IDNE_ADMIN"]} exact path="/" component={LandingScreen}/>
                            <PrivateRoute roles={["IDNE_ADMIN"]} exact path="/landing" component={LandingScreen}/>
                            <PrivateRoute roles={["IDNE_ADMIN"]} exact path="/suppliers" component={SupplierScreen}/>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center", fontSize: 10, paddingTop: 0, paddingRight: 10, paddingLeft: 10, paddingBottom: 9}}>
                        <Row>
                            <Col span={8}>
                            </Col>
                            <Col span={8}><CopyrightOutlined /> <span> 2021 Copyright  Lehetetlen nem létezik Kft.. | Created by <a href="https://www.pockitsolutions.hu" target="_blank" >PockIT Solutions</a></span></Col>
                            <Col span={8} style={{textAlign: "right"}}>Test-SNAPSHOT</Col>
                        </Row>
                    </Footer>
                </Layout>
            </Layout>
        </Router>
    )
}
