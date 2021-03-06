import { Component, OnInit } from '@angular/core';
import { easeSlideForContent, easeSlideForSideNav } from '../animation';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  animations: [easeSlideForSideNav, easeSlideForContent],
})
export class ShellComponent implements OnInit {
  scrWidth: any;

  constructor(public uiService: UiService) {}

  ngOnInit(): void {
    this.getScreenSize();
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }
}
