import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from 'src/app/models/conversation/conversation';
import { Compte } from 'src/app/models/compte/compte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CvrService {

  constructor(private http:HttpClient) { }
  getCvrs(compte:Compte):Observable<Conversation[]>{
    return this.http.get<Conversation[]>('http://localhost:8080/api/conversation/'+compte.id);
  }
  save(cvr:Conversation):Observable<Conversation>{
    return this.http.post<Conversation>('http://localhost:8080/api/conversation',cvr);
  }
}
