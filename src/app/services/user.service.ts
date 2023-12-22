import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/User.class'; // Pfad zu deinem User-Modell

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
        return newUser; // Rückgabe des neu erstellten Benutzers
      } else {
        throw new Error('Benutzer konnte nicht erstellt werden.');
      }
    } catch (error) {
      throw error;
    }
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    await this.firestore.collection('users').doc(userId).update({
      avatar: avatarUrl
    });
  }
  async getCurrentUserId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        if (user) {
          resolve(user.uid); // Gibt die Benutzer-ID zurück, wenn vorhanden
        } else {
          reject('Kein Benutzer angemeldet.'); // oder resolve(null);
        }
      });
    });
  }
  async getCurrentUserName(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(user => {
        if (user) {
          resolve(user.displayName); // oder user.email oder eine andere Benutzerinformation
        } else {
          resolve(null); // Kein Benutzer angemeldet
        }
      });
    });
  }
}
