import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { Roles } from '../models/roles/role';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  openMessage:boolean=false;
  logCompte:Compte;
  constructor(private authService:AuthenticationService) { }

  ngOnInit() {
    this.authService.getLogCompte().subscribe(data=>this.logCompte=data);
  }
  getRole(compte:Compte):string{
    for(let role of this.logCompte.roles){
      return role.roleName;
    }
  }
}
