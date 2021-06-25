import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RowHeightCache } from '@swimlane/ngx-datatable';
import { DataServiceService } from '../data-service.service';
import { LoadingController, Platform } from '@ionic/angular';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
class Row{
  roomNo: string;
  buildingName:string;
  vcNo: string;
  stbNo: string;
  amount: number;
}
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  allReports =[];
  cols=[];
  rows=[];
  newEntryMonth: string = "";
  newEntryYear:number;
  showSpinner:boolean = false;
  displayMonth:string = "";
  // Constants
  monthCodes = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  monthValues = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAYAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  pdfObj = null;
  @ViewChild('content') content: ElementRef;
  constructor(private dataService: DataServiceService,private platform:Platform) {
    this.cols=[
      {prop:'roomNo',name:'Room No'},
      {prop:'buildingName',name:'Building Name'},
      {prop:'vcNo',name:'Vc No'},
      {prop:'stbNo',name:'Stb No'},
      {prop:'amount',name:'Amount'}
    ];
   }

  ngOnInit() {
    this.showSpinner=true;
    let date = new Date();
    let cMonth = date.getMonth();
    this.newEntryYear = date.getFullYear();
    this.newEntryMonth = this.monthCodes[cMonth];
    this.displayMonth = this.monthValues[cMonth];
    this.dataService.getBuildings().subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let buildingData = doc.data();
        let buildingKey=doc.id;
        let report={
          "buildingName": buildingData['BuildingName'],
          "rows": [],
          "sum":0
        }
        
        this.dataService.getRooms(buildingKey).subscribe((snapshot) => {
          snapshot.forEach((doc) => {
            let roomData = doc.data();
            let row =new Row();
            row.vcNo = roomData['vcNo'];
            row.stbNo = roomData['stbNo'];
            row.roomNo= roomData['roomNo'];
            let amounts=roomData['currentAmount'];
            row.amount=amounts[this.newEntryMonth+this.newEntryYear];
            if(row.amount){
              report.sum = report.sum + row.amount;}
            report.rows=report.rows.concat(row);
          });
          this.allReports.push(report);
          this.showSpinner=false;
    });
  });
  });
}
public captureScreen()
{
var data = document.getElementById('Html2Pdf');    
    html2canvas(data).then(canvas => {    
      // Few necessary setting options    
      var imgWidth = 208;     
      var pageHeight = 295;      
      var imgHeight = canvas.height * imgWidth / canvas.width;    
      var heightLeft = imgHeight;    
    
      const contentDataURL = canvas.toDataURL('image/png')    
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF    
      var position = 0;    
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)    
  
      pdf.save('report.pdf'); // Generated PDF     
          });  
}
}

//   public captureScreen()  
//   {  
//      var node = document.getElementById('Html2Pdf');
//               var img;
//               var filename;
//               var newImage;
//               domtoimage.toPng(node, { bgcolor: '#fff' })

//                 .then(function(dataUrl) {

//                   img = new Image();
//                   img.src = dataUrl;
//                   newImage = img.src;

//                   img.onload = function(){

//                   var pdfWidth = img.width;
//                   var pdfHeight = img.height;

//                     // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image

//                     var doc;

//                     if(pdfWidth > pdfHeight)
//                     {
//                       doc = new jsPDF('l', 'px', [pdfWidth , pdfHeight]);
//                     }
//                     else
//                     {
//                       doc = new jsPDF('p', 'px', [pdfWidth , pdfHeight]);
//                     }


//                     var width = doc.internal.pageSize.getWidth();
//                     var height = doc.internal.pageSize.getHeight();


//                     doc.addImage(newImage, 'PNG',  10, 10, width, height);
//                     filename = 'mypdf_' + '.pdf';
//                     doc.save(filename);

//                   };


//                 })
//                 .catch(function(error) {

//                  // Error Handling

         
//   });
// }

