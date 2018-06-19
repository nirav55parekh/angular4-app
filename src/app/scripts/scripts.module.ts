import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptsRoutingModule } from './scripts-routing.module';
import { ScriptsComponent } from './scripts.component';
import { ListComponent } from './list/list.component';
import { ManageComponent, KeysPipe } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { ScriptServices } from './script.services';
import { CommonService } from './common.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    ScriptsRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ],
  declarations: [
    ScriptsComponent,
    ListComponent,
    ManageComponent,
    KeysPipe,
    ViewComponent
  ],
  providers: [ScriptServices, CommonService]
})
export class ScriptsModule { }
