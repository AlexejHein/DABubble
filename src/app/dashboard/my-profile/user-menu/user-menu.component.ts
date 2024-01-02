import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit{

  currentUserId: any;
  currentUserDetails: any;
  startEdit=false;

  constructor(public dialog: MatDialog,
    private userService: UserService,
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


  edit(){
   this.startEdit=true;
  }
}
