import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth.guard";
import { StartScreenComponent } from './start-screen/start-screen.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import { ImpressComponent } from './impress/impress.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  {path:'',component:StartScreenComponent},
  {path: 'reset-password',component:ResetPasswordComponent},
  { path: 'dashboard', canActivate: [AuthGuard], component: DashboardComponent },
  {path:'impressum', component:ImpressComponent},
  {path:'privacy', component:PrivacyComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
