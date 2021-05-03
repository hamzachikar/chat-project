import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_helpers';
import { HomeComponent } from './home/home.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { ContactComponent } from './contact/contact.component';
import { ImageComponent } from './image/image.component';
import { ProfileComponent } from './profile/profile.component';
import { MsgHomeComponent } from './msg-home/msg-home.component';
import { HistoryComponent } from './history/history.component';


const routes: Routes = [{ path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent ,canActivate: [AuthGuard]},
{ path: 'history', component: HistoryComponent ,canActivate: [AuthGuard]},
{path:'',  redirectTo: '/home',pathMatch: 'full',canActivate: [AuthGuard]},
{ path: 'dasch', component: DashBoardComponent ,canActivate: [AuthGuard]},
{ path: 'contact', component: ContactComponent ,canActivate: [AuthGuard]},
{ path: 'profile', component:ProfileComponent ,canActivate: [AuthGuard]},
{ path: 'chat-box', component: MsgHomeComponent ,canActivate: [AuthGuard]},
{ path: 'test', component: ImageComponent ,canActivate: [AuthGuard]}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
