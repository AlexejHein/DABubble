import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {
  email: any;
  emailSent: boolean = false;
  constructor( public storageService:StorageService,
               private afAuth: AngularFireAuth){}

  sendResetEmail() {
    this.afAuth.sendPasswordResetEmail(this.email)
      .then(() => {
        this.emailSent = true;
        setTimeout(() => {
          this.storageService.logInStep();
        },1500);
      })
      .catch(() => {
        this.emailSent = false;
        console.log('error');
      });
  }
}
