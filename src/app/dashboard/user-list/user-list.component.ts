import { Component, OnInit, inject } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { User } from 'src/app/models/User.class';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UserService} from "../../services/user.service";
import { WorkspaceService } from "../../services/workspace.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent  implements OnInit {

  firestore: Firestore = inject(Firestore)
  items$!: Observable<any[]>;
  allUsers: any[] = [];
  user = new User();
  currentUserId: string = "";


constructor(
  protected userService: UserService,
  public dialog: MatDialog,
  private workspaceService: WorkspaceService,
) {}


  ngOnInit(): void {
    const aCollection = collection(this.firestore, 'users');
    this.items$ = collectionData(aCollection, { idField: 'id' });

    this.items$.subscribe((users) => {
      this.userService.getCurrentUserId().then((id) => {
        if (id != null) {
          this.currentUserId = id;
          this.userService.setUserOnline(id, true).then(r => {}); // assuming such a method exists
        }
        this.allUsers = [
          users.find(user => user.id === this.currentUserId),
          ...users.filter(user => user.id !== this.currentUserId)
        ].filter(Boolean);
      });
      const currentUser = this.allUsers.find(user => user.id === this.currentUserId);
      if (currentUser) {
        this.onUserClick(currentUser);
      }
    });
  }


  onUserClick(selectedUser: User): void {
    this.userService.setSelectedUser(selectedUser);
    //this.workspaceService.addMessageClicked();
  }

}
