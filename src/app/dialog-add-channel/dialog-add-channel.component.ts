import { Component, OnInit, inject } from '@angular/core';
import { Channel } from '../models/channel.class';
import { Firestore, addDoc, collection, collectionData, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from "../models/User.class";
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss']
})
export class DialogAddChannelComponent implements OnInit {

  currentUser: User | null | undefined;
  currentUserId: string | null = "";
  currentUserName: string | null = "";
  currentUserDetails: any;

  firestore: Firestore = inject(Firestore);	

  channel = new Channel();
  loading = false;

  constructor(private userService: UserService){

  }

  ngOnInit(): void {
    this.userService.getCurrentUserId().then(id => {
      this.currentUserId = id;
      console.log("Current Author ID:", this.currentUserId);
    }).catch(error => {
      console.error("Error getting current Author ID:", error);
    });

    this.userService.getCurrentUserName().then(name => {
      this.currentUserName = name;
      console.log("Current Author Name:", this.currentUserName);
    }).catch(error => {
      console.error("Error getting current Author Name:", error);
    });
    
    
  }

  saveThread(){
console.log(this.channel);
console.log("current author name:", this.currentUserName);
console.log("current author id:", this.currentUserId);
this.channel.authorId = this.currentUserId;
this.channel.authorName = this.currentUserName;
this.loading = true;
console.log(this.loading);
    addDoc(collection(this.firestore, 'threads'), this.channel.toJSON());
    this.loading = false;
    console.log(this.loading);
  }

}
