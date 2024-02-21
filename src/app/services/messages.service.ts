import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Message } from "../models/message.class";
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messageClickedSource = new Subject<any>();
  messageClicked$ = this.messageClickedSource.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

  messageClick(message: any) {
    this.messageClickedSource.next(message);
  }

  async saveMessage(message: any) {
    try {
      const docRef = await this.firestore.collection('messages').add(message);
      message.id = docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  updateMessage(message: Message) {
    return this.firestore.collection('messages').doc(message.id).update(message);
  }

  getMessages() {
    return this.firestore.collection('messages', ref => ref.orderBy('createdAt', 'asc')).snapshotChanges();
  }
}
