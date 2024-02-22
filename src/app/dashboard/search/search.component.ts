import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from "../../services/user.service";
import { ThreadsService } from "../../services/threads.service";
import { DashboardComponent } from "../dashboard.component";
import { ChannelService } from "../../services/channel.service";
import { MessagesService } from "../../services/messages.service";
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;

  usersOrChannels: any[] = []; // Daten für Benutzer oder Kanäle
  filteredUsersOrChannels: any[] = [];
  filteredOptions: Observable<any[]> | undefined;
  dropdownVisible:boolean = false;
  threadVisible = true;
  moveRight:string = "";
  moveLeft:string = "";

  constructor(private userService: UserService,
              private threadsService: ThreadsService,
              protected dashboard: DashboardComponent,
              private channelService: ChannelService,
              private messageService: MessagesService) { }

  ngOnInit() {
   
    const aCollection = collection(this.firestore, 'users');
    this.items$ = collectionData(aCollection, { idField: 'id' });
    this.items$.subscribe((users) => {
      this.usersOrChannels = [...this.usersOrChannels, ...users.map(user => ({...user, type: 'user'}))];
    });

    this.threadsService.getChannels().subscribe((channels: any[]) => {
      this.usersOrChannels = [...this.usersOrChannels, ...channels.map(channel => ({
        name: channel.title,
        avatar: '',
        status: '',
        id: channel.id,
        type: 'channel'
      }))];
    });

    const messageCollection = collection(this.firestore, 'messages')
    this.items$ = collectionData(messageCollection, { idField: 'id' });
    this.items$.subscribe((messages) => {
      this.usersOrChannels = [...this.usersOrChannels, ...messages.map(message => ({
        name: message.body,
        avatar: '',
        status: '',
        id: message.id,
        type: 'message'
      }))];
    });

    const threadsCollection = collection(this.firestore, 'threads')
    this.items$ = collectionData(threadsCollection, { idField: 'id' });
    this.items$.subscribe((threads) => {
      this.usersOrChannels = [...this.usersOrChannels, ...threads.map(thread => ({
        ...thread,
        name: thread.title,
        avatar: '',
        status: '',
        id: thread.id,
        type: 'thread'
      }))];
    });

  }

  private_filter(text: string) {
    
    if (!text) {
      this.filteredUsersOrChannels = this.usersOrChannels;
      this.dropdownVisible = false;
      return;
    }
    console.log('usersOrChannels: ',this.usersOrChannels, '- filtered: ');
    this.filteredUsersOrChannels = this.usersOrChannels.filter(
      usersOrChannels => usersOrChannels?.name.toLowerCase().includes(text.toLowerCase())
    );
    this.dropdownVisible = true;
  
  }

  selectUser(user: any) {

    if(user.type === 'user') {
      this.dashboard.setSelectedUser(user);
      this.dashboard.focusMessageInput();
      this.dashboard.loadMessages();
    } else if(user.type === 'channel') {
      this.channelService.channelClick(user);
    } else if(user.type === 'thread') {
      this.threadsService.setSelectedThread(user);
      this.showThread();
      this.moveSidebar();
    } else if(user.type === 'message') {
      console.log('open message: ', user);
      this.threadsService.setSelectedThread(user);
    }
  }

  showThread(){
    this.threadVisible = true;
    this.threadsService.setSelectedSidebarVisibility(this.threadVisible);

  }

  moveSidebar(){
    this.moveRight = "";
    this.threadsService.setselectedSidebarClassName(this.moveRight);
    this.dashboard.closeWorkspaceMenu();
  }

  protected readonly of = of;
}
