import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonServices } from '../../shared/services/common.service';
import { YearServices } from '../year.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewChecked {

  private years: any = [];
  private temp: any = [];
  private searchList = [];
  private searchField = 'name';
  @ViewChild(DatatableComponent) table: DatatableComponent;   @ViewChild(SearchComponent) searchComp;

  constructor(private yearServices: YearServices, private commonServices: CommonServices, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "year", "label": "Name", "type": "text", "value": "", "options": null },
    ];
    this.getList();
  }

  getList() {
    let that = this;
    this.yearServices.getYearList()
      .subscribe((data) => {
        this.years = data;
        this.temp = [...data];
      });
  }

  deleteYear(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.yearServices.deleteYear(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.years = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
