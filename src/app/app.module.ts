import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ExcelService } from './Services/excel.service';
import { ReadexcelComponent } from './Components/readexcel/readexcel.component';
import { DeliveryReportComponent } from './Components/readexcel/delivery-report/delivery-report.component';

@NgModule({
  declarations: [
    AppComponent,
    ReadexcelComponent,
    DeliveryReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
