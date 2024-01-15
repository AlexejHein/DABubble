import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {Message} from "../models/message.class";


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) { }

  async saveMessage(message: any) {
    try {
      const docRef = await this.firestore.collection('messages').add(message);
      console.log("Document written with ID: ", docRef.id);
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
