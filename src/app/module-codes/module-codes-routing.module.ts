import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleCodesComponent } from './module-codes.component';
import { ManageCodesComponent } from './codes/manage-codes/manage-codes.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', component: ModuleCodesComponent, children: [
      { path: '', component: ListComponent },
      { path: 'edit/:id', component: ManageCodesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuleCodesRoutingModule { }
