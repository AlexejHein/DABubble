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
      const userId = await this.userService.getCurrentUserId(); // Ensure this method gets the current user ID
      if (userId) {
        await this.userService.setUserOnline(userId, false); // Set isOnline to false before logging out
      }

      await this.afAuth.signOut(); // Proceed with sign out
      console.log('You are Successfully logged out!');
      await this.router.navigate(['']);
    } catch (error) {
      console.error('Error during logout', error);
      throw error;
    }
  }
}

