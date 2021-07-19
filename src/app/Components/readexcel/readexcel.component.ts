import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/Services/excel.service';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
@Component({
  selector: 'app-readexcel',
  templateUrl: './readexcel.component.html',
  styleUrls: ['./readexcel.component.css']
})
export class ReadexcelComponent implements OnInit {

  constructor(private excelservice: ExcelService) { }

  isExport: boolean = false;
  isSprint: boolean = false;
  sheetData: [][];
  finalData: any[] = [];
  //firsheet declaration
  TempoLogs: any[] = [];
  //PivotTableData: any[] = []; for groupby
  pivotData: any[] = [];
  afterRemovingDuplicates: any[] = []
  planvsDeliveredDataa: any[] = [];

  ngOnInit() {
  }
  reloadPage(){
    window.location.reload();
  }
 
  onFileChange(event: any, step: string) {
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
      if (step === 'firstone') {
        this.removeUnwantedColumns(this.finalData)
      } else {
        this.sprintFile(this.finalData)
      }
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
    //this.epicLinkRequired(Requiredlist)
    this.epicLinkRequired2(Requiredlist)

  }

  /*step2 removeving rows if epiclink column is having 
  "Daily Stand Up" || "Project Management" || "Training and Onboarding" || "TIMECODE"
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
       var data = finalarr[m]["Epic Link"] //.trim().toLowerCase();
       if(data != undefined){
        if(data != null &&  data != ''){
         var str = data.toLowerCase().trim();
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
   // console.log("replace parent key array")
   // console.log(ReplaceParentKeyArr)

    this.TempoLogs = JSON.parse(JSON.stringify(ReplaceParentKeyArr))
    //this.groupByKeyNdName(this.TempoLogs)
    this.RemovingDplctsBasedOnNamendKey(ReplaceParentKeyArr)
  }
 /*  Step4 : prepairing pivot table (removing duplicate from tempolog and unwanted columns)*/
  RemovingDplctsBasedOnNamendKey(tempo: any[]) {
    var deeptempo = JSON.parse(JSON.stringify(tempo))
    var uniqueresult = _.uniqBy(deeptempo, v => [v['Issue Key'], v['Full name']].join());
    this.afterRemovingDuplicates = JSON.parse(JSON.stringify(uniqueresult));
   // console.log("after removing duplicates")
    //console.log(this.afterRemovingDuplicates)
    this.isSprint = true
    // this.groupbyName(uniqueresult)
    var deepPvtData = JSON.parse(JSON.stringify(this.afterRemovingDuplicates))
    this.pivotData = this.sort_by_key(this.RemoveColumnsforpivotTable(deepPvtData), "Full name")
   // console.log("pivot data")
   // console.log(this.pivotData)
  }
  RemoveColumnsforpivotTable(pvtData: any[]) {
    for (var f in pvtData) {
      // delete pvtData[f]['Full name']
      delete pvtData[f]['Parent Key']
      delete pvtData[f]['Epic Link']
      delete pvtData[f]['Issue summary']
    }
    return pvtData;
  }

  //array sorting by fullname name
  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  /* groupbyName(uniqueresult: any[]) {
    var deepuniqueresult = JSON.parse(JSON.stringify(uniqueresult))
    var PivotTable = _.groupBy(deepuniqueresult, function (record) {
      return record['Full name'];
    });
    this.PivotTableData = PivotTable
    console.log("grouped Data")
    console.log(PivotTable)
    //this.dosomething(PivotTable)
  }
 */

  //step:5 read sprint plan file 
  onFileChangesprint(event: any) {
    this.onFileChange(event, 'sprint')
  }
  sprintFile(excelsprint) {
    //var sprintData = excelsprint
    var sprintData = this.sort_by_key(excelsprint, "Engineer")
    //console.log("sprint data")
    //console.log(sprintData)
    this.removeunwantedRowsfromSprint(sprintData);
  }

  removeunwantedRowsfromSprint(sprintData: any = []) {
    var filterSprintData =  []

    filterSprintData = _.filter(sprintData,(element)=>{
      return ((element["Engineer"]!=undefined ) && element["Ticket #"]!=undefined )
    })

   // console.log("sprint data after unwanted columns")
    //console.log(filterSprintData)
    this.removePlannedfromFlyinsinPivot(filterSprintData)
  }

  /* step6 : removing planned tickes from the flyins column in the temppivotdata by 
  comparing two arrays(temppivotdata and sprintplan) for plan vs delivery data */
  removePlannedfromFlyinsinPivot(filterSprintData:any[]){
    var deepfilterSprintData  = _.cloneDeep(filterSprintData);
    var pivotDataforPlanVsDeliver =JSON.parse(JSON.stringify(this.pivotData)); //temppivotdata
    var indexes = []
      for(var n=0 ; n< pivotDataforPlanVsDeliver.length ; n++){
           var name = pivotDataforPlanVsDeliver[n]["Full name"],
            IssueKey = pivotDataforPlanVsDeliver[n]["Issue Key"]
        for(var j=0 ; j< deepfilterSprintData.length ; j++){
              if(name.trim()===deepfilterSprintData[j]["Engineer"].trim()){
                if(IssueKey.trim()===deepfilterSprintData[j]["Ticket #"].trim()){
                  //if(pivotDataforPlanVsDeliver[n]["Issue Key"].trim()=="TUR-40135")
                   pivotDataforPlanVsDeliver.splice(n,1)
                   n = n-1
                   //indexes.push({index:n,nme:name,Flyin:IssueKey})
                  }
              }
              
        }
      }
      //console.log("after removing planned from flyins in temppivottable")
      //console.log(pivotDataforPlanVsDeliver)
      this.setPlanvsDelivered(deepfilterSprintData,pivotDataforPlanVsDeliver)
  }
  //step7: prepairing plan vs delivered data from  two arrays(pivotdata and sprintplan)
  setPlanvsDelivered(filterSprintData:any[],pivotDataforPlanVsDeliver:any[]){
     
      pivotDataforPlanVsDeliver.forEach((Item,index)=>{
        var obj={
          Resource: "",
          Planned: "",
          Type :"",
          Status :"",
          Planned_Delivered:"",
          Flyins: "",
          Flyins_Type: "",
          Flyins_Status: "",
          Flyins_Delivered:""
        }; 
        var SecondArrArrayIndex = filterSprintData.findIndex(x=>x["Engineer"] === Item["Full name"]);
       
        obj.Resource=Item["Full name"]
        obj.Flyins= Item["Issue Key"],
        obj.Flyins_Type= Item["Issue Type"],
        obj.Flyins_Status= Item["Issue Status"]
   
        if(SecondArrArrayIndex!==-1){
          
         /*  if(filterSprintData[SecondArrArrayIndex]["Engineer"]==="Preethi Boienwar"){
            // if condition for debug purpose
            var plannedticket = filterSprintData[SecondArrArrayIndex]["Ticket #"]
        } */

          obj.Planned= filterSprintData[SecondArrArrayIndex]["Ticket #"];
          filterSprintData.splice(SecondArrArrayIndex,1);
        }else{
          obj.Planned = ""
        }
       
        this.planvsDeliveredDataa.push(obj);
      })

     // console.log('final plan vs deliver')
      // console.log(this.planvsDeliveredDataa)
      this.isExport = true
     
  }
 
    //export to excel
    ExporttoExcel() {
      this.excelservice.exportAsExcelFile(this.TempoLogs, this.pivotData, this.planvsDeliveredDataa ,"Report")
    }
  
}
