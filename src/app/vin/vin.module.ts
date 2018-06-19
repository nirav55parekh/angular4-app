import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VinRoutingModule } from './vin-routing.module';
import { VinComponent } from './vin.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { VinServices } from './vin.service';

@NgModule({
  imports: [
    CommonModule,
    VinRoutingModule,
    SharedModule
  ],
  declarations: [
    VinComponent,
    ListComponent,
    ManageComponent
  ],
  providers:[VinServices]
})
export class VinModule { }
