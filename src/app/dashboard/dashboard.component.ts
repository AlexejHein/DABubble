import { Component, OnInit } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { UserService } from '../services/user.service';
import {User} from "../models/User.class";
import {Subscription} from "rxjs";
import {MessagesService} from "../services/messages.service";
import {Message} from "../models/message.class";
import { Thread } from '../models/thread.class';
import { ThreadsService } from '../services/threads.service';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { docData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Firestore, doc, addDoc, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(500, style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ]),
    trigger('move', [

    ])
 ]
})
export class DashboardComponent implements OnInit {
  workspaceMenuVisible = true;
  threadVisible = true;
  moveLeft = "";
  moveRight = "";
  menuString = "schließen";
  menuState = "";
  user: string | undefined | null = "";
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserAvatar: string | undefined = "";
  private subscription: Subscription | null = null;
  selectedUser:  User | null = null;
  messages: Message[] = [];
  message: any = {};
  selectedThread: Thread | null = null;
  threadId:any = 'BXwTdTZRtd7Da9jpo2ey';
  thread: Thread = new Thread();
  allUsers: User[] = [];


  constructor(private userService: UserService,
              private threadsService: ThreadsService,
              private messagesService: MessagesService,
              public dialog: MatDialog,
              private firestore: Firestore) {}


  async ngOnInit(): Promise<void> {
    this.userService.getUsers().subscribe(users => {
      this.allUsers = users;
      console.log("All Users:", this.allUsers);
    });
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      console.log("Current User ID:", this.currentUserId);
    }).catch(error => {
      console.error("Error getting current user ID:", error);
    });
    this.userService.getUsers().subscribe(users => {
      this.currentUser = users.find(user => user.id === this.currentUserId);
      if (this.currentUser) {
        this.user = this.currentUser.name;
        this.currentUserAvatar = this.currentUser.avatar;
      }
    });
    this.subscription = this.userService.selectedUser.subscribe(user => {
      this.selectedUser = user;
      this.selectedThread = null;
      this.loadMessages();
    });
    this.subscription = this.threadsService.selectedThread.subscribe(thread => {
      this.selectedThread = thread;
      this.selectedUser = null;
    });
  }


  loadMessages() {
    this.messagesService.getMessages().subscribe(data => {
      const allMessages = data.map(e => {
        const payloadData = e.payload.doc.data() as any;
        const message: Message = {
          id: e.payload.doc.id,
          ...payloadData
        };
        if (payloadData.createdAt && payloadData.createdAt.seconds) {
          message.createdAt = new Date(payloadData.createdAt.seconds * 1000);
        }
        return message;
      });
      this.messages = this.filterMessages(allMessages);
    });
  }


  filterMessages(messages: any[]) {
    return messages.filter(m => {
      const isFromCurrentUser = m.user as unknown as undefined === this.currentUserId;
      const isToCurrentUser = m.toUser as unknown as undefined === this.currentUserId;
      const isFromSelectedUser = this.selectedUser ? m.user as unknown as undefined === this.selectedUser.id : false;
      const isToSelectedUser = this.selectedUser ? m.toUser as unknown as undefined === this.selectedUser.id : false;
      return (isFromCurrentUser || isToCurrentUser) && (isFromSelectedUser || isToSelectedUser);
    });
  }


  saveMessage() {
    if (this.currentUserId && this.selectedUser && this.message.body.trim() !== '') {
      this.message.user = this.currentUserId;
      this.message.toUser = this.selectedUser.id;
      this.message.createdAt = new Date();
      this.messagesService.saveMessage(this.message).then(() => {
        console.log('Message saved successfully');
        this.message.body = '';
      }).catch(error => {
        console.error('Error saving message:', error);
      });
    } else {
      console.error('No current user ID or selected user available, or message is empty');
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  closeWorkspaceMenu() {
    if(this.workspaceMenuVisible) {
      this.workspaceMenuVisible = false;
      this.menuString = "öffnen";
      this.menuState = "closed";
      this.moveLeft = "moveleft";
    }
    else {
      this.workspaceMenuVisible = true;
      this.menuString = "schließen";
      this.menuState = "";
      this.moveLeft = "";
    }
  }


  closeThread() {
    if(this.threadVisible) {
      this.threadVisible = false;
      this.moveRight = "moveright";
    }
    else {
      this.threadVisible = true;
      this.moveRight = "";
    }
  }


  editChannel() {
    let threadCollection = collection(this.firestore, 'threads');
    let threadDoc = doc(threadCollection, this.threadId);

    docData(threadDoc).subscribe((thread) => {

      this.thread = new Thread(thread);
      console.log('Current thread', this.thread);
      console.log(this.thread.title)
    });
    this.saveEditedChannel(this.thread, this.threadId);
  }

  saveEditedChannel(thread:any, threadId:any){
    let dialog = this.dialog.open(DialogEditChannelComponent, {
      width: '100%'
  });
    dialog.componentInstance.thread = new Thread(this.thread.toJSON());
    dialog.componentInstance.threadId = this.threadId;
    console.log("thread to edit:", this.selectedThread);
  }

  addEmoticon(emoticon: string) {
    // Füge das ausgewählte Emoticon zum Nachrichtentext hinzu
    this.message.body = (this.message.body || '') + emoticon;
  }
}
