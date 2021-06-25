import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';

interface Dropdown {
  key: string;
  value: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogComponent implements OnInit {
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

  // UI
  isBuildingSelected: boolean = false;
  isRoomSelected:boolean = false;
  currentAmountFetchInProgress: boolean = false;
  creatingNewEntryInProgress: boolean = false;
  clear: boolean = false;
  showSuccessOrFail: boolean = true;
  checkCurrentAmount: boolean = true;
  enableAddEntryButton: boolean = false;

  constructor(private dataService: DataServiceService) {}

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
    this.selectedRoomId = "";
    this.isBuildingSelected = true;

    this.dataService.getRooms(this.selectedBuildingId).subscribe((snapshot) => {
      snapshot.forEach((doc) => {
        let roomData = doc.data();
        this.roomsDropdown.push({ key: doc.id, value: roomData['roomNo'] });
      });
    });
  }

  roomNumberSelected(event) {
    this.selectedRoomId = event.key;
    this.isRoomSelected = true;
    this.fetchCurrentAmountForRoom(
      this.selectedBuildingId,
      this.selectedRoomId,
      this.newEntryMonth,
      this.newEntryYear
    );
  }

  currentMonthChanged(event) {
    this.newEntryMonth = event;
    this.fetchCurrentAmountForRoom(
      this.selectedBuildingId,
      this.selectedRoomId,
      this.newEntryMonth,
      this.newEntryYear
    );
  }

  fetchCurrentAmountForRoom(buildingId, roomId, month, year) {
    this.currentAmountFetchInProgress = true;
    this.dataService
      .getCurrentAmountOfRoom(buildingId, roomId)
      .subscribe((snapshot) => {
        let cAmountObj = snapshot.data().currentAmount;
        this.currentAmount = cAmountObj[month + year] || 0;
        this.currentAmountFetchInProgress = false;
      });
  }

  newEntryAmountEntered(event) {
    let newAmount = Number(event);
    if (newAmount > 0) {
      this.newEntryAmount = newAmount;
      this.enableAddEntryButton = true;
    } else {
      this.enableAddEntryButton = false;
    }
  }

  addNewEntryLog(event) {
    this.creatingNewEntryInProgress = true;
    let updatedAmount = this.currentAmount + this.newEntryAmount;
    this.dataService
      .createNewLogEntryForRoom(
        this.selectedBuildingId,
        this.selectedRoomId,
        this.newEntryAmount,
        this.newEntryMonth
      )
      .then((docRef) => {
        this.dataService
          .updateCurrentAmount(
            this.selectedBuildingId,
            this.selectedRoomId,
            updatedAmount,
            this.newEntryMonth,
            this.newEntryYear
          )
          .then(() => {
            this.creatingNewEntryInProgress = false;
            this.currentAmount = updatedAmount;
            this.newEntryAmount = 0;
          });
      });
  }
}
