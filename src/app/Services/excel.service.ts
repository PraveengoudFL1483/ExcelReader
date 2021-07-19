import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(private http: HttpClient) { }

  

  //export to excel
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';

  public exportAsExcelFile(TempoLogs: any[],pivotData:any[],planvsDeliveredData:any[],excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(TempoLogs); //tempologs with duplicates
    const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(pivotData); // pivot data(tempolog without duplicates)
    const worksheet3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(planvsDeliveredData); // planvsDeliveredData
   // XLSX.utils.
    //console.log('worksheet', worksheet);
    // alert('service worksheet : '+JSON.stringify( worksheet))
    const workbook: XLSX.WorkBook = {
      Sheets: { 
          'Tempo Logs': worksheet,
          'Pivot Table': worksheet2,
          'PlannedVsDelivered': worksheet3
         }, 
         SheetNames: ['Tempo Logs','Pivot Table','PlannedVsDelivered']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportAsExcelFilefrDeliveryReport(DeliveryReport: any[],excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(DeliveryReport); //Delivery Report
    // XLSX.utils.
    //console.log('worksheet', worksheet);
    // alert('service worksheet : '+JSON.stringify( worksheet))
    const workbook: XLSX.WorkBook = {
      Sheets: { 
          'Delivery Report': worksheet
         }, 
         SheetNames: ['Delivery Report']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: this.EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + this.EXCEL_EXTENSION);
  }


}
