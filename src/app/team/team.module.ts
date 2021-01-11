import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team/team.component';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [TeamComponent, MemberCardComponent],
  imports: [CommonModule, TeamRoutingModule, MatMenuModule, MatIconModule],
})
export class TeamModule {}
