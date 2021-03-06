import React from "react";
import {FC} from "react";
import DtoTable from "../../components/dto-table/dto-table";
import SupplierModel from "../../models/dto/supplier-model";
import useSafeState from "../../utils/safe-state";
import {Breadcrumb, Popconfirm, message, Button, Tooltip} from "antd";
import {Trans} from "@lingui/macro";
import {DeleteOutlined, EditTwoTone} from "@ant-design/icons";
import {useAxios} from "../../utils/hooks";
import {antdContext} from "../../utils/antdContext";
import Drawer from "../../components/drawer/drawer";
import SupplierForm from "../../forms/supplier-form/supplier-drawer";
import {PlusOutlined} from "@ant-design/icons/lib";


const SupplierScreen : FC = () => {

    const [trigger, setTrigger] = useSafeState(false);

    const mtskAxiosInstance = useAxios(process.env.REACT_APP_API_BASE_URL  + "");

    const handleDelete = (id: any) => {
        if(mtskAxiosInstance.current != null){
            mtskAxiosInstance.current.delete("/resource/suppliers/id?id="+id)
                .then(() => {
                    message.success(antdContext('Az adott sor sikeresen törölve lett.'));
                    setTrigger(false);
                    setTrigger(!trigger);
                }).catch(function (error :any) {
                message.error(antdContext('Hiba a mentés közben'));
                setTrigger(false);
                setTrigger(!trigger);
                console.log(error);
            });
        }
    }

    const action = (text: string, record: any) => {

        return  <>
            <Tooltip placement="top" title={<Trans>Delete supplier</Trans>}>
                <Popconfirm title={<Trans>Are you sure to delete this supplier?</Trans>}
                                              onConfirm={() => handleDelete(record.code)}
                                              okText={<Trans>Yes</Trans>}
                                              cancelText={<Trans>No</Trans>}>
                    <DeleteOutlined className={"ActionButtons"} style={{color: "#ff4d4f"}}/>
                </Popconfirm>
            </Tooltip>
            <Tooltip placement="top" title={<Trans>Edit supplier</Trans>}>
                <EditTwoTone
                    twoToneColor={"#40a9ff"}
                    className={"ActionButtons"} onClick={
                    () => drawer.open("Edit", {
                        code: record.code,
                        name: record.name,
                        remark: record.remark,
                        active: record.active,
                        translated: record.translated,
                        ftpNeed: record.ftpNeed,
                        email: record.email,
                        receiverGate: record.receiverGate,
                        receiverPlantCode: record.receiverPlantCode,
                        version: record.version
                    })}/>
            </Tooltip>
        </>
    }

    const text = <Trans>Supplier</Trans>
    const drawer = Drawer(
        {
            title: text,
            children:
                <SupplierForm/>,
            customClose: () => setTrigger(!trigger)
        }
    );

    const actions = {
        width: 90,
        render: (text: string, record: any) => action(text, record),
        title: '',
        fixed: 'right',
        align: 'center'
    };

    return  <>
        <Breadcrumb style={{ marginBottom: 10 }}>
            <Breadcrumb.Item><Trans id={'Homepage'}/></Breadcrumb.Item>
            <Breadcrumb.Item><Trans id={'Suppliers'}></Trans></Breadcrumb.Item>
        </Breadcrumb>
        <DtoTable
            model={SupplierModel}
            tableHeader={
                <Button type={"primary"} onClick={ () => drawer.open("Add new")} style={{float: "left", marginRight:10}}><PlusOutlined /><span><Trans>Add new</Trans></span></Button>
            }
            action={actions}
            trigger={trigger}
            pageSize={100}
            scroll={{ x: 1300, y: "65vh" }}
        />
        {drawer.component}
    </>
}
export default SupplierScreen;
