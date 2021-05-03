import { Component } from '@angular/core';
import { Compte } from './models/compte/compte';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authenticateService/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assosiation';
  currentUser:Compte;
  opened:boolean=true;
  constructor( private router: Router,
    private authenticationService: AuthenticationService){
      this.authenticationService.currentUser.subscribe(x =>{
        this.currentUser =x;
        if(this.currentUser){
          this.authenticationService.getLogCompte().subscribe(data=>this.currentUser=data);
        }
      });
      
    }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
openNav(){
  this.opened=!this.opened;
}
checkRole(compte:Compte):boolean{
  var isUser=false
  console.log(this.currentUser);
    for(let role of this.currentUser.roles){
      if(role.roleName==="ROLE_USER"){
        isUser=true;
        break;
      }
    }
    return isUser;
}
}
