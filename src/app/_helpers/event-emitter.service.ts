import { Injectable, EventEmitter } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Image } from '../models/image/image';
import { AuthenticationService } from '../services/authenticateService/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService { 
  private imageChange=new BehaviorSubject<Image>(new Image());
  currentChange=this.imageChange.asObservable();

  constructor() { 
  }   
  changeImage(change:Image){
    this.imageChange.next(change);
  } 
}
