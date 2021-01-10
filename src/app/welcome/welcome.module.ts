import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [WelcomeComponent, LoginComponent],
  imports: [CommonModule, WelcomeRoutingModule, MatButtonModule],
})
export class WelcomeModule {}
