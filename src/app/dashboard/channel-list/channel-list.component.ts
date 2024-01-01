import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Channel } from 'src/app/models/channel.class';
import { ThreadsService } from 'src/app/services/threads.service';

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

  onThreadClick(selectedChannel: Channel): void {
    this.threadsService.setSelectedChannel(selectedChannel);
    console.log("Selected Thread:", selectedChannel);
    console.log("Selected Thread ID:", selectedChannel.id);
    this.channelId = selectedChannel.id;
  }

}
