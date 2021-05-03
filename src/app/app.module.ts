import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { ContactComponent,FilterPipe } from './contact/contact.component';
import { JwModalComponent } from './jw-modal/jw-modal.component';
import { EditInputComponent } from './edit-input/edit-input.component';
import { ModelService } from 'src/_service/model.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ImageComponent } from './image/image.component';
import { FormContactComponent } from './form-contact/form-contact.component';
import { ProfileComponent } from './profile/profile.component';
import { CompteComponent } from './compte/compte.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material';
import { EventEmitterService } from './_helpers/event-emitter.service';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import {MatBadgeModule} from '@angular/material/badge';
import { ToastrModule } from 'ngx-toastr';
import { SocketService } from './services/socketService/socket.service';
import { MsgBoxComponent } from './msg-box/msg-box.component';
import { UserBoxComponent } from './user-box/user-box.component';
import {MatChipsModule} from '@angular/material/chips';
import { MsgHomeComponent } from './msg-home/msg-home.component';
import { ChartsModule } from 'ng2-charts';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HistoryComponent } from './history/history.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    TopNavBarComponent,
    SideNavBarComponent,
    DashBoardComponent,
    ContactComponent,
    JwModalComponent,
    FilterPipe,
    EditInputComponent,
    ImageComponent,
    FormContactComponent,
    ProfileComponent,
    CompteComponent,
    ChatBoxComponent,
    MsgBoxComponent,
    UserBoxComponent,
    MsgHomeComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FilterPipeModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 3000 }),
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatBadgeModule,
    MatChipsModule,
    ChartsModule,
    MatSortModule,
    MatTableModule,
    MatSliderModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  providers: [ FilterPipe, ModelService,EventEmitterService,SocketService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
