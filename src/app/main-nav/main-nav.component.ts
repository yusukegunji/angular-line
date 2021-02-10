import { Component, OnInit } from '@angular/core';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
})
export class MainNavComponent implements OnInit {
  constructor(public uiService: UiService) {}

  ngOnInit(): void {}

  toggleNav(): void {
    this.uiService.isOpened = !this.uiService.isOpened;
  }
}
