import React from "react";
import {AxiosResponse} from "axios";
const axios = require('axios');

//@Bakos


const listController =  ( url : string, setData :(data : any) => void,id ?: number | string) => {

    axios.get(process.env.REACT_APP_SERVER_API+url+'/list'+(id?'/'+id:''), {withCredentials:true})
        .then(function (response : AxiosResponse<any>)
        {
            if (Array.isArray(response.data))
            setData(response.data);

        })
        .catch(function (error: any) {
            console.log(error);//TODO::EndIt
        });

}
export default listController;