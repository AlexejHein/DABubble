import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
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
  @ViewChild('filter') private filter: ElementRef | undefined;
  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;

  usersOrChannels: any[] = []; // Daten für Benutzer oder Kanäle
  filteredUsersOrChannels: any[] = [];
  filteredOfPrivateMessages: any[] = [];
  allThreads: any[] = [];
  selectedThread: any;
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
      this.usersOrChannels = [...this.usersOrChannels, ...users.map(user => ({...user, toThread: '', type: 'user'}))];
    });

    this.threadsService.getChannels().subscribe((channels: any[]) => {
      this.usersOrChannels = [...this.usersOrChannels, ...channels.map(channel => ({
        name: channel.title,
        avatar: '',
        status: '',
        toThread: '',
        id: channel.id,
        type: 'channel'
      }))];
    });

    const messageCollection = collection(this.firestore, 'messages')
    this.items$ = collectionData(messageCollection, { idField: 'id' });
    this.items$.subscribe((messages) => {
      this.usersOrChannels = [...this.usersOrChannels, ...messages.map(message => ({
        ...message,
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
      this.allThreads = threads;
      this.usersOrChannels = [...this.usersOrChannels, ...threads.map(thread => ({
        ...thread,
        name: thread.title,
        avatar: '',
        status: '',
        toThread: '',
        id: thread.id,
        type: 'thread'
      }))];
    });

  }

  private_filter(text: string) {
    this.filteredOfPrivateMessages = this.usersOrChannels.filter(
      usersOrChannels =>(usersOrChannels.toThread !== undefined
      )
    );
    //console.log('filteredOfPrivateMessages: ', this.filteredOfPrivateMessages);
    if (!text) {
      this.filteredUsersOrChannels = this.filteredOfPrivateMessages;
      this.dropdownVisible = false;
      return;
    }
    //console.log('usersOrChannels: ',this.filteredOfPrivateMessages, '- filtered: ');
    this.filteredUsersOrChannels = this.filteredOfPrivateMessages.filter(
      filteredOfPrivateMessages => filteredOfPrivateMessages?.name.toLowerCase().includes(text.toLowerCase())
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
      this.filterSelectedThreadId(user);
    }
    this.dropdownVisible = false;
    this.clearInputField();
  }

  clearInputField(): void {
    try {
      if (this.filter && this.filter.nativeElement) {
        this.filter.nativeElement.value = "";
      }
    } catch(err) {
      console.error('Input not cleared:', err);
    }
  }

  filterSelectedThreadId(user:any) {
    //console.log('open message: ', user, 'thread id: ', user.toThread, 'all threads: ', this.allThreads);
    this.selectedThread = this.allThreads.filter(thread => thread.id === user.toThread);
    this.threadsService.setSelectedThread(this.selectedThread[0]);
    this.showThread();
    this.moveSidebar();
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
