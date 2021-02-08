import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MemberDetailComponent } from './member-detail/member-detail.component';

const routes: Routes = [
  {
    path: ':teamId/:monthId',
    component: MemberDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberDetailRoutingModule {}
