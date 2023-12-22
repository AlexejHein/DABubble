import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import {finalize} from "rxjs";

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent {

  userName: string = '';
  // Konstruktor mit Services
  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private userService: UserService,
    protected storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadUserName().then(r => {} );
  }

  async loadUserName() {
    this.userName = await this.userService.getCurrentUserName() || 'Unbekannter Benutzer';

  }

  // Funktion, um vorgegebene Avatare zu wählen
  selectAvatar(avatarName: string) {
    // Pfad zu den vorgegebenen Avataren
    const avatarUrl = `./../../assets/img/${avatarName}.png`;
    this.saveAvatar(avatarUrl).then(r => {});
  }

  // Funktion, um das Bild hochzuladen
  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Hier Upload-Logik implementieren und URL speichern
      const filePath = `avatars/${new Date().getTime()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      // Verfolge den Upload-Status und erhalte die URL
      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise();
          await this.saveAvatar(downloadURL); // Speichere die URL des hochgeladenen Avatars
        })
      ).subscribe();
    }
  }

  // Funktion, um die Avatar-URL im Benutzerprofil zu speichern
  async saveAvatar(avatarUrl: string) {
    try {
      const userId = await this.userService.getCurrentUserId(); // Warte auf die UserID
      if (userId) {
        await this.firestore.collection('users').doc(userId).update({
          avatar: avatarUrl
        });
        // Weiterleitung oder Bestätigung hier
      } else {
        // Behandle den Fall, dass keine Benutzer-ID vorhanden ist
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Avatars: ', error);
      // Fehlerbehandlung hier
    }
  }

  goNext() {
    this.storageService.plusStep();
  }

}
