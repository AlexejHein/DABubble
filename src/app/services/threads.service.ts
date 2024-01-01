import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import { Thread } from '../models/thread.class';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  selectedChannel = this.selectedChannelSubject.asObservable();

  private selectedThreadSubject = new BehaviorSubject<Thread | null>(null);
  selectedThread = this.selectedThreadSubject.asObservable();

  constructor() { }

  setSelectedChannel(channel: Channel | null) {
   this.selectedChannelSubject.next(channel);
  }

  setSelectedThread(thread: Thread | null) {
    this.selectedThreadSubject.next(thread);
   }

} 
