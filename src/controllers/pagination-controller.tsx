import { AxiosInstance, AxiosResponse } from 'axios';

const paginationController = (
    query : any,
    url : string,
    size : number,
    direction: string,
    sortedField : string,
    setData :(data : any) => void,
    SetTotalElement:(data :  any) => void,
    pagination : number,
    axiosInstance: AxiosInstance) => {

    let page = pagination-1;

    axiosInstance.post(url+'/page', {

        query:query,
        start:  page,
        length: size,
        direction:direction,
        sorted_field:sortedField

    })
        .then(function (response : AxiosResponse<any>)
        {
            setData(response.data.data);
            SetTotalElement(response.data.totalElements);
        })
        .catch(function (error: any) {
            console.log(error);//TODO::EndIt
        });

}
export default paginationController;
