import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../data-service.service';
import { Building } from '../model/Building';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Dropdown } from '../model/Dropdown';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {
  
  roomsInitial = []; //initialize your countriesInitial array empty
  rooms = []; //initialize your countries array empty
  buildings=[];
  copyVcNo=''
  roomNoSearchString = ''; 
  showSpinner:boolean=false;
  error:boolean=false;
  disableFields:boolean=false;
  roomChosen:boolean=false;
  showResults:boolean=false;
  vcNo: any;
  buildSelection: string;
  roomNo: string;
  buildingDataList=[];
  allRooms=[];
  roomVcNoMap: Map<string,string> = new Map([]);
  constructor( private dataService: DataServiceService,private clipboard: Clipboard,public db: AngularFirestore) {
   
  }
   ngOnInit() {
    this.showSpinner=true;
    this.disableFields=true;
    
    this.dataService.getBuildings().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        this.buildingDataList.push(doc);
      
        if(this.buildingDataList.length==ss.docs.length)
        {
          for(let build of this.buildingDataList)
          {
            let d = new Dropdown;
            d.key=build.id;
            d.value=build.data().BuildingName;
            this.buildings.push(d);
          }
          this.showSpinner=false;
          this.disableFields=false;
        }
      }
      ,
      (error) =>
       {
      this.error = true;
      this.showSpinner=false;
      }
      )
    });
  
}
  
  dataCleared()
  {
    this.roomChosen=false;
  }
   searchRoomNo(searchbar) {
    this.roomChosen=false;
    this.showResults=false;
    // reset countries list with initial call
    this.rooms = this.roomsInitial;

    // set q to the value of the searchbar
    var q = searchbar;

    // if the value is an empty string don't filter the items
    if (q.trim() == '') {
       
        this.roomChosen=false;
        return;
    }

    this.rooms = this.rooms.filter((v) => {
        if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
            return true;
        }
        return false;
    })
}
medClicked(event, item) {
  this.roomNoSearchString = item;
  this.roomChosen = true;
  this.rooms = this.rooms.filter((item) => {
  return '';
  })
  }
  buildingSelection(event)
  {
    this.roomNoSearchString = '';
    this.roomChosen=false;
    this.showResults=false;
    this.buildSelection = event.key;
    this.allRooms=[];
    this.roomsInitial =[];
    this.rooms=[];
    this.showSpinner=true;
    this.roomVcNoMap.clear();
    this.dataService.getRooms(this.buildSelection).subscribe((ss) => {
      ss.docs.forEach((doc) => {
        this.allRooms.push(doc.data());
      
        if(this.allRooms.length==ss.docs.length)
        {
          this.allRooms.sort((a, b) => (a.sNo > b.sNo) ? 1 :  -1 )
          for(let room of this.allRooms)
          {
            this.roomVcNoMap.set(room.roomNo,room.vcNo);
            this.rooms.push(room.roomNo);
          }
          this.roomsInitial = this.rooms;
          this.showSpinner=false;
          this.disableFields=false;
        }
      }
      ,
      (error) =>
       {
      this.error = true;
      this.showSpinner=false;
      }
      )
    });
  }
  search()
  {
    this.showSpinner=true;
    this.vcNo = this.roomVcNoMap.get(this.roomNoSearchString);
    
      if(!this.vcNo)
      {
        this.vcNo = "EMPTY";
      }
    this.showSpinner=false;
    this.showResults=true;
  }
 
  copyString(){
    this.copyVcNo = this.vcNo;
    this.clipboard.copy(this.copyVcNo);
  }

}
