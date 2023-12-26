import { Component, OnInit, inject } from '@angular/core';
import { Thread } from '../models/thread.class';
import { Firestore, addDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent implements OnInit {
  firestore: Firestore = inject(Firestore);	

  thread = new Thread();
  loading = false;

  constructor(){

  }

  ngOnInit(): void {

  }

  saveThread(){
console.log(this.thread);
this.loading = true;
console.log(this.loading);
    addDoc(collection(this.firestore, 'thread'), this.thread.toJSON());
    this.loading = false;
    console.log(this.loading);
  }

}
