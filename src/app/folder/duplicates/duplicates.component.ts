import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Table } from '../model/Table';


class EntireData
{
  buildingName: string;
  rooms : any;
}
@Component({
  selector: 'app-duplicates',
  templateUrl: './duplicates.component.html',
  styleUrls: ['./duplicates.component.scss'],
})
export class DuplicatesComponent implements OnInit {
  showSpinner:boolean = false;
  duplicate = [];
  distinctDuplicates=[];
  showResults:boolean = false;
  constructor(private dataService: DataServiceService) { }
  allData=[];
  ngOnInit() {
    this.showSpinner= true;
    this.dataService.getBuildings().subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let buildingId=doc.id;
        let buildingData = doc.data();
        let buildingName=buildingData['BuildingName'];
        this.dataService.getRooms(buildingId).subscribe((ss) => {
          ss.docs.forEach((doc) => {
            let roomInfo = new EntireData();
            roomInfo.buildingName = buildingName;
            roomInfo.rooms = doc.data();
            this.allData.push(roomInfo);
           
          }
          )
        });
        this.showSpinner= false;
        this.findDuplicates(this.allData,'vcNo');
      });
    });
  }
  runEngine()
  {  
    this.showSpinner= true;
    this.findDuplicates(this.allData,'vcNo');
    this.showResults=true;
  }

findDuplicates(allData: any[], arg1: string) {
  
  this.duplicate = [];
  var map = new Map();
  this.allData.forEach((room) => {
    if(room.rooms.vcNo!="" && map.get(room.rooms.vcNo))
    {
      this.duplicate.push(room);
      this.duplicate.push(map.get(room.rooms.vcNo));
    }
    map.set(room.rooms.vcNo,room);
  });
  this.distinctDuplicates = this.duplicate.filter(
    (thing, i, arr) => arr.findIndex(t => t.buildingName+t.rooms.roomNo === thing.buildingName+thing.rooms.roomNo) === i
  );
  this.showSpinner= false;
}
}


