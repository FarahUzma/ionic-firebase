import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Dropdown } from '../model/Dropdown';
@Component({
  selector: 'app-all-logs',
  templateUrl: './all-logs.component.html',
  styleUrls: ['./all-logs.component.scss'],
})

export class AllLogsComponent implements OnInit {

  allLogs = [];
  buildingsDropdown:Dropdown[] = [];
  roomsDropdown:Dropdown[] = [];
  selectedBuildingId:string = "";
  selectedRoomId:string = "";
  areLogsLoading:boolean = false;

  constructor(private dataService: DataServiceService) { }

  ngOnInit() {
    this.dataService.getBuildings().subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let buildingData = doc.data();
        this.buildingsDropdown.push({
          key: doc.id,
          value: buildingData['BuildingName'],
        });
      });
    });
  }

  onBuildingSelected(event) {
    this.roomsDropdown = [];
    this.selectedBuildingId = event.key;
    this.selectedRoomId = "";

    this.dataService.getRooms(this.selectedBuildingId).subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let roomData = doc.data();
        this.roomsDropdown.push({ key: doc.id, value: roomData['roomNo'] });
      });
    });
  }

  roomNumberSelected(event) {
    this.allLogs = [];
    this.selectedRoomId = event.key;
    this.getAllLogs(this.selectedBuildingId, this.selectedRoomId);
  }

  getAllLogs(buildingId, roomId) {
    this.areLogsLoading = true;
    this.dataService.getAllLogs(buildingId, roomId).subscribe((snapshot) => {
      snapshot.forEach((data) => {
        let log = data.data();
        let logEntry = {
          amount: log['amount'],
          created: new Date(log['created'].toDate()),
          month: log['month'] || ""
        }
        this.allLogs.push(logEntry);
      });
      this.areLogsLoading = false;
    });
  }

}
