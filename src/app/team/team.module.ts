import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team/team.component';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DialogsModule } from '../dialogs/dialogs.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [TeamComponent, MemberCardComponent],
  imports: [
    CommonModule,
    TeamRoutingModule,
    MatMenuModule,
    MatIconModule,
    DialogsModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class TeamModule {}
