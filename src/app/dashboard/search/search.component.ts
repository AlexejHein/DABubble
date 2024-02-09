import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from "../../services/user.service";
import { ThreadsService } from "../../services/threads.service";
import { DashboardComponent } from "../dashboard.component";
//import { ChannelListComponent} from "../channel-list/channel-list.component";
import { ChannelService } from "../../services/channel.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  usersOrChannels: any[] = []; // Daten für Benutzer oder Kanäle
  filteredOptions: Observable<any[]> | undefined;

  constructor(private userService: UserService,
              private threadsService: ThreadsService,
              protected dashboard: DashboardComponent,
              private channelService: ChannelService) { }

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    // Abrufen von Benutzern
    this.userService.getUsers().subscribe((users: any[]) => {
      this.usersOrChannels = [...this.usersOrChannels, ...users.map(user => ({...user, type: 'user'}))];
    });

    // Abrufen von Kanälen
    this.threadsService.getChannels().subscribe((channels: any[]) => {
      this.usersOrChannels = [...this.usersOrChannels, ...channels.map(channel => ({
        name: channel.title,
        avatar: '',
        status: '',
        id: channel.id,
        type: 'channel'
      }))];
    });
  }


  private _filter(value: string): any[] {
    if (value === null || value === undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.usersOrChannels
      .filter(item => item.name.toLowerCase().includes(filterValue))
      .map(item => ({
        name: item.name,
        avatar: item.avatar,
        status: item.status,
        id: item.id,
        type: item.type
      }));
  }

  selectUser(user: any) {
    console.log("Selected item: ", user);
    this.searchControl.setValue(user.name);
    this.searchControl.reset();
    if(user.type === 'user') {
      this.dashboard.setSelectedUser(user);
      this.dashboard.focusMessageInput();
      this.dashboard.loadMessages();
    } else if(user.type === 'channel') {
      this.channelService.channelClick(user);
      //this.threadsService.setSelectedChannel(user);
    }
    // Weitere Aktionen...
  }


  protected readonly of = of;
}
