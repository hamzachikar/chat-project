import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private logCompte:Compte;
  constructor(private authenticationService: AuthenticationService,private router: Router) { }

  ngOnInit() {
    this.authenticationService.getLogCompte().subscribe(users => {
      this.logCompte=users;
      console.log(users);
      if(this.logCompte){
        if(this.logCompte.roles[0].roleName==='ROLE_ADMIN'||this.logCompte.roles[0].roleName==='ROLE_MANAGER'){
          this.router.navigate(['/dasch']);
        }
        else{
          this.router.navigate(['/chat-box']);
        }
      }
      else{
        this.router.navigate(['/login']);
      }
      
  });
  }

}
