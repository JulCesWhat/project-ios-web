import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {ScanPageComponent} from './scan-page/scan-page.component';


const routes: Routes = [
    { path: 'main', component: MainPageComponent },
    { path: 'scan', component: ScanPageComponent },
    { path: '', redirectTo: '/main', pathMatch: 'full' }, // redirect to `first-component`
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
