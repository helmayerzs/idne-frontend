import {ReactElement} from "react";
import {Tag} from "./Tag";

export interface Column {
        title: ReactElement;
        key: string;
        sorter: boolean;
        direction?:"asc"|"desc";
        dataIndex?:string|string[];
        fixed?:"left"|"right";
        width?: string | number;
        checkboxFilter?:boolean;
        dateFilter?:boolean;
        dateTimeFilter?:boolean;
        checkboxOptionsUrl?:string;
        filter?:boolean;
        uniqueSelectFilterData?: object[];
        render?: (text: any, row: any, index: any) => {};
        children?: Column[];
        tags?: Tag[];
}
