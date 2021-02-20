import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit {
  teamId$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('teamId'))
  );
  teamId: string;

  channelControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(30),
  ]);

  user$: Observable<User> = this.authService.user$;

  constructor(
    private authService: AuthService,
    public meetingService: MeetingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.teamId$.subscribe((id) => {
      this.teamId = id;
    });
  }

  joinChannel(): void {
    const channelId = this.channelControl.value;
    this.router.navigateByUrl(`/meeting/${this.teamId}/${channelId}`);
  }
}
