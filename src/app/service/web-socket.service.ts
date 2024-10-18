import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { UserDataEvent } from '../interface/user-data-event';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor() {}

  connect$ = (url: string) => {
    return webSocket<UserDataEvent>(url).asObservable();
  };
}
