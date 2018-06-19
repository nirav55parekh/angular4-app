import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ViewComponent } from './view/view.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '', component: UsersComponent, children: [
      {
        path: '', component: ListComponent, canActivate: [NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: [
        //       'users_edit_owner', 'users_create_owner', 'users_delete_owner', 'users_view_owner',
        //       'users_edit_admin', 'users_create_admin', 'users_delete_admin', 'users_view_admin'
        //     ],
        //     redirectTo: '/home/dashboard'
        //   }
        // },
      },
      {
        path: 'new', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['users_create_owner', 'users_create_admin'],
            redirectTo: '/home/users'
          }
        }
      },
      {
        path: 'edit/:id', component: ManageComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['users_edit_owner', 'users_edit_admin'],
            redirectTo: '/home/users'
          }
        }
      },
      {
        path: 'view/:id', component: ViewComponent, canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['users_view_owner', 'users_view_admin'],
            redirectTo: '/home/users'
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
export class UsersRoutingModule { }
