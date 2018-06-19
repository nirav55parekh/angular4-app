import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { HeadingService } from './heading.service';
import { NavigationStart, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router/src/router_state';
import { NgxPermissionsService } from 'ngx-permissions';

import * as _ from "lodash";
import { SharedContants } from '../../shared/shared.constants';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
})
export class HeadingComponent implements OnInit, AfterViewChecked {
  public headingDetails: any = {
    heading: "",
    tagLine: "",
    title: "",
    icon: ""
  };
  public listView = false;
  public addButtonEnable = false;
  public isAdmin = false;

  constructor(private ngxPermissionsService: NgxPermissionsService, router: Router, private headingService: HeadingService, private ref: ChangeDetectorRef) {
    var that = this;
    this.isAdmin = SharedContants.IS_ADMIN;
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url.search("edit") !== -1
          || event.url.search("view") !== -1
          || event.url.search("scriptList") !== -1
          || event.url.search("settings") !== -1
          || event.url.search("new") !== -1) {
          that.listView = false;
        } else {
          that.listView = true;
        }
        that.headingDetails = that.headingService.setHeading(event.url);
        var permissions = that.ngxPermissionsService.getPermissions();
        let found = false;
        that.ngxPermissionsService.permissions$.subscribe((permissions) => {
          _.forIn(permissions, function (value, key) {
            if (key === that.headingDetails.add_button_title) {
              found = true;
            }
          });
          this.addButtonEnable = found || false;
        })
      }
    });

    if (router.url.search("edit") !== -1 ||
      router.url.search("view") !== -1 ||
      router.url.search("settings") !== -1 ||
      router.url.search("scriptList") !== -1 ||
      router.url.search("new") !== -1) {
      that.listView = false;
    } else {
      that.listView = true;
    }
    this.headingDetails = this.headingService.setHeading(router.url);

    var permissions = this.ngxPermissionsService.getPermissions();
    let found = false;
    this.ngxPermissionsService.permissions$.subscribe((permissions) => {
      _.forIn(permissions, function (value, key) {
        if (key === that.headingDetails.add_button_title) {
          found = true;
        }
      });
      this.addButtonEnable = found || false;
    })

  }

  ngOnInit() {
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
