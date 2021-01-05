import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntlRoutingModule } from './intl-routing.module';
import { PrivacyComponent } from './privacy/privacy.component';


@NgModule({
  declarations: [PrivacyComponent],
  imports: [
    CommonModule,
    IntlRoutingModule
  ]
})
export class IntlModule { }
