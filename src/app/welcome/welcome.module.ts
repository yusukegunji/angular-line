import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatButtonModule } from '@angular/material/button';
import { LineAuthHandlerComponent } from './line-auth-handler/line-auth-handler.component';

@NgModule({
  declarations: [WelcomeComponent, LineAuthHandlerComponent],
  imports: [CommonModule, WelcomeRoutingModule, MatButtonModule],
})
export class WelcomeModule {}
