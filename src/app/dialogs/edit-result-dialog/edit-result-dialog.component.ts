import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Log } from 'src/app/interfaces/log';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-edit-result-dialog',
  templateUrl: './edit-result-dialog.component.html',
  styleUrls: ['./edit-result-dialog.component.scss'],
})
export class EditResultDialogComponent implements OnInit {
  processing: boolean;
  form = this.fb.group({
    logedInAt: [''],
    logedOutAt: [''],
    tookBreakAt: [''],
    backedBreakAt: [''],
  });

  dailyLog$: Observable<Log>;

  constructor(
    private fb: FormBuilder,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data);

      this.form.patchValue({
        logedInAt: this.data.log.logedInAt?.toDate(),
        logedOutAt: this.data.log.logedOutAt?.toDate(),
        tookBreakAt: this.data.log.tookBreakAt?.toDate(),
        backedBreakAt: this.data.log.backedBreakAt?.toDate(),
      });
    }
  }

  updateLogData(): void {
    const formData = this.form.value;
    const logData = {
      logedInAt: formData.logedInAt,
      logedOutAt: formData.logedOutAt,
      tookBreakAt: formData.tookBreakAt,
      backedBreakAt: formData.backedBreakAt,
      uid: this.data.log.uid,
      teamId: this.data.log.teamId,
      monthId: this.data.log.monthId,
      dayId: this.data.log.dayId,
    };
    this.logService.updateLog(logData);
  }
}
