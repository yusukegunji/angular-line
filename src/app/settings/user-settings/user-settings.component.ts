import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {
  readonly nameMaxLength = 20;
  readonly activeTeamIdMaxLength = 30;
  user: User;
  isProcessing: boolean;
  oldImageUrl = '';
  imageFile: string;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(this.nameMaxLength)]],
    activeTeamId: ['', [Validators.maxLength(this.activeTeamIdMaxLength)]],
  });

  user$: Observable<User> = this.authService.user$;
  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.user = user;
      this.oldImageUrl = user.photoURL;
      this.form.patchValue({
        ...user,
      });
    });
  }

  onCroppedImage(image: string): void {
    this.imageFile = image;
  }

  openDeleteDialog(user: User): void {
    this.dialog
      .open(DeleteDialogComponent, {
        width: '400px',
        autoFocus: false,
        restoreFocus: false,
        data: { user },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.userService.deleteUser(user.uid);
        } else {
          return;
        }
      });
  }

  updateUser(): void {
    const formData = this.form.value;
    this.userService
      .updateUser({
        uid: this.user.uid,
        photoURL: this.imageFile,
        name: formData.name,
        activeTeamId: formData.activeTeamId,
      })
      .then(() => this.snackBar.open('ユーザー情報を更新しました'));
  }
}
