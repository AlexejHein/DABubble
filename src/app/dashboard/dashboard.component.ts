import { Component, OnInit } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { UserService } from '../services/user.service';
import {User} from "../models/User.class";
import {Subscription} from "rxjs";

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
export class DashboardComponent implements OnInit {
  workspaceMenuVisible = true;
  threadVisible = true;
  moveLeft = "";
  moveRight = "";
  menuString = "schließen";
  menuState = "";
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  //selectedUserId: string | null = null;
  private subscription: Subscription | null = null;
  selectedUser:  User | null = null;


  constructor(private userService: UserService) {

  }



  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      console.log("Current User ID:", this.currentUserId);
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });
    this.subscription = this.userService.selectedUser.subscribe(user => {
      this.selectedUser = user;
      console.log('Selected user:', this.selectedUser);
      console.log('Current user ID:', this.currentUserId);
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  closeWorkspaceMenu() {
    if(this.workspaceMenuVisible) {
      this.workspaceMenuVisible = false;
      this.menuString = "öffnen";
      this.menuState = "closed";
      this.moveLeft = "moveleft";
    }
    else {
      this.workspaceMenuVisible = true;
      this.menuString = "schließen";
      this.menuState = "";
      this.moveLeft = "";
    }
  }

  closeThread() {
    if(this.threadVisible) {
      this.threadVisible = false;
      this.moveRight = "moveright";
    }
    else {
      this.threadVisible = true;
      this.moveRight = "";
    }
  }


}
