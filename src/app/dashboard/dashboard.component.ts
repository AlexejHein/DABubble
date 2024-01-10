import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/animations';
import { UserService } from '../services/user.service';
import { User} from "../models/User.class";
import { Subscription } from "rxjs";
import { MessagesService } from "../services/messages.service";
import { Message } from "../models/message.class";
import { Channel } from '../models/channel.class';
import { ThreadsService } from '../services/threads.service';
import { DialogEditChannelComponent } from '../dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { docData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Firestore, doc, addDoc, collectionData } from '@angular/fire/firestore';
import { Thread } from '../models/thread.class';
import { DialogUserComponent} from "../dialog-user/dialog-user.component";

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
  selectedChannel: Channel | null = null;
  channelId:any/* = 'rt2NJeozgOCVDrlvy2hw'*/;
  channel: Channel = new Channel();
  allUsers: User[] = [];
  thread = new Thread();
  @ViewChild('myScrollContainer') private myScrollContainer: ElementRef | undefined;
  showReactions = false;
  hoveredIndex:any;


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
      this.selectedChannel = null;
      this.loadMessages();
    });
     this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
      this.selectedChannel = channel;
      this.selectedUser = null;
      this.channelId = this.selectedChannel!.id;
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
      setTimeout(() => this.scrollToBottom(), 0);
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

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  saveMessage() {
    if (this.currentUserId && this.selectedUser && this.message.body.trim() !== '') {
      this.message.user = this.currentUserId;
      this.message.toUser = this.selectedUser.id;
      this.message.createdAt = new Date();
      this.messagesService.saveMessage(this.message).then(() => {
        console.log('Message saved successfully');
        this.message.body = '';
        setTimeout(() => this.scrollToBottom(), 0); // Scroll to bottom with a delay after saving a message

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

  openThread(){
    this.threadVisible = true;
    this.moveRight = "";
  }


  editChannel() {
    let threadCollection = collection(this.firestore, 'channels');
    let threadDoc = doc(threadCollection, this.channelId);

    docData(threadDoc).subscribe((channel) => {

      this.channel = new Channel(channel);
      this.saveEditedChannel(this.channel, this.channelId);

    });

  }

  saveEditedChannel(channel:any, channelId:any){
    if(this.dialog.openDialogs.length==0){
    let dialog = this.dialog.open(DialogEditChannelComponent, {
      width: '100%'
  });
    dialog.componentInstance.channel = new Channel(this.channel.toJSON());
    dialog.componentInstance.channelId = this.channelId;
    console.log("thread to edit:", this.selectedChannel);
}
  }

  saveThread() {
    this.thread.authorId = this.currentUserId;
    this.thread.toChannel = this.channelId;
    addDoc(collection(this.firestore, 'threads'), this.thread.toJSON()).then(r => console.log(r));
  }

  addEmoticon(emoticon: string) {
    this.message.body = (this.message.body || '') + emoticon;
  }


  showEmoticonMenu(i:number): void {
    this.hoveredIndex=i;
  }

  chosen:any
  userProfile(){
    console.log("userProfiel");
  }
  selectEmo(emoticon: string){
    this.showReactions=true;
    this.chosen=emoticon;
  }

  openDialog(user: any): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '250px', // oder eine andere geeignete Größe
      data: user // Übergeben Sie hier die Benutzerdaten
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Der Dialog wurde geschlossen');
      // Weitere Aktionen nach dem Schließen des Dialogs
    });
  }
}
