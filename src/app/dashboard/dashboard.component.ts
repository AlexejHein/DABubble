import { Component } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => active', [ 
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(500, style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('move', [
     
    ])
 ]
})
export class DashboardComponent {
  workspaceMenuVisible = true;
  threadVisible = true;
  moveLeft = "";
  moveRight = "";
  menuString = "schließen";

  constructor() {

  }

  closeWorkspaceMenu() {
    if(this.workspaceMenuVisible == true) {
      this.workspaceMenuVisible = false;
      this.menuString = "öffnen";
      this.moveLeft = "moveleft";
    }
    else {
      this.workspaceMenuVisible = true;
      this.menuString = "schließen";
      this.moveLeft = "";
    }
  }

  closeThread() {
    if(this.threadVisible == true) {
      this.threadVisible = false;
      this.moveRight = "moveright";
    }
    else {
      this.threadVisible = true;
      this.moveRight = "";
    }
  }


}
