import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { User } from '../models/User.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent  implements OnInit{

  constructor( public storageService:StorageService){}

  user:User=new User();


  ngOnInit(){

  }


  send(){
  // speichern firebase
  console.log(this.user);
  
    
    //this.storageService.plusStep()
  }
}
