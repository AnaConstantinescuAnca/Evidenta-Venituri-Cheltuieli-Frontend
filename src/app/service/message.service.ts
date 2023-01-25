import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mesaj } from '../model/mesaj';

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private mesaj: Mesaj = new Mesaj();
  private messageSource = new BehaviorSubject<Mesaj | null>(this.mesaj);
  curentMessage = this.messageSource.asObservable();
  // message: Mesaj;

  // private messageSource = new BehaviorSubject("Default message");
  // curentMessage = this.messageSource.asObservable();

  constructor() {

    // this.message = new Mesaj("Service", "message.service",null);
    // this.messageSource = new BehaviorSubject<Mesaj>(this.message);
    // this.curentMessage = this.messageSource.asObservable();

   }

  changeMessage(msg: Mesaj){

    this.messageSource.next(msg);
  }
}
