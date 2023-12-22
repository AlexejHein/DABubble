import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/User.class';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  async registerUser(userData: { name: string, email: string, password: string }) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(userData.email, userData.password);
      const userId = userCredential.user?.uid;
      if (userId) {
        const newUser = new User({
          id: userId,
          name: userData.name,
          email: userData.email,
        });
        await this.firestore.collection('users').doc(newUser.id).set(newUser.toJSON());
        return newUser;
      } else {
        throw new Error('Benutzer konnte nicht erstellt werden.');
      }
    } catch (error) {
      throw error;
    }
  }
  async getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid);
        } else {
          reject('Kein Benutzer angemeldet.');
        }
      });
    });
  }
  async getCurrentUserName(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        console.log(user);
        if (user) {
          console.log('User Display Name: ', user.displayName);
          resolve(user.displayName);
        } else {
          console.log('Kein Benutzer angemeldet');
          resolve(null);
        }
      });

    });
  }
}
