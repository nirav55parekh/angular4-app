import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ScriptServices } from '../script.services';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewChecked {
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
  isAdmin = SharedContants.IS_ADMIN;
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent) table: DatatableComponent; @ViewChild(SearchComponent) searchComp;

  constructor(
    private scriptServices: ScriptServices,
    private commonServices: CommonServices,
    private modalService: BsModalService,
    private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "name", "label": "Name", "type": "text", "value": "", "options": null }
    ];
    this.getList();
  }

  getList() {
    const that = this;
    this.scriptServices.getScriptList()
      .subscribe((data) => {
        that.scripts = data;
        that.temp = [...data];
        that.getVinYearData(1);
      });
  }

  deleteScript(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.scriptServices.deleteScript(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.scripts = event;
  }

  assignModel(template1, script) {
    this.selectedProgram = script.id;
    this.selectedProgramName = script.name;
    this.iterateYear();
    this.modalRef = this.modalService.show(template1);
  }

  iterateYear() {
    if (this.vinyears && this.vinyears.length) {
      this.vinyears.forEach((value, index) => {
        value.checked = false;
        value.programs.forEach((program, pindex) => {
          if (program.id === this.selectedProgram) {
            value.checked = true;
          }
        });
      });
    }

  };

  saveAssgignPrograms = function () {
    let that = this;
    this.scriptServices.assginProgram(this.selectedProgram, this.vinyears).subscribe((data) => {
      that.messageSaveAssignment = data.msg;
      that.getVinYearData(0);
    })
  }

  getVinYearData(fromList) {
    var that = this;
    this.scriptServices.getVinYear().subscribe((years) => {
      that.vinyears = years;
      if (fromList == 0) {
        that.iterateYear();
      }
    });
  }

  updateCredit(script) {
    if (script.credit) {
      this.scriptServices.editScript(script).subscribe(() => {
      });
    }
  }

  countUp() {
    this.getList();
  };

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
