import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {first} from "rxjs";
import {VncData} from "../interface/vnc-data";
import {ConfigService} from "./config.service";
import {UsersData} from "../interface/user-data-event";

@Injectable({
  providedIn: 'root'
})
export class VnsService {
  private readonly SERVER_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_URL = `${this.configService.getServerUrl()}/api/v1/vnc`;
  }

  vncData$ = () => this.httpClient.get<VncData[]>(this.SERVER_URL).pipe(
    first()
  )

  users$ = (id: string) => this.httpClient.get<UsersData>(`${this.SERVER_URL}/${id}/users`).pipe(
    first()
  )
}
