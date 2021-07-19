import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryReportComponent } from './Components/readexcel/delivery-report/delivery-report.component';
import { ReadexcelComponent } from './Components/readexcel/readexcel.component';


const routes: Routes = [

  {path:'',component:ReadexcelComponent},
  {path:'reader',component:ReadexcelComponent},
  {path:'deliveryreport',component:DeliveryReportComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
