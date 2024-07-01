import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {provideHttpClient} from "@angular/common/http";
import { CardVncComponent } from './card-vnc/card-vnc.component';
import { VncClientComponent } from './vnc-client/vnc-client.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CardVncComponent,
    VncClientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
