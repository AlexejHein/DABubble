import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('You are Successfully logged in!', result);
      return result;
    } catch (error) {
      console.error('Error during login with email', error);
      throw error;
    }
  }
  async loginWithGoogle() {
    try {
      const result = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      console.log('You are Successfully logged in with Google!', result);
      return result;
    } catch (error) {
      console.error('Error during login with Google', error);
      throw error;
    }
  }
}

