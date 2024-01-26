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
import { DialogUserComponent } from "../dialog-user/dialog-user.component";
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { DialogEditUsersComponent } from '../dialog-edit-users/dialog-edit-users.component';
import { FocusService } from '../services/focus.service';
import {Reaction} from "../models/reaction.class";
import { ChangeDetectorRef} from "@angular/core";
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  threadVisible = false;
  moveLeft = "";
  moveRight = "moveright";
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
  channelId:any | undefined/* = 'rt2NJeozgOCVDrlvy2hw'*/;
  channel: Channel = new Channel();
  channelUsers: any[] = [];
  usersId:any = "";
  allUsers: User[] = [];
  thread = new Thread();
  @ViewChild('myScrollContainer') private myScrollContainer: ElementRef | undefined;
  showReactions = false;
  hoveredIndex:any;
  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  uploadedFileInfo: any;
  tooltipVisible = false;
  tooltipVisibleMap = new Map<string, boolean>();

  constructor(private userService: UserService,
              private threadsService: ThreadsService,
              private messagesService: MessagesService,
              public dialog: MatDialog,
              private firestore: Firestore,
              private focusService: FocusService,
              private changeDetector: ChangeDetectorRef,
              private fireStorage: AngularFireStorage,) {}


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
      if (channel) {
        this.selectedChannel = channel;
        this.selectedUser = null;
        this.channelId = this.selectedChannel.id;
        this.channelUsers = this.selectedChannel.users;
      }
    });
    this.focusService.focusMessageInput$.subscribe(() => {
      this.focusMessageInput();
    });
    this.subscription = this.threadsService.selectedSidebarVisibility.subscribe(threadVisibility => {
      this.threadVisible = threadVisibility;
    });
    this.subscription = this.threadsService.selectedSidebarClassName.subscribe(moveClassName => {
      this.moveRight = moveClassName;
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
      if (this.uploadedFileInfo) {
        this.message.body = this.uploadedFileInfo.url;
        this.uploadedFileInfo = null;
      }
      this.message.user = this.currentUserId;
      this.message.toUser = this.selectedUser.id;
      this.message.createdAt = new Date();
      this.messagesService.saveMessage(this.message).then(() => {
        console.log('Message saved successfully');
        this.message.body = '';
        setTimeout(() => this.scrollToBottom(), 0);

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
    if (this.uploadedFileInfo) {
      this.thread.title = this.uploadedFileInfo.url;
      this.uploadedFileInfo = null; // Reset uploaded file information
    }
    this.thread.authorId = this.currentUserId;
    this.thread.toChannel = this.channelId;
    addDoc(collection(this.firestore, 'threads'), this.thread.toJSON()).then(r => console.log(r));
    this.thread.title = '';
  }

  addEmoticon(emoticon: string) {
    this.message.body = (this.message.body || '') + emoticon;
  }


  showEmoticonMenu(i:number): void {
    this.hoveredIndex=i;
    this.changeDetector.detectChanges();
  }

  chosen:any
  hideEmoticonMenu = signal<any | null>(null);
  selectEmo(emoticon: string, messageId: string) {
    this.showReactions = true;
    this.chosen = emoticon;
    const newReaction: Reaction = {
        emoji: emoticon,
        userId: this.currentUserId ?? ''
    };
    const messageToUpdate = this.messages.find(message => message.id === messageId);
    if (messageToUpdate) {
        if (!messageToUpdate.reactions) {
            messageToUpdate.reactions = [newReaction];
        } else {
            const existingReactionIndex = messageToUpdate.reactions.findIndex(
                reaction => reaction.userId === this.currentUserId && reaction.emoji === emoticon
            );
            if (existingReactionIndex !== -1) {
                messageToUpdate.reactions.splice(existingReactionIndex, 1);
            } else {
                messageToUpdate.reactions.push(newReaction);
            }
        }
        this.saveUpdatedMessage(messageToUpdate);
    } else {
        console.error("Nachricht nicht gefunden");
    }
}


  getReactionsSummary(message: Message): { emoji: string, count: number, userId?: string }[] {
    const summary = new Map<string, { count: number, userId?: string }>();

    message.reactions.forEach(reaction => {
      const existingReaction = summary.get(reaction.emoji);
      if (existingReaction) {
        existingReaction.count += 1;
      } else {
        summary.set(reaction.emoji, { count: 1, userId: reaction.userId });
      }
    });

    return Array.from(summary, ([emoji, { count, userId }]) => ({ emoji, count, userId }));
  }


  saveUpdatedMessage(message: Message) {
    this.messagesService.updateMessage(message).then(() => {
      console.log("Nachricht erfolgreich aktualisiert");
    }).catch(error => {
      console.error("Fehler beim Aktualisieren der Nachricht:", error);
    });
  }



  openDialog(user: any): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '500px',
      height: '600px',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  findUserInChannel(usersId:any) {
    let indexChecked = this.channelUsers.indexOf(usersId);
    return indexChecked > -1;
  }

  addUserToChannel() {
    let threadCollection = collection(this.firestore, 'channels');
    let threadDoc = doc(threadCollection, this.channelId);
    docData(threadDoc).subscribe((channel) => {
      this.channel = new Channel(channel);
      this.saveUserToChannel(this.channel, this.channelId);

    });

  }

  saveUserToChannel(channel:any, channelId:any){
    if(this.dialog.openDialogs.length==0){
    let dialog = this.dialog.open(DialogAddUserComponent, {
      width: '100%'
  });
    dialog.componentInstance.channel = new Channel(this.channel.toJSON());
    dialog.componentInstance.channelId = this.channelId;
}
  }

  showUsers(){
    let threadCollection = collection(this.firestore, 'channels');
    let threadDoc = doc(threadCollection, this.channelId);
    docData(threadDoc).subscribe((channel) => {
      this.channel = new Channel(channel);
      if(this.dialog.openDialogs.length==0){
        let dialog = this.dialog.open(DialogEditUsersComponent, {
          width: '100%'
      });
        dialog.componentInstance.channel = new Channel(this.channel.toJSON());
        dialog.componentInstance.channelId = this.channelId;
    }
    });

  }
  focusMessageInput(): void {
    if (this.messageInput) {
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
      }, 0);
    }
  }


  async upload(event:any){
    const file = event.target.files[0];

    if(file){
      console.log(file);
      const path=`messageImage/${file.name}`
      const uploadTask=  await this.fireStorage.upload(path,file)
      const url = await uploadTask.ref.getDownloadURL()
      console.log(url);
      this.uploadedFileInfo = {
        name: file.name,
        url: url
      };
      this.message.body= this.uploadedFileInfo.name
    }
  }


  async uploadPDF(event: any) {
    try {
      const file = event.target.files[0];

      if (file && file.type === 'application/pdf') {
        const path = `messagePDF/${file.name}`;
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        console.log(url);

        this.uploadedFileInfo = {
          name: file.name,
          url: url
        };

        this.message.body = this.uploadedFileInfo.name;
        this.thread.title= this.uploadedFileInfo.name;
      } else {
        console.error('Invalid file format. Please select a PDF file.');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  }



isImage(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const isImage = imageExtensions.some(ext => url.toLowerCase().includes(ext));

  return isImage;
}

isPDF(url: string): boolean {
  const isPDF = url.toLowerCase().includes('.pdf');

  return isPDF;
}


getPDFFileName(url: string): string {
  const decodedUrl = decodeURIComponent(url);
  const urlParts = decodedUrl.split('/');
  return urlParts[urlParts.length - 1].split('?')[0];
}

getUserName(userId: string | undefined): string {
  const user = this.allUsers.find(user => user.id === userId);
  return user ? user.name : '';
}


}
