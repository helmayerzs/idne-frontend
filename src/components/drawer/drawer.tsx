import useSafeState from '../../utils/safe-state';
import { Drawer as TableDrawer} from 'antd';
import React, {ReactElement} from "react";
import {Trans} from "@lingui/macro";

interface Interface {
    title?: ReactElement;
    children:  ReactElement;
    onCustomClose?: () => void;
    customClose?: () => void;
}

const Drawer = (props : Interface) => {

    const [visible, setVisible] = useSafeState(false);
    const [data,setData] = useSafeState([]);
    const [mode,setMode]= useSafeState("Edit");
    const [title, setTitle] = useSafeState<ReactElement>();

    const onClose = () => {
        if(props.customClose)
        {
            props.customClose();
        }
        setVisible(false);
    };

    const open  = ( mode? : "Add new" | "Edit" | "" | "Upload File" , recordData?: any) => {

        let lang = localStorage.getItem('language') == 'en' ? 'en' : 'hu';
        let text = <></>;
        if(lang == 'en'){

            switch(mode){
                case 'Add new': { text = <><Trans>Add</Trans> <Trans>New</Trans> {props.title} </>; break; }
                case 'Edit': { text = <><Trans>Edit</Trans> {props.title} </>; break; }
                case 'Upload File': { text = <>{props.title} <Trans>.csv upload</Trans></>; break;}
                case '': { text = <>{props.title}</>; break;}
                default: { text = <>{props.title}</>; break;}
            };
        }else{

            switch(mode){
                case 'Add new': { text = <>{props.title} <Trans>Add</Trans></>; break; }
                case 'Edit': { text = <>{props.title} <Trans>Edit</Trans></>; break; }
                case 'Upload File': { text = <>{props.title} <Trans>.csv upload</Trans></>; break;}
                case '': { text = <>{props.title}</>; break;}
                default: { text = <>{props.title}</>; break;}
            };
        }

        setTitle(text);
        setMode(mode ?  mode : '');
        setData(recordData);
        setVisible(true);
    };

    const createContent = (): React.ReactNode => {
        return React.cloneElement(props.children, {
            mode : mode,
            data : data,
            onClose : () => {
                onClose();
            }
        });
    };

    const component =
        <TableDrawer
            destroyOnClose
            title={title}
            width={720}
            onClose={onClose}
            visible={visible}
            bodyStyle={{ paddingBottom: 80 }}
        > {createContent()} </TableDrawer>;

    return {component,open};

};
export default Drawer;
