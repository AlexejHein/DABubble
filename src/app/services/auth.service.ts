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
  private autoLogoutTimer: any;

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

      this.setAutoLogout(60 * 60 * 1000); //(4 * 60 * 60 * 1000) Set auto logout to 4 hours

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

      this.setAutoLogout(4 * 60 * 60 * 1000); // Set auto logout to 4 hours

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

      this.clearAutoLogout();
    } catch (error) {
      console.error('Error during logout', error);
      throw error;
    }
  }

  setAutoLogout(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => {
      this.logout().then(r => {});
    }, expirationDuration);
  }

  clearAutoLogout() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
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
