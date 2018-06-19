import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../user.services';
import { ScriptGroupsServices } from '../../script-groups/script-groups.service';
import * as _ from "lodash";

@Component({
  selector: 'app-view',
  template: `
  <view-mode [details]="details" [title]="userName" ></view-mode>
  `,
  styles: []
})
export class ViewComponent implements OnInit, AfterViewChecked {

  user: any = {};
  details: any = {};
  userName: String = undefined;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private userServices: UserServices,
    private scriptGroupsServices: ScriptGroupsServices,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let id = +params['id'];
      this.getViewDetails(id);
    });
  }

  getViewDetails(id) {
    this.userServices.getUserDetails(id).subscribe((data) => {
      this.user = data;
      this.userName = this.user.providers.local.name;
      this.getSelectedScriptGroups(data, this.user.providers.local.scriptGroups)
    })
  }

  getSelectedScriptGroups(user, scriptGroups) {
    var that = this;
    this.scriptGroupsServices.getSelectedScriptGroups(scriptGroups).subscribe((data) => {
      let selectedScriptGroups = _.map(data, 'name').toString();
      this.createKeyValuePair(user, selectedScriptGroups);
    })
  }

  createKeyValuePair(data, selectedScriptGroups) {
    this.details = {
      "Id": data.id,
      "Email": data.email,
      "Username": data.providers.local.username,
      "Approved": (data.providers.local.approved) ? "Approved" : "Not Approved",
      "Role": data.providers.local.role.name,
      "Script Groups": selectedScriptGroups
    }
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
