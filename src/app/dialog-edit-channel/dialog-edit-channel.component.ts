import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.class';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-dialog-edit-channel',
  templateUrl: './dialog-edit-channel.component.html',
  styleUrls: ['./dialog-edit-channel.component.scss']
})
export class DialogEditChannelComponent implements OnInit {
  firestore: Firestore = inject(Firestore);	
  thread: Thread = new Thread();
  threadId:any = '';
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
    console.log(this.thread);
  
  const coll = doc(this.firestore, 'threads', this.threadId);
  updateDoc(coll, this.thread.toJSON());
   }

  editTitle() {
  this.readOnlyTitle = "editinput";
  this.notEditingTitle = false;
  this.showSaveTitle = true;
  this.showEditTitle = false;
  }

  saveEditedTitle() {
    const coll = doc(this.firestore, 'threads', this.threadId);
    updateDoc(coll,  {title: this.thread.title});
    this.notEditingTitle = true;
    this.showSaveTitle = false;
    this.showEditTitle = true;
    this.readOnlyTitle = "readonly";
  }

  editDesc() {
    this.readOnlyDesc = "";
    this.notEditingDesc = false;
    this.showSaveDesc = true;
    this.showEditDesc = false;
    }
  
    saveEditedDesc() {
      const coll = doc(this.firestore, 'threads', this.threadId);
      updateDoc(coll,  {description: this.thread.description});
      this.notEditingDesc = true;
      this.showSaveDesc = false;
      this.showEditDesc = true;
      this.readOnlyDesc = "readonly";
    }

}
