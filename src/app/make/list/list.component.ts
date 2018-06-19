import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MakeServices } from '../make.service';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewChecked {

  private makes: any = [];
  private temp: any = [];
  private searchList = [];
  private searchField = 'name';
  @ViewChild(DatatableComponent) table: DatatableComponent;   @ViewChild(SearchComponent) searchComp;

  constructor(private makeServices: MakeServices, private commonServices: CommonServices, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "name", "label": "Name", "type": "text", "value": "", "options": null },
    ];
    this.getList();
  }

  getList() {
    let that = this;
    this.makeServices.getMakeList()
      .subscribe((data) => {
        this.makes = data;
        this.temp = [...data];
      });
  }

  deleteMake(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.makeServices.deleteMake(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.makes = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
