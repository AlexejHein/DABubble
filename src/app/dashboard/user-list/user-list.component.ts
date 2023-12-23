import { Component, OnInit, inject } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { User } from 'src/app/models/User.class';
import { Firestore, addDoc, collection, collectionData, docData } from '@angular/fire/firestore';
import { doc, onSnapshot } from "firebase/firestore";
import { Observable } from 'rxjs';

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

constructor() {

}

ngOnInit(): void {
  // User importieren und abonnieren
  const aCollection = collection(this.firestore, 'users')		
  this.items$ = collectionData(aCollection, { idField: 'id' });		
  this.items$.subscribe((users) => { 
    this.allUsers = users;
    console.log(users);
    });

    


}



}
