import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable, of} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {UserService} from "../../services/user.service";
import {DashboardComponent} from "../dashboard.component";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl();
  usersOrChannels: any[] = []; // Typ zu any[] geändert
  filteredOptions: Observable<any[]> | undefined; // Typ des Observables angepasst

  constructor(private userService: UserService,
              protected dashboard: DashboardComponent) { }

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this.userService.getUsers().subscribe((users: any[]) => { // Typ von users korrigiert
      this.usersOrChannels = users; // Direkt zuweisen, da wir nur Benutzer haben
    });
    console.log("Service: ", this.usersOrChannels);
  }

  private _filter(value: string): any[] {
    if(value === null || value === undefined) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.usersOrChannels
      .filter(user => user.name.toLowerCase().includes(filterValue))
      .map(user => {
        return {
          name: user.name,
          avatar: user.avatar,
          status: user.status,
          id: user.id
        };
      });
  }

  selectUser(user: any) {
    console.log("Selected user: ", user);
    // Setzen Sie beispielsweise den Namen des Benutzers als Wert des Suchfelds
    this.searchControl.setValue(user.name);
    this.searchControl.reset();
    this.dashboard.setSelectedUser(user);
    this.dashboard.focusMessageInput();
    this.dashboard.loadMessages();
    // Führen Sie hier weitere Aktionen aus, z.B. Navigieren zu einem Benutzerprofil
  }


  protected readonly of = of;
}
