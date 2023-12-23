import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';
import { User } from '../models/User.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user:User= new User();
  privacyPolicyChecked!:boolean;
  disableForm:boolean=false;

  constructor(
    public storageService: StorageService,
    private userService: UserService
  ) {}

  calculatePasswordStrength(password: string): string {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>=]/.test(password);
  
    if (password.length < 6 || !((hasLowerCase || hasUpperCase) && hasSpecialChar)) {
      return 'Schwach';
    } else if (password.length < 8) {
      return 'Mittel';
    } else {
      return 'Stark';
    }
  }
  

  isWeakPassword(): boolean {
    return this.calculatePasswordStrength(this.user.password) === 'Schwach';
  }

  isMediumPassword(): boolean {
    return this.calculatePasswordStrength(this.user.password) === 'Mittel';
  }

  isStrongPassword(): boolean {
    return this.calculatePasswordStrength(this.user.password) === 'Stark';
  }

  async register() {
    this.disableForm=true;
    const name = (document.getElementById('textRegister') as HTMLInputElement).value;
    const email = (document.getElementById('emailRegister') as HTMLInputElement).value;
    const password = (document.getElementById('passRegister') as HTMLInputElement).value;

    const checkbox = (document.querySelector('.checkboxSection input') as HTMLInputElement);
    if (!checkbox.checked) {
      alert('Bitte stimme der Datenschutzerklärung zu.');
      return;
    }

    try {
      await this.userService.registerUser({ name, email, password });
      this.storageService.plusStep();
      this.disableForm=false;
    } catch (error) {
      console.error('Registrierungsfehler', error);
    }
  }
}