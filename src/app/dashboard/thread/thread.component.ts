import {ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Thread} from 'src/app/models/thread.class';
import {ThreadsService} from '../../services/threads.service';
import {UserService} from '../../services/user.service';
import {User} from "../../models/User.class";
import {MessagesService} from "../../services/messages.service";
import {Message} from "../../models/message.class";
import {Reaction} from "../../models/reaction.class";
import {collection, collectionData, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {arrayUnion} from 'firebase/firestore';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  private subscription: Subscription | null = null;
  selectedThread: any;
  allThreads: any[] = [];
  allThreadsFiltered: any[] = [];
  currentThread: any;
  thread = new Thread();
  threadId: any;
  selectedThreadId: any;
  selectedThreadAuthorId: any;
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserAvatar: string | undefined = "";
  user: string | undefined | null = "";
  allUsers: User[] = [];
  selectedUser:  User | null = null;
  messages: Message[] = [];
  allMessages: any[] = [];
  message: any = {};
  messageId: any;
  threadMessages: any[] = [];
  @ViewChild('myScrollContainer') private myScrollContainer: ElementRef | undefined;
  showReactions = false;
  hoveredIndex:any;
  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  uploadedFileInfo: any;
  tooltipVisible = false;
  tooltipVisibleMap = new Map<string, boolean>();

  constructor(  private userService: UserService,
    protected threadsService: ThreadsService,
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef,
    private fireStorage: AngularFireStorage) {
}


ngOnInit(): void {
  this.userService.getUsers().subscribe(users => {
    this.allUsers = users;
  });
  this.userService.getCurrentUserId().then(id => {
    this.currentUserId = id;
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
  this.subscription = this.threadsService.selectedThread.subscribe(thread => {
    if (thread) {
      this.selectedThread = thread;
      this.threadMessages = this.selectedThread.messages;
    }
  });

  const threadCollection = collection(this.firestore, 'threads');
  this.items$ = collectionData(threadCollection, { idField: 'id' });

  this.items$.subscribe((threads) => {
    this.allThreads = threads;
    this.allThreads.sort((a, b) => a.createdAt - b.createdAt);

    const currentThread = this.allThreads.find(thread => thread.id === this.selectedThread?.id);

    if (currentThread) {
      this.threadMessages = currentThread.messages;
    }
  });
  const messageCollection = collection(this.firestore, 'messages')
  this.items$ = collectionData(messageCollection, { idField: 'id' });
  this.items$.subscribe((messages) => {
    this.allMessages = messages;
    });
    this.subscription = this.userService.selectedUser.subscribe(user => {
      this.selectedUser = user;
      this.loadMessages();
    });
  this.items$.subscribe((messages) => {
    this.allMessages = messages;
    this.allMessages.sort((a, b) => a.createdAt - b.createdAt);
    this.messages = messages;
  });

}

saveMessage(thread:any) {
  if (this.message.body.trim() !== '') {
    if (this.uploadedFileInfo) {
      // If an image is uploaded, include its information in the message body
      this.message.body = this.uploadedFileInfo.url;
      this.uploadedFileInfo = null; // Reset uploaded file information
    }

    this.message.user = this.currentUserId;
    //this.message.toUser = this.selectedUser.id;
    this.message.createdAt = new Date();
    this.message.toThread = thread.id;
    this.messagesService.saveMessage(this.message).then(() => {
      this.message.body = '';
      this.updatethreadMessages(thread, this.message);

    }).catch(error => {
      console.error('Error saving message:', error);
    });
  } else {
    console.error('No current user ID or selected user available, or message is empty');
  }
}

updatethreadMessages(thread:any, message:any){
      const coll = doc(this.firestore, 'threads', thread.id);
      //Add message ID to thread messages
      updateDoc(coll, {messages: arrayUnion(message.id)}).then(r => {});
    }

  loadMessages() {
    this.messagesService.getMessages().subscribe(data => {
      let allMessages = data.map(e => {
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
    });
  }

  selectCurrentThread(threadId: any) {
    if (threadId && this.selectedThread) {
      return threadId === this.selectedThread.id;
    } else {
      return false;
    }
  }


selectCurrentThreadAuthor(userId:any, thread:any){
  this.selectedThreadAuthorId = thread.authorId;
  return userId === this.selectedThreadAuthorId;
  }

messageSelectedToThread(messageId:any){
  let indexChecked = this.threadMessages.indexOf(messageId);
  return indexChecked > -1;
}

chosen:any
  hideEmoticonMenu = signal<any | null>(null);
  isUploading: boolean = false;
  selectEmo(emoticon: string, messageId: string) {
    const messageExists = this.messages.some(message => message.id === messageId);
    if (!messageExists) {
      console.error(`Nachricht mit der ID ${messageId} existiert nicht in 'this.messages'`);
      return;
    }
    const messageToUpdate = this.messages.find(message => message.id === messageId);
    const newReaction: Reaction = {
      emoji: emoticon,
      userId: this.currentUserId ?? ''
    };
    if (!messageToUpdate!.reactions) {
      messageToUpdate!.reactions = [newReaction];
    } else {
      const existingReactionIndex = messageToUpdate!.reactions.findIndex(
        reaction => reaction.userId === this.currentUserId && reaction.emoji === emoticon
      );
      if (existingReactionIndex !== -1) {
        messageToUpdate!.reactions.splice(existingReactionIndex, 1);
      } else {
        messageToUpdate!.reactions.push(newReaction);
      }
    }
    this.saveUpdatedMessage(messageToUpdate!);
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
  }).catch(error => {
    console.error("Fehler beim Aktualisieren der Nachricht:", error);
  });
}

showEmoticonMenu(i:number): void {
  this.hoveredIndex=i;
  this.changeDetector.detectChanges();
}

async upload(event:any){
    this.isUploading = true;
  const file = event.target.files[0];

  if(file){
    const path=`messageImage/${file.name}`
    const uploadTask=  await this.fireStorage.upload(path,file)
    const url = await uploadTask.ref.getDownloadURL()
    this.uploadedFileInfo = {
      name: file.name,
      url: url
    };
    this.message.body= this.uploadedFileInfo.name
  }
  this.isUploading = false;
}


async uploadPDF(event: any) {
    this.isUploading = true;
  try {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const path = `messagePDF/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
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
  this.isUploading = false;
}

isImage(url: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
}

isPDF(url: string): boolean {
  return url.toLowerCase().includes('.pdf');
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

  addEmoticon(emoticon: string) {
    this.message.body = (this.message.body || '') + emoticon;
  }

}
