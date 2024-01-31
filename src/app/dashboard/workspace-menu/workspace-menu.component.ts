import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-workspace-menu',
  templateUrl: './workspace-menu.component.html',
  styleUrls: ['./workspace-menu.component.scss']
})
export class WorkspaceMenuComponent implements OnInit{
userListState = true;
channelListState = true;
userListClass = "open";
channelListClass = "open";
isInputVisible = false;

constructor(public dialog: MatDialog, private workspaceService: WorkspaceService) {

}

ngOnInit(){
}

  openUserList() {
    if(this.userListState) {
      this.userListState = false;
      this.userListClass = "close";
    }
    else {
      this.userListState = true;
      this.userListClass = "open";
    }
  }

  openChannelList() {
    if(this.channelListState) {
      this.channelListState = false;
      this.channelListClass = "close";
    }
    else {
      this.channelListState = true;
      this.channelListClass = "open";
    }
  }

  addChannel() {
    this.dialog.open(DialogAddChannelComponent);
  }

  addMessage() {
    this.workspaceService.addMessageClicked();

  }
}
