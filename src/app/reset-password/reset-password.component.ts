import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  code: string = '';
  email: string = '';

  constructor(
    public storageService: StorageService,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.code = params['oobCode'];
      this.email = params['email'];
    });
  }
  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }

    try {
      await this.auth.confirmPasswordReset(this.code, this.newPassword);
      await this.router.navigate(['']);
    } catch (error) {
      console.error("Fehler beim Zurücksetzen des Passworts", error);
    }
  }
}

