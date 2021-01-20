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
import { LogTableComponent } from './log-table/log-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [TeamComponent, MemberCardComponent, LogTableComponent],
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
    MatTableModule,
    MatPaginatorModule,
  ],
})
export class TeamModule {}
