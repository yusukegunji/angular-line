import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  opened$: Observable<boolean> = this.uiService.isOpen$;
  scrWidth: any;

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.getScreenSize();
  }

  toggleNav(): void {
    this.uiService.toggleOpening();
    console.log('toggle');
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }
}
