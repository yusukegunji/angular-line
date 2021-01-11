import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Team } from 'src/app/interfaces/team';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import * as firebase from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  readonly NAME_MAX_LENGTH = 20;
  readonly DESCRIPTION_MAX_LENGTH = 200;
  oldImageUrl = '';
  imageFile: string;
  isProcessing: boolean;
  uid: string;

  form = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.maxLength(this.NAME_MAX_LENGTH)],
    ],
    description: [
      '',
      [Validators.required, Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.uid = user.uid;
      console.log(this.uid);
    });
  }

  onCroppedImage(image: string): void {
    this.imageFile = image;
  }

  async submit(): Promise<void> {
    this.isProcessing = true;
    let teamData = this.form.value;

    if (this.imageFile !== undefined) {
      teamData = {
        ...teamData,
        createdAt: firebase.default.firestore.Timestamp.now(),
        ownerId: this.uid,
      };
      await this.teamService
        .createTeam(teamData, this.imageFile)
        .then(() => {
          this.snackbar.open('チームを作成しました！');
          this.router.navigateByUrl('/');
        })
        .finally(() => (this.isProcessing = false));
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '入力した内容が失われますがよろしいですか？';
    }
  }
}
