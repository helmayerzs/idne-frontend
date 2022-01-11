import {Tag} from "../../models/Tag";
import {Link} from "react-router-dom";
import {i18n} from "@lingui/core";
import { Column } from '#/models/column';
import {
    CloseOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    FileTextOutlined, FilterFilled, FilterOutlined,
    LeftOutlined,
    ProfileOutlined
} from '@ant-design/icons/lib';
import useSafeState from '../../utils/safe-state';
import React, {ReactNode, useEffect } from "react";
import {Input, Checkbox, Table, Select, Row, Col, Button, DatePicker, Tag as TagAntd, Space, Tooltip} from 'antd';
import paginationController from "../../controllers/pagination-controller";
import { SearchOutlined,CheckCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
import {ColumnMain} from "../../models/column-main";
import listController from "../../controllers/list-controller";
import {ColumnsType} from "antd/es/table";
import {t, Trans} from "@lingui/macro";
import {useAxios} from "../../utils/hooks";
import "./dto-table.css";
const axios = require('axios');


interface Interface{
    query?: any;
    pageSize?: number;
    model:ColumnMain;
    action?:any;
    tableHeader?:any;
    apiUrl?:string;
    backUrl?:string;
    allowBackButton?: boolean;
    allowExport?: boolean;
    allowBulkExport?: boolean;
    view?:any;
    listId?: number | string;
    listController?:() => void;
    trigger?: boolean;
    disabled?:boolean;
    pagination?:"Off";
    rowClassName?: string | any | undefined;
    summary?: (data: any) => ReactNode;
    scroll?:any;
    title?:()=>ReactNode;
}

const DtoTable = (props: Interface) => {

    const [data,setData] = useSafeState([]);
    const [columnState,setColumnState] = useSafeState();
    const [totalElements,setTotalElements] = useSafeState(0);

    const [searchTrigger,setSearchTrigger] = useSafeState(true);
    const [page,setPage] = useSafeState(1);

    const [size,setSize] = useSafeState(props.pageSize? props.pageSize: 15);
    const [direction,setDirection] = useSafeState<string>();
    const [sortedField,setSortedField] = useSafeState<any>();
    const [queryModel,setQueryModel]=useSafeState<any>({});
    const [actFilters,setActFilters]=useSafeState<Map<object, object>>(new Map<object, object>());

    const [selectedRowId,setSelectedRowId] = useSafeState<any>();
    const [filteredInfo,setFilteredInfo]=useSafeState<any>();

    const [isAnyFilterOnTable,setIsAnyFilterOnTable] = useSafeState(false);

    const axiosInstance = useAxios(process.env.REACT_APP_API_KEYCLOAK_URL + "")
    const axiosResourceInstance = useAxios(process.env.REACT_APP_API_BASE_URL + "")

    const [xlsDownloading, setXlsDownloading] = useSafeState(false);
    const [downloading, setDownloading] = useSafeState(false);

    const render = (data : any,tags:Tag[] | undefined) => {

        if(data===true) {
            return <CheckCircleOutlined style={{color:'green'}} />;
        }
        else if(data===false) {
            return  <CloseCircleOutlined style={{color:'red'}} />;
        }
        else if(tags!=undefined)
        {
            return  tags.map(
                (item:Tag)=>
                {
                    if(item.text==data)
                    {
                        return  <TagAntd  color={item.color} key={item.text}>
                            <Trans id={item.text}></Trans>
                        </TagAntd>;
                    }
                });
        }
        return data;
    }

    const onChange = (checkedValues : any,key : string) => {

        let isTrue : boolean = false;
        let isFalse : boolean = false;

        let searchValue = null;

        checkedValues.forEach((value : any) => {
            if(value=='true')
            {
                isTrue=true;
            }
            if(value=='false')
            {
                isFalse=true;
            }
        });

        if(isFalse && isTrue==false)
        {
            searchValue="false";
        }
        else if(isFalse== false && isTrue)
        {
            searchValue="true";
        }else if(checkedValues.length>0 && isFalse== false && !isTrue){
            searchValue=checkedValues;
        }
        searchHandle(key,searchValue);

    }

    const onChangeDate = (date : any,key : string) => {
        searchHandle(key,date ? date.format('YYYY-MM-DD') : null);
    }

    const onChangeDateTime = (dateTime : any,key : string) => {
        searchHandle(key,dateTime ? dateTime.format('YYYY-MM-DD HH:mm') : null);
    }

    const simpleOptions = [
        { label: <Trans>True</Trans>, value: 'true' },
        { label: <Trans>False</Trans>, value: 'false' },
    ];

    const handleReset = (clearFilters : any) => {
        clearFilters();
    };

    const columnGenerateGeneral = (columns: Column[]) => {
        let generatedColumns:any = new Array();

        if(columns.length < 1){
            return generatedColumns;
        }

        columns.forEach(function (value: any) {

            generatedColumns.push({
                title: value.title,
                dataIndex: value.dataIndex?value.dataIndex:value.key,
                key: value.key,
                sorter: value.sorter,
                fixed:value.fixed,
                width: value.width,
                filter: value.filter,
                render: value.render ? value.render : (data : any) => (render(data,undefined)),
                filterIcon: (filtered : any) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters } : any) => (
                    value.filter === false
                        ? null
                        : value.uniqueSelectFilterData
                        ? <Select options={value.uniqueSelectFilterData} style={{width: 200}} onChange={value1 => searchHandle(value.key,value1+"",value.dataIndex)} />
                        : value.dateFilter
                            ? <DatePicker format={'YYYY-MM-DD'} placeholder={'YYYY-MM-DD'} onChange={(date) => onChangeDate(date, value.key)}/>
                            : value.dateTimeFilter
                                ? <DatePicker showTime={true} format={'YYYY-MM-DD HH:mm'} placeholder={'YYYY-MM-DD HH:mm'} onChange={(dateTime) => onChangeDateTime(dateTime, value.key)}/>
                                :
                                    <div style={{ padding: 8 }}>
                                        <Input
                                            value={selectedKeys[0]}
                                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                            onPressEnter={(event:any) => {
                                                searchHandle(event.target.id,event.target.value,value.dataIndex);
                                                confirm({ closeDropdown: false });
                                            }}
                                            style={{ marginBottom: 8, display: 'block', width: value.width }}
                                        />
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={(event : any) => {
                                                    searchHandle(value.key,selectedKeys[0],value.dataIndex);
                                                    confirm({ closeDropdown: false });
                                                }}
                                                icon={<SearchOutlined />}
                                                size="small"
                                                style={{ width: 90 }}
                                            >
                                            </Button>
                                            <Button onClick={() => handleReset(clearFilters)}
                                                    icon={<SearchOutlined />}
                                                    size="small" style={{ width: 90 }}>
                                            </Button>
                                        </Space>
                                    </div>)
            });
        });

        return generatedColumns;
    }

    const getProperty = <T, K extends keyof T>(obj: T, key: K) => {
        if(obj != undefined){
            return obj[key];
        }

        return null;
    }

    const getEmbeddedProperty = (o: any, s: any) => {
        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k != null && o != null && k in o) {
                o = o[k];
            } else {
                return null;
            }
        }
        return o;
    }

    const isFiltered = (key: any) => {
        if(queryModel != null && getEmbeddedProperty(queryModel, key) != null){
            return true;
        }
        return false;
    }

    const getActFilter = (key: any) => {
        if(actFilters != null && actFilters.get(key) != undefined){
            return actFilters.get(key) + "";
        }
        return "";
    }


    const columnGenerate = async ():Promise<ColumnsType<any>> => {
        let columns:any = new Array();
        let alreadySet=true;
        let i=0;

        await Promise.all(props.model.columns.map(async(value : any) => {

            let childrenColumns:any = new Array();
            let data:any;
            let tags: Tag[] | undefined = props.model.columns[i].tags;
            if(value.checkboxOptionsUrl) {
                data= await axios.get(process.env.REACT_APP_SERVER_API + value.checkboxOptionsUrl + '/list');
            }

            let extra;
            if (queryModel===undefined) {
                queryModel[value.key] = '';
            }
            if (props.model.columns[i].direction !== undefined) {
                setDirection( props.model.columns[i].direction);
                setSortedField( props.model.columns[i].key);
                extra = {defaultSortOrder: props.model.columns[i].direction + 'end'};
                alreadySet=false;
            }

            if(props.model.columns[i].children! && props.model.columns[i].children != null){
                childrenColumns = columnGenerateGeneral(props.model.columns[i].children!);
            }

            columns.push({
                title: value.title,
                dataIndex: value.dataIndex?value.dataIndex:value.key,
                key: value.key,
                sorter: value.sorter,
                fixed:value.fixed,
                width: value.width,
                filter: value.filter,
                children: childrenColumns.length > 0 ? childrenColumns : null,
                render: value.render ? value.render : (data : any) => (render(data,tags)),
                filteredValue: getProperty(filteredInfo, value.key),
                filterIcon: (filtered : any) => {
                    return <FilterFilled style={{ color: isFiltered(value.key) ? '#1890ff' : undefined, marginRight: 5}} />
                    },
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters } : any) => (
                    value.filter === false
                        ? null
                        : value.uniqueSelectFilterData
                        ? <Select options={value.uniqueSelectFilterData} style={{width: 200}} onChange={value1 => searchHandle(value.key,value1+"",value.dataIndex)} />
                        : value.checkboxFilter
                            ? <Checkbox.Group style={{padding:'10px'}} options={data!=null?data.data:simpleOptions} onChange={(checkedValue) => onChange(checkedValue,value.key)} />
                            : value.dateFilter
                                ? <DatePicker format={'YYYY-MM-DD'} placeholder={i18n._(t`dateFormat`)} onChange={(date) => onChangeDate(date, value.key)}/>
                                : value.dateTimeFilter
                                    ? <DatePicker showTime={true} format={'YYYY-MM-DD HH:mm'} placeholder={i18n._(t`dateTimeFormat`)} onChange={(dateTime) => onChangeDateTime(dateTime, value.key)}/>
                                    :
                                        <div style={{ padding: 8 }}>
                                            <Row>
                                                <Col>
                                                    <Input
                                                        allowClear={true}
                                                        value={getActFilter(value.key)}
                                                        onChange={e => {
                                                            if (e.target.value === '') {
                                                                actFilters.delete(value.key);
                                                                setSelectedKeys('');
                                                                searchHandle(value.key,undefined,value.dataIndex);
                                                                handleReset(clearFilters);
                                                                confirm({ closeDropdown: false });
                                                            }
                                                            actFilters.set(value.key, e.target.value ? [e.target.value] : []);
                                                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                                                            }
                                                        }
                                                        onPressEnter={(event:any) => {
                                                            searchHandle(value.key,getActFilter(value.key),value.dataIndex);
                                                            confirm({ closeDropdown: false });
                                                        }}
                                                        style={{ marginRight: 1, width: value.width}}
                                                    />
                                                    <>
                                                        <Button
                                                            style={{ marginRight: 1}}
                                                            type="primary"
                                                            onClick={(event : any) => {
                                                                searchHandle(value.key,getActFilter(value.key),value.dataIndex);
                                                                confirm({ closeDropdown: false });
                                                            }}
                                                            icon={<SearchOutlined />}
                                                        >
                                                        </Button>
                                                    </>

                                                </Col>
                                            </Row>
                                        </div>
                ),...extra});

            i=i+1;
        }));

        if (props.view){
            columns.push(
                props.view
            );
        }
        if (props.action){
            columns.push(
                props.action
            );
        }
        setColumnState(columns);
        return columns;
    }

    const isAnyFilter = () : any => {

        for (var key of Object.keys(queryModel)) {
                if(queryModel[key] != null){
                    return true;
                }
        }
    };

    const searchHandle = (columnId : string, data : any, dataIndex?:string[]) => {
        if(dataIndex!==undefined){
            let v:any={};
            v[dataIndex[dataIndex.length-1]]=data;
            dataIndex.slice().reverse().forEach((value, index) => {
                if (index>0 && index<dataIndex.length-1){
                    const acc:any={};
                    acc[value]=v;
                    v=acc;
                }
            })

            if(queryModel[dataIndex[0]]!=undefined && dataIndex[0] != Object.keys(queryModel[dataIndex[0]])[0])
            {
                Object.assign(queryModel[dataIndex[0]],(data==="null" || data==="")?undefined:v)
            }else{
                queryModel[dataIndex[0]] = (data==="null" || data==="")?undefined:v;
            }
        }else{
            queryModel[columnId] =  (data==="null" || data==="")?undefined:data;
        }

        setIsAnyFilterOnTable(isAnyFilter);
        setPage(1);
        setSearchTrigger(prevState => !prevState);
    }

    const sortChangeHandle = (sorter: any ) =>
    {

        if(sorter!=undefined)
        {
            let sortedField:string="";
            if (Array.isArray(sorter.field)) {
                sorter.field.forEach((value:any) =>{
                    sortedField=sortedField+value+".";
                })
                sortedField.substring(0,sortedField.length-1);
            }else{
                sortedField=sorter.field
            }

            setSortedField(sortedField);
            let direct : string = sorter.order!==false?sorter.order:'';
            if(direct=='ascend')
            {
                direct='asc';
            }
            else if(direct=='descend')
            {
                direct='desc';
            }
            setDirection(direct);
        }
    };

    const getTableData = () => {

        if(typeof props.listId==="number" || typeof props.listId==="string")
        {
            if(props.listId==-111)
            {
                setData([]);
            }
            else
            {
                listController(  props.model.url, (data: any) => setData(data),props.listId);
            }
        }
        else {
            if(props.query != null){
                console.log(props.query);
                if(props.query.sapFileIncomingId != null){
                    queryModel.sapFileIncomingId = props.query.sapFileIncomingId;
                }

                if(props.query.fileType != null){
                    queryModel.fileType = props.query.fileType;
                }
            }

            if (direction!==undefined && axiosResourceInstance.current != null) {
                paginationController(queryModel, props.model.url, size, direction, sortedField, (data: any) => setData(data), (data: any) => setTotalElements(data), page, axiosResourceInstance.current);
            }
        }

    };

    useEffect(()=>{
        columnGenerate();
    },[])

    useEffect(() => {
        getTableData();
    }, [sortedField,direction,page,size,props.listId,props.trigger,searchTrigger]);


    const onClickRow = (record: any) => {
        return {
            onClick: () => {
                setSelectedRowId(record && record.__ref__ && record.__ref__.__id__ ? record.__ref__.__id__ : '')
            },
        };
    }

    const setRowClassName = (record: any) => {

        return record && record.__ref__ && record.__ref__.__id__
            ? (record.__ref__.__id__ === selectedRowId ? 'clickRowStyl' : '')
            : '';
    }

    if (columnState===undefined){
        return <div>Loading</div>;
    }

    const handleDownloadXls = () => {
        setXlsDownloading(true);
        if(axiosInstance.current != null){
            const FileDownload = require('js-file-download');
            axiosInstance.current({
                url: process.env.REACT_APP_API_BASE_URL + '/resource/' + props.apiUrl + '/xls/',
                method: 'POST',
                responseType: 'blob',
                data: queryModel
            }).then((response) => {
                FileDownload(response.data, props.apiUrl + '-' + new Date().toISOString().split('.')[0] + '.xls');
            }).catch(function (error: any) {
                console.log(error);
            }).finally(() => setXlsDownloading(false));
        }
    }

    const handleDocumentumDownload = (key : number) => {

        setDownloading(true);

        let documentType: string = "xls";

        if(key==2)
        {
            documentType = "csv";
        }
        else if (key==3)
        {
            documentType = "pdf";
        }
        else if (key==4)
        {
            documentType = "edi";
        }

        if(axiosInstance.current != null){
            const FileDownload = require('js-file-download');
            axiosInstance.current({
                url: process.env.REACT_APP_API_BASE_URL + '/resource/' + props.apiUrl + '/'+documentType,
                method: 'POST',
                responseType: 'blob',
                data: queryModel
            }).then((response) => {
                FileDownload(response.data, props.apiUrl + '-' + new Date().toISOString().split('.')[0] + '.'+documentType);
                setSearchTrigger(prevState => !prevState);
            }).catch(function (error: any) {
                console.log(error);
            }).finally(
                () => setDownloading(false)
            );
        }
    }

    const handleChange = (pagination: any, filters: any, sorter: any) => {
        sortChangeHandle(sorter);
        setFilteredInfo(filters);
    };

    const clearFilters = () => {

        Object.keys(queryModel).forEach(key => {
           if(queryModel[key] != null){
               queryModel[key] = null;
           }
        });

        actFilters.clear();
        setIsAnyFilterOnTable(false);
        setFilteredInfo(null)
        setPage(1);
        setSearchTrigger(prevState => !prevState);
    };

    return(
        <>
            <Row gutter={24}>
                <Col span={24} style={{marginBottom:10}}>
                    {props.allowBackButton && props.allowBackButton == true && props.backUrl ?
                        <span style={{cursor: "pointer", fontSize: "large", marginRight: 10}}>
                            <Link to={props.backUrl}>
                                <LeftOutlined/><Trans>Vissza</Trans>
                            </Link>
                        </span>
                        : <></>
                    }
                    {props.tableHeader}
                    <Tooltip placement="topLeft" title={<Trans>Clear all filters</Trans>}>
                        <Button
                            onClick={() => clearFilters()}>
                            {isAnyFilterOnTable
                                ? <FilterFilled style={{color: '#1890ff'}} />
                                : <FilterOutlined style={{color: '#1890ff'}} />
                            }

                        </Button>
                    </Tooltip>
                    {props.allowExport && props.allowExport == true
                        ?
                        <Button
                            loading={xlsDownloading}
                            onClick={() => handleDownloadXls()}
                            style={{float: "right"}}
                            >
                            <FileExcelOutlined />
                            <span><Trans>Excel Export</Trans></span>
                        </Button>
                        :<></>
                    }
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <Table
                        style={{height:"100%"}}
                        title={props.title}
                        dataSource={data}
                        onRow={value => onClickRow(value)}
                        rowClassName={value => setRowClassName(value)}
                        bordered
                        summary={props.summary}
                        pagination={
                            props.pagination==="Off"? false:{
                                total:totalElements,
                                pageSize:size,
                                onChange: (page : any) => setPage(page),
                                showSizeChanger:true,
                                pageSizeOptions: ["5","10","15","20","50","100"],
                                current:page,
                                onShowSizeChange:(current,pageSize)=>setSize(pageSize),
                            }
                        }
                        columns={columnState}
                        onChange={(pagination : any,filters : any,sorter : any)=> {
                            handleChange(pagination, filters, sorter);
                        }}
                        scroll={props.scroll}
                    />
                    {props.trigger}
                </Col>
            </Row>
        </>
    );
}

export default DtoTable;
