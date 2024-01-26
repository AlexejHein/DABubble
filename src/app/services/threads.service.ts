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

  private selectedSidebarState = new BehaviorSubject<any>({});
  selectedSidebarVisibility = this.selectedSidebarState.asObservable();

  private selectedSidebarClass = new BehaviorSubject<any>({});
  selectedSidebarClassName = this.selectedSidebarClass.asObservable();

  constructor() { }

  setSelectedChannel(channel: Channel | null) {
   this.selectedChannelSubject.next(channel);
  }

  setSelectedThread(thread: Thread | null) {
    this.selectedThreadSubject.next(thread);
   }

  setSelectedSidebarVisibility(threadVisible:any) {
    this.selectedSidebarState.next(threadVisible);
  }
  setselectedSidebarClassName(moveRight:any) {
    this.selectedSidebarClass.next(moveRight);
  }

}
