import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptGroupsRoutingModule } from './script-groups-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ScriptGroupsComponent } from './script-groups.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ScriptGroupsServices } from './script-groups.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ViewComponent } from './view/view.component';
import { ScriptListComponent } from './script-list/script-list.component';

@NgModule({
  imports: [
    CommonModule,
    ScriptGroupsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ScriptGroupsComponent,
    ListComponent,
    ManageComponent,
    ViewComponent,
    ScriptListComponent
  ],
  providers: []
})
export class ScriptGroupsModule { }
