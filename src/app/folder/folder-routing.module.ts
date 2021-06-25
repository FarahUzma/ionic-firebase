import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { AddComponent } from './add/add.component';
import { AllLogsComponent } from './all-logs/all-logs.component';
import { BillComponent } from './bill/bill.component';
import { DuplicatesComponent } from './duplicates/duplicates.component';

import { FolderPage } from './folder.page';
import { LogComponent } from './log/log.component';
import { ReportsComponent } from './reports/reports.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'folder/modify',
    component: AddComponent
  },
  {
    path: 'folder/search',
    component: SearchComponent
  },
  {
    path: 'folder/logNew',
    component: LogComponent
  },
  {
    path: 'folder/allLogs',
    component: AllLogsComponent
  },
  {
    path: 'folder/reports',
    component: ReportsComponent
  },
  {
    path: 'folder/bill',
    component: BillComponent
  },
  {
    path: 'folder/duplicates',
    component: DuplicatesComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}

