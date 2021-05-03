import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { environment } from '../models/envirenement';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from '../models/message';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { SocketService } from '../services/socketService/socket.service';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Compte } from '../models/compte/compte';
import { CompteService } from '../services/compteService/compte.service';
import { Conversation } from '../models/conversation/conversation';
import { CvrService } from '../services/cvrService/cvr.service';
import { MessageService } from '../services/messageService/message.service';
import { Msg } from '../models/message/msg';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'msg-box',
  templateUrl: './msg-box.component.html',
  styleUrls: ['./msg-box.component.scss']
})
export class MsgBoxComponent implements OnInit,OnDestroy,AfterViewChecked{
  static sendMessageService(arg0: string, arg1: string) {
    throw new Error("Method not implemented.");
  }
  @ViewChild('msgs',{static: false}) msgContent:ElementRef ; 
  private serverUrl = environment.url + 'socket';
  showContacts:boolean=true;
  @Output() msgR=new EventEmitter<Message>();
  demand:Msg=new Msg();
  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  private stompClient;
  private cvr:Conversation[]=[];
  private convo:Conversation=new Conversation();
  private form: FormGroup;
  contacts:Compte[];
  contactToShow:Compte[]=[];
  selectetC:Compte;
  private userForm: FormGroup;
  private logCompte:Compte;
  messages: Message[] = [];
  selectCompte:Compte=new Compte();
  adminContact:[Compte,number][]=[];
  managerContact:[Compte,number][]=[];
  employeContact:[Compte,number][]=[];
  constructor(private sanitizer:DomSanitizer,private msgService:MessageService,private cvrService:CvrService,private compteService:CompteService,private socketService: SocketService,private authenticationService: AuthenticationService,private toastr: ToastrService) { }
  ngAfterViewChecked(): void {
    if(this.msgContent){
      this.msgContent.nativeElement.scrollTop=this.msgContent.nativeElement.scrollHeight;
    }
  }
  ngOnDestroy(){
   
  }
  ngOnInit() {
    this.compteService.getContact().subscribe(data=>{this.contacts=data;
      this.authenticationService.getLogCompte().subscribe(users => {
        this.logCompte=users;
        for(let c of this.contacts){
          if(c.id===this.logCompte.id){
            this.contacts.splice(this.contacts.indexOf(c,0),1)
          }
        }
        for(let role of this.logCompte.roles){
          if(role.roleName==='ROLE_ADMIN'){
            for(let c of this.contacts){
              this.groupContactGr(c);
            }
          }
          if(role.roleName==='ROLE_MANAGER'){
            for(let c of this.contacts){
              if(c.contact.groupe==='ADMINISTRATION'||c.contact.groupe===this.logCompte.contact.groupe||c.roles[0].roleName===role.roleName){
                this.groupContactGr(c);
              }
            }
            
          }
          if(role.roleName==='ROLE_EMPLOYEE'){
            for(let c of this.contacts){
              for(let r of c.roles){
                if(r.roleName==='ROLE_ADMIN'){
                  this.groupContactGr(c);
                }
                if(c.contact.groupe===this.logCompte.contact.groupe&&r.roleName==='ROLE_MANAGER'){
                  this.groupContactGr(c);
                }
              }
            
            }
          }
        }
        this.userForm = new FormGroup({
          fromId: new FormControl(this.logCompte.id, [Validators.required]),
          toId: new FormControl(null)
        })
        this.cvrService.getCvrs(this.logCompte).subscribe(data=>{
          if(data){
            this.cvr=data;
          }
        });
        this.initializeWebSocketConnection();
    });
      this.form = new FormGroup({
        message: new FormControl(null, [Validators.required])
      })
    this.loadNotifContact();
    });
  }
  loadNotifContact(){
    this.msgService.getAllMessage().subscribe(
      data=>{
        for(let msg of data){
          if(msg.type==='message'){
            for(let c of this.contacts){
              if(c.id===msg.fromContact.id&&this.logCompte.id===msg.toContact.id&&!msg.status){
                this.notif(c.id+'');
                break;
              }
            }
          }
        }
      }
    )
  }
  groupContactGr(c:Compte){
      if(c.contact.groupe!=='PARENT'){
       for(let r of c.roles){
         if(r.roleName==='ROLE_MANAGER'){
           this.managerContact.push([c,0]);
         }
         if(r.roleName==='ROLE_EMPLOYEE'){
           this.employeContact.push([c,0]);
         }
         if(r.roleName==='ROLE_ADMIN'){
           this.adminContact.push([c,0]);
         }
       }
      }
    
  }
  refresh(){
    this.showContacts=true;
    this.convo=new Conversation();
    this.selectCompte=new Compte();
    this.demand=new Msg();
    this.selectetC=null;
    this.messages= [];
    this.userForm = new FormGroup({
      fromId: new FormControl(this.logCompte.id, [Validators.required]),
      toId: new FormControl(null)
    });
  }
  sendMessageUsingSocket() {
    if (this.form.valid) {
      let message: Message = {id:0,message: this.form.value.message,fromId:''+this.userForm.value.fromId, toId: this.userForm.value.toId,type:'message', att:0,cvrId:''+this.convo.id };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(message));
      this.form = new FormGroup({
        message: new FormControl(null, [Validators.required])
      })
      }
  }

  sendMessageUsingRest() {
    if (this.form.valid) {
      let message: Message = { id:0,message: this.form.value.message, fromId: this.userForm.value.fromId, toId: this.userForm.value.toId ,type:'message', att:0,cvrId:''+this.convo.id };
      console.log(message);
      this.socketService.post(message).subscribe(res => {
        console.log(res);
        this.messages.push(message);
        this.form.value.message=null;
      })
    }
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl+'?jwt='+this.authenticationService.currentUserValue.jwt);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      console.log('isloaded...............');
      that.isLoaded = true;
      that.openSocket();
    });
  }

  openGlobalSocket() {
    this.stompClient.subscribe("/socket-publisher", (message) => {
      this.handleResult(message);
    });
  }

  openSocket() {
    if (this.isLoaded) {
      this.isCustomSocketOpened = true;
      this.stompClient.subscribe("/socket-publisher/"+this.logCompte.id, (message) => {
        this.handleResult(message);
      });
    }
  }
  findContact(id:string):Compte{
    let compte;
    for(let c of this.contacts){
      if(c.id+''===id){
        compte=c;
        break;
      }
    }
    if(compte){
      return compte;
    }
    else{
      return null;
    }
  }
  notif(id:string){
    let compte=this.findContact(id);
    if(compte){
      if(compte.roles[0].roleName==='ROLE_ADMIN'){
        for(let c of this.adminContact){
          if(c[0].id+''===id){
            if(!this.isActive(c[0])){
              c[1]=c[1]+1;
            }
            else{
              c[1]=0
            }
            break;
          }
        }
      }
      if(compte.roles[0].roleName==='ROLE_MANAGER'){
        for(let c of this.managerContact){
          if(c[0].id+''===id){
            if(!this.isActive(c[0])){
              c[1]=c[1]+1;
            }
            else{
              c[1]=0
            }
            break;
          }
        }
      }
      if(compte.roles[0].roleName==='ROLE_EMPLOYEE'){
        for(let c of this.employeContact){
          if(c[0].id+''===id){
            if(!this.isActive(c[0])){
              c[1]=c[1]+1;
            }
            else{
              c[1]=0
            }
            break;
          }
        }
      }
     
    }
  }
  handleResult(message){
    if (message.body) {
      let messageResult: Message = JSON.parse(message.body);
      if(messageResult.cvrId===''+this.convo.id){
        console.log('for convo '+this.convo.id)
        if(messageResult.fromId===''+this.logCompte.id){
          this.messages.push(messageResult);
        }
        else{
           messageResult.att=1;
          this.messages.push(messageResult);
        }
  
      }
      this.msgR.emit(messageResult);
      this.notif(messageResult.fromId)
    }
  }
  setMessage(msg:Msg[]){
    console.log(msg);
    for(let m of msg){
      if(m.fromContact.id===this.logCompte.id){
        let message: Message = { id:m.id,message:''+m.msg, fromId:''+m.fromContact.id, toId:''+m.toContact.id ,type:m.type, att:0,cvrId:''+this.convo.id };
        this.messages.push(message);
      }
      else{
        let message: Message = { id:m.id,message:''+m.msg, fromId:''+m.fromContact.id, toId:''+m.toContact.id,type:m.type , att:1,cvrId:''+this.convo.id };
        this.messages.push(message);
        this.msgService.seen(m.id).subscribe();
      }
      
    }
  }
  setContacts(c:Compte[]){
    this.contacts=c;
  }
  setSelectContact(c:Compte){
    this.contacts=[];
    this.selectCompte=c;
  }
  deselectContact(){
    this.selectCompte=new Compte();
  }
  isActive(contact:Compte):Boolean{
    if(contact.id===this.selectCompte.id){
      return true;
    }
    else{
      return false;
    }
  }
  sendMessageNotifToContact(msg:string,idContact:number){
    console.log('message published');
    let m: Message = {id:0,message:msg,fromId:''+this.logCompte.id, toId:idContact+'',type:'notif', att:0,cvrId:'' };
    this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(m));
  }
  sendNotificationService(msg:string,service:string){
    let m: Message = {id:0,message:msg,fromId:''+this.logCompte.id, toId:'',type:'notif', att:0,cvrId:'' };
    if(service==='all'){
      for(let c of this.contacts){
        if(c.id!==this.logCompte.id){
          m.toId=c.id+'';
          this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(m));
        }
      }
    }
    else{
      for(let c of this.contacts){
        if(c.id!==this.logCompte.id){
          if(c.contact.groupe===service.toUpperCase()){
            m.toId=c.id+'';
            this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(m));
          }
        }  
      }
    }
  }
  sendNotifToServiceManeger(msg:string,service:string){
    let manager:Compte;
    for(let c of this.contacts){
      if(c.contact.groupe===service.toUpperCase()&&(c.roles[0].roleName==='ROLE_MANAGER'||c.roles[0].roleName==='ROLE_ADMIN')){
        manager=c;
        break;
      }
    }
    if(manager){
      let m: Message = {id:0,message:msg,fromId:''+this.logCompte.id, toId:manager.id+'',type:'notif', att:0,cvrId:'' };
      this.stompClient.send("/socket-subscriber/send/message", {}, JSON.stringify(m));
    }
    

  }
  setSelectedCvr(c:Conversation){
    console.log("++++++++++++"+c.id);
    this.messages=[];
    if(this.logCompte.id!==c.contact1.id){
      this.selectCompte=c.contact1;
      this.userForm.value.toId=''+c.contact1.id;
    }
    else{
      this.selectCompte=c.contact2;
      this.userForm.value.toId=''+c.contact2.id;
    }
    this.convo=c;
    this.msgService.getMsgCvr(this.convo).subscribe(data=>{
      this.setMessage(data);
    });
  }
  getMsgConvo(c:Conversation){
    this.msgService.getMsgCvr(c).subscribe(data=>{
      this.setMessage(data);
    });
  }
  setSelectedContact(contact:Compte){
    this.selectCompte=contact;
    this.messages=[];
    this.cvrService.getCvrs(this.logCompte).subscribe(data=>{
      if(data){
        this.cvr=data;
   
    if(this.cvr.length===0){
      this.convo.contact1=this.logCompte;
      this.convo.contact2=contact;
      this.convo.active=true;
      this.convo.status='chatEmpl';
      this.cvrService.save(this.convo).subscribe(data=>{
        this.convo=data;
        this.cvr.push(this.convo);
      this.getMsgConvo(this.convo);
      });
     
    }
    else{
      let found:boolean=false;
      if(contact.id!==this.logCompte.id){
        for(let conversation of this.cvr ){
          if(contact.id===conversation.contact1.id ||contact.id===conversation.contact2.id){
            this.convo=conversation;
            this.getMsgConvo(this.convo);
            found=true;
          }
        }
        if(!found){
          this.convo.id=0;
          this.convo.contact1=this.logCompte;
          this.convo.contact2=contact;
          this.convo.status='chatEmpl';
          this.convo.active=true;
          this.cvrService.save(this.convo).subscribe(data=>{this.convo=data;
            this.getMsgConvo(this.convo);
            this.cvr.push(this.convo);  
          });
          
          found=false;
        }
  
      }
      this.userForm.value.toId=''+contact.id;
      }
    }
  });
      
  }
  
}
