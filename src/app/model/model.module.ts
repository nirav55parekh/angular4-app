import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModelRoutingModule } from './model-routing.module';
import { ModelComponent } from './model.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { ModelServices } from './model.service';

@NgModule({
  imports: [
    CommonModule,
    ModelRoutingModule,
    SharedModule
  ],
  declarations: [
    ModelComponent,
    ListComponent,
    ManageComponent
  ],
  providers: [ModelServices]
})
export class ModelModule { }
