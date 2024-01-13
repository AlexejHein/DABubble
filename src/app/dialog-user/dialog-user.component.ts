import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {NgIf, NgStyle} from "@angular/common";
import {MatIconModule} from "@angular/material/icon";
import { FocusService} from "../services/focus.service";

@Component({
  selector: 'app-dialog-user',
  template: `
    <div class="header">
    <h1>Profil</h1>
      <mat-icon (click)="onNoClick()" >close</mat-icon>
    </div>
    <div class="content" mat-dialog-content>
      <div class="avatar">
      <img [src]="data.avatar" alt="Avatar">
      </div>
      <h2>{{ data.name }}</h2>
      <div class="activ online" *ngIf="data.isOnline">Online</div>
      <div class="activ offline" *ngIf="!data.isOnline">Offline</div>
      <p class="email"> <img src="./assets/img/mail (1).png"> <strong>E-Mail-Adresse</strong> </p>
      <p class="email-user">{{ data.email }}</p>
    </div>

    <div class="action" mat-dialog-actions>
      <button (click)="sendMessage()" mat-button><mat-icon>mode_comment</mat-icon> Nachricht</button>
    </div>

  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    NgStyle,
    MatIconModule,
    NgIf
  ],
  styles: [
    `
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        h1 {
          color: #000000;
          font-size: 1.5rem;
          text-align: left;
        }
      }
      .content {
        padding: 0;
        display: flex;
        jaustify-content:flex-start;
        flex-direction: column;
        .avatar{
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
          }
        }
        .activ{
          margin-top: 0;
        }
        .online{
          color: lightgreen;
        }
        .offline{
          color: darkgreen;
          content: "Abweesend";
        }
        .email{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-weight: 700;
          img{
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        h2{
          font-weight: bold;
          font-size: 2rem;
          color: #000000;
        }
        .email-user{
          color: #444DF2;
        }
      }
      .action {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        button{
          background-color: #444DF2;
          color: white!important;
          border-radius: 30px;
          padding: 10px 20px;
          cursor: pointer;
        }
      }

    `,

  ]
})
export class DialogUserComponent {
  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private focusService: FocusService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  sendMessage(){
    this.dialogRef.close();
    this.focusService.triggerFocusMessageInput();
  }
}
