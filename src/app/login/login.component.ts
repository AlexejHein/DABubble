import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService} from "../services/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  guestEmail: string = 'guest@login.com';
  guestPassword: string = '123456789';
  loginError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    protected storageService: StorageService
  ) {}

  login() {
    this.authService.loginWithEmail(this.email, this.password)
      .then((result) => {
        this.router.navigate(['/dashboard']).then(r => console.log(r));
      })
      .catch((error) => {
        switch(error.code) {
          case 'auth/invalid-credential':
            this.loginError = 'Die eingegebenen Anmeldedaten sind ungültig oder abgelaufen.';
            break;
          default:
            this.loginError = 'Ein unbekannter Fehler ist aufgetreten.';
        }
      });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then((result) => {
        this.router.navigate(['/dashboard']).then(r => console.log(r));
      })
      .catch((error) => {
        console.error("Google Login failed:", error);
      });
  }
  fillGuestCredentials() {
    this.email = this.guestEmail;
    this.password = this.guestPassword;
    this.login();
  }

}
