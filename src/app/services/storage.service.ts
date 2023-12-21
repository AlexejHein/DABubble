import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

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

  getStep(){
    return this.step
  }
}
