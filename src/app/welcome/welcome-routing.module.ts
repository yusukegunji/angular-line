import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LineAuthHandlerComponent } from './line-auth-handler/line-auth-handler.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'line-auth-handler',
    component: LineAuthHandlerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
