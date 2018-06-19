import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MakeRoutingModule } from './make-routing.module';
import { MakeComponent } from './make.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { MakeServices } from './make.service';
import { CommonServices } from '../shared/services/common.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MakeRoutingModule,
    SharedModule,
  ],
  declarations: [
    MakeComponent,
    ListComponent,
    ManageComponent
  ],
  providers:[MakeServices]
})
export class MakeModule { }
