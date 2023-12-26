import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/User.class';
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

  saveMessage(message: any) {
    return this.firestore.collection('messages').add(message);
  }

  getMessages() {
    return this.firestore.collection('messages').snapshotChanges();
  }
}
