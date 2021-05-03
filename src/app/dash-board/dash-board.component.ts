import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services/contactService/contact.service';
import { MessageService } from '../services/messageService/message.service';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { Label, Color, MultiDataSet } from 'ng2-charts';
import { Msg } from '../models/message/msg';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
import { Compte } from '../models/compte/compte';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  messages:Msg[]=[];
  nbrMessage:number=0;
  nbrDemand:number=0;
  nbrDemandResolved:number=0;
  nbrDemandOpen:number=0;
  nbrDemandAwait:number=0;
  //bar chart
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['administration','education', 'medicale','transport'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[]=[];

  //for circle demand stats
  doughnutChartLabels: Label[] = ['en cours', 'resolue', 'rejeter','en attente'];
  doughnutChartData: MultiDataSet = [[25,25,25,25]];
  doughnutChartType: ChartType = 'doughnut';
//for message of the current mounth chart
lineChartData: ChartDataSets[] = [
  { data: [85, 72, 78, 75, 77, 75], label: 'Crude of messages this year' },
];

lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','Octobre','November','December'];

lineChartOptions = {
  responsive: true,
};

lineChartColors: Color[] = [
  {
    borderColor: 'black',
    backgroundColor: 'rgba(255,255,0,0.28)',
  },
];

lineChartLegend = true;
lineChartPlugins = [];
lineChartType = 'line';

  
  constructor(private contactService: ContactService,private router: Router,private authenticationService: AuthenticationService,private messageService:MessageService) {
    
   }

  ngOnInit() {
    this.messageService.getAllMessage().subscribe(message=>{
      this.messages=message;
      this.authenticationService.getLogCompte().subscribe(logCompte=>{
        //for admin
        if(logCompte.roles[0].roleName==='ROLE_ADMIN'){
          for(let m of this.messages){
            if(m.type==='message'){
              this.nbrMessage=this.nbrMessage+1;
            }
            if(m.type!=='message'&&m.type!=='notif' ){
              this.nbrDemand=this.nbrDemand+1;
              if(m.cvr&&m.cvr.status==='close'||m.cvr.status==='rejected'){
                this.nbrDemandResolved=this.nbrDemandResolved+1;
              }
              if(m.cvr&&m.cvr.status==='open'){
                this.nbrDemandOpen=this.nbrDemandOpen+1;
              }
              if(m.cvr&&m.cvr.status==='WAIT'){
                this.nbrDemandAwait=this.nbrDemandAwait+1;
              }
            }
          }
           this.barChartData=[{data:[
            this.checkNbrDemandByS('administration',1),
            this.checkNbrDemandByS('education',1),
            this.checkNbrDemandByS('paramedicale',1),
            this.checkNbrDemandByS('transport',1),
    
          ], label: 'en cours',backgroundColor:'orange' },{data:[
            this.checkNbrDemandByS('administration',2),
            this.checkNbrDemandByS('education',2),
            this.checkNbrDemandByS('paramedicale',2),
            this.checkNbrDemandByS('transport',2),
    
          ], label: 'resolue',backgroundColor:'green'},
          {data:[
            this.checkNbrDemandByS('administration',3),
            this.checkNbrDemandByS('education',3),
            this.checkNbrDemandByS('paramedicale',3),
            this.checkNbrDemandByS('transport',3),
    
          ], label: 'rejeter',backgroundColor:'red'},
          {data:[
            this.checkNbrDemandByS('administration',4),
            this.checkNbrDemandByS('education',4),
            this.checkNbrDemandByS('paramedicale',4),
            this.checkNbrDemandByS('transport',4),
    
          ], label: 'en attente',backgroundColor:'blue'}
          
          ];
          this.doughnutChartData=[
            [
              this.checkDemandStats('open',logCompte),
              this.checkDemandStats('close',logCompte),
              this.checkDemandStats('rejected',logCompte),
              this.checkDemandStats('WAIT',logCompte)
            ]
          ];
          this.lineChartData= [
            { 
              data: [this.checkMsgDate(0,'msg',logCompte),
              this.checkMsgDate(1,'msg',logCompte) , 
              this.checkMsgDate(2,'msg',logCompte),
              this.checkMsgDate(3,'msg',logCompte),
              this.checkMsgDate(4,'msg',logCompte),
              this.checkMsgDate(5,'msg',logCompte),
              this.checkMsgDate(6,'msg',logCompte),
              this.checkMsgDate(7,'msg',logCompte),
              this.checkMsgDate(8,'msg',logCompte),
              this.checkMsgDate(9,'msg',logCompte),
              this.checkMsgDate(10,'msg',logCompte),
              this.checkMsgDate(11,'msg',logCompte),
            ], 
              label: 'Crude of messages this year',
              backgroundColor:'red',
              borderColor:'red'
            },
            { 
              data: [this.checkMsgDate(0,'dmd',logCompte),
              this.checkMsgDate(1,'dmd',logCompte) , 
              this.checkMsgDate(2,'dmd',logCompte),
              this.checkMsgDate(3,'dmd',logCompte),
              this.checkMsgDate(4,'dmd',logCompte),
              this.checkMsgDate(5,'dmd',logCompte),
              this.checkMsgDate(6,'dmd',logCompte),
              this.checkMsgDate(7,'dmd',logCompte),
              this.checkMsgDate(8,'dmd',logCompte),
              this.checkMsgDate(9,'dmd',logCompte),
              this.checkMsgDate(10,'dmd',logCompte),
              this.checkMsgDate(11,'dmd',logCompte),
            ], label: 'Crude of demand this year',
              backgroundColor:'red',
              borderColor:'red'
            }
          ];
        }
        //for manager
        if(logCompte.roles[0].roleName==='ROLE_MANAGER'){
          for(let m of this.messages){
            if(m.type==='message'){
              if(m.fromContact.contact.groupe===logCompte.contact.groupe||m.toContact.contact.groupe===logCompte.contact.groupe){
                this.nbrMessage=this.nbrMessage+1;
              }
            }
            if(m.type!=='message'&&m.type!=='notif'&&m.toContact.id===logCompte.id){
              this.nbrDemand=this.nbrDemand+1;
              if(m.cvr&&m.cvr.status==='close'||m.cvr.status==='rejected'){
                this.nbrDemandResolved=this.nbrDemandResolved+1;
              }
              if(m.cvr&&m.cvr.status==='open'){
                this.nbrDemandOpen=this.nbrDemandOpen+1;
              }
              if(m.cvr&&m.cvr.status==='WAIT'){
                this.nbrDemandAwait=this.nbrDemandAwait+1;
              }
            }
          }
          this.barChartLabels= [logCompte.contact.groupe];
           this.barChartData=[{data:[
            this.checkNbrDemandByS(logCompte.contact.groupe,1),
          ], label: 'en cours',backgroundColor:'orange' },{data:[
            this.checkNbrDemandByS(logCompte.contact.groupe,2),    
          ], label: 'resolue',backgroundColor:'green'},
          {data:[
            this.checkNbrDemandByS(logCompte.contact.groupe,3),
          ], label: 'rejeter',backgroundColor:'red'},
          {data:[
            this.checkNbrDemandByS(logCompte.contact.groupe,4),
          ], label: 'en attente',backgroundColor:'blue'}
          ];
          this.doughnutChartData=[
            [
              this.checkDemandStats('open',logCompte),
              this.checkDemandStats('close',logCompte),
              this.checkDemandStats('rejected',logCompte),
              this.checkDemandStats('WAIT',logCompte)
            ]
          ];
          this.lineChartData= [
            { 
              data: [this.checkMsgDate(0,'msg',logCompte),
              this.checkMsgDate(1,'msg',logCompte) , 
              this.checkMsgDate(2,'msg',logCompte),
              this.checkMsgDate(3,'msg',logCompte),
              this.checkMsgDate(4,'msg',logCompte),
              this.checkMsgDate(5,'msg',logCompte),
              this.checkMsgDate(6,'msg',logCompte),
              this.checkMsgDate(7,'msg',logCompte),
              this.checkMsgDate(8,'msg',logCompte),
              this.checkMsgDate(9,'msg',logCompte),
              this.checkMsgDate(10,'msg',logCompte),
              this.checkMsgDate(11,'msg',logCompte),
            ], 
              label: 'Crude of messages this year',
              backgroundColor:'red',
              borderColor:'red'
            },
            { 
              data: [this.checkMsgDate(0,'dmd',logCompte),
              this.checkMsgDate(1,'dmd',logCompte) , 
              this.checkMsgDate(2,'dmd',logCompte),
              this.checkMsgDate(3,'dmd',logCompte),
              this.checkMsgDate(4,'dmd',logCompte),
              this.checkMsgDate(5,'dmd',logCompte),
              this.checkMsgDate(6,'dmd',logCompte),
              this.checkMsgDate(7,'dmd',logCompte),
              this.checkMsgDate(8,'dmd',logCompte),
              this.checkMsgDate(9,'dmd',logCompte),
              this.checkMsgDate(10,'dmd',logCompte),
              this.checkMsgDate(11,'dmd',logCompte),
            ], label: 'Crude of demand this year',
              backgroundColor:'red',
              borderColor:'red'
            }
          ];
        }
        if(logCompte.roles[0].roleName==='ROLE_EMPLOYEE'||logCompte.roles[0].roleName==='ROLE_USER'){
          this.router.navigate(['/']);
        }
      })
    
    
    })
  }
  checkNbrDemandByS(service:string,option:number){
    let nbr=0;
    if(option===1){
      for(let m of this.messages){
        if(m.type!=='message'&&m.type!=='notif'){
          let date=new Date(Date.parse(m.dateSent+''));
          console.log(date.getDay());
          if(m.toContact.contact.groupe===service.toUpperCase()&&m.cvr.status==='open'){
            nbr=nbr+1;
          }
        }
      }
    }
    if(option===2){
      for(let m of this.messages){
        if(m.type!=='message'&&m.type!=='notif'){
          if(m.toContact.contact.groupe===service.toUpperCase()&&m.cvr.status==='close'){
            nbr=nbr+1;
          }
        }
      }
    }
    if(option===3){
      for(let m of this.messages){
        if(m.type!=='message'&&m.type!=='notif'){
          if(m.toContact.contact.groupe===service.toUpperCase()&&m.cvr.status==='rejected'){
            nbr=nbr+1;
          }
        }
      }
    }
    if(option===4){
      for(let m of this.messages){
        if(m.type!=='message'&&m.type!=='notif'){
          if(m.toContact.contact.groupe===service.toUpperCase()&&m.cvr.status==='WAIT'){
            nbr=nbr+1;
          }
        }
      }
    }
    return nbr;
  }
  checkDemandStats(s:string,c:Compte):number{
    let len=0;
    let nbr=0;
    for(let m of this.messages){
      if(m.type!=='message'&&m.type!='notif'){
        if(c.roles[0].roleName==='ROLE_ADMIN'){
          len=len+1;
          if(m.cvr.status===s){
            nbr=nbr+1;
          }
        }
        else{
          if(m.toContact.id===c.id){
            len=len+1;
          if(m.cvr.status===s){
            nbr=nbr+1;
          }
          }
        }
      }
    }
    let p=(nbr/len)*100;
    return p;
  }
  checkMsgDate(d:number,option:string,c:Compte){
    let dt=new Date();
    let nbr=0;
    if(option==='msg'){
      for(let m of this.messages){
        if(m.type==='message'&&new Date(Date.parse(m.dateSent+'')).getMonth()===d&&new Date(Date.parse(m.dateSent+'')).getFullYear()===dt.getFullYear()){
          if(c.roles[0].roleName==='ROLE_ADMIN'){
            nbr=nbr+1;
          }
          else{
            if(m.fromContact.id===c.id||m.toContact.id===c.id){
              nbr=nbr+1;
            }
          }
        }
      }
    }
    if(option==='dmd'){
      for(let m of this.messages){
        if(m.type!=='message'&&m.type!=='notif'&&new Date(Date.parse(m.dateSent+'')).getMonth()===d&&new Date(Date.parse(m.dateSent+'')).getFullYear()===dt.getFullYear()){
          if(c.roles[0].roleName==='ROLE_ADMIN'){
            nbr=nbr+1;
          }
          else{
            if(m.toContact.id===c.id){
              nbr=nbr+1;
            }
          }
        }
      }
    }
   
    return nbr;
  }
  
}


