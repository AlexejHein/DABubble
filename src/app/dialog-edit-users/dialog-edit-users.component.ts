import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, docData, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../models/channel.class';
import { UserService } from '../services/user.service';
import { User } from '../models/User.class';
import { Subscription } from "rxjs";
import { ThreadsService } from '../services/threads.service';
import { DialogUserProfileComponent } from '../dialog-user-profile/dialog-user-profile.component';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

@Component({
  selector: 'app-dialog-edit-users',
  templateUrl: './dialog-edit-users.component.html',
  styleUrls: ['./dialog-edit-users.component.scss']
})
export class DialogEditUsersComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  private subscription: Subscription | null = null;
  channel: Channel = new Channel();
  channelId:any = '';
  selectedChannel: Channel | null = null;
  channelUsers: any[] = [];
  selectedUser:  User | null = null;
  selectedUserId: any = "";
  allUsers: User[] = [];
  items$!: Observable<any[]>;
  currentUserId: string = "";
  channelUserId: any = "";

  constructor(private userService: UserService,
    public dialog: MatDialog,
    private threadsService: ThreadsService) {}

  async ngOnInit(): Promise<void> {

    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      console.log("All Users:", this.allUsers);
    });

    this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
      this.selectedChannel = channel;
      this.selectedUser = null;
      this.channelUsers = this.selectedChannel!.users;
      this.channelId = this.selectedChannel!.id;
    });

    const aCollection = collection(this.firestore, 'users');
    this.items$ = collectionData(aCollection, { idField: 'id' });

    this.items$.subscribe((users) => {
      this.userService.getCurrentUserId().then((id) => {
        if (id != null) {
          this.currentUserId = id;
          this.userService.setUserOnline(id, true).then(r => {}); // assuming such a method exists
        }
        this.allUsers = [
          users.find(user => user.id === this.currentUserId),
          ...users.filter(user => user.id !== this.currentUserId)
        ].filter(Boolean);
      });
    });
  }

  
  saveUserToChannel() {
    const coll = doc(this.firestore, 'channels', this.channelId);
    updateDoc(coll, {users: this.channel.users}).then(r => console.log(r));
  }


  showUserInChannel(usersId:any){
    let indexChecked = this.channelUsers.indexOf(usersId);
    if(indexChecked > -1){
    return true;
    }
    else {
      return false;
    }
  }

  openUserProfile(selectedUser: User): void {
    this.channelUserId  = selectedUser.id;

    this.dialog.open(DialogUserProfileComponent, {
      height: '600px',
      width: '500px',
  });
  this.onSelecteChannelUserId(this.channelUserId);
  }

  onSelecteChannelUserId(channelUserId:any) {
    this.userService.getSelectedUserId(channelUserId);
  }

  addUserToChannel() {
    let threadCollection = collection(this.firestore, 'channels');
    let threadDoc = doc(threadCollection, this.channelId);
    this.dialog.closeAll();
    docData(threadDoc).subscribe((channel) => {

      this.channel = new Channel(channel);
      this.saveUsersToChannel(this.channel, this.channelId);

    });

  }

  saveUsersToChannel(channel:any, channelId:any){
    if(this.dialog.openDialogs.length==1){
    let dialog = this.dialog.open(DialogAddUserComponent, {
      width: '100%'
  });
    dialog.componentInstance.channel = new Channel(this.channel.toJSON());
    dialog.componentInstance.channelId = this.channelId;
}
  }


}
