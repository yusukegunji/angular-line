import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogTableComponent } from './log-table/log-table.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  {
    path: ':id',
    component: TeamComponent,
    children: [
      {
        path: ':monthId',
        component: LogTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
