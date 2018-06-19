import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevicesComponent } from './devices.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '', component: DevicesComponent, children: [
      { path: '', component: ListComponent },
      { path: 'settings/:id', component: SettingsComponent },
      {
        path: 'new', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['device_create_owner', 'device_create_admin'],
            redirectTo: '/home/devices'
          }
        }
      },
      {
        path: 'edit/:id', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['device_edit_owner', 'device_edit_admin'],
            redirectTo: '/home/devices'
          }
        }
      },
      {
        path: 'view/:id', component: ViewComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['device_view_owner', 'device_view_admin'],
            redirectTo: '/home/devices'
          }
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
