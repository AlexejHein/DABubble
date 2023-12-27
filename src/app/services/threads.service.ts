import { Injectable } from '@angular/core';
import { Thread } from '../models/thread.class';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private selectedThreadSubject = new BehaviorSubject<Thread | null>(null);
  selectedThread = this.selectedThreadSubject.asObservable();

  constructor() { }

  setSelectedThread(thread: Thread | null) {
   this.selectedThreadSubject.next(thread);
  }

} 
