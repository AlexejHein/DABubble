import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impress',
  templateUrl: './impress.component.html',
  styleUrls: ['./impress.component.scss']
})
export class ImpressComponent {
  
  constructor(private router:Router){

  }
  
  back(){
    this.router.navigateByUrl('/')
  }
}
