import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {catchError, EMPTY, first} from "rxjs";
import {TokenData} from "../interface/token-data";
import {ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly SERVER_URL: string;

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.SERVER_URL = `${this.configService.getServerUrl()}/api/v1/tokens`;
  }

  token$ = (id: string) => this.httpClient.post<TokenData>(`${this.SERVER_URL}/${id}`, null).pipe(
    first()
  );
}

export const tokenResolverFn: ResolveFn<TokenData> =
  (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
    const router = inject(Router);
    return inject(TokenService).token$(route.paramMap.get("id")).pipe(
      catchError(() => {
        router.navigate(["/"]).then()
        return EMPTY;
      })
    );
  }
