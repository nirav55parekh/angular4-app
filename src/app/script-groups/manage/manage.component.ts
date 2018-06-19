import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ScriptGroupsServices } from '../script-groups.service';
import { ScriptGroupsConstants } from "../script-groups.constants";
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SharedContants } from '../../shared/shared.constants';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  @ViewChild('f') scriptGroupForm: NgForm;
  id: number;
  editMode = false;
  title: String = "Script Group Details";
  scriptGroup: any = {};
  errorMessage: String = "";
  oldDetails: any = {};

  constructor(private scriptGroupsServices: ScriptGroupsServices, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.scriptGroupForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });
  }

  formDetails() {
    if (this.editMode) {
      this.scriptGroupsServices.getScriptGroupsDetails(this.id).subscribe((data) => {
        this.scriptGroup = data;
        this.oldDetails = Object.assign({}, this.scriptGroup)
      })
    }
  }

  onSubmit() {
    var that = this;
    if (this.scriptGroupForm.valid) {
      if (this.scriptGroup.name !== this.oldDetails.name) {
        this.scriptGroupsServices.checkIfNameAvailable(this.scriptGroup).subscribe((data) => {
          if (data.length) {
            this.errorMessage = ScriptGroupsConstants.NAME_ALREADY_AVAILABLE
          } else {
            this.submitForm();
          }
        })
      }
      else {
        that.router.navigate(['/home/script-groups'], { relativeTo: that.route });
      }
    }
  }

  submitForm() {
    var that = this;
    this.scriptGroup.created_by = SharedContants.USER_ID;
    if (this.editMode) {
      this.scriptGroupsServices.editScriptGroup(this.scriptGroup).subscribe(() => {
        that.router.navigate(['/home/script-groups'], { relativeTo: that.route });
      })
    } else {
      this.scriptGroupsServices.createScriptGroup(this.scriptGroup).subscribe(() => {
        that.router.navigate(['/home/script-groups'], { relativeTo: that.route });
      })
    }
  }

}
