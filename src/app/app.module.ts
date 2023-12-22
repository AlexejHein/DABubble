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
import { AngularFirestore} from "@angular/fire/compat/firestore";
import { environment} from "../environment/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { FormsModule } from '@angular/forms';
import { ImpressComponent } from './impress/impress.component';
import { SearchComponent } from './dashboard/search/search.component';
import { ThreadComponent } from './dashboard/thread/thread.component';
import { WorkspaceMenuComponent } from './dashboard/workspace-menu/workspace-menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
