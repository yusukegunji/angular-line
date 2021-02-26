import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { JoinDialogComponent } from './join-dialog/join-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { QrDialogComponent } from './qr-dialog/qr-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditResultDialogComponent } from './edit-result-dialog/edit-result-dialog.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    JoinDialogComponent,
    QrDialogComponent,
    EditResultDialogComponent,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatIconModule,
  ],
})
export class DialogsModule {}
