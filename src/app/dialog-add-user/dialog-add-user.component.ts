import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Channel } from '../models/channel.class';
import { UserService } from '../services/user.service';
import { User } from '../models/User.class';
import { Subscription } from "rxjs";
import { ThreadsService } from '../services/threads.service';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  private subscription: Subscription | null = null;
  channel: Channel = new Channel();
  channelId:any = '';
  selectedChannel: Channel | null = null;
  channelUsers: any[] = [];
  selectedUser:  User | null = null;
  selectedUserId: any = "";
  allUsers: User[] = [];
  filteredAllUsers: any[] = [];
  items$!: Observable<any[]>;
  currentUserId: string = "";
  channelUserId: any = "";
  loadChannelUsers: any[] = [];
  selUserId: any;

  constructor(private userService: UserService,
    public dialog: MatDialog,
    private threadsService: ThreadsService) {
      this.filteredAllUsers = this.allUsers;

    }

  async ngOnInit(): Promise<void> {

    this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
      this.selectedChannel = channel;
      this.selectedUser = null;
      this.channelUsers = this.selectedChannel!.users;
      this.channelId = this.selectedChannel!.id;
      this.loadChannelUsers = this.selectedChannel!.users;
      console.log('selected channel list of users: ', this.loadChannelUsers);
    });

    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
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

filterResults(text: string) {
  if (!text) {
    this.filteredAllUsers = this.allUsers;
    return;
  }

  this.filteredAllUsers = this.allUsers.filter(
    allUsers => allUsers?.name.toLowerCase().includes(text.toLowerCase())
  );
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

addUserToChannel(usersId:any) {
  //const coll = doc(this.firestore, 'channels', this.channelId);
 // updateDoc(coll, {users: this.channel.users}).then(r => console.log(r));
 this.loadChannelUsers.push(usersId);
 console.log('neue channelUsers:',  this.loadChannelUsers);
}

removeUserFromChannel(usersId:any) {
  let channelUserIndex = this.loadChannelUsers.indexOf(usersId);
  this.loadChannelUsers.splice(channelUserIndex, 1);
  console.log('neue channelUsers:',  this.loadChannelUsers);
}

saveUsersToChannel() {
  const coll = doc(this.firestore, 'channels', this.channelId);
  this.channel.users = this.loadChannelUsers;
    updateDoc(coll, {users: this.channel.users}).then(r => console.log(r));
}


}
