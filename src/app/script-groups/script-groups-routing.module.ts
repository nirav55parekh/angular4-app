import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScriptGroupsComponent } from './script-groups.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ScriptListComponent } from './script-list/script-list.component';

const routes: Routes = [
  {
    path: '', component: ScriptGroupsComponent, children: [
      {
        path: '', component: ListComponent, canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: [
        //       'script_groups_edit_owner', 'script_groups_create_owner', 'script_groups_delete_owner', 'script_groups_view_owner',
        //       'script_groups_edit_admin', 'script_groups_create_admin', 'script_groups_delete_admin', 'script_groups_view_admin'
        //     ],
        //     redirectTo: '/home/dashboard'
        //   }
        // }
      },
      {
        path: 'new', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['script_groups_create_owner', 'script_groups_create_admin'],
            redirectTo: '/home/script-groups'
          }
        }
      },
      {
        path: 'edit/:id', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['script_groups_edit_owner', 'script_groups_edit_admin'],
            redirectTo: '/home/script-groups'
          }
        }
      },
      {
        path: 'view/:id', component: ViewComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['script_groups_view_owner', 'script_groups_view_admin'],
            redirectTo: '/home/script-groups'
          }
        }
      },
      {
        path: 'scriptList/:id', component: ScriptListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptGroupsRoutingModule { }
