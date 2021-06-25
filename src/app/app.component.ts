import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Find VC Number', url: '/folder/search', icon: 'search' },
    { title: 'Modify Info', url: '/folder/modify', icon: 'paper-plane'},
    { title: 'Log Recharge', url: '/folder/logNew', icon: 'pencil' },
    { title: 'Reports', url: '/folder/reports', icon: 'today' },
    { title: 'View All Logs', url: '/folder/allLogs', icon: 'eye' },
    
    { title: 'Print Bill', url: '/folder/bill', icon: 'receipt' },
    { title: 'Find Duplicate Vc Nos', url: '/folder/duplicates', icon: 'warning' },
  ];
  constructor() {}
}
