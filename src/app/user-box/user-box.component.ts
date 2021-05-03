import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Msg } from '../models/message/msg';
import { MessageService } from '../services/messageService/message.service';
import { Conversation } from '../models/conversation/conversation';
import { Message } from '../models/message';

enum typeMessage{
  edu="edu",
  trans="trans",
  med="med",
  admin="admin",
  all="all"
}

@Component({
  selector: 'user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent implements OnInit {
  @ViewChild('demandBox',{static: true}) demandBox:any;
  @ViewChild('sendDmdService',{static: true}) closeModal: ElementRef;
  messageAbs:Msg[]=[];
  msgSrvSent:[Msg,number][]=[];
  selectedSug:string=null;
  sujet:string;
  messages:Msg[]=[];
  private nbrMessageReceived:number=0;
  service:string;
  valid:boolean=false;
  logCompte:Compte;
  sugMsg=[
    'mon profile',
    'demande de bultin scolaire',
    'demande d\'une fiche medicale',
    'informer une absence',
    'demande d\'emplois du temps',
    'informer une maladie',
    'reclamation d\'une violance ou mal traitence',
    'demande d\'une assistance medicale',
    'autre ...'
  ];
  nbrJour=0;
  description:string;
  max = 100;
  min = 0;
  step=1;
  constructor(private msgService:MessageService,private authService:AuthenticationService) { }
  
  ngOnInit() {
    this.authService.getLogCompte().subscribe(data=>this.logCompte=data);
  }
  checkSug(sug:String):boolean{
    if(sug==="reclamation d\'une violance ou mal traitence"||sug==="autre ..."){
      return true;
    }
    else{
      return false;
    }
  }
  setSelectedSug(sug:string){
    this.valid=false;
    this.description=null;
    this.nbrJour=0;
    this.selectedSug=sug;
    if(this.selectedSug==='autre ...'||this.selectedSug==='reclamation d\'une violance ou mal traitence'||this.selectedSug==='mon profile'){
      this.service=typeMessage.admin;
    }
    if(this.selectedSug==='demande de bultin scolaire'||this.selectedSug==='demande d\'emplois du temps'||this.selectedSug==='informer une absence'){
      this.service=typeMessage.edu;
    }
    if(this.selectedSug==='informer une maladie'||this.selectedSug==='demande d\'une assistance medicale'||this.selectedSug==='demande d\'une fiche medicale'){
      this.service=typeMessage.med;
    }
  }
  showTextArea():boolean{
    if(this.selectedSug){
      if(this.selectedSug==="informer une absence"){
        return false;
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }
  onSubmitDemandForm(){
    if(this.selectedSug==='informer une absence'){
      if(this.description===''||this.description===null||this.nbrJour===0||this.nbrJour===null){
        console.log('not valid')
        alert('veuillez remplir tout les donnees')
        return;
      }
      else{
        this.sendMsgToService();
        this.closeModal.nativeElement.click();
        console.log('valid')
      }
    }
    else{
      if(this.selectedSug==='autre ...'){
        if(this.sujet!==""&&this.sujet){
          if(this.description!==""&&this.description){
            this.sendMsgToService();
            this.closeModal.nativeElement.click();
          }
         else{
          alert('veuillez remplir tout les donnees')
           return;
         }
         }
         else{
          alert('veuillez remplir tout les donnees')
           return
         }
      }
      else{
        if(this.description===''||this.description===null){
          alert('veuillez remplir tout les donnees')
          return;
        }
        else{
          this.closeModal.nativeElement.click();
          this.sendMsgToService()
        }
      }
    }
  
  }
  checkData(){
   
    if(this.selectedSug){
     if(this.selectedSug!=="autre ..."){
      if(this.nbrJour!==0){
        if(this.description!==""&&this.description){
          this.valid=true;
        }
      }
      if(this.description!==""&&this.description){
        this.valid=true;
      }
      if(this.description===""){
        console.log("active")
        this.valid=false;
      }
     }
     else{
       if(this.sujet!=""&&this.sujet){
        if(this.description!==""&&this.description){
          this.valid=true;
        }
        if(this.description===""){
          console.log("active")
          this.valid=false;
        }
       }
     }
    }
  }
  getMessage():Msg{
    let message=new Msg();
    if(this.selectedSug!=="autre ..."){
      if(this.nbrJour!==0){
        message.type=this.selectedSug;
        message.msg="absence de "+this.nbrJour+" jours ==> "+this.description;
      }
      else{
        message.type=this.selectedSug;
        message.msg=this.description;
        console.log(this.selectedSug+" "+this.description);
      }
    }
    else{
      message.type=this.sujet;
      message.msg=this.description;
    }
    message.fromContact=this.logCompte;
    console.log([message,this.service]);
    return message
  }
  checkMsg(msg:Msg):number{
    let nbr=0;
    for(let m of this.messages){
      if(!m.status&&m.type==='message'){
        if(m.fromContact.id===msg.toContact.id&&m.toContact.id===this.logCompte.id&&m.cvr.id===msg.cvr.id){
          nbr+=1;
        }
      }
    
    }
    return nbr;
  }
  sendMsgToService(){
    this.msgService.postUserMessage(this.getMessage(),this.service).subscribe(x=>{
      this.selectedSug=null;
      alert('votre demande est en cours de traitement');
    });
  }
  setMsgAbs(m:Msg):Msg{
    let msg=new Msg();
    msg.cvr=m.cvr;
    msg.fromContact=m.fromContact;
    msg.status=m.status;
    msg.msg=m.msg;
    msg.type=m.type;
    return msg;
  }
  loadDemandService(){
    this.msgSrvSent=[];
    this.messageAbs=[];
    this.msgService.getAllMessage().subscribe(data=>{
      this.messages=data;
      this.msgService.getServiceMsg(this.logCompte).subscribe(data=>{
        for(let m of data){
             if(m.cvr.active){
               this.msgSrvSent.push([m,this.checkMsg(m)]);
              }
        }
        for(let element of this.messageAbs){
          this.msgSrvSent.push([element,0]);
        }
      })
    });
  }
  notif(m:Message){
    if(!this.demandBox.nativeElement.ariaModal){
      if(m.fromId!==this.logCompte.id+''){
        this.nbrMessageReceived=this.nbrMessageReceived+1;
      }
     
    }
    for(let msg of this.msgSrvSent){
      if(''+msg[0].cvr.id===m.cvrId){
        this.msgSrvSent[this.msgSrvSent.indexOf(msg)][1]+=1;
        break;
      }
    }
  }
}

