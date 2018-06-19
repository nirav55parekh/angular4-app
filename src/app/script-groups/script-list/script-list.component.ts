import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SearchComponent } from '../../layouts/search/search.component';
import { ScriptServices } from '../../scripts/script.services';
import { ScriptGroupsServices } from '../script-groups.service';
import { Params, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-script-list',
  templateUrl: './script-list.component.html',
  styleUrls: ['./script-list.component.css']
})
export class ScriptListComponent implements OnInit {

  scripts: any = [];
  userId = SharedContants.USER_ID;
  temp: any = [];
  searchList = [];
  searchField = 'name';
  selectedProgram: '';
  selectedProgramName: '';
  messageSaveAssignment: '';
  yearsIds;
  vinyears = [];
  id = null;

  modalRef: BsModalRef;
  @ViewChild(DatatableComponent) table: DatatableComponent; @ViewChild(SearchComponent) searchComp;

  constructor(
    private scriptGroupsServices: ScriptGroupsServices,
    private commonServices: CommonServices,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });
    this.searchList = [
      { "name": "name", "label": "Name", "type": "text", "value": "", "options": null }
    ];
    this.getList();
  }

  getList() {
    const that = this;
    this.scriptGroupsServices.scriptsOfScriptGroup(this.id)
      .subscribe((data) => {
        that.scripts = data;
        that.temp = [...data];
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.scripts = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
