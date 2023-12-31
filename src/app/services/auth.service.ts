import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router} from "@angular/router";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import {UserService} from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private userService: UserService) { }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('You are Successfully logged in!', result);

      if (!result.user?.emailVerified) {
        await this.sendVerificationEmail();
      }

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

  async logout() {
    try {
      const userId = await this.userService.getCurrentUserId();
      if (userId) {
        await this.userService.setUserOnline(userId, false);
      }
      await this.afAuth.signOut();
      console.log('You are Successfully logged out!');
      await this.router.navigate(['']);
    } catch (error) {
      console.error('Error during logout', error);
      throw error;
    }
  }

  async sendVerificationEmail() {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        await user.sendEmailVerification();
        console.log('Verification email sent');
      } else {
        console.error('No user is currently logged in');
      }
    } catch (error) {
      console.error('Error during sending verification email', error);
      throw error;

    }
  }
}
