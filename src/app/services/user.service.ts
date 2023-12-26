import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/User.class';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private selectedUserSubject = new BehaviorSubject<User | null>(null);

  currentUser = this.currentUserSubject.asObservable();
  selectedUser = this.selectedUserSubject.asObservable();

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

  async setUserOnline(userId: string, isOnline: boolean) {
    try {
      const userRef = this.firestore.collection('users').doc(userId);
      await userRef.update({ isOnline });
    } catch (error) {
      console.error('Failed to update user online status', error);
      throw error;
    }
  }




  getUserDetails(userId: string) {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }
  setSelectedUser(user: User | null) {
    this.selectedUserSubject.next(user);
  }

}
