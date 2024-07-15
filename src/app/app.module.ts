import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {CardVncComponent} from './card-vnc/card-vnc.component';
import {VncClientComponent} from './vnc-client/vnc-client.component';
import {provideOAuthClient} from "angular-oauth2-oidc";
import {AuthService} from "./service/auth.service";
import {InfoPanelComponent} from './info-panel/info-panel.component';
import {FormsModule} from "@angular/forms";
import {oauthInterceptorFn} from "./interceptor/oauth.interceptor";

const appInitializerFn = (authService: AuthService) => {
  return () => {
    return authService.loadAuthConfig();
  };
};

const allowedUrlsFn = (): string[] => {
  return ["http://localhost:8080", "http://localhost:9000/api/v1"]
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
        allowedUrls: allowedUrlsFn(),
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
