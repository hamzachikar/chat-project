import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roles } from 'src/app/models/roles/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }
  getRoles():Observable<Roles[]>{
    return this.http.get<Roles[]>('http://localhost:8080/api/roles');
  }
}
