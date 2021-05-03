import { Component, OnInit, Pipe, Injectable, PipeTransform, ViewChild } from '@angular/core';
import { Contact } from '../models/contact/contact';
import { RouteReuseStrategy, Router } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactService } from '../services/contactService/contact.service';
import { ModelService } from 'src/_service/model.service';
import { CompteService } from '../services/compteService/compte.service';
import { Compte } from '../models/compte/compte';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { AuthenticationService } from '../services/authenticateService/authentication.service';
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string): any[] {
    console.log(value);
    console.log(field);
      if (!items) {
        return [];
      }
      if (!field || !value) {
          return items;

      }
      return items.filter(singleItem => singleItem[field].toLowerCase().includes(value.toLowerCase()));
  }
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nom', 'prenom','cin','date naissance','groupe','status'];
  activeCompteSource = new MatTableDataSource();
  nActiveCompteSource = new MatTableDataSource();
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  updateContact:Contact;
  activeContacts:Contact[]=[];
  nActiveContacts:Contact[]=[];
  comptes:Compte[]=[];
  controls: FormArray;
  formOpen:boolean=false;
  public searchString: string;
  private modify:Boolean=false;
    constructor(private authenticationService: AuthenticationService,private router: Router,private contactService: ContactService,private compteService:CompteService,private modelService: ModelService) {}
    form=false;
    ngOnInit() {
      this.authenticationService.getLogCompte().subscribe(logCompte=>{
          if(logCompte.roles[0].roleName==='ROLE_ADMIN'){
            this.compteService.getContact().subscribe(data=>{
              this.comptes=data;
             this.loadListsCompteStats();
              this.activeCompteSource=new MatTableDataSource(this.activeContacts);
              this.activeCompteSource.sort=this.sort
              this.activeCompteSource.paginator = this.paginator;
              this.nActiveCompteSource=new MatTableDataSource(this.nActiveContacts);
            })
          }
          else{
            this.router.navigate(['/']);
          }
        }
      )
     
      }
     
   submitForm(){
    this.refreshTable();
   }
   loadListsCompteStats(){
     this.activeContacts=[];
     this.nActiveContacts=[];
    for(let c of this.comptes){
      if(c.active){
        this.activeContacts.push(c.contact);
      }
      else{
        this.nActiveContacts.push(c.contact);
      }
    }
   }
    refreshTable(){
      this.compteService.getContact()
      .subscribe( 
        (data) =>{
          this.ngOnInit();
        }),
        err => {
          console.log("Error");
        }   
    }
   
    showForm() {
      this.form=!this.form;
      console.log(this.form)
    }
    activateForm(){
      this.form=!this.form;
    }
  
  closeModal(id: string) {
    this.ngOnInit();  
    this.modelService.close(id);
      
  }
  modifieddContent(){
    this.modify=true;
  }
  update(contact:Contact){
    console.log(contact);
    this.contactService.saveOrUpdateContact(contact).subscribe(data=>{console.log("updated");})
  }
  checkActiveCompte(contact:Contact){
    var isActive=true;
    for(let c of this.comptes){
      if(contact.id===c.contact.id){
        isActive=c.active;
        break;
      }
    }
    return isActive;
  }
  changeState(contact:Contact){
    for(let c of this.comptes){
      if(contact.id===c.contact.id){
        if(c.active){
          this.activeContacts=this.activeContacts.filter(eachContact=>eachContact.id!==contact.id);
          this.nActiveContacts.push(contact);
        }
        else{
          this.nActiveContacts=this.nActiveContacts.filter(eachContact=>eachContact.id!==contact.id);
          this.activeContacts.push(contact);
        }
        this.activeCompteSource=new MatTableDataSource(this.activeContacts);
        this.activeCompteSource.sort=this.sort;
        this.nActiveCompteSource=new MatTableDataSource(this.nActiveContacts);
        c.active=!c.active;
        this.compteService.saveOrUpdateContact(c).subscribe(data=>console.log(data));
      }
    }
  }
}
