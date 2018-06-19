import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { RolesComponent } from './roles.component';
import { SharedModule } from '../shared/shared.module';
import { PermissionsComponent } from './manage/permissions/permissions.component';
import { PermissionServices } from './manage/permissions/permissions.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RolesRoutingModule
  ],
  declarations: [
    RolesComponent,
    ListComponent,
    ManageComponent,
    PermissionsComponent
  ],
  providers:[PermissionServices]
})
export class RolesModule { }
