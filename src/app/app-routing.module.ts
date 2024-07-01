import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {VncClientComponent} from "./vnc-client/vnc-client.component";

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "vnc/:id", component: VncClientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
