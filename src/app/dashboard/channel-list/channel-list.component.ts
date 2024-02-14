import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { Thread } from 'src/app/models/thread.class';
import { WorkspaceService } from 'src/app/services/workspace.service';
import {ChannelService} from "../../services/channel.service";
import { DashboardComponent } from "../dashboard.component";

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
    private channelService: ChannelService,
    private dashboard: DashboardComponent
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
     const foundChannel = this.allChannels.find(c => c.id === channel.id);
     if (foundChannel) {
       this.onChannelClick(foundChannel);
       console.log("Kanal, der empfangen wurde: ", channel);
     } else {
       console.log("Kein übereinstimmender Kanal für ID", channel.id, "gefunden.");
     }
   });

 }

  searchChannel(query: string): void {
    if (query) {
      this.selectChannelByName(query);
      console.log("Kanal mit dem Namen", query, "gesucht.");
    }
  }

  selectChannelByName(channelName: string): void {
    const foundChannel = this.allChannels.find(channel => channel.name === channelName);
    if (foundChannel) {
      this.onChannelClick(foundChannel);
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
    this.dashboard.isInputVisible = false;
    this.dashboard.isInputVisible = false;
    this.dashboard.toggleVisibility();
  }


   onThreadClick(selectedThread: Thread): void {
    this.threadsService.setSelectedThread(selectedThread);
    console.log("Selected Thread:", selectedThread.id);
  }

}
