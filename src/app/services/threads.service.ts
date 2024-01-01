import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.class';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private selectedChannelSubject = new BehaviorSubject<Channel | null>(null);
  selectedChannel = this.selectedChannelSubject.asObservable();

  constructor() { }

  setSelectedChannel(channel: Channel | null) {
   this.selectedChannelSubject.next(channel);
  }

} 
