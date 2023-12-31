import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserMenuComponent } from './user-menu/user-menu.component';
import  { UserService } from '../../services/user.service';
import { AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit{

  currentUserId: string | null | undefined;
  currentUserDetails: any;


  constructor(public dialog: MatDialog,
              private userService: UserService,
              private authService: AuthService
) {}

  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      if(this.currentUserId) {
        this.userService.getUserDetails(this.currentUserId).subscribe(userDetails => {
          this.currentUserDetails = userDetails;
        });
      }
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });
  }

  logoutUser(){
    if (this.userService.currentUser){
      this.authService.logout().then(r => {});
    }else {
      console.log('No user is logged in');
    }
  }

  openDialog(){
    this.dialog.open(UserMenuComponent, {
      height: '600px',
      width: '500px',
      position:{
        top: '126px',
        right: '50px',
      }
    });
  }

}
