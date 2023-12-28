import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AngularFirestore, AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { environment} from "../environment/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { FormsModule } from '@angular/forms';
import { ImpressComponent } from './impress/impress.component';
import { SearchComponent } from './dashboard/search/search.component';
import { ThreadComponent } from './dashboard/thread/thread.component';
import { WorkspaceMenuComponent } from './dashboard/workspace-menu/workspace-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyProfileComponent } from './dashboard/my-profile/my-profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserMenuComponent } from './dashboard/my-profile/user-menu/user-menu.component';
import { UserListComponent } from './dashboard/user-list/user-list.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogAddChannelComponent } from './dialog-add-channel/dialog-add-channel.component';
import { ThreadListComponent } from './dashboard/thread-list/thread-list.component';


@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    LoginComponent,
    RegisterComponent,
    ChooseAvatarComponent,
    SendEmailComponent,
    ResetPasswordComponent,
    ImpressComponent,
    DashboardComponent,
    WorkspaceMenuComponent,
    ThreadComponent,
    SearchComponent,
    MyProfileComponent,
    UserMenuComponent,
    UserListComponent,
    DialogAddChannelComponent,
    ThreadListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyB7yQy3kZNdO3QSJUnhQFmfCWHsVsc0sPo",
      authDomain: "dabubble-97d36.firebaseapp.com",
      projectId: "dabubble-97d36",
      storageBucket: "dabubble-97d36.appspot.com",
      messagingSenderId: "7321163189",
      appId: "1:7321163189:web:ccc6f61096f18ad9fab5fc"
    })),
    provideFirestore(() => getFirestore()),
    MatIconModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
