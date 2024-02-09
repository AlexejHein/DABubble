import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ThreadsService } from "./threads.service";

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelClickedSource = new Subject<any>();
  channelClicked$ = this.channelClickedSource.asObservable();

  // Hinzufügen für Suchfunktionalität
  private searchQuerySource = new Subject<string>();
  searchQuery$ = this.searchQuerySource.asObservable();

  constructor(private threadsService: ThreadsService) {}
  channelClick(channel: any) {
    console.log("Kanal, der gesendet wird: ", channel);
    this.channelClickedSource.next(channel);
  }

  // Methode zum Auslösen der Suche
  searchChannel(query: string) {
    this.searchQuerySource.next(query);
  }
}

