import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Message } from '../../models/message';
import { Observable } from 'rxjs';
import { environment } from 'src/app/models/envirenement';

@Injectable()
export class SocketService {
  url: string = environment.url + "api/socket";

  constructor(private http: HttpClient) { }

  post(data: Message) {
    return this.http.post(this.url, data);
  }
}