import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./auth.guard";
import { StartScreenComponent } from './start-screen/start-screen.component';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {path:'',component:StartScreenComponent},
  {
    path: 'dashboard', canActivate: [AuthGuard],
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
