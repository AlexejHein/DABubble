import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ThreadsService } from 'src/app/services/threads.service';
import { Thread } from 'src/app/models/thread.class';

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

  constructor(  protected threadsService: ThreadsService,) {}

  ngOnInit(): void {
    const aCollection = collection(this.firestore, 'channels')		
    this.items$ = collectionData(aCollection, { idField: 'id' });	
    this.items$.subscribe((channels) => { 
      this.allChannels = channels;
      console.log(channels);
      });
  }

  onChannelClick(selectedChannel: Channel): void {
    this.threadsService.setSelectedChannel(selectedChannel);
    console.log("Selected Channel:", selectedChannel);
    console.log("Selected Channel ID:", selectedChannel.id);
    this.channelId = selectedChannel.id;
  }


   onThreadClick(selectedThread: Thread): void {
    this.threadsService.setSelectedThread(selectedThread);
    console.log("Selected Thread:", selectedThread.id);
 
  } 

}
