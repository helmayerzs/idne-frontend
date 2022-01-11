import useSafeState from '../../utils/safe-state';
import React, {useEffect} from 'react';
import {Form, Row, Col, Input, Button, message, Switch} from 'antd';
import {useAxios} from '../../utils/hooks';
import {AxiosResponse} from "axios";
import {Trans} from "@lingui/macro";
import {antdContext} from "../../utils/antdContext";
import SupplierModel from "../../models/dto/supplier-model";

interface Interface {
    data?: any;
    mode?: "Edit" | "Add new";
    onClose?: () => void;
}


const SupplierForm = (props: Interface) => {

    const [loading, setLoading] = useSafeState(false);
    const axiosInstance = useAxios(process.env.REACT_APP_API_BASE_URL + "")
    const config = {headers: {'Content-Type': 'application/json'}};
    const [active, setActive] = useSafeState(true);
    const [ftpNeed, setFtpNeed] = useSafeState(true);

    const data = props.data || {};
    const [form] = Form.useForm();

    let isEditMode = false;

    useEffect(() => {

        form.resetFields();

        if (props.mode === "Edit") {

            let fieldsValues = [];
            for (const [key, value] of Object.entries(data)) {
                fieldsValues.push({name: key, value: value});
            }
            form.setFields(fieldsValues);

            isEditMode = true;
        } else if (props.mode === "Add new") {
            isEditMode = false;
        }
    }, [])

    const onReset = () => {
        form.resetFields();
    };


    const openNotification = (status: any) => {
        if (status === "error") {
            message.error(antdContext('Hiba mentés közben')).then(r => {
                console.log(r)
            });
        } else if (status === "success") {
            message.success(antdContext('Sikeres mentés'));
        } else {
            message.info(antdContext('Ismeretlen hiba')).then(r => {
                console.log(r)
            })
        }
        if (props.onClose) {
            props.onClose();
        }
    };


    const handleEdit = () => {

        if (axiosInstance.current != null) {
            const obj = {
                id: form.getFieldValue(["code"]),
                code: form.getFieldValue(["code"]),
                name: form.getFieldValue(["name"]),
                active: form.getFieldValue(["active"]),
                remark: form.getFieldValue(["remark"]),
                ftpNeed: form.getFieldValue(["ftpNeed"]),
                email: form.getFieldValue(["email"]),
                receiverGate: form.getFieldValue(["receiverGate"]),
                receiverPlantCode: form.getFieldValue(["receiverPlantCode"]),
                version: form.getFieldValue(["version"])
            };
            setLoading(true);
            axiosInstance.current.put(SupplierModel.url + "/id?id=" + form.getFieldValue(["code"]), obj,
                config).then(() => {
                openNotification("success");
                setLoading(false);

            }).catch(function (error: any) {
                openNotification("error");
                console.log(error)
                setLoading(false);
            });
        }
    }
    const handleAddNew = () => {

        if (axiosInstance.current != null) {
            const obj = {
                code: form.getFieldValue(["code"]),
                name: form.getFieldValue(["name"]),
                active: active,
                remark: form.getFieldValue(["remark"]),
                ftpNeed: active,
                email: form.getFieldValue(["email"]),
                receiverGate: form.getFieldValue(["receiverGate"]),
                receiverPlantCode: form.getFieldValue(["receiverPlantCode"])
            };
            setLoading(true);
            axiosInstance.current.post(SupplierModel.url, obj,
                config).then(function (response: AxiosResponse<any>) {

                openNotification("success");
                setLoading(false);

            }).catch(function (error: any) {
                openNotification("error");
                console.log(error)
                setLoading(false);
            });
        }
    }

    const onChange = () => {
        setActive(!active);
    }
    const onChangeFtpNeed = () => {
        setFtpNeed(!ftpNeed);
    }

    return (
        <Form id={props.mode} form={form} layout="vertical"
              onFinish={() => props.mode === "Edit" ? handleEdit() : handleAddNew()}>
            <>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="code"
                            label={<Trans>Code</Trans>}
                            children={<Input disabled={props.mode === "Edit"}/>}
                            rules={[{
                                type: "string",
                                required: true,
                                message: <Trans>Please type a code</Trans>
                            }]}
                        />
                    </Col>
                    <Col span={16}>
                        <Form.Item
                            name="name"
                            label={<Trans>Name</Trans>}
                            children={<Input disabled={false}/>}
                            rules={[{
                                type: "string",
                                required: true,
                                message: <Trans>Please type a name</Trans>
                            }]}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label={<Trans>Email</Trans>}
                            children={<Input disabled={false}/>}
                            rules={[{
                                type: "string",
                                required: false,
                                message: <Trans>Please type an email</Trans>
                            }]}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="ftpNeed"
                            label={<Trans>FTPneed?</Trans>}
                            valuePropName="checked"
                            rules={[{
                                type: "boolean"
                            }]}
                            children={<Switch defaultChecked onChange={onChangeFtpNeed}/>}
                        />
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="active"
                            label={<Trans>Active</Trans>}
                            valuePropName="checked"
                            rules={[{
                                type: "boolean"
                            }]}
                            children={<Switch defaultChecked onChange={onChange}/>}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={24}>
                        <Form.Item
                            name="remark"
                            label={<Trans>Remark</Trans>}
                            children={<Input/>}
                            rules={[{
                                type: "string",
                                required: false,
                                message: <Trans>Please type a remark</Trans>
                            }]}
                        />
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="receiverGate"
                            label={<Trans>Receiver Gate</Trans>}
                            children={<Input/>}
                            rules={[{
                                type: "string",
                                required: false,
                                max: 5,
                                message: <Trans>Maximum 5 karakter lehet a kapu.</Trans>
                            }]}
                        />
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="receiverPlantCode"
                            label={<Trans>Receiver Plant Code</Trans>}
                            children={<Input/>}
                            rules={[{
                                type: "string",
                                required: false,
                                max: 3,
                                message: <Trans>Maximum 3 karakter lehet az üzem.</Trans>
                            }]}
                        />
                    </Col>
                </Row>

            </>
            {props.mode === "Edit" ?
                <Button loading={loading} htmlType="button" type="primary" onClick={() => form.submit()}>
                    <Trans>Mentés</Trans>
                </Button>
                :
                props.mode === "Add new" ?
                    <>
                        <Button htmlType="button" style={{marginRight: 8}} onClick={() => onReset()}>
                            <Trans>Vissza</Trans>
                        </Button>
                        <Button loading={loading} htmlType="button" type="primary" style={{marginRight: 8}}
                                onClick={() => form.submit()}>
                            <Trans>Save</Trans>
                        </Button>
                    </>
                    :
                    <></>
            }
        </Form>
    );

}
export default SupplierForm;
