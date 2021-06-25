import { Component, OnInit } from '@angular/core';
import { DataTableColumnDirective } from '@swimlane/ngx-datatable';
import { Key } from 'selenium-webdriver';
import { DataServiceService } from '../data-service.service';
import { Table } from '../model/Table';
interface Dropdown {
  key: string;
  value: string;
}
class AllRooms{
  id : string;
  content:any;
}
@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
//Data
buildingsDropdown: Dropdown[] = [];
roomsDropdown: Dropdown[] = [];
monthsDropdown: Dropdown[] = [];
currentMonth:string = "";
clearText:string="";
currentAmount: number = -1;
selectedBuildingId: string;
selectedRoomId: string;
vcNo: string = "";
stbNo: string = "";
newEntryYear:number;
allRooms:Array<AllRooms> =[];
showResults:boolean = false;
isdone:boolean = false;
disableFields:boolean = true;
showSpinner: boolean = false;
// UI
isBuildingSelected: boolean = false;
isRoomSelected:boolean = false;
clear: boolean = false;
showSuccessOrFail: boolean = true;
checkCurrentAmount: boolean = true;
enableModifyButton: boolean = false;
roomVcNoMap: Map<string,Table> = new Map([]);

constructor(private dataService: DataServiceService) {}

ngOnInit() {
  this.showSpinner = true;
  this.dataService.getBuildings().subscribe((snapshot) => {
    snapshot.forEach((doc) => {
      let buildingData = doc.data();
      this.buildingsDropdown.push({
        key: doc.id,
        value: buildingData['BuildingName'],
      });
      this.showSpinner = false;
    });
  });
}
refresh(event)
{
  this.roomVcNoMap.clear();
  this.allRooms=[];
  this.dataService.getRooms(this.selectedBuildingId).subscribe((ss) => {
    ss.docs.forEach((doc) => {
      let roomData = new AllRooms();
      roomData.content=doc.data();
      roomData.id=doc.id;
      this.allRooms.push(roomData);
    
      if(this.allRooms.length==ss.docs.length)
      {
        this.allRooms.sort((a, b) => (a.content.sNo > b.content.sNo) ? 1 :  -1 )
        for(let room of this.allRooms)
        {
          let t = new Table();
          t.vcNo = room.content.vcNo;
          t.stbNo = room.content.stbNo;
          this.roomVcNoMap.set(room.id,t);
          this.roomsDropdown.push({
            key: room.id,
            value: room.content.roomNo,
          });
        }
        this.showSpinner = false;
      }
    }
    )
  });
}
onBuildingSelected(event) {
  this.disableFields=true;
  this.isdone= false;
  this.showResults = false;
  this.vcNo = "";
  this.stbNo="";
  this.roomsDropdown = [];
  this.allRooms=[];
  this.selectedBuildingId = event.key;
  this.selectedRoomId = "";
  this.isBuildingSelected = true;
  this.roomVcNoMap.clear();
  this.showSpinner = true;
  this.enableModifyButton=false;
  this.dataService.getRooms(this.selectedBuildingId).subscribe((ss) => {
    ss.docs.forEach((doc) => {
      let roomData = new AllRooms();
      roomData.content=doc.data();
      roomData.id=doc.id;
      this.allRooms.push(roomData);
    
      if(this.allRooms.length==ss.docs.length)
      {
        this.allRooms.sort((a, b) => (a.content.sNo > b.content.sNo) ? 1 :  -1 )
        for(let room of this.allRooms)
        {
          let t = new Table();
          t.vcNo = room.content.vcNo;
          t.stbNo = room.content.stbNo;
          this.roomVcNoMap.set(room.id,t);
          this.roomsDropdown.push({
            key: room.id,
            value: room.content.roomNo,
          });
        }
        this.showSpinner = false;
      }
    }
    )
  });
}

roomNumberSelected(event) {
  this.disableFields=true;
  this.showSpinner = true;
  this.isdone= false;
  this.vcNo = "";
  this.stbNo="";
  this.selectedRoomId = event.key;
  this.showResults = true;
  this.enableModifyButton=true;
  let info = new Table();
  info = this.roomVcNoMap.get(this.selectedRoomId);
  this.vcNo = info.vcNo;
  this.stbNo = info.stbNo;
  this.showSpinner = false;
}
enableModificationFeilds(event)
{
  this.disableFields=false;
}
newVcNo(event) {
  this.vcNo=event;
}
newStbNo(event) {
  this.stbNo=event;
}
ModifyEntry(event) {
  this.showSpinner = true;
  this.dataService
      .modifyInfo(
        this.selectedBuildingId,
        this.selectedRoomId,
        this.vcNo,
        this.stbNo
      )
      .then(() => {
        this.isdone= true;
        this.showSpinner = false;
        let event=
        {
          key:this.selectedBuildingId
        }
        this.refresh(event);
        
      });
 

}

}
