import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProfileComponent } from '../profile/profile.component';
import { NotFoundComponent } from '../layouts/not-found/not-found.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SettingsComponent } from '../settings/settings.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'devices', loadChildren: '../devices/devices.module#DevicesModule' },
      { path: 'roles', loadChildren: '../roles/roles.module#RolesModule' },
      { path: 'users', loadChildren: '../users/users.module#UsersModule' },
      { path: 'module-codes', loadChildren: '../module-codes/module-codes.module#ModuleCodesModule' },
      { path: 'script-groups', loadChildren: '../script-groups/script-groups.module#ScriptGroupsModule' },
      { path: 'scripts', loadChildren: '../scripts/scripts.module#ScriptsModule' },
      { path: 'vins', loadChildren: '../vin/vin.module#VinModule' },
      { path: 'makes', loadChildren: '../make/make.module#MakeModule' },
      { path: 'models', loadChildren: '../model/model.module#ModelModule' },
      { path: 'years', loadChildren: '../year/year.module#YearModule' },
      { path: '', redirectTo: "/home/dashboard", pathMatch: "full" },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
