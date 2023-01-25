import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { formatDate } from 'devextreme/localization';
import { lastValueFrom, Subscription } from 'rxjs';
import { Mesaj } from 'src/app/model/mesaj';
import { MessageService } from 'src/app/service/message.service';

const URL = 'http://localhost:8080';

@Component({
  selector: 'app-venituri',
  templateUrl: './venituri.component.html',
  styleUrls: ['./venituri.component.css']
})
export class VenituriComponent implements OnInit, OnDestroy {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  venitData: any;
  refreshMode!: string;
  venitTip = [{ tip: 'SALARIU' }, { tip: 'DOBANDA' }, { tip: 'DIVIDENDE' }, { tip: 'ALTELE' }];
  statuses: string[];
  messageURL: string = `${URL}`;
  messageMethod: string = '';
  messageData: any;

  message?: Mesaj | null;
  //message: string ='';
  subscription!: Subscription;

  constructor(private http: HttpClient, private mesajService: MessageService) {
    this.statuses = ['Toate', 'SALARIU','DOBANDA','DIVIDENDE','ALTELE'];
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.subscription = this.mesajService.curentMessage.subscribe(msg => this.message = msg);

    // ********** Aduc venituri din backend
    // this.http.get(URL+'/venituri').subscribe(response => {
    //   this.venitSource = response;
    //   //console.log(this.venitSource);
    // });
    this.venitData = ({

      // load: async () => {
      //   try {
      //     //this.logRequest("GET", URL + '/venituri', null);
      //     // this.messageMethod = "GET";
      //     // this.messageURL = `${URL}/venituri`;
      //     // this.messageData = null;

      //     // this.mesaj ={
      //     //   url="dddd",
      //     //   method="ddddd",
      //     //   data =null
      //     // }
      //     //this.mesaj = new Mesaj("Venituri", "VenituriComponent", null);
      //     //console.log(this.mesaj);
      //     return await lastValueFrom(this.http.get(`${URL}/venituri`));
      //   } catch {
      //     throw 'BackEnd error !';
      //   }
      // },
      load: () => this.sendRequest(`${URL}/venituri`, 'GET'),
      insert: (values: any) => this.sendRequest(`${URL}/venituri`, 'POST', {
        values: JSON.stringify(values)

      }),
      update: (key: any, values: any) => this.sendRequest(`${URL}/venituri/${key.id}`, 'PATCH', {
        key,
        values: JSON.stringify(values)
      }),
      remove: (key: any) => this.sendRequest(`${URL}/venituri/${key.id}`, 'DELETE', {
        key
      })
    });
  }

  selectStatus(data: { value: string; }) {
    if (data.value == 'Toate') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['tip', '=', data.value]);
    }
  }
  // Afisez alt format la Data
  customizeDate(data: { value: any; }) {

    // return `Buget la data de: ${new DatePipe('en-US').transform(data.value, 'dd.MM.yyyy')}`;
    return `Buget la data de: ${formatDate(new Date(), 'dd.MM.yyyy')}`;
  }
  addRow() {

    //console.log(this.dataGrid.instance);
    this.dataGrid.instance.addRow();
  }

  sendRequest(url: string, method = 'GET', data: any = {}): any {

    //console.log(url);
    //this.logRequest(method, url, data);

    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { withCredentials: false, body: httpParams };

    let result: any;
    let mesaj = new Mesaj()

    switch (method) {
      case 'GET':
        result = this.http.get(url, httpOptions);

        mesaj.method = "GET";
        mesaj.url = `${URL}/venituri/`;
        //mesaj.data = null;
        break;
      case 'POST':
        data = JSON.parse(data.values);
        delete data.__KEY__;
        result = this.http.post(url, data, httpOptions);

        mesaj.method = "POST";
        mesaj.url = `${URL}/venituri`;
        mesaj.data = JSON.stringify(data);
        mesaj.key=' ';
        break;
      case 'PATCH':
        //console.log(data);
        result = this.http.patch(url, JSON.parse(data.values), httpOptions);

        mesaj.method = "PATCH";
        mesaj.url = `${URL}/venituri/`;
        mesaj.data = data.values;
        mesaj.key = data.key.id;
        //console.log('Caz metoda PUT');
        break;
        case 'DELETE':
        //result = this.http.delete(url, httpOptions);
        //console.log('Verb Delete');
        result = this.http.delete(url, httpOptions);

        mesaj.method = "DELETE";
        mesaj.url = `${URL}/venituri/`;
        //mesaj.data = null;
        mesaj.key = data.key.id;
        break;
    }

    this.newMessage(mesaj);

    return lastValueFrom(result)
      .then((data: any) => (method === 'GET' ? data : data.data))
      .catch((e) => {
        throw 'BackEnd error !'; //e && e.error && e.error.Message;
      });

    //return lastValueFrom(this.http.get(`${URL}/venituri`));
    //return result;
  }

  newMessage(msgs: Mesaj){

    //console.log(msgs);
    this.mesajService.changeMessage(msgs);

  }
}
