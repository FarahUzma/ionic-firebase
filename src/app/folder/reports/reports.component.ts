import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Dropdown } from '../model/Dropdown';
import { Table } from '../model/Table';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
    rows = [];
      columns=[];
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
  'OCY',
  'NOV',
  'DEC',
];
 //Data
 sum:number = 0;
 tablestyle = 'bootstrap';
 buildingsDropdown: Dropdown[] = [];
 roomsDropdown: Dropdown[] = [];
 monthsDropdown: Dropdown[] = [];
 currentMonth:string = "";
 currentAmount: number = -1;
 selectedBuildingId: string;
 selectedRoomId: string;
 newEntryAmount: number = 0;
 newEntryMonth: string = "";
 newEntryYear:number;
 buildingName:string;

 // UI
 showSpinner: boolean = false;
 isBuildingSelected: boolean = false;
 isRoomSelected:boolean = false;
 currentAmountFetchInProgress: boolean = false;
 creatingNewEntryInProgress: boolean = false;
 clear: boolean = false;
 showSuccessOrFail: boolean = true;
 checkCurrentAmount: boolean = true;
 enableAddEntryButton: boolean = false;
 enableSearch: boolean = false;
  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.columns=[
      {prop:'roomNo',name:'Room No'},
      {prop:'buildingName',name:'Building Name'},
      {prop:'vcNo',name:'Vc No'},
      {prop:'stbNo',name:'Stb No'},
      {prop:'amount',name:'Amount'}
    ];
    this.showSpinner=true;
    this.dataService.getBuildings().subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let buildingData = doc.data();
        this.buildingsDropdown.push({
          key: doc.id,
          value: buildingData['BuildingName'],
        });
        this.showSpinner=false;
      });
    });
    let date = new Date();
    let cMonth = date.getMonth();
    this.newEntryYear = date.getFullYear();
    this.newEntryMonth = this.monthCodes[cMonth];
    for (let i=0; i<3; i++)
      this.monthsDropdown.push({key: this.monthCodes[cMonth+i], value: this.monthCodes[cMonth+i]})
  }

  onBuildingSelected(event) {
    this.roomsDropdown = [];
    this.selectedBuildingId = event.key;
    this.buildingName = event.value;
    this.selectedRoomId = "";
    this.isBuildingSelected = true;
    this.enableSearch=true;
    
  }
  currentMonthChanged(event) {
    this.newEntryMonth = event;
    this.enableSearch=true;
  }
  search(event)
  {this.showSpinner = true;
    this.sum=0;
    this.rows=[];
    this.dataService.getRooms(this.selectedBuildingId).subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let roomData = doc.data();
        let record = new Table();
        record.roomNo=roomData['roomNo'];
        record.buildingName=this.buildingName;
        record.vcNo=roomData['vcNo'];
        record.stbNo=roomData['stbNo'];
        let amounts=roomData['currentAmount'];
        record.amount=amounts[this.newEntryMonth+this.newEntryYear];
        if(record.amount){
        this.sum = this.sum + record.amount;}
        this.rows=this.rows.concat(record);
        this.showSpinner = false;
      });
    });
  }
}
