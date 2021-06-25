import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FolderPageRoutingModule } from './folder-routing.module';
import { FolderPage } from './folder.page';
import { AddComponent } from './add/add.component';
import { SearchComponent } from './search/search.component';
import { BrowserModule } from '@angular/platform-browser';
import { LogComponent } from './log/log.component';
import { AllLogsComponent } from './all-logs/all-logs.component';
import { ReportsComponent } from './reports/reports.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BillComponent } from './bill/bill.component';
import { DuplicatesComponent } from './duplicates/duplicates.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [
    FolderPage,
    AddComponent,
    SearchComponent,
    LogComponent,
    AllLogsComponent,
    ReportsComponent,
    BillComponent,
    DuplicatesComponent
  ]
})
export class FolderPageModule {}
