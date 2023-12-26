import { Injectable } from '@angular/core';
import { Thread } from '../models/thread.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  
  constructor() { }

  setSelectedThread(thread: Thread | null) {
   // this.selectedThreadSubject.next(thread);
  }

} 
