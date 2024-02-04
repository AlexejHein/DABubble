import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/User.class';
import { UserService } from 'src/app/services/user.service';
import { FocusService } from '../services/focus.service';
import { DialogUserComponent } from '../dialog-user/dialog-user.component';
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
  user = new User();
  
  

  constructor(public dialog: MatDialog,
    private userService: UserService,
    public dialogRef: MatDialogRef<DialogUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private focusService: FocusService
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

onNoClick(): void {
  this.dialogRef.close();
}

sendMessage(selectedUser: User): void {
  console.log("selected user test: ", selectedUser);
  this.userService.setSelectedUser(selectedUser);
  this.dialog.closeAll();
  this.focusService.triggerFocusMessageInput();
}

}
