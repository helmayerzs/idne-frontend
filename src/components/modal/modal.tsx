import useSafeState from '../../utils/safe-state';
import { Trans } from '@lingui/macro';
import { Button, Modal as AntModel } from 'antd';
import * as React from 'react';
import { ReactElement } from 'react';

export interface ModalProps {
    title: string;
    component: ReactElement;
    width?: string | number;
}
const Modal = (props: ModalProps) => {
    const [visible, setVisible] = useSafeState(false);
    const [data, setData] = useSafeState([]);

    const open = (recordData?: any) => {
        setData(recordData);
        setVisible(true);
    };

    const createContent = (): React.ReactNode => {
        return React.cloneElement(props.component, {
            data,
        });
    };
    const handleClose = () => {
        setVisible(false);
    };

    const component = (
        <AntModel
            title={props.title}
            centered
            onCancel={handleClose}
            visible={visible}
            width={props.width}
            footer={[
                <Button key="submit" type="primary" onClick={handleClose}>
                    <Trans>Ok</Trans>
                </Button>,
            ]}
        >
            {createContent()}
        </AntModel>
    );
    return { open, component };
};
export default Modal;
