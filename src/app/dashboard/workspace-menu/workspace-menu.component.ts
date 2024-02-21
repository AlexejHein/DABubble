import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DashboardComponent} from "../dashboard.component";

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
readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
    .pipe(
      tap(value => {}),
      distinctUntilChanged()
    );

    Breakpoints = Breakpoints;
    currentBreakpoint:string = '';

constructor(public dialog: MatDialog,
            private workspaceService: WorkspaceService,
            private breakpointObserver: BreakpointObserver,
            private dashboard: DashboardComponent) {

}

ngOnInit(){
  this.breakpoint$.subscribe(() =>
  this.breakpointChanged()
);
}
private breakpointChanged() {
  if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
    this.currentBreakpoint = Breakpoints.Large;
  } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
    this.currentBreakpoint = Breakpoints.Medium;
  } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
    this.currentBreakpoint = Breakpoints.Small;
  } else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
    this.currentBreakpoint = '(min-width: 500px)';
  }
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
    this.dialog.open(DialogAddChannelComponent , {
      autoFocus: false
    });
  }

  addMessage() {
    this.workspaceService.addMessageClicked();
    this.dashboard.clearHeader();
  }
}
