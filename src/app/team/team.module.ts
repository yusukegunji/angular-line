import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team/team.component';
import { MemberCardComponent } from '../member-card/member-card.component';

@NgModule({
  declarations: [TeamComponent, MemberCardComponent],
  imports: [CommonModule, TeamRoutingModule],
})
export class TeamModule {}
