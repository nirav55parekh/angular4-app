import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptsComponent } from './scripts.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '', component: ScriptsComponent, children: [
      {
        path: '', component: ListComponent, canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: [
        //       'script_groups_view_owner', 'scripts_edit_owner', 'scripts_create_owner', 'scripts_delete_owner', 'scripts_view_owner',
        //       'scripts_edit_admin', 'scripts_create_admin', 'scripts_delete_admin', 'scripts_view_admin'
        //     ],
        //     redirectTo: '/home/dashboard'
        //   }
        // },
      },
      {
        path: 'new', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['scripts_create_owner', 'scripts_create_admin'],
            redirectTo: '/home/scripts'
          }
        }
      },
      {
        path: 'edit/:id', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['scripts_edit_owner', 'scripts_edit_admin'],
            redirectTo: '/home/scripts'
          }
        }
      },
      {
        path: 'view/:id', component: ViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptsRoutingModule { }
