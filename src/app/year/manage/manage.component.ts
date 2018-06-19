import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from "lodash";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { ModelServices } from '../../model/model.service';
import { YearServices } from '../../year/year.service';
import { YearConstants } from '../year.constants';
import { MakeServices } from '../../make/make.service';
import { ScriptServices } from '../../scripts/script.services';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { CommonServices } from '../../shared/services/common.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit, AfterViewChecked {
  @ViewChild('f') yearForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  id: number;
  editMode = false;
  title: String = "Year Details";
  year: any = {};
  makes: any = [];
  models: any = [];
  scripts: any = [];
  programs: any = [];
  selectedPrograms: any = [];
  errorMessage: String = "";
  oldDetails: any = {};
  file: File;
  decodestring = [{ id: 0, name: "", year_id: 0 }];

  constructor(
    private yearServices: YearServices,
    private makeServices: MakeServices,
    private modelServices: ModelServices,
    private router: Router,
    private http: Http,
    private scriptServices: ScriptServices,
    private ref: ChangeDetectorRef,
    private commonServices: CommonServices,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.yearForm.valueChanges.subscribe(() => {
      this.errorMessage = "";
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });

    this.getMakeList();
    this.getScriptList();
  }

  fileChange(event) {
    this.file = event.target.files[0];
  }

  formDetails() {
    if (this.editMode) {
      this.yearServices.getYearDetails(this.id).subscribe((data) => {
        this.year = data;
        this.year.make_id = this.year.make_id.toString()
        this.year.model_id = this.year.model_id.toString()
        this.onMakeChange(this.year.make_id);
        this.getProgramList(this.year.programs)
        this.oldDetails = Object.assign({}, this.year)
      })
    }
  }

  onMakeChange(make_id) {
    this.modelServices.getvinmodelbymake(make_id).subscribe((data) => {
      this.models = data;
    })
  }

  getProgramList(programs) {
    this.scriptServices.getprogramslist(programs).subscribe((data) => {
      this.selectedPrograms = data;
    })
  }

  onSubmit() {
    var that = this;
    if (this.yearForm.valid) {
      this.submitForm();
    }
  }

  submitForm() {
    var that = this;
    if (this.yearForm.valid) {

      let tempDate = this.year.name;
      if (!(typeof this.year.name === "string")) {
        this.year.name = tempDate[0].getFullYear() + " - " + tempDate[1].getFullYear();
        this.year.startDate = tempDate[0].getFullYear();
        this.year.endDate = tempDate[1].getFullYear();
      }

      this.year.programs = _.map(this.selectedPrograms, 'id').toString();
      this.year.decodestring = this.decodestring;

      if (this.editMode) {
        this.yearServices.editYear(this.year).subscribe(() => {
          that.uploadFile();
        })
      } else {
        this.yearServices.createvinyear(this.year).subscribe(() => {
          that.uploadFile();
        })
      }
    }
  }

  uploadFile() {
    var that = this;
    if (this.file) {
      let formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);
      var filename = this.year.id + "_" + this.year.make_id + this.year.model_id;

      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      this.blockUI.start('Loading...');
      this.http.post(environment.SERVER_URL + 'vinyear/uploadvinimage/' + filename + '/' + this.year.id,
        formData, { "headers": headers })
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(() => {
          that.blockUI.stop();
          that.commonServices.toastrMessage(1, YearConstants.YEAR_ADD_SUCCESS);
          that.router.navigate(['/home/years'], { relativeTo: that.route });
        })
    } else {
      this.commonServices.toastrMessage(1, YearConstants.YEAR_ADD_SUCCESS);
      this.router.navigate(['/home/years'], { relativeTo: this.route });
    }
  }

  getMakeList() {
    this.makeServices.getMakeList()
      .subscribe((data) => {
        this.makes = data;
      });
  }

  getScriptList() {
    this.scriptServices.getScriptList()
      .subscribe((data) => {
        this.scripts = data;
      });
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
