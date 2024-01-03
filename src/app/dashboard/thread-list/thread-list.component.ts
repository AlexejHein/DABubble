import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Thread } from 'src/app/models/thread.class';
import { ThreadsService } from 'src/app/services/threads.service';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  private subscription: Subscription | null = null;
  allThreads: any[] = [];
  allThreadsFiltered: any[] = [];
  thread = new Thread();
  threadId: any;
  selectedChannel: any;
  selectedChannelId: any;

  constructor(  protected threadsService: ThreadsService,) {}

  ngOnInit(): void {
    const aCollection = collection(this.firestore, 'threads')		
    this.items$ = collectionData(aCollection, { idField: 'id' });	
    this.items$.subscribe((threads) => { 
      this.allThreads = threads;
      console.log(threads);

      //could fix the bug
      this.subscription = this.threadsService.selectedChannel.subscribe(channel => {
        this.selectedChannel = channel;
        this.selectedChannelId = channel?.id;
        console.log('neu selected channel id: ', this.selectedChannelId);
        console.log('all threads: ', this.allThreads);
        this.allThreadsFiltered = this.allThreads.filter((f) => 
        this.selectedChannelId === f.toChannel)
      });
      });
    
  }

}
