import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit{
    
  constructor( public storageService:StorageService,
    private router:Router){}

  animationOver=false;
  
  ngOnInit(): void {

   setTimeout(() => {
    this.animationOver=true;
   }, 2500);  

  }

  goToImpress(){
    this.router.navigateByUrl('impressum')
  }

  goToPolicy(){
    this.router.navigateByUrl('privacy')
  }


}
