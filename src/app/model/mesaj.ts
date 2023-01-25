import { formatDate } from "devextreme/localization";


export class Mesaj{

    time: string = formatDate(new Date(), 'HH:mm:ss')
    method: string = 'BackEnd Address';
    url: string = 'http://localhost:8080';
    data:any;
    key:string='';
}