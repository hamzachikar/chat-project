import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/models/contact/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  
  constructor(private http: HttpClient) { }
  getContact():Observable<Contact[]>{
    return this.http.get<Contact[]>('http://localhost:8080/api/contact');
  }
  deleteContact(id:Number):Observable<Contact>{
    console.log(id);
    const url='http://localhost:8080/api/contact/'+id
    return this.http.delete<Contact>(url);
  }
  saveOrUpdateContact(contact:Contact):Observable<Contact>{
    console.log(contact);
    return this.http.post<Contact>('http://localhost:8080/api/contact',contact);
  }
  
}
