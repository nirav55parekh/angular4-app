import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ModelServices } from '../model.service';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewChecked {

  private models: any = [];
  private temp: any = [];
  private searchList = [];
  private searchField = 'name';
  @ViewChild(DatatableComponent) table: DatatableComponent;   @ViewChild(SearchComponent) searchComp;

  constructor(private modelServices: ModelServices, private commonServices: CommonServices, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "name", "label": "Name", "type": "text", "value": "", "options": null },
    ];
    this.getList();
  }

  getList() {
    let that = this;
    this.modelServices.getModelList()
      .subscribe((data) => {
        this.models = data;
        this.temp = [...data];
      });
  }

  deleteModel(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.modelServices.deleteModel(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.models = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
