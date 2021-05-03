import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Contact } from '../models/contact/contact';
import { Compte } from '../models/compte/compte';
import { MustMatch } from '../models/mustMatch';
import { CompteService } from '../services/compteService/compte.service';
import { ContactService } from '../services/contactService/contact.service';
import { Roles } from '../models/roles/role';
import { RoleService } from '../services/roleService/role.service';

@Component({
  selector: 'form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
 
})
export class FormContactComponent implements OnInit,OnDestroy {
  @Output()
  submitForm=new EventEmitter<boolean>();
  registerForm:FormGroup;
  valideSave:Boolean=false;
  submitted=false;
  contactModel=new Contact();
  compteModel=new Compte();
  passV:String;
  idG:Number;
  role:Roles;
  contact:Object;
  roles:Roles[];
  gr:String;
  activate:boolean=false;
  listGroupe:string[]=['ADMINISTRATION','PARENT','TRANSPORT','PARAMEDICALE','EDUCATION'];
  constructor(private contactService:ContactService,private formBuilder:FormBuilder,private compteService:CompteService,private roleService:RoleService) { }
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.roleService.getRoles().subscribe(data=>{
      this.roles=data;
      console.log(data);
    });
      this.registerForm = this.formBuilder.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        cin: ['', Validators.required],
        dateNaissance: ['', Validators.required],
        sexe: ['', Validators.required],
        groupe:['',Validators.required],
        role:['',Validators.required],
        situation: ['', Validators.required],
        civilite: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', Validators.required],
        passV: ['', Validators.required],
    }, {
        validator: MustMatch('password', 'passV')
    });
  }
  get f() { return this.registerForm.controls; }
  async onSubmitContactForm(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      console.log('form invalid');
        return;
    }
   else{
    this.compteModel.username=this.registerForm.controls['username'].value;
    this.compteModel.password=this.registerForm.controls['password'].value;
    this.compteModel.roles=[this.getRole(this.registerForm.controls['role'].value)];
    this.compteModel.active=this.activate;
    this.contactModel=this.registerForm.value;
    console.log(this.compteModel)
    this.contactService.saveOrUpdateContact(this.contactModel).subscribe(data=>{
      this.compteModel.contact=data;
      this.compteService.saveOrUpdateContact(this.compteModel).subscribe(data=>this.submitForm.emit());

    });
    
   this.onReset();
   
   }
  
  }
  getRole(roleName:string):Roles{
    for(let r of this.roles){
      if(r.roleName===roleName){
        return r;
      }
    }
  }
  async onReset() {
    await this.delay(1000);
    this.submitted = false;
    this.valideSave=false;
    this.registerForm.reset();
}
  radioChangeHandler(event:any){
    this.contactModel.sexe=event.target.value;
    console.log(event.target.value);
  }
  
validatePass(pass:String,passV:String):Boolean{
  if(pass===passV){
    return true;
  }
  else{
    return false;
  }
}
delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
selectChangeHandler(role:any) {
  this.role=role
  console.log(this.role);
}
selectChangeHandlerGroupe(groupe:string) {
  console.log(groupe.toUpperCase());
}
setContact(contact:Contact){
  this.contactModel=contact;
  console.log(contact);
}
activateContact(){
  this.activate=!this.activate;
  console.log(this.activate);
}

}
