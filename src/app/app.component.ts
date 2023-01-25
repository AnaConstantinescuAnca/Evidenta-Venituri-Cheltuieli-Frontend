import { Component, OnInit, OnDestroy } from '@angular/core';
import { formatDate } from 'devextreme/localization';
import { Subscription } from 'rxjs';
import { Mesaj } from './model/mesaj';
import { MessageService } from './service/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{

  title = 'EV-VENITURI-CHELTUIELI-V1';
  
  message?: Mesaj | null;
  subscription!: Subscription;

  requests: string[] = [];

  constructor(private mesajService: MessageService) { }

  ngOnInit(): void {

    this.subscription = this.mesajService.curentMessage.subscribe(msg => {this.message = msg;
      this.requests.unshift(
        [msg!.time, msg!.method,
          `${msg!.url}${msg!.key}`, msg!.data].join(' '));
    });
  }
  ngOnDestroy(): void {

    this.subscription.unsubscribe();

  }

  clearRequests() {
    this.requests = [];
  }
  /* nu este utilizat */
  // logRequest(method: string, url: string, data: any) {

  //   //const args = Object.keys(data || {}).map((key) => `${key}=${data[key]}`).join(' ');
  //   const time = formatDate(new Date(), 'HH:mm:ss');

  //   // this.requests.unshift([time, method, url.slice(URL.length), args].join(' '));
  //   this.requests.unshift([time, method, url].join(' '));

  // }
}
