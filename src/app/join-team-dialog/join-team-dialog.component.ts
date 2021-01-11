import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { TeamService } from '../services/team.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-join-team-dialog',
  templateUrl: './join-team-dialog.component.html',
  styleUrls: ['./join-team-dialog.component.scss'],
})
export class JoinTeamDialogComponent implements OnInit {
  readonly PASS_MIN_LENGTH = 6;
  user: User;
  isProcessing: boolean;
  isPossible: boolean;
  eventId: string;

  form = this.fb.group({
    id: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(this.PASS_MIN_LENGTH)],
    ],
  });

  constructor(
    private router: Router,
    private teamService: TeamService,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uid: string;
    }
  ) {}

  ngOnInit(): void {}

  async submit(): Promise<void> {
    this.isProcessing = true;
    const formData = this.form.value;
    this.isPossible = await this.teamService.judgePassword(
      formData.password,
      formData.id
    );
    if (this.isPossible) {
      this.userService.joinTeam(formData.id, this.data.uid);
      this.router.navigateByUrl(`team/${formData.id}`);
    } else {
      console.log(this.isPossible);
      this.snackbar.open('パスワードとIDが一致しません。');
    }
  }
}
