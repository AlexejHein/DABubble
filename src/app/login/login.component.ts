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

  // Consider removing or securely managing guest credentials
  guestEmail: string = 'guest@login.com';
  guestPassword: string = '123456789';

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
        console.error("Login failed:", error);
      });
  }
  // In Ihrer LoginComponent-Klasse

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then((result) => {
        // Hier navigieren Sie zum Dashboard oder einem anderen internen Bereich
        this.router.navigate(['/dashboard']).then(r => console.log(r));
      })
      .catch((error) => {
        console.error("Google Login failed:", error);
        // Behandeln Sie Fehler und zeigen Sie vielleicht eine Benachrichtigung an
      });
  }



  fillGuestCredentials() {
    this.email = this.guestEmail;
    this.password = this.guestPassword;
    this.login();
  }

}
