import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JoinTeamDialogComponent } from '../join-team-dialog/join-team-dialog.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  openJoinTeamDialog(uid: string): void {
    this.dialog.open(JoinTeamDialogComponent, {
      maxWidth: '100vw',
      minWidth: '50%',
      autoFocus: false,
      restoreFocus: false,
      data: { uid },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
