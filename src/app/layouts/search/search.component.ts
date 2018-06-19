import { Component, OnInit, EventEmitter, Output, Input, ViewChild, AfterViewChecked, ChangeDetectorRef, Injectable, } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
@Injectable()
export class SearchComponent implements OnInit, AfterViewChecked {
  @Input() searchList;
  @Input() rows;
  @Input() tempData;
  @Input() searchField;

  @Output() searchEvent = new EventEmitter<string>();
  pagesizes = [5, 10, 15]
  rowlimit = 5;
  isOpen = true;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }

  updateFilter(event) {
    let that = this;
    const val = event.target.value.toLowerCase();

    // filter our data
    const tempData = this.tempData.filter(function (d) {
      return d[that.searchField].toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = tempData;

    this.searchEvent.emit(this.rows);
  }

  onReset() {
    this.searchList[0].value = "";
    this.searchEvent.emit(this.tempData);
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
