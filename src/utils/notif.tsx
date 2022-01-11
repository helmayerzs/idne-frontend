import React from 'react';
import {message} from "antd";
import {antdContext} from "../utils/antdContext";

export const notif = (status: any, msg: string) => {
    if (status === "error") {
        message.error(antdContext(msg)).then(r => {
            console.log(r)
        });
    } else if (status === "success") {
        message.success(antdContext(msg));
    } else {
        message.info(antdContext(msg)).then(r => {
            console.log(r)
        })
    }
};
