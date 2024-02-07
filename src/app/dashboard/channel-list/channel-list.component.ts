import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { Thread } from 'src/app/models/thread.class';
import { WorkspaceService } from 'src/app/services/workspace.service';
import {ChannelService} from "../../services/channel.service";

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.scss']
})
export class ChannelListComponent implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  allChannels: any[] = [];
  channel = new Channel();
  thread = new Thread();
  channelId: any;

  constructor(
    protected threadsService: ThreadsService,
    private workspaceService: WorkspaceService,
    private channelService: ChannelService
  ) {}

 async ngOnInit(): Promise<void> {
    const aCollection = collection(this.firestore, 'channels');
    this.items$ = collectionData(aCollection, { idField: 'id' });
    this.items$.subscribe((channels) => {
      this.allChannels = channels;
      console.log(channels);
      console.log("Empfangener Kanal: ", channels);
      this.selectChannelByName('Gesuchter Kanalname');
    });
   this.channelService.searchQuery$.subscribe(query => {
     this.searchChannel(query);
   });
   this.channelService.channelClicked$.subscribe(channel => {
     console.log("Empfangener Kanal im Abonnement: ", channel);
     const selectedChannel = new Channel();
     Object.assign(selectedChannel, channel);
     this.onChannelClick(selectedChannel);
   });
  }

  searchChannel(query: string): void {
    if (query) {
      this.selectChannelByName(query);
    }
  }

  selectChannelByName(channelName: string): void {
    const foundChannel = this.allChannels.find(channel => channel.name === channelName);
    if (foundChannel) {
      this.onChannelClick(foundChannel);
      console.log("Kanal mit dem Namen", channelName, "gefunden.");
    } else {
      console.log("Kanal mit dem Namen", channelName, "nicht gefunden.");
    }
  }

  onChannelClick(selectedChannel: Channel): void {
    this.threadsService.setSelectedChannel(selectedChannel);
    console.log("Selected Channel:", selectedChannel);
    console.log("Selected Channel ID:", selectedChannel.id);
    this.channelId = selectedChannel.id;
    this.workspaceService.addMessageClicked();
  }


   onThreadClick(selectedThread: Thread): void {
    this.threadsService.setSelectedThread(selectedThread);
    console.log("Selected Thread:", selectedThread.id);
  }

}
