import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from '../../services/threads.service';
import { UserService } from '../../services/user.service';
import { User} from "../../models/User.class";
import { MessagesService } from "../../services/messages.service";
import { Message } from "../../models/message.class";
import { Reaction } from "../../models/reaction.class";
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

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
  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserAvatar: string | undefined = "";
  user: string | undefined | null = "";
  allUsers: User[] = [];
  messages: Message[] = [];
  allMessages: any[] = [];
  message: any = {};
  messageId: any;
  threadMessages: any[] = [];
 
  constructor(  private userService: UserService,
    protected threadsService: ThreadsService,
    private messagesService: MessagesService,
    private changeDetector: ChangeDetectorRef) {
}


ngOnInit(): void {
  this.subscription = this.threadsService.selectedThread.subscribe(thread => {
    if (thread) {
      this.selectedThread = thread;
      console.log("selected thread in sidebar: ",this.selectedThread);
      this.threadMessages = this.selectedThread.messages;
      console.log('messages in thread: ',this.selectedThread.messages);
    }
  });

  const threadCollection = collection(this.firestore, 'threads')		
  this.items$ = collectionData(threadCollection, { idField: 'id' });	
  this.items$.subscribe((threads) => { 
    this.allThreads = threads;
    });

    const messageCollection = collection(this.firestore, 'messages')		
  this.items$ = collectionData(messageCollection, { idField: 'id' });	
  this.items$.subscribe((messages) => { 
    this.allMessages = messages;
    });

}

selectCurrentThread(threadId:any){
if(threadId === this.selectedThread.id){
  return true;
}
else {
  return false;
}
}

messageSelectedToThread(messageId:any){
  let indexChecked = this.threadMessages.indexOf(messageId);
  return indexChecked > -1;
}


}
