import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.class';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss']
})
export class DialogEditChannelComponent implements OnInit {
  firestore: Firestore = inject(Firestore);	
  thread: Thread = new Thread();
  threadId:any = 'BXwTdTZRtd7Da9jpo2ey';
  loading = false;


  constructor() {

  }

  ngOnInit(): void {
  
  }

  saveThread(){
    console.log(this.thread);
  this.loading = true;
  
  const coll = doc(this.firestore, 'threads', this.threadId);
  updateDoc(coll, this.thread.toJSON());
     this.loading = false;
   }

}
