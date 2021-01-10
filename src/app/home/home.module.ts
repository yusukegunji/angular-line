import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MemberCardComponent } from './member-card/member-card.component';

@NgModule({
  declarations: [HomeComponent, MemberCardComponent],
  imports: [CommonModule, HomeRoutingModule, MatButtonModule],
})
export class HomeModule {}
