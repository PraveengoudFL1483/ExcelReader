import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/Services/excel.service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
@Component({
  selector: 'app-delivery-report',
  templateUrl: './delivery-report.component.html',
  styleUrls: ['./delivery-report.component.css']
})
export class DeliveryReportComponent implements OnInit {

  constructor(private excelservice: ExcelService) { }

  isExport: boolean = false;
  sheetData: [][];
  finalData: any[] = [];
  //firsheet declaration
  TempoLogs: any[] = [];
  afterRemovingDuplicates: any[] = []
 
  ngOnInit() {
  }
  reloadPage(){
    window.location.reload();
  }
 
  onFileChange(event: any, step: string='') {
    const target: DataTransfer = <DataTransfer>(event.target)
    if (target.files.length !== 1) {
      throw new Error("please select single file");
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname]
      this.sheetData = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      //console.log("final data");
      // console.log(this.finalData)
      // console.log("new single array")
      this.finalData = this.arrToObject(this.sheetData)
      //console.log(this.finalData)
      
        this.removeUnwantedColumns(this.finalData)
     
    }
    reader.readAsBinaryString(target.files[0])

  }
  //create JSON object from 2 dimensional Array
  arrToObject(arr) {
    //assuming header
    var keys = arr[0];
    //vacate keys from main array
    var newArr = arr.slice(1, arr.length);
    var formatted = [],
      data = newArr,
      cols = keys,
      //finding columns
      lc = cols.length;
    for (var i = 0; i < data.length; i++) {
      var singledata = data[i],
        obj = {};
      for (var j = 0; j < lc; j++)
        obj[cols[j]] = singledata[j];
      formatted.push(obj);
    }
    return formatted;
  }


  //step1 removing unwanted columns
  removeUnwantedColumns(exceltoJson) {
    //console.log("full data")
    //console.log(exceltoJson)
    var Requiredlist = exceltoJson;
    for (var m in Requiredlist) {
      delete Requiredlist[m]['Hours']
      delete Requiredlist[m]['Work date']
      delete Requiredlist[m]['User Account ID']
      delete Requiredlist[m]['Team']
      delete Requiredlist[m]['Period']
      delete Requiredlist[m]['Account Name']
      delete Requiredlist[m]['Account Lead ID']
      delete Requiredlist[m]['Account Category']
      delete Requiredlist[m]['Account Category']
      delete Requiredlist[m]['Account Customer']
      delete Requiredlist[m]['Activity Name']
      delete Requiredlist[m]['Component']
      delete Requiredlist[m]['All Components']
      delete Requiredlist[m]['Version Name']
      delete Requiredlist[m]['Project Key']
      delete Requiredlist[m]['Project Name']
      delete Requiredlist[m]['Epic']
      delete Requiredlist[m]['Work Description']
      delete Requiredlist[m]['Reporter ID']
      delete Requiredlist[m]['External Hours']
      delete Requiredlist[m]['Billed Hours']
      delete Requiredlist[m]['Issue Original']
      delete Requiredlist[m]['Estimate']
      delete Requiredlist[m]['Issue Remaining ']
      delete Requiredlist[m]['Estimate']
      delete Requiredlist[m]['Capitalization']
      delete Requiredlist[m]['Account Customer']
      delete Requiredlist[m]['Issue Original Estimate']
      delete Requiredlist[m]['Issue Remaining Estimate']
      delete Requiredlist[m]['Activity Name']
      delete Requiredlist[m]['Account Key']
    }
    /* console.log("required data")
    console.log(Requiredlist) */
   // this.epicLinkRequired(Requiredlist)
    this.epicLinkRequired2(Requiredlist)

  }

  /*step2 removeving rows if epiclink column is having 
  "Daily Stand Up" || "Project Management" || "Training and Onboarding"
  */
  /* epicLinkRequired(Requiredlist: any[]) {
    var epicList = JSON.parse(JSON.stringify(Requiredlist))
    let notDailyarr = epicList.filter(a => (a["Epic Link"].trim().toLowerCase() !== 'daily stand up'))
    let notProjectarr = notDailyarr.filter(a => (a["Epic Link"].trim().toLowerCase() !== "project management"))
    let notTrainingndOnboard = notProjectarr.filter(a => (a["Epic Link"].trim().toLowerCase() !== "training and onboarding"))
    let notProductteamarr = notTrainingndOnboard.filter(a => (a["Epic Link"].trim().toLowerCase() !== "product team meetings/demos/documentation"))
    let notTimeDailyarr = notProductteamarr.filter(a => (a["Epic Link"].trim().toLowerCase() !== "[time coding] daily stand up"))
    let notTimeProjectarr = notTimeDailyarr.filter(a => (a["Epic Link"].trim().toLowerCase() !== "[time coding] project management"))
    let finalarr = notTimeProjectarr.filter(a => (a["Epic Link"].trim().toLowerCase() !== "[time coding] training and onboarding"))
   // console.log("Final Array")
    //console.log(finalarr)
    this.replaceIssueKey(finalarr)
  } */

  epicLinkRequired2(Requiredlist: any[]){
   // let epicList = JSON.parse(JSON.stringify(Requiredlist))
     var finalarr = [];
     finalarr = _.cloneDeep(Requiredlist);

    for(var m = 0 ; m < finalarr.length; m ++){
      var data = finalarr[m]["Epic Link"] //.trim().toLowerCase(); undefined
      if(data != undefined ){
        if(data != null &&  data != ''){
          var str = data.toLowerCase().trim();
       /*  if(m==260||m==261||m==262||m==263){
          var str = data.toLowerCase().trim();
         } */
         if(str.includes("time coding") ||
           str.includes("daily stand up") ||
           str.includes("project management") ||
           str.includes("training and onboarding") ||
           str.includes("product team meetings/demos/documentation")){

             finalarr.splice(m,1)
            m = m - 1
        }
      } 
     }
    }
    this.replaceIssueKey(finalarr)
  }



  /*step3 : replacing Issue key with Parent Key if Issue Type is Sub-Task 
  and adding empty string to the three columns
  Issue summary,Issue Status,Issue Type*/
  replaceIssueKey(finalarr: any[]) {
    var ReplaceParentKeyArr = finalarr
    for (var i = 0; i < ReplaceParentKeyArr.length; i++) {
      if (ReplaceParentKeyArr[i]["Issue Type"] == "Sub-task") {
        ReplaceParentKeyArr[i]["Issue Key"] = ReplaceParentKeyArr[i]["Parent Key"]
        ReplaceParentKeyArr[i]["Issue summary"] = ""
        ReplaceParentKeyArr[i]["Issue Status"] = ""
        ReplaceParentKeyArr[i]["Issue Type"] = ""
      }
    }
   console.log("replace parent key array")
   console.log(ReplaceParentKeyArr)

    this.TempoLogs = JSON.parse(JSON.stringify(ReplaceParentKeyArr))
    //this.groupByKeyNdName(this.TempoLogs)
    this.RemovingDplctsBasedOnKey(this.TempoLogs)
  }
 /*  Step4 : prepairing delivery report (removing duplicate from tempolog based on issue key)*/
  RemovingDplctsBasedOnKey(tempo: any[]) {
    var deeptempo = JSON.parse(JSON.stringify(tempo))
   // var uniqueresult = _.uniqBy(deeptempo, v => [v['Issue Key'], v['Full name']].join());
    var uniqueresult = _.uniqBy(deeptempo,'Issue Key');
    this.afterRemovingDuplicates = this.RemoveColumnsforuniqresult(uniqueresult);
    console.log("after removing duplicates")
    console.log(this.afterRemovingDuplicates)
    this.isExport = true
  }
 
  RemoveColumnsforuniqresult(uniqueresult: any[]) {
    for (var f in uniqueresult) {
      // delete pvtData[f]['Full name']
       uniqueresult[f]['Customer'] =  uniqueresult[f]['Epic Link']; //replacing epik link with customer name
       delete  uniqueresult[f]['Epic Link'];
       delete uniqueresult[f]['Full name']
       delete uniqueresult[f]["Parent Key"] //deleting Parent Key after adding into issukey
    }
    //uniqueresult.splice(1, 0, 'blue') 
    uniqueresult.push({'Delivery Tix':''})
    uniqueresult.push({'Priority':''})
    /* uniqueresult.push({'Status':''}) */
   // uniqueresult.push({'Expected Date of Production / Completion':''})
   // uniqueresult.push({'Comments':''})
    return this.SwappingMethod(uniqueresult)
    //return this.sort_by_key(uniqueresult,'Customer')
  }
   SwappingMethod(arraydata:any){
    
   var data =  arraydata.map(function(x) {
      return {
              'Customer': x.Customer,
             'Delivery Tix':x["Delivery Tix"],
             'Issue Key':x["Issue Key"],
             'Issue summary':x["Issue summary"],
             'Issue Type':x["Issue Type"],
             'Priority':x["Priority"],
             'Issue Status':x["Issue Status"],
            }
       });
       data.push({'Expected Date of Production / Completion':''})
       data.push({'Comments':''})
      return this.sort_by_key(data,'Customer')
   }
  //swap array indexs
  swapArrayLocs(arr, index1, index2) {
    var temp = arr[index1];
  
    arr[index1] = arr[index2];
    arr[index2] = temp;
  }
 /*  this.isExport = true afterRemovingDuplicates*/
  //array sorting by fullname name
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

    //export to excel
    ExporttoExcel() {
      this.excelservice.exportAsExcelFilefrDeliveryReport(this.afterRemovingDuplicates,"DeliveryReport")
    }
  
}
