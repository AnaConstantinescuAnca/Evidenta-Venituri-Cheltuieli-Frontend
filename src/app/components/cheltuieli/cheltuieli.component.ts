import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { lastValueFrom, Subscription } from 'rxjs';
import { Mesaj } from 'src/app/model/mesaj';
import { MessageService } from 'src/app/service/message.service';

const URL = 'http://localhost:8080';

@Component({
  selector: 'app-cheltuieli',
  templateUrl: './cheltuieli.component.html',
  styleUrls: ['./cheltuieli.component.css']
})

export class CheltuieliComponent implements OnInit, OnDestroy {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  cheltuieliSource: any;
  cheltuialaTip = [{ tip: 'TRANSPORT' }, { tip: 'GASTRONOMIE' }, { tip: 'CASA' }, { tip: 'TAXE' }, { tip: 'ALTELE' }];
  statusec: string[];
  message?: Mesaj | null;
  subscription!: Subscription;

  constructor( private http: HttpClient, private mesajService: MessageService){
    this.statusec = ['Toate', 'TRANSPORT','GASTRONOMIE','CASA','TAXE','ALTELE'];
   }
   
   ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.subscription = this.mesajService.curentMessage.subscribe(msg => this.message = msg);

    // ********* Aduc cheltuieli din backend
    // this.http.get(URL + '/cheltuieli').subscribe(response => {
    //   this.cheltuieliSource = response;
    //   //console.log(this.cheltuieliSource);
    // });
    this.cheltuieliSource = ({

      // load: async () => {
      //   try {
      //     let mesaj = new Mesaj()
      //     mesaj.method = "GET";
      //     mesaj.url = `${URL}/cheltuieli`;
      //     mesaj.data = null;
      //     this.newMessage(mesaj);
      //     //this.logRequest("GET", URL + '/venituri', null);
      //     return await lastValueFrom(this.http.get(`${URL}/cheltuieli`));
      //   } catch {
      //     throw 'BackEnd error !';
      //   }
      // },
      load: () => this.sendRequest(`${URL}/cheltuieli`, 'GET'),
      insert: (values: any) => this.sendRequest(`${URL}/cheltuieli`, 'POST', {
        values: JSON.stringify(values)

      }),
      update: (key: any, values: any) => this.sendRequest(`${URL}/cheltuieli/${key.id}`, 'PATCH', {
        key,
        values: JSON.stringify(values)
      }),
      remove: (key: any) => this.sendRequest(`${URL}/cheltuieli/${key.id}`, 'DELETE', {
        key
      })
    });
  }

  addRow() {
    this.dataGrid.instance.addRow();
  }

  selectStatus(data: { value: string; }) {
    if (data.value == 'Toate') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['tip', '=', data.value]);
    }
  }

  requests: string[] = [];
  sendRequest(url: string, method = 'GET', data: any = {}): any {

    const httpParams = new HttpParams({ fromObject: data });
    const httpOptions = { withCredentials: false, body: httpParams };

    let result: any;
    let mesaj = new Mesaj()

    switch (method) {
      case 'GET':
        result = this.http.get(url, httpOptions);

        mesaj.method = "GET";
        mesaj.url = `${URL}/cheltuieli/`;
        break;
      case 'POST':
        data = JSON.parse(data.values);
        delete data.__KEY__;
        result = this.http.post(url, data, httpOptions);

        mesaj.method = "POST";
        mesaj.url = `${URL}/cheltuieli`;
        mesaj.data = JSON.stringify(data);
        mesaj.key=' ';
        break;
      case 'PATCH':
        //console.log(data);
        result = this.http.patch(url, JSON.parse(data.values), httpOptions);
        
        mesaj.method = "PATCH";
        mesaj.url = `${URL}/cheltuieli/`;
        mesaj.data = data.values;
        mesaj.key = data.key.id;
        break;
        case 'DELETE':
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

