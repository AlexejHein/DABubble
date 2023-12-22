import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserMenuComponent } from './user-menu/user-menu.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {

  constructor(public dialog: MatDialog) {}

  openDialog(){
    this.dialog.open(UserMenuComponent);
  }

}
