import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ThreadsService } from "./threads.service";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelClickedSource = new Subject<any>();
  channelClicked$ = this.channelClickedSource.asObservable();
  private searchQuerySource = new Subject<string>();
  searchQuery$ = this.searchQuerySource.asObservable();

  constructor(private threadsService: ThreadsService) {}
  channelClick(channel: any) {
    this.channelClickedSource.next(channel);
  }
  searchChannel(query: string) {
    this.searchQuerySource.next(query);
  }
}

