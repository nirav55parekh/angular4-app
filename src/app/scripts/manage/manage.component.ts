import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, ElementRef, Pipe, PipeTransform, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ScriptServices } from '../script.services';
import { ScriptConstants } from '../script.constants';
import { Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common.service';
import { ScriptGroupsServices } from '../../script-groups/script-groups.service';
import * as _ from "lodash";
import { SharedContants } from '../../shared/shared.constants';
import { UserServices } from '../../users/user.services';
import { DeviceServices } from '../../devices/device.service';
import { MakeServices } from '../../make/make.service';

@Injectable()

@Pipe({ name: 'module' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styles: ['div { word-break: break-all; }']
})

export class ManageComponent implements OnInit, AfterViewChecked {

  @ViewChild('f') scriptForm: NgForm;
  @ViewChild('template1') template1: ElementRef;
  id: number;
  editMode = false;
  deviceSelected = { "errors": "", "info": "" };
  isAdmin = SharedContants.IS_ADMIN;
  title: String = "Script Details";
  script: any = {};
  errorMessage: String = "";
  oldDetails: any = {};
  devices: any = [];
  selectedScriptGroups: any = [];
  categories = ScriptConstants.CATEGORIES;
  devicenumbertocheck = '';
  protected searchStr: string;
  modalRef: BsModalRef;
  getdevices = [];
  dataSource: any = [];
  deviceSocket = [];
  pid = 0;
  contents: "";
  scriptGroups: any = [];
  codes: any = [];
  users: any = [];
  scriptUser: any = {};
  selectedModule: any;
  selectedStatus: any;
  scanning: any;
  makes: any = [];
  selectedMakes: any = [];
  categoryNotAvail: boolean;
  isIdAvailableForCategories: boolean = false;

  constructor(
    private makeServices: MakeServices, private http: Http, private scriptServices: ScriptServices, private modalService: BsModalService, private ref: ChangeDetectorRef, private router: Router,
    private route: ActivatedRoute, private commonService: CommonService, private scriptGroupsServices: ScriptGroupsServices,
    private userServices: UserServices, private deviceServices: DeviceServices
  ) { }

  ngOnInit() {
    this.deviceSelected.errors = null;
    this.deviceSelected.info = null;
    this.scriptForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
      this.getCustomerList();
      this.getMakeList();
    });
  }

  formDetails() {
    var that = this;
    this.getScriptGroups();
    if (this.editMode) {
      this.scriptServices.getScriptDetails(this.id).subscribe((data) => {
        this.script = data;
        this.isIdAvailableForCategories = (isNaN(this.script.category) && 'id' in this.script.category) ? true : false
        this.oldDetails = Object.assign({}, this.script);
        this.getSelectedScriptGroups(this.script.scriptGroups);
        this.getSelecteUserList();
        if (this.script.make_id !== undefined) {
          this.getSelectedMakes(this.script.make_id);
        }
      })
    }
  }

  getMakeList() {
    this.makeServices.getMakeList().subscribe((data) => {
      this.makes = data;
    })
  }

  getScriptGroups() {
    var that = this;
    this.scriptGroupsServices.getScriptGroupsList().subscribe((data) => {
      that.scriptGroups = data;
    })
  }

  getSelectedScriptGroups(scriptGroups) {
    var that = this;
    this.scriptGroupsServices.getSelectedScriptGroups(scriptGroups).subscribe((data) => {
      that.selectedScriptGroups = data;
    })
  }

  getCustomerList() {
    this.userServices.getUserList().subscribe((data) => {
      this.users = data;
    })
  }

  getSelecteUserList() {
    let users = this.script.created_by;

    if (users) {
      this.deviceServices.getSelectedUserList(users).subscribe((data) => {
        this.scriptUser = (data.length) ? data[0] : [];
      })
    }
  }

  getSelectedMakes(makes) {
    var that = this;
    this.makeServices.getSelectedMakes(makes).subscribe((data) => {
      this.selectedMakes = data;
    })
  }

  onSubmit(commit) {
    var that = this;
    if (this.scriptForm.valid && ("category" in this.script)) {
      if (this.script.name !== this.oldDetails.name) {
        this.scriptServices.checkIfNameAvailable(this.script).subscribe((data) => {
          if (data.length) {
            this.errorMessage = ScriptConstants.NAME_ALREADY_AVAILABLE
          } else {
            this.submitForm(commit);
          }
        })
      } else {
        this.submitForm(commit);
      }
    } {
      if (!("category" in this.script)) {
        this.categoryNotAvail = true;
      }
    }
  }

  submitForm(commit) {
    var that = this;
    let scriptForMakeCheck = "";
    this.script.commit = commit;
    if ("category" in this.script) {
      scriptForMakeCheck = (typeof this.script.category === "object") ? this.script.category.id : this.script.category;
    }
    if (scriptForMakeCheck.toString() == "3") {
      this.script.make_id = _.map(this.selectedMakes, 'id').toString();
    }
    this.script.created_by = ("id" in this.scriptUser) ? this.scriptUser.id : SharedContants.USER_DETAILS.id;
    this.script.scriptGroups = _.map(this.selectedScriptGroups, 'id').toString();
    if (this.editMode) {
      this.scriptServices.editScript(this.script).subscribe(() => {
        that.router.navigate(['/home/scripts'], { relativeTo: that.route });
      })
    } else {
      this.scriptServices.createscript(this.script).subscribe(() => {
        that.router.navigate(['/home/scripts'], { relativeTo: that.route });
      })
    }
  }

  onCategoryChange(c) {
    this.script.category = c;
  }

  searchDevice() {
    var that = this;
    this.http.get(environment.SERVER_URL + "devices/getbytyped/W/" + this.script.deviceNo).subscribe((data) => {
      that.dataSource = data.json();
    })
  }

  onChange(event) {
    this.script.category = event;
  }

  openLogsModal(template1) {
    this.modalRef = this.modalService.show(template1);
  }

  preivewpythonscript() {
    this.devicenumbertocheck = this.script.deviceNo;
    this.contents = this.script.contents;
    if (this.editMode) {
      this.commonService.store('edit', this);
      this.commonService.previewPythonScript();
      this.openLogsModal(this.template1);
      this.commonService.get('edit');
    } else {
      this.commonService.store('create', this);
      this.commonService.previewPythonScript();
      this.commonService.get('create');
    }

  }


  stopProgram() {
    var that = this;
    this.scriptServices.stopprogram(this.devicenumbertocheck).subscribe((obj) => {
      that.pid = 0;
    })
  }

  updateDeviceList(typed) {
    var that = this;
    this.scriptServices.getbytyped(typed).subscribe((data) => {
      that.getdevices = data;
    })
  }


  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
