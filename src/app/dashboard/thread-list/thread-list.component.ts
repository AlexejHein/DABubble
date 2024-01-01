import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  allThreads: any[] = [];
  thread = new Thread();
  threadId: any;

  constructor(  protected threadsService: ThreadsService,) {}

  ngOnInit(): void {
    const aCollection = collection(this.firestore, 'threads')		
    this.items$ = collectionData(aCollection, { idField: 'id' });	
    this.items$.subscribe((threads) => { 
      this.allThreads = threads;
      console.log(threads);
      });
  }

  onThreadClick(selectedThread: Thread): void {
    this.threadsService.setSelectedThread(selectedThread);
    console.log("Selected Thread:", selectedThread);
    console.log("Selected Thread ID:", selectedThread.id);
    this.threadId = selectedThread.id;
  }

}
