import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DxDataGridModule, DxSelectBoxModule, DxButtonModule } from 'devextreme-angular';

import { CheltuieliComponent } from './components/cheltuieli/cheltuieli.component';
import { VenituriComponent } from './components/venituri/venituri.component';

@NgModule({
  declarations: [
    AppComponent,
    CheltuieliComponent,
    VenituriComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DxButtonModule,
    DxDataGridModule,
    DxSelectBoxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
