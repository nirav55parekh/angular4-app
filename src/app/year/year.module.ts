import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YearRoutingModule } from './year-routing.module';
import { YearComponent } from './year.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { YearServices } from './year.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    YearRoutingModule,
    SharedModule
  ],
  declarations: [
    YearComponent,
    ListComponent,
    ManageComponent
  ],
  providers:[YearServices]
})
export class YearModule { }
