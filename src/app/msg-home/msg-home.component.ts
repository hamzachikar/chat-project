import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { Msg } from '../models/message/msg';
import { MessageService } from '../services/messageService/message.service';
import { CvrService } from '../services/cvrService/cvr.service';
import { Message } from '../models/message';
import {MsgBoxComponent} from '../msg-box/msg-box.component'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeInItems } from '@angular/material';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';


@Component({
  selector: 'app-msg-home',
  templateUrl: './msg-home.component.html',
  styleUrls: ['./msg-home.component.scss']
})
export class MsgHomeComponent implements OnInit {
  @ViewChild('msgModal',{static: false}) msgModal:any ; 
  @ViewChild('msgBox',{static: true}) msgBox:MsgBoxComponent;
  @ViewChild('notifBox',{static: true}) notifBox:any;
  @ViewChild('close',{static: true}) closeModal: ElementRef;
  messagesAbs:Msg[]=[];
  private roleLogCompte:string;
  selectedDemand:Msg;
  private messages:Msg[]=[];
  private logCompte:Compte;
  private srvMessage:[Msg,number][]=[]
  private notifMsg:Msg[]=[];
  private rejectedDmd:Msg;
  private nbrNotifReceived:number=0;
  private openChat:boolean=false;
  private submitted:boolean=true;
  nbrMessageR:number=0;
  notifForm:FormGroup;
  deleteForm:FormGroup;
  listService:string[]=['all','administration','parent','transport','paramedicale','education'];
  constructor(private authService:AuthenticationService,private msgService:MessageService,private cvrService:CvrService,private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.messagesAbs=[];
    this.notifForm = this.formBuilder.group({
      service: ['', Validators.required],
      messageSrv: ['', Validators.required]
     });
     this.deleteForm = this.formBuilder.group({
      description: ['', Validators.required]
     });
    this.srvMessage=[];
    this.authService.getLogCompte().subscribe(data=>{
      this.logCompte=data;
      for(let role of this.logCompte.roles){
        this.roleLogCompte=role.roleName;
      }
      this.msgService.getAllMessage().subscribe(data=>{
        this.messages=data;
        for(let msg of data){
          if(msg.type!=='message'&&msg.type!=='notif'&&msg.toContact.id===this.logCompte.id&&msg.cvr.active){
            if(msg.cvr.status==='open'||msg.cvr.status==='WAIT'){
              this.srvMessage.push([msg,this.checkMsg(msg)]);
            }
          }
          if(msg.type==="notif"&&msg.status===false){
            if(msg.toContact.id===this.logCompte.id){
              this.nbrNotifReceived=this.nbrNotifReceived+1;
            }
          }
          if(msg.type==="message"&&msg.status===false){
            if(msg.toContact.id===this.logCompte.id&&(msg.fromContact.roles[0].roleName==='ROLE_ADMIN'||msg.fromContact.roles[0].roleName==='ROLE_MANAGER'||msg.fromContact.roles[0].roleName==='ROLE_EMPLOYEE')){
              this.nbrMessageR=this.nbrMessageR+1;
            }
          }
        }
        this.loadNotificationMsg();
      })
    });
  }
  onSubmitNotifForm(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.notifForm.invalid) {
      return;
    }
   else{
    this.sendNotificationService(this.notifForm.controls['messageSrv'].value,this.notifForm.controls['service'].value);
    this.submitted = false;
    this.notifForm.reset();
   }
  }
  sendNotificationService(msg:string,service:string){
    this.msgBox.sendNotificationService(msg,service);
  }
  checkMsgAbs(m:Msg){
    if(this.messagesAbs.length!==0){
      for(let msg of this.messagesAbs){
        if(msg.id!==m.id&&msg.cvr.id===m.cvr.id&&msg.status){
          this.sendNotificationToContact(
            'la demande de '+m.type+' a ete approuver',m.fromContact.id
          );
        }
      }
    }
  }
  validate(m:Msg){
    if(!m.status){
      if(m.type==='informer une absence'){
        m.cvr.status='close';
        m.cvr.active=false;
        this.cvrService.save(m.cvr).subscribe(data=>{
          this.srvMessage=this.srvMessage.filter(eachMsg=>eachMsg[0].id!==m.id)
          this.msgService.seen(m.id).subscribe(data=>{
            this.sendNotificationToContact(
              'la demande de '+m.type+' a ete approuver',m.fromContact.id
            );
            this.sendNotifToServiceManager(
              'le manager du service education a approuve la demande de '+m.type+'==>'+m.msg+' du parent '+m.fromContact.contact.nom+' '+m.fromContact.contact.prenom,
              'transport'
            );
          });
        }
        )
       
      }
      else{
        let cvr=m.cvr;
        cvr.status='open'
        m.status=true;
        this.cvrService.save(cvr).subscribe(data=>{
          m.cvr=data;
          this.msgService.seen(m.id).subscribe(data=>{
            for(let msg of this.srvMessage){
              if(data.id===msg[0].id){
                this.srvMessage[this.srvMessage.indexOf(msg)][0]=data;
                break;
              }
            }
            this.sendNotificationToContact(
              'la demande:'+m.type+' a ete approuver',m.fromContact.id
            );
            alert("la demande a ete approuver");  
          },
          error=>{
            alert("transaction n'ai pas valide")
          }
          )
        });
      }

    }
   else{
    
   }
  }
  reject(){
    if (this.deleteForm.invalid) {
      return;
    }
    else{
      let cvr=this.rejectedDmd.cvr;
      cvr.active=false;
      cvr.status='rejected';
      this.cvrService.save(cvr).subscribe(data=>{
        this.srvMessage=this.srvMessage.filter(eachMsg=>eachMsg[0].id!==this.rejectedDmd.id)
        this.sendNotificationToContact(
          'la demande '+this.rejectedDmd.type+'a ete rejeter parceque '+this.deleteForm.controls['description'].value,this.rejectedDmd.fromContact.id
        );
        this.closeModal.nativeElement.click();
        this.deleteForm= this.formBuilder.group({
          description: ['', Validators.required]
         });
      });
    }
   
  }
  setRejectedDmd(m:Msg){
    console.log(m);
    this.rejectedDmd=m;
  }
  closeCvr(m:Msg){
    console.log('closing ........')
    let cvr=m.cvr
    cvr.active=false;

    cvr.status='close'
    this.cvrService.save(cvr).subscribe(data=>{
      this.srvMessage=this.srvMessage.filter(eachMsg=>eachMsg[0].id!==m.id)
      this.sendNotificationToContact(
        'la demande:'+m.type+' a ete cloturer',m.fromContact.id
      );
    });
  }
  checkMsg(msg:Msg):number{
    let nbr=0;
    for(let m of this.messages){
      if(m.toContact){
        if(!m.status){
          if(m.fromContact.id===msg.fromContact.id&&m.toContact.id===this.logCompte.id&&m.type==='message'&&m.cvr.id===msg.cvr.id){
            nbr+=1;
          }
        }
      
      }
     
    }
    return nbr;

  }
  chat(){
    this.openChat=!this.openChat;
  }
  notif(c:Message){
    if(this.logCompte.id+''!==c.fromId){
      if(c.type==='notif'){
      if(!this.notifBox.nativeElement.ariaModal){
          this.nbrNotifReceived=this.nbrNotifReceived+1;
        }
        this.loadNotificationMsg();
      }
     
      else{
        let flag=false;
        for(let msg of this.srvMessage){
          if(!this.msgModal.nativeElement.ariaModal){
            if(''+msg[0].cvr.id===c.cvrId){
              this.srvMessage[this.srvMessage.indexOf(msg)][1]+=1;
              flag=true
              break;
            }
          }
          else{
            if(this.selectedDemand&&this.selectedDemand.cvr.id+''!==c.cvrId){
              if(''+msg[0].cvr.id===c.cvrId){
                flag=true;
                this.srvMessage[this.srvMessage.indexOf(msg)][1]+=1;
                break;
              }
           }
          }
        }
        if(!this.msgModal.nativeElement.ariaModal&&flag===false){
          this.nbrMessageR=this.nbrMessageR+1;
        }
        
      }
      }
     
  }
  
  sendNotificationToContact(message:string,idContact:number){
    this.msgBox.sendMessageNotifToContact(message,idContact);
  }
  sendNotifToServiceManager(message:string,service:string){
    this.msgBox.sendNotifToServiceManeger(message,service);
  }
  loadNotificationMsg(){
    this.notifMsg=[];
    this.msgService.getAllMessage().subscribe(data=>{
      this.messages=data;
      for(let n of this.messages){
        if(n.type==='notif'&&!n.status){
          if(n.toContact.id===this.logCompte.id){
            this.notifMsg.push(n)
           
          }
         
        }
      }
    })
  }
  notifValidate(m:Msg){
    m.status=true;
    this.msgService.seen(m.id).subscribe(data=>{
      this.notifMsg=this.notifMsg.filter(eachMsg=>eachMsg.id!==data.id);
    });
  }
  checkRole(r:string):boolean{
    if(this.logCompte.roles){
      if(r==='admin'){
        for(let role of this.logCompte.roles){
          if(role.roleName==='ROLE_ADMIN'||role.roleName==='ROLE_MANAGER'){
            return true;
          }
        }
      }
      if(r==='empl'){
        for(let role of this.logCompte.roles){
          if(role.roleName==='ROLE_EMPLOYEE'){
            return true ;
          }
        }
      }
      if(r==='client'){
        for(let role of this.logCompte.roles){
          if(role.roleName==='ROLE_USER'){
            return true;
          }
        }
      }
    }
  }
  getDate(d:any):string{
    let date=new Date(d);
    let dd=date.getDay();
    let mm=date.getMonth();
    let yy=date.getFullYear();
    return dd+'/'+mm+'/'+yy ;
  }
}