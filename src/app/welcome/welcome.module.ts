import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [CommonModule, WelcomeRoutingModule, MatButtonModule],
})
export class WelcomeModule {}
