import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.class';


@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss']
})
export class DialogEditChannelComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  channel: Channel = new Channel();
  channelId:any = '';
  showEditTitle = true;
  notEditingTitle = true;
  showSaveTitle = false;
  showEditDesc = true;
  notEditingDesc = true;
  showSaveDesc = false;
  readOnlyTitle = "readonly";
  readOnlyDesc = "readonly";

  constructor() {

  }

  ngOnInit(): void {

  }

  saveThread(){
  const coll = doc(this.firestore, 'channels', this.channelId);
  updateDoc(coll, this.channel.toJSON()).then(r => console.log(r));
   }

  editTitle() {
  this.readOnlyTitle = "editinput";
  this.notEditingTitle = false;
  this.showSaveTitle = true;
  this.showEditTitle = false;
  }

  saveEditedTitle() {
    const coll = doc(this.firestore, 'channels', this.channelId);
    updateDoc(coll, {title: this.channel.title}).then(r => console.log(r));
    this.notEditingTitle = true;
    this.showSaveTitle = false;
    this.showEditTitle = true;
    this.readOnlyTitle = "readonly";
  }

  editDesc() {
    this.readOnlyDesc = "editinput";
    this.notEditingDesc = false;
    this.showSaveDesc = true;
    this.showEditDesc = false;
    }

    saveEditedDesc() {
      const coll = doc(this.firestore, 'channels', this.channelId);
      updateDoc(coll, {description: this.channel.description}).then(r => console.log(r))
      this.notEditingDesc = true;
      this.showSaveDesc = false;
      this.showEditDesc = true;
      this.readOnlyDesc = "readonly";
    }

}
