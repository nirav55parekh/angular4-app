import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { VinServices } from '../vin.service';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewChecked {

  private vins: any = [];
  private temp: any = [];
  private searchList = [];
  private searchField = 'vin';

  @ViewChild(DatatableComponent) table: DatatableComponent;   @ViewChild(SearchComponent) searchComp;

  constructor(private vinServices: VinServices, private commonServices: CommonServices, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "VIN", "label": "Name", "type": "text", "value": "", "options": null },
    ];
    this.getList();
  }

  getList() {
    this.vinServices.getVinList()
      .subscribe((data) => {
        this.vins = data;
        this.temp = [...data];
      });
  }

  deleteVin(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.vinServices.deleteVin(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.vins = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
