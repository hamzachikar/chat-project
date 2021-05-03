import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compte } from 'src/app/models/compte/compte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor(private http:HttpClient) { }
  getContact():Observable<Compte[]>{
    return this.http.get<Compte[]>('http://localhost:8080/api/compte');
  }
  saveOrUpdateContact(compte:Compte):Observable<Compte>{
    console.log(compte);
    return this.http.post<Compte>('http://localhost:8080/api/compte',compte);
  }
}
