import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Image } from '../models/image/image';
import { SideNavBarComponent } from '../side-nav-bar/side-nav-bar.component';
import { EventEmitterService } from '../_helpers/event-emitter.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  compte:Compte;
  change:boolean;
  retrieveResonse: any;
  base64Data: any;
  selectedFile: File;
  message: string;
  profileImage:Image;
  @Output()
  changeImage=new EventEmitter<boolean>();
  constructor(private athenticationService:AuthenticationService,private sanitizer:DomSanitizer,private httpClient:HttpClient,private eventEmitter:EventEmitterService) { }

  ngOnInit() {
    this.athenticationService.getLogCompte().subscribe(data=>{
      this.compte=data;
      console.log(data);
      this.getImage(this.compte.contact.imageModel.id);
    })
    this.eventEmitter.currentChange.subscribe(msg=>this.profileImage=msg); 
   }
transform(){
  if(this.profileImage.picByte){
    return this.sanitizer.bypassSecurityTrustResourceUrl( 'data:image/png;base64,' +  this.profileImage.picByte);
  }
  else{
    return null;
  }
}
getImage(id:Number) {
  //Make a call to Sprinf Boot to get the Image Bytes.
  this.httpClient.get<Image>('http://localhost:8080/image/get/'+id)
    .subscribe(
      res => {
        this.profileImage=res;
        this.eventEmitter.changeImage(this.profileImage);
        console.log(this.profileImage);
      }
    );
}

public onFileChanged(event) {
  this.selectedFile = event.target.files[0];
  //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.  
  const uploadImageData = new FormData(); 
  uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
  console.log(122222222222222220);
 //Make a call to the Spring Boot Application to save the image 
  this.httpClient.post<Image>('http://localhost:8080/image/upload/'+this.compte.contact.id, uploadImageData) 
    .subscribe(response => {
        this.message = 'Image uploaded successfully';
        console.log( response.id);
      this.getImage(response.id);
      console.log(this.profileImage);
      
    }
    );  
}
}
