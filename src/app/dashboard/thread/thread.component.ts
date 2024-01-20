import {Component, OnInit, inject, signal, ChangeDetectorRef} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { UserService } from '../../services/user.service';
import { User} from "../../models/User.class";
import {Reaction} from "../../models/reaction.class";
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
 
  constructor(  private userService: UserService,
    protected threadsService: ThreadsService,
    private changeDetector: ChangeDetectorRef) {
}


ngOnInit(): void {

  this.subscription = this.threadsService.selectedThread.subscribe(thread => {
    if (thread) {
      this.selectedThread = thread;
      console.log("selected thread in sidebar: ",this.selectedThread);
    }
  });

  const aCollection = collection(this.firestore, 'threads')		
  this.items$ = collectionData(aCollection, { idField: 'id' });	
  this.items$.subscribe((threads) => { 
    this.allThreads = threads;
    });

}

selectCurrentThread(threadId:any){
  console.log('this thread id: ', this.selectedThread);
if(threadId === this.selectedThread){
  return true;
}
else {
  return false;
}
}


}
