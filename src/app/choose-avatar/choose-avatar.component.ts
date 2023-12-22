import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {UserService} from '../services/user.service';
import {StorageService} from '../services/storage.service';
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent implements OnInit {
  userName: string = 'Unbekannter Benutzer';
  avatarUrl = '';
  imageUrls = [1, 2, 3, 4, 5, 6].map(i => `assets/img/avatar${i}.png`);
  currentAvatar =  'assets/img/profile.png';

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private userService: UserService,
    protected storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadUserName().then(r => console.log('Benutzername geladen'));
  }

  async loadUserName() {
    try {
      const name = await this.userService.getCurrentUserName();
      this.userName = name || 'Unbekannter Benutzer';
    } catch (error) {
      console.error('Fehler beim Laden des Benutzernamens', error);
      // Handle the error appropriately
    }
  }

  selectAvatar(avatarName: string) {
    this.currentAvatar = avatarName;
    this.saveAvatar(avatarName).catch(error => console.error('Error saving avatar:', error));
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const filePath = `avatars/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(async () => {
        this.avatarUrl = await fileRef.getDownloadURL().toPromise();
        await this.saveAvatar(this.avatarUrl);
      })
    ).subscribe();
  }

  async saveAvatar(avatarUrl: string) {
    try {
      const userId = await this.userService.getCurrentUserId();
      if (userId) {
        await this.firestore.collection('users').doc(userId).update({ avatar: avatarUrl });
        this.avatarUrl = avatarUrl;
      } else {
        console.error('No user ID found');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Avatars: ', error);
    }
  }

  goNext() {
    this.storageService.plusStep();
  }
}
