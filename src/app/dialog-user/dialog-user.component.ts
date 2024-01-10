import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user',
  template: `
      <h1>Profil</h1>
      <div mat-dialog-content>
        <img  [src]="data.avatar" alt="Avatar">
        <p>{{ data.name }}</p>
        <p>{{ data.email }}</p>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Schließen</button>
      </div>
  `,
  styles: [
    `
      h1{
        color: #3f51b5;
        font-size: 1.5rem;
        text-align: left;
      }
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
    `,

  ]
})
export class DialogUserComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    // Schließt den Dialog
  }
}
