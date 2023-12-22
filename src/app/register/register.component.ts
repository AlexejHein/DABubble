import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(
    public storageService: StorageService,
    private userService: UserService
  ) {}

  async register() {
    const name = (document.getElementById('textRegister') as HTMLInputElement).value;
    const email = (document.getElementById('emailRegister') as HTMLInputElement).value;
    const password = (document.getElementById('passRegister') as HTMLInputElement).value;

    const checkbox = (document.querySelector('.checkboxSection input') as HTMLInputElement);
    if (!checkbox.checked) {
      alert('Bitte stimme der Datenschutzerklärung zu.');
      return;
    }

    try {
      this.storageService.plusStep();
      await this.userService.registerUser({ name, email, password });
    } catch (error) {
      console.error('Registrierungsfehler', error);
    }
  }
}

