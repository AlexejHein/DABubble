import { Injectable } from '@angular/core';
import firebase from "firebase/compat";
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private userData: any;

  constructor() { }

  step:number=1;

  plusStep(){
    this.step++
    return this.step
  }

  minusStep(){
    this.step--;
    return this.step
  }

  sendEmailStep(){
    this.step=4;
    return this.step
  }

  resetPasswordStep(){
    this.step=5;
    return this.step
  }

  logInStep(){
    this.step=1;
    return this.step
  }

  getStep(){
    return this.step
  }

  storeUserData(user: any) {
    this.userData = user;
  }
  getUserData(): User {
    return this.userData;
  }
}
