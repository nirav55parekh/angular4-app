import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { UserServices } from './user.services';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    UsersComponent,
    ListComponent,
    ManageComponent,
    ViewComponent
  ],
  providers: []
})
export class UsersModule { }
