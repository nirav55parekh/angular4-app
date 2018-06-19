import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ScriptGroupsServices } from '../script-groups.service';

@Component({
  selector: 'app-view',
  template: `
  <view-mode [details]="details" [title]="scriptGroup.name" ></view-mode>
  `,
  styles: []
})
export class ViewComponent implements OnInit, AfterViewChecked {

  scriptGroup: any = {};
  details: any = {};
  constructor(private router: Router,
    private route: ActivatedRoute,
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
    this.scriptGroupsServices.getScriptGroupsDetails(id).subscribe((data) => {
      this.scriptGroup = data;
      this.createKeyValuePair(this.scriptGroup);
    })
  }

  createKeyValuePair(data) {
    this.details = {
      "Id": data.id,
      "name": data.name
    }
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
