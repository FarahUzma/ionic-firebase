import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Building } from './model/Building';
import { AngularFirestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  constructor(private httpClient: HttpClient,public db: AngularFirestore) { }

  getBuildings() {
    return this.db.collection('buildings').get();
  }

  getRooms(buildingKey:string){
    return this.db.collection('buildings/'+ buildingKey +'/rooms', ref => {
      return ref
        .orderBy('sNo')
    }).get();
  }

  getAllLogs(buildingId:string, roomId:string, ) {
    return this.db.collection('buildings/'+ buildingId +'/rooms/' + roomId + '/cable_logs').get();
  }

  /**
  * Get current amount of the room
  */
  getCurrentAmountOfRoom(buildingId, roomId): Observable<any> {
     return this.db
     .collection("buildings" + "/" + buildingId + "/" + "rooms")
     .doc(roomId)
     .get();
   }

   /**
   * Create a new log entry for a given room in build
   */
   createNewLogEntryForRoom(buildingId, roomId, amount, month) {
      return this.db.collection("buildings" + "/" + buildingId + "/" + "rooms" + "/" + roomId + "/" + "cable_logs")
      .add({
        amount: amount,
        month: month,
        created: new Date()
      });
   }

   /**
    * Update current amount to the room
    */
    updateCurrentAmount(buildingId, roomId, amount, month, year) {
      let monthKey = month + year;
       return this.db.collection("buildings" + "/" + buildingId + "/" + "rooms").doc(roomId)
       .set({
         currentAmount: {
           [monthKey]: amount
         },
       }, { merge: true });
    }

    /**
    * Update current amount to the room
    */
     modifyInfo(buildingId, roomId, vcNo, stbNo) {
       return this.db.collection("buildings" + "/" + buildingId + "/" + "rooms").doc(roomId)
       .set({
         vcNo:vcNo,
         stbNo:stbNo
       }, { merge: true });
    }
}
