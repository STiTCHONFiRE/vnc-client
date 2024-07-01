import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs";
import {VncData} from "../interface/vnc-data";

@Injectable({
  providedIn: 'root'
})
export class VnsService {

  constructor(private httpClient: HttpClient) {
  }

  vncData$ = () => this.httpClient.get<VncData[]>("http://localhost:8080/api/v1/vnc").pipe(
    first()
  )
}
