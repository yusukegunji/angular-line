import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingComponent } from './meeting/meeting.component';

const routes: Routes = [
  {
    path: ':teamId',
    component: MeetingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingRoutingModule {}
