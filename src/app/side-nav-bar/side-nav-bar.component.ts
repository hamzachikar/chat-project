import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Compte } from '../models/compte/compte';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { EventEmitterService } from '../_helpers/event-emitter.service';
import { Image } from '../models/image/image';

@Component({
  selector: 'sideNav',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  @Output()
  logOut=new EventEmitter<boolean>();
  change:boolean;
  logCompte:Compte;
  retrievedImage: any;
  base64Data: any;
  profileImage:Image;
  retrieveResonse: any;
  selectedLink:string='';
  constructor(private authenticationService: AuthenticationService,private sanitizer:DomSanitizer,private httpClient: HttpClient,private eventEmitter:EventEmitterService) { }

  ngOnInit() {
    this.authenticationService.getLogCompte().subscribe(users => {
      if(users){
        this.logCompte=users;   
        this.getImage();
      }
  });
    this.eventEmitter.currentChange.subscribe(msg=>{
      if(msg.picByte){
        this.retrievedImage='data:image/png;base64,' +msg.picByte;
      }
     
});
  }
  setSelectedLink(s:string){
    this.selectedLink=s;
  }
  checkRole(b:string):boolean{
    if(this.logCompte){
      for (let role of this.logCompte.roles) {
        if(b==='adminManager'){
          if(role.roleName==='ROLE_ADMIN'||role.roleName==='ROLE_MANAGER'){
            return true;
          }
        }
        else{
          if(role.roleName=="ROLE_ADMIN"){
            return true;
          }
        }
    }
  }
      
    }
    transform(){
      if(this.profileImage){
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.retrievedImage);
      }
      
  }
  getImage() {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.httpClient.get<Image>('http://localhost:8080/image/get/'+this.logCompte.contact.imageModel.id)

      .subscribe(

        res => {

          this.profileImage= res;
          this.retrievedImage = 'data:image/png;base64,' +this.profileImage.picByte;

        }

      );

  }
  logout(){
    this.logOut.emit();
  }
  getRole():string{
    let r;
    for(let role of this.logCompte.roles){
      if(role.roleName==='ROLE_ADMIN'){
        r='ADMINISTRATEUR';
        break;
      }
      if(role.roleName==='ROLE_MANAGER'){
        r='MANAGER';
        break;
      }
      if(role.roleName==='ROLE_EMPLOYEE'){
        r='EMPLOYEE';
        break;
      }
      if(role.roleName==='ROLE_USER'){
        r='UTILISATEUR';
        break;
      }

    }
    if(r){
      return r;
    }
  }
  }

