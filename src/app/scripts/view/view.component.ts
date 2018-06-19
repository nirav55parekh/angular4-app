import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ScriptServices } from '../script.services';
import * as _ from "lodash";
import { ScriptGroupsServices } from '../../script-groups/script-groups.service';

@Component({
  selector: 'app-view',
  template: `
  <view-mode [details]="details" [title]="script.name" ></view-mode>
  `,
  styles: []
})
export class ViewComponent implements OnInit, AfterViewChecked {

  script: any = {};
  details: any = {};
  constructor(private router: Router,
    private route: ActivatedRoute,
    private scriptServices: ScriptServices,
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
    this.scriptServices.getScriptDetails(id).subscribe((data) => {
      this.script = data;
      this.getSelectedScriptGroups(data, this.script.scriptGroups)
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
      "name": data.name,
      "Program": data.program,
      "Contents(Python)": data.contents,
      "Category": data.category.name,
      "Script Groups": selectedScriptGroups,
    }
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
