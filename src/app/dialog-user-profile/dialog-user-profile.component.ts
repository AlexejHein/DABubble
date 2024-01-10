import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-dialog-user-profile',
  templateUrl: './dialog-user-profile.component.html',
  styleUrls: ['./dialog-user-profile.component.scss']
})
export class DialogUserProfileComponent implements OnInit{

  selectedUser: any;
  selectedUserId: any;
  selecteChannelUserId: any;
  selectedUserDetails: any;
  startEdit=false;
  
  

  constructor(public dialog: MatDialog,
    private userService: UserService,
) {}

ngOnInit(): void {
/*  this.userService.getSelectedUserId().then(id => {
    this.selectedUserId = id;
    this.userService.getUserDetails(this.selectedUserId).subscribe(userDetails => {
      this.selectedUserDetails = userDetails;
   });
  }); */
  
  this.userService.selecteChannelUserId$.subscribe((value) => {
    this.selecteChannelUserId = value;
    this.selectedUserId = value;
    this.userService.getUserDetails(this.selectedUserId).subscribe(userDetails => {
      this.selectedUserDetails = userDetails;
   });

  });


  
}

}
