import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule, ModalModule, TypeaheadModule, AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from "@angular/http";
import { HttpClient } from './services/http-client.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CommonServices } from './services/common.service';
import { UserStatusPipe } from './pipes/user-staus.pipe';
import { SearchComponent } from '../layouts/search/search.component';
import { DropdownDirective } from './directives/dropdown.directive';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { MakeServices } from '../make/make.service';
import { ModelServices } from '../model/model.service';
import { ShortenPipe } from './pipes/shorten.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeviceServices } from '../devices/device.service';
import { CommonService } from '../scripts/common.service';
import { ScriptGroupsServices } from '../script-groups/script-groups.service';
import { RolesServices } from '../roles/roles.service';
import { ThumbnailDirective } from './directives/thumnail.directive';
import { ViewModeComponent, KeysPipe } from '../layouts/view-mode/view-mode.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImgFallbackModule,
    HttpModule,
    NgxDatatableModule,
    TypeaheadModule,
    ModalModule,
    NgSelectModule,
    AccordionModule
  ],
  declarations: [
    UserStatusPipe,
    ShortenPipe,
    KeysPipe,
    DropdownDirective,
    ThumbnailDirective,
    SearchComponent,
    ViewModeComponent
  ],
  exports: [
    UserStatusPipe,
    ShortenPipe,
    KeysPipe,
    FormsModule,
    DropdownDirective,
    ThumbnailDirective,
    SearchComponent,
    ViewModeComponent,
    ImgFallbackModule,
    BsDatepickerModule,
    NgSelectModule,
    NgxDatatableModule,
    TypeaheadModule,
    ModalModule,
  ],
  providers: [CommonService, RolesServices, ScriptGroupsServices, MakeServices, ModelServices, DeviceServices, HttpClient]
})
export class SharedModule { }
