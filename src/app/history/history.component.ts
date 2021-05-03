import { Component, OnInit, ViewChild } from '@angular/core';
import { Msg } from '../models/message/msg';
import { Conversation } from '../models/conversation/conversation';
import { MessageService } from '../services/messageService/message.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'de:', 'demande','description','service','status','conversation'];
  dataTable= new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  allCvr:Msg[]=[];
  filtCvr:Msg[]=[];
  closedCvr:Msg[]=[];
  attCvr:Msg[]=[];
  rejectCvr:Msg[]=[];
  openCvr:Msg[]=[];
  selectCvrMsg:[Msg,number][]=[];
  selectedCvr:Conversation;
  retrievedImageC1:any;
  retrievedImageC2:any;
  selectedState:string='all';
  selectedService:string='all';
  selectedType:string='all';
  sugMsg=[
    'all',
    'mon profile',
    'demande de bultin scolaire',
    'demande d\'une fiche medicale',
    'informer une absence',
    'demande d\'emplois du temps',
    'informer une maladie',
    'reclamation d\'une violance ou mal traitence',
    'demande d\'une assistance medicale',
    'autre ...',
  ];
  constructor(private msgService:MessageService,private sanitizer:DomSanitizer){}
  ngOnInit(): void {
   this.msgService.getAllMessage().subscribe(data=>{
     for(let m of data){
        if(m.type!='message'&&m.type!='notif'&&m.type!='informer une absence'){
          this.allCvr.push(m);
          if(m.cvr.status==='close'){
           this.closedCvr.push(m);
         }
         if(m.cvr.status==='WAIT'){
           this.attCvr.push(m);
         }
         if(m.cvr.status==='rejected'){
           this.rejectCvr.push(m);
         }
         if(m.cvr.status==='open'){
           this.openCvr.push(m);
         }
       }
     }
      this.filtCvr=this.allCvr;
     this.dataTable= new MatTableDataSource(this.allCvr);
     this.dataTable.sort=this.sort;
     this.dataTable.paginator=this.paginator;
   })
  }
  getStatus(status:string):string{
    if(status==='open'){
      return 'en cours';
    }
    if(status==='WAIT'){
      return 'en attente';
    }
    if(status==='rejected'){
      return 'non valide';
    }
    if(status==='close'){
      return 'cloturee'
    }
  }
  filter(){
    let dmd:Msg[]=[];
      for(let d of this.allCvr){
        if(this.selectedService==='all'){
          if(this.selectedState==='all'){
            if(this.selectedType==='all'){
              dmd.push(d);
            }
            else{
              if(this.selectedType===d.type){
                dmd.push(d);
              }
            }
          }
          else{
            if(d.cvr.status===this.selectedState){
              if(this.selectedType==='all'){
                dmd.push(d);
              }
              else{
                if(this.selectedType===d.type){
                  dmd.push(d);
                }
              }
            }
          }
        }
        else{
          if(d.toContact.contact.groupe===this.selectedService){
            if(this.selectedState==='all'){
              if(this.selectedType==='all'){
                dmd.push(d);
              }
              else{
                if(this.selectedType===d.type){
                  dmd.push(d);
                }
              }
            }
            else{
              if(d.cvr.status===this.selectedState){
                if(this.selectedType==='all'){
                  dmd.push(d);
                }
                else{
                  if(this.selectedType===d.type){
                    dmd.push(d);
                  }
                }
              }
            }
          }
          }
      }
    this.filtCvr=dmd;
    this.dataTable=new MatTableDataSource(dmd);
    this.dataTable.sort=this.sort;
     this.dataTable.paginator=this.paginator;
  }
  setService(s:any){
    this.selectedService=s.value;
    this.filter();
  }
  setState(s:any){
    this.selectedState=s.value;
    this.filter();
  }
  setType(s:any){
    this.selectedType=s.value;
    this.filter();
  }
  setSelectedCvr(c:Conversation){
    this.selectCvrMsg=[];
    this.retrievedImageC1=null;
    this.retrievedImageC2=null;
    this.msgService.getMsgCvr(c).subscribe(data=>{
      this.selectedCvr=c;
      for(let m of data){
        if(m.fromContact.id===c.contact1.id){
          this.selectCvrMsg.push([m,1]);
        }
        else{
          this.selectCvrMsg.push([m,0]);
        }
      }
    });
  }
}
