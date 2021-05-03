import { Component, OnInit } from '@angular/core';
import { CompteService } from '../services/compteService/compte.service';
import { Compte } from '../models/compte/compte';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent implements OnInit {
  comptes:Compte[];
  controls: FormArray;
  constructor(private compteService:CompteService) { }

  ngOnInit() {
    this.compteService.getContact().subscribe(data=>{
      this.comptes=data;
      console.log(data);
      const toGroups = this.comptes.map(entity => {
        return new FormGroup({
          id: new FormControl(entity.id, Validators.required),
          username: new FormControl(entity.username, Validators.required),
          password: new FormControl(entity.password, Validators.required),
          active: new FormControl(entity.active, Validators.required)
        });
        this.controls = new FormArray(toGroups);
      });
    })
  }
  getControl(index: number, field: string) : FormControl {
    return this.controls.at(index).get(field)  as FormControl;
  }
  updateField(index: number, field: string) {
    const control = this.getControl(index, field);

    if (control.valid) {
      this.comptes = this.comptes.map((e, i) => {
        if (index === i) {
          return {
            ...e,
            [field]: control.value
          }
        }
        return e;
      })
    }

  }
  getRole(c:Compte){
    for(let role of c.roles){
      return role.roleName;
    }
  }
}
