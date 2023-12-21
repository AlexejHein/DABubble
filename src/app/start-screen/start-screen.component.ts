import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{
    
  constructor( public storageService:StorageService){}

  animationOver=false;
  ngOnInit(): void {

   setTimeout(() => {
    this.animationOver=true;
   }, 2000);  

  }

}
