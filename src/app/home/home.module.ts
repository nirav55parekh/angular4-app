import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { HeaderComponent } from '../layouts/header/header.component';
import { FooterComponent } from '../layouts/footer/footer.component';
import { SidebarComponent } from '../layouts/sidebar/sidebar.component';

import { DevicesModule } from '../devices/devices.module';
import { UsersModule } from '../users/users.module';
import { ModuleCodesModule } from '../module-codes/module-codes.module';
import { ScriptsModule } from '../scripts/scripts.module';
import { VinModule } from '../vin/vin.module';
import { ModelModule } from '../model/model.module';
import { YearModule } from '../year/year.module';
import { SharedModule } from '../shared/shared.module';
import { HeadingComponent } from '../layouts/heading/heading.component';
import { ProfileComponent } from '../profile/profile.component';
import { ScriptGroupsModule } from '../script-groups/script-groups.module';
import { HeadingService } from '../layouts/heading/heading.service';
import { RolesModule } from '../roles/roles.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BreadcrumbComponent } from '../layouts/breadcrumb/breadcrumb.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { SettingsServices } from '../settings/settings.service';
import { AccordionModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HeadingComponent,
    ProfileComponent,
    BreadcrumbComponent,
    DashboardComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    DevicesModule,
    UsersModule,
    ModuleCodesModule,
    ScriptsModule,
    VinModule,
    ModelModule,
    FileUploadModule,
    YearModule,
    ScriptGroupsModule,
    RolesModule,
    NgxPermissionsModule.forChild(),
    AccordionModule.forRoot(),
  ],
  providers: [HeadingService, SettingsServices]
})
export class HomeModule { }
