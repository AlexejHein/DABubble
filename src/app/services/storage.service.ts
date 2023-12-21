import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  step:number=5;

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
}
