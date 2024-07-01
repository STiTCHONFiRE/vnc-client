import {Component, OnInit} from '@angular/core';
import {VnsService} from "../service/vns.service";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {VncData} from "../interface/vnc-data";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  vncData$: Observable<{
    appState: string;
    appData?: VncData[];
    err?: HttpErrorResponse;
  }>;

  constructor(private vncService: VnsService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.vncData$ = this.vncService.vncData$().pipe(
      map((result) => {
        return {appState: "APP_LOADED", appData: result}
      }),
      startWith({appState: "APP_LOADING"}),
      catchError((err: HttpErrorResponse) => of({appState: "APP_ERROR", err}))
    )
  }

  logout() {
    this.authService.logout();
  }
}
