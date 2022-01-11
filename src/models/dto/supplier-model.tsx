import {ColumnMain} from "../column-main";
import {Column} from "../column";
import {Trans} from "@lingui/macro";
import React from "react";

const SupplierModel = () : ColumnMain => {

    const columns : Array<Column> = new Array();
    columns.push({key:'code', width: 110, sorter:true,title:<Trans>Code</Trans>, fixed: "left", direction:"asc", render: text => {return (<b>{text}</b>);} });
    columns.push({key:'name', width: 200, sorter:true,title:<Trans>Name</Trans> });
    columns.push({key:'email', width: 200, sorter:true,title:<Trans>Email</Trans> });
    columns.push({key:'ftpNeed', width: 150, checkboxFilter: true, sorter:true,title:<Trans>Ftp need</Trans> });
    columns.push({key:'remark', width: 150, sorter:true,title:<Trans>Remark</Trans> });
    columns.push({key:'active', width: 110, sorter:true,checkboxFilter:true,title:<Trans>Active</Trans> });
    columns.push({key:'receiverGate', width: 150, sorter:true, title:<Trans>Receiver Gate</Trans> });
    columns.push({key:'receiverPlantCode', width: 150, sorter:true, title:<Trans>Receiver Plant Code</Trans> });
    columns.push({key:'createdBy', width: 170, sorter:true,title:<Trans>Created By</Trans>})
    columns.push({key:'createdDate', width: 140, dateTimeFilter: true, sorter:true,title:<Trans>Created Date</Trans>})
    columns.push({key:'updatedBy', width: 170, sorter:true,title:<Trans>Updated By</Trans>})
    columns.push({key:'updatedDate', width: 140, dateTimeFilter: true, sorter:true,title:<Trans>Updated Date</Trans>})

    return{
        columns:columns,
        url:"/resource/suppliers"
    };

}
export default SupplierModel();
