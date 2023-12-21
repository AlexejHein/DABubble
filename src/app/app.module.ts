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
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

@NgModule({
  declarations: [
    AppComponent,
    StartScreenComponent,
    LoginComponent,
    RegisterComponent,
    ChooseAvatarComponent,
    SendEmailComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"dabubble-97d36","appId":"1:7321163189:web:ccc6f61096f18ad9fab5fc","storageBucket":"dabubble-97d36.appspot.com","apiKey":"AIzaSyB7yQy3kZNdO3QSJUnhQFmfCWHsVsc0sPo","authDomain":"dabubble-97d36.firebaseapp.com","messagingSenderId":"7321163189"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideMessaging(() => getMessaging())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
