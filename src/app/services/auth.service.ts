import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router} from "@angular/router";
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import {UserService} from "./user.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private autoLogoutTimer: any;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private userService: UserService,
              private firestore: AngularFirestore ) { }

  async loginWithEmail(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);

      if (!result.user?.emailVerified) {
       // await this.sendVerificationEmail();
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
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      const user = result.user;

      if (user) {
        const userRef = this.firestore.collection('users').doc(user.uid);
        const doc = await userRef.get().toPromise();
        if (!doc?.exists) {
          const newUser = {
            id: user.uid,
            name: user.displayName || 'Anonymer Nutzer',
            email: user.email,
          };
          await userRef.set(newUser);
          console.log('Benutzer erfolgreich in Firestore angelegt:', newUser);
        } else {
          console.log('Benutzer existiert bereits in Firestore.');
        }
      } else {
        console.error('Google-Anmeldung fehlgeschlagen: Kein Benutzerobjekt erhalten.');
      }
    } catch (error) {
      console.error('Google-Anmeldung fehlgeschlagen:', error);
    }
  }


  async logout() {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        console.log('Kein Benutzer zum Ausloggen gefunden');
        await this.router.navigate(['/login']);
        return;
      }

      const userId = await this.userService.getCurrentUserId();
      if (userId) {
        await this.userService.setUserOnline(userId, false);
      }

      await this.afAuth.signOut();
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
}
