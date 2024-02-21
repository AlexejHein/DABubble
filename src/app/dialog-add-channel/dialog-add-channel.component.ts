import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { Channel } from '../models/channel.class';
import { Firestore, addDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from "../models/User.class";
import { UserService } from '../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddChannelAddUserComponent } from '../dialog-add-channel-add-user/dialog-add-channel-add-user.component';
import { ThreadsService } from '../services/threads.service';



@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent implements OnInit, OnDestroy {

  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserName: string | null = "";
  currentUserDetails: any;

  firestore: Firestore = inject(Firestore);

  channel = new Channel();
  loading = false;

  constructor(private userService: UserService,
    protected threadService: ThreadsService,
    public  dialog: MatDialog,){

  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
    }).catch(error => {
      console.error("Error getting current Author ID:", error);
    });

    this.userService.getCurrentUserName().then(name => {
      this.currentUserName = name;
    }).catch(error => {
      console.error("Error getting current Author Name:", error);
    });
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }

  saveThread(){
  this.channel.authorId = this.currentUserId;
  this.channel.authorName = this.currentUserName;
  this.loading = true;
  this.channel.users = [this.currentUserId!];
  addDoc(collection(this.firestore, 'channels'), this.channel.toJSON()).then(docRef => {
    this.channel.id =  docRef.id;
  });

  this.loading = false;
    this.addUserToChannel(this.channel,this.channel.id);
    this.threadService.setSelectedChannel(this.channel);
  }


  addUserToChannel(channel:any, newChannelId:any){
    if(this.dialog.openDialogs.length==1){
    let dialog = this.dialog.open(DialogAddChannelAddUserComponent, {
      width: '100%'
  });
    dialog.componentInstance.channel = new Channel(this.channel.toJSON());
    dialog.componentInstance.channelId = newChannelId;
   }
  }
}
