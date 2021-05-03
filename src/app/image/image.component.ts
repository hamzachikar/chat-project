import { Component, OnInit, ViewChild} from '@angular/core';
import { MessageService } from '../services/messageService/message.service';
import { Msg } from '../models/message/msg';
import { Conversation } from '../models/conversation/conversation';
import { Contact } from '../models/contact/contact';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource, throwMatDuplicatedDrawerError, MatSort, MatPaginator } from '@angular/material';
import { Compte } from '../models/compte/compte';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Message } from '../models/message'

enum typeMessage{
  edu="edu",
  trans="trans",
  med="med",
  admin="admin",
  all="all"
}

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})


export class ImageComponent implements OnInit {
  @ViewChild('demandBox',{static: true}) demandBox:any;
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
    console.log(this.service)
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
        return;
      }
      else{
        this.sendMsgToService()
        console.log('valid')
      }
    }
    else{
      if(this.selectedSug==='autre ...'){
        if(this.sujet!==""&&this.sujet){
          if(this.description!==""&&this.description){
            console.log('valid');
            this.sendMsgToService()
          }
         else{
           console.log('not valid');
           return;
         }
         }
         else{
           console.log('not valid');
           return
         }
      }
      else{
        if(this.description===''||this.description===null){
          console.log('not valid');
          return;
        }
        else{
          console.log('valid');
          this.sendMsgToService()
        }
      }
    }
  
  }
 
  getMessage():Msg{
    let message=new Msg();
    if(this.selectedSug!=="autre ..."){
      if(this.selectedSug==='informer une absence'){
        message.type=this.selectedSug;
        message.msg="absence de "+this.nbrJour+" jours ==> "+this.description;
      }
      else{
        message.type=this.selectedSug;
        message.msg=this.description;
      }
    }
    else{
      message.type=this.sujet;
      message.msg=this.description;
    }
    message.fromContact=this.logCompte;
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
  checkAbsMsg(m:Msg){
    let msg=this.setMsgAbs(m);
    if(this.messageAbs.length===0){
      this.messageAbs.push(msg);
    }
    else{
      let flag=false;
      let index=-1;
      console.log(index);
      for(let element of this.messageAbs){
        if(element.cvr.id===m.cvr.id){
          flag=true;
          if(element.status&&m.status){
            index=this.messageAbs.indexOf(element);
          }
          else{
            element.status=false;
          }
          break; 
        }
      }
      if(index>=0){
        this.messageAbs.splice(index);
      }
      if(!flag){
        this.messageAbs.push(msg);
      }
    }
  }
  loadDemandService(){
    this.msgSrvSent=[];
    this.messageAbs=[];
    this.msgService.getAllMessage().subscribe(data=>{
      this.messages=data;
      this.msgService.getServiceMsg(this.logCompte).subscribe(data=>{
        for(let m of data){
          if(m.type==='informer une absence'){
            this.checkAbsMsg(m);
           }
           else{
             if(m.cvr.active){
               this.msgSrvSent.push([m,this.checkMsg(m)]);
              }
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

