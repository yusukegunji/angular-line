import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.scss'],
})
export class QrDialogComponent implements OnInit {
  isApprove: false;

  constructor(
    private dialog: MatDialog,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uid: string;
    }
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    console.log(this.data);

    if (this.isApprove) {
      this.db.doc(`users/${this.data}`).set(
        {
          isRefuseDialog: true,
        },
        {
          merge: true,
        }
      );
    }
    this.dialog.closeAll();
  }
}
