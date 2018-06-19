import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YearComponent } from './year.component';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: '', component: YearComponent, children: [
      { path: '', component: ListComponent },
      { path: 'new', component: ManageComponent },
      { path: 'edit/:id', component: ManageComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearRoutingModule { }
