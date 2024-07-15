import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {VncClientComponent} from "./vnc-client/vnc-client.component";
import {tokenResolverFn} from "./service/token.service";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "vnc/:id", component: VncClientComponent, resolve: {tokenData: tokenResolverFn}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
