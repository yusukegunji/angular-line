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

  constructor(public uiService: UiService) {
    console.log(this.uiService.isOpened);
  }

  ngOnInit(): void {
    this.getScreenSize();
  }

  toggleNav(): void {
    this.uiService.isOpened = !this.uiService.isOpened;
    console.log(this.uiService.isOpened);
  }

  getScreenSize(): void {
    this.scrWidth = window.innerWidth;
  }
}
