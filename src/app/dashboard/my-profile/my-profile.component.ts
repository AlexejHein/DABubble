import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserMenuComponent } from './user-menu/user-menu.component';
import  { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit{

  currentUserId: string | null | undefined;
  currentUserDetails: any;


  constructor(public dialog: MatDialog,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      if(this.currentUserId) {
        this.userService.getUserDetails(this.currentUserId).subscribe(userDetails => {
          this.currentUserDetails = userDetails;
          console.log("Current User Details:", this.currentUserDetails);
        });
      }
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });
  }


  openDialog(){
    this.dialog.open(UserMenuComponent);
  }

}
