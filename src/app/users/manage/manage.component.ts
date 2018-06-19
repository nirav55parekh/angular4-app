import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../user.services';
import { UserConstants } from '../user.constants';
import * as _ from "lodash";
import { ScriptGroupsServices } from '../../script-groups/script-groups.service';
import { RolesServices } from '../../roles/roles.service';
import { SharedContants } from '../../shared/shared.constants';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit, AfterViewChecked {

  @ViewChild('f') userForm: NgForm;
  id: number;
  editMode = false;
  title: String = "User Details";
  roles; any = [];
  user: any = {
    providers: {
      local: {
        role: {}
      }
    }
  };
  errorMessage: String = "";
  selectedScriptGroups: any = [];
  oldDetails: any = {};
  scriptGroups = [
    { id: 1, name: "Ford" },
    { id: 2, name: "BMW" },
  ]

  constructor(private userServices: UserServices, private rolesServices: RolesServices, private router: Router, private ref: ChangeDetectorRef, private scriptGroupsServices: ScriptGroupsServices,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });
  }

  formDetails() {
    this.getScriptGroups();
    this.getRoles();
    if (this.editMode) {
      this.userServices.getUserDetails(this.id).subscribe((data) => {
        this.user = data;
        this.user.providers.local.role.id = this.user.providers.local.role.id.toString();

        if (this.user.providers.local.scriptGroups)
          this.getSelectedScriptGroups(this.user.providers.local.scriptGroups);

        this.oldDetails = Object.assign({}, this.user);
      })
    }
  }

  getRoles() {

    var that = this;
    this.rolesServices.getRolesList().subscribe((data) => {
      that.roles = data;
      that.roles = _.remove(that.roles, (role) => role.id !== '1')
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
      this.getUserCreatedScriptGroups(data);
    })
  }

  getUserCreatedScriptGroups(tempSelectedScriptGroups) {
    this.scriptGroupsServices.getUserCreatedScriptGroups(this.id, tempSelectedScriptGroups).subscribe((data) => {
      if (data.length) {
        data.forEach(element => {
          tempSelectedScriptGroups.push(element);
        });
      }
      this.selectedScriptGroups = tempSelectedScriptGroups;
      this.ref.detectChanges();
    })
  }

  onSubmit() {
    var that = this;
    if (this.userForm.valid) {
      if (this.user !== this.oldDetails) {
        this.submitForm();
      }
      else {
        that.router.navigate(['/home/users'], { relativeTo: that.route });
      }
    }
  }

  submitForm() {
    var that = this;
    this.user.email = this.user.email.toLowerCase();
    this.user.providers.local.scriptGroups = _.map(this.selectedScriptGroups, 'id').toString();
    if (this.editMode) {
      this.userServices.editUser(this.user).subscribe(() => {
        that.router.navigate(['/home/users'], { relativeTo: that.route });
      })
    } else {
      let payload = this.user.providers.local;
      payload.email = this.user.email;
      payload.created_by = SharedContants.USER_ID;
      this.userServices.createuser(payload).subscribe(() => {
        that.router.navigate(['/home/users'], { relativeTo: that.route });
      })
    }
  }

  onChange(event) {
    this.user.providers.local.role = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
