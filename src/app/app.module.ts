import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FolderPageModule } from './folder/folder.module';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPrintModule } from 'ngx-print';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [CommonModule,BrowserModule, IonicModule.forRoot(),FolderPageModule, NgxPrintModule,
  AppRoutingModule,HttpClientModule,
  AngularFireModule.initializeApp(environment.firebase, 'cable-management'),
  AngularFirestoreModule,NgxDatatableModule ],
  providers: [Clipboard,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
