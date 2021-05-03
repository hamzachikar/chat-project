import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Msg } from 'src/app/models/message/msg';
import { Conversation } from 'src/app/models/conversation/conversation';
import { Compte } from 'src/app/models/compte/compte';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient) { }
  getAllMessage():Observable<Msg[]>{
    return this.http.get<Msg[]>('http://localhost:8080/api/message');
  }
  getMsgCvr(cvr:Conversation):Observable<Msg[]>{
    return this.http.post<Msg[]>('http://localhost:8080/api/msgCvr',cvr);
  }
  seen(id:number):Observable<Msg>{
    return this.http.post<Msg>('http://localhost:8080/api/updateMsg',id);
  }
  getServiceMsg(c:Compte):Observable<Msg[]>{
    return this.http.post<Msg[]>('http://localhost:8080/api/demandeMsg',c);
  }
  postUserMessage(message:Msg,service:string):Observable<Msg>{
    return this.http.post<Msg>('http://localhost:8080/api/msgToService/'+service,message);
  }
}
