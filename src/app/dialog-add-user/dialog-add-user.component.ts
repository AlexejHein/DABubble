import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.class';

@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  channel: Channel = new Channel();
  channelId:any = '';

  constructor() {

  }

  ngOnInit(): void {

  }

  
  saveUserToChannel() {
    //const coll = doc(this.firestore, 'channels', this.channelId);
   // updateDoc(coll, {users: this.channel.users}).then(r => console.log(r));


}

}
