import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelComponent } from './channel/channel.component';
import { MeetingComponent } from './meeting/meeting.component';

const routes: Routes = [
  {
    path: ':teamId',
    component: MeetingComponent,
  },
  {
    path: ':teamId/:channelId',
    component: ChannelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingRoutingModule {}
