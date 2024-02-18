import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/compat/storage';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {UserService} from '../services/user.service';
import {StorageService} from '../services/storage.service';
import {finalize} from "rxjs/operators";
import {User} from "../models/User.class";
import firebase from "firebase/compat";

@Component({
  selector: 'app-choose-avatar',
  templateUrl: './choose-avatar.component.html',
  styleUrls: ['./choose-avatar.component.scss']
})
export class ChooseAvatarComponent implements OnInit {
  userName: string = 'Unbekannter Benutzer';
  userData: any = {};
  avatarUrl = '';
  imageUrls = [1, 2, 3, 4, 5, 6].map(i => `assets/img/avatar${i}.png`);
  currentAvatar =  'assets/img/profile.png';
  uploadPercent: number | undefined = 0;
  isUploading: boolean = false;
  finish: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private userService: UserService,
    protected storageService: StorageService
  ) {}

  ngOnInit() {
    this.loadUserName().then(r => console.log('Benutzername geladen'));
    this.loadUserData().then(r => console.log('Benutzerdaten geladen'));
  }
  async loadUserData() {
    this.userData = this.storageService.getUserData();
    console.log('userData:', this.userData);
  }

  async loadUserName() {
    try {
      const name = await this.userService.getCurrentUserName();
      this.userName = name || 'Unbekannter Benutzer';
    } catch (error) {
      console.error('Fehler beim Laden des Benutzernamens', error);
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

    this.isUploading = true;
    task.percentageChanges().subscribe(percent => {
      this.uploadPercent = percent;
    });

    task.snapshotChanges().pipe(
      finalize(async () => {
        this.avatarUrl = await fileRef.getDownloadURL().toPromise();
        await this.saveAvatar(this.avatarUrl);
        this.currentAvatar = this.avatarUrl;
        this.uploadPercent = 0;
        this.isUploading = false;
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
    this.finish = true;
    setTimeout(() => {
    this.storageService.logInStep();
  },1500);}
}
