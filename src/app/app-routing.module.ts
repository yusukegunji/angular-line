import { FullscreenOverlayContainer } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'intl',
        loadChildren: () =>
          import('./intl/intl.module').then((m) => m.IntlModule),
      },
      {
        path: 'editor',
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),
      },
      {
        path: 'team',
        loadChildren: () =>
          import('./team/team.module').then((m) => m.TeamModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: ':uid',
        loadChildren: () =>
          import('./member-detail/member-detail.module').then(
            (m) => m.MemberDetailModule
          ),
      },
      {
        path: 'meeting',
        loadChildren: () =>
          import('./meeting/meeting.module').then((m) => m.MeetingModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
