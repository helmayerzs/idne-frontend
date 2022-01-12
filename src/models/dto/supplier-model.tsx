import {ColumnMain} from "../column-main";
import {Column} from "../column";
import {Trans} from "@lingui/macro";
import React from "react";

const SupplierModel = () : ColumnMain => {

    const columns : Array<Column> = new Array();
    columns.push({key:'id', width: 150, sorter:true,title:<Trans>Id</Trans>, fixed: "left", direction:"asc", render: text => {return (<b>{text}</b>);} });
    columns.push({key:'title', width: 200, sorter:true,title:<Trans>Title</Trans> });
    columns.push({key:'content', width: 200, sorter:true,title:<Trans>Content</Trans>,
        render: text =>{return { children: <div className={"crop"}>{text}</div> }; }});
    columns.push({key:'videoLink', width: 400, sorter:true,title:<Trans>Video Link</Trans> });
    columns.push({key:'createdBy', width: 170, sorter:true,title:<Trans>Created By</Trans>})
    columns.push({key:'createdDate', width: 160, dateTimeFilter: true, sorter:true,title:<Trans>Created Date</Trans>})
    columns.push({key:'updatedBy', width: 170, sorter:true,title:<Trans>Updated By</Trans>})
    columns.push({key:'updatedDate', width: 160, dateTimeFilter: true, sorter:true,title:<Trans>Updated Date</Trans>})

    return{
        columns:columns,
        url:"/resource/posts"
    };

}
export default SupplierModel();
