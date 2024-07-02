import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors} from "@angular/common/http";
import {CardVncComponent} from './card-vnc/card-vnc.component';
import {VncClientComponent} from './vnc-client/vnc-client.component';
import {OAuthModuleConfig, OAuthStorage, provideOAuthClient} from "angular-oauth2-oidc";
import {AuthService} from "./service/auth.service";
import { InfoPanelComponent } from './info-panel/info-panel.component';
import {FormsModule} from "@angular/forms";

const appInitializerFn = (authService: AuthService) => {
  return () => {
    return authService.loadAuthConfig();
  };
};

export function checkUrl(url: string, moduleConfig: OAuthModuleConfig): boolean {
  let found = moduleConfig.resourceServer.allowedUrls.find(u => url.startsWith(u));
  return !!found;
}

const oauthInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let authStorage = inject(OAuthStorage);
  let moduleConfig = inject(OAuthModuleConfig);

  let url = req.url.toLowerCase();

  if (!moduleConfig) return next(req);
  if (!moduleConfig.resourceServer) return next(req);
  if (!moduleConfig.resourceServer.allowedUrls) return next(req);
  if (!checkUrl(url, moduleConfig)) return next(req);

  let sendAccessToken = moduleConfig.resourceServer.sendAccessToken;

  if (sendAccessToken) {

    let token = authStorage.getItem('access_token');
    let header = 'Bearer ' + token;

    let headers = req.headers
      .set('Authorization', header);

    req = req.clone({headers});
  }

  return next(req)
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardVncComponent,
    VncClientComponent,
    InfoPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(
      withInterceptors([oauthInterceptorFn])
    ),
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ["http://localhost:8080"],
        sendAccessToken: true
      }
    }),
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AuthService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
