import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModuleCodesRoutingModule } from './module-codes-routing.module';
import { ModuleCodesComponent } from './module-codes.component';
import { ModulesComponent } from './modules/modules.component';
import { CodesComponent } from './codes/codes.component';
import { ManageCodesComponent } from './codes/manage-codes/manage-codes.component';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared/shared.module';
import { ModuleCodesServices } from './module-codes.service';

@NgModule({
  imports: [
    CommonModule,
    ModuleCodesRoutingModule,
    SharedModule
  ],
  declarations: [
    ModuleCodesComponent,
    ModulesComponent,
    CodesComponent,
    ManageCodesComponent,
    ListComponent
  ],
  providers: [ModuleCodesServices]
})
export class ModuleCodesModule { }
