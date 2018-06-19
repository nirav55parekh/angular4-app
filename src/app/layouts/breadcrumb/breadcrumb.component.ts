import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import * as _ from "lodash";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  url: any = [];
  addressBarUrl: String = "";
  constructor(router: Router, private ref: ChangeDetectorRef) {
    var that = this;
    let type = "";
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        let eventUrl: any = event.url;
        this.addressBarUrl = event.url;
        if (eventUrl.search("edit") !== -1 ||
          eventUrl.search("view") !== -1 ||
          eventUrl.search("settings") !== -1 ||
          eventUrl.search("scriptList") !== -1
        ) {
          if (eventUrl.search("edit") !== -1) {
            type = "edit";
            eventUrl = eventUrl.substring(0, eventUrl.search(type) + 4);
          } else if (eventUrl.search("view") !== -1) {
            type = "view";
            eventUrl = eventUrl.substring(0, eventUrl.search(type) + 4);
          } else if (eventUrl.search("scriptList") !== -1) {
            type = "scriptList";
            eventUrl = eventUrl.substring(0, eventUrl.search(type) + 10);
          } else if (eventUrl.search("settings") !== -1) {
            type = "settings";
            eventUrl = eventUrl.substring(0, eventUrl.search(type) + 8);
          }
        }
        eventUrl = eventUrl.split("/");
        this.createBreadcrumb(eventUrl);
      }
    });

    let eventUrl: any = router.url;
    this.addressBarUrl = router.url;
    if (eventUrl.search("edit") !== -1 || eventUrl.search("view") !== -1 || eventUrl.search("scriptList") !== -1
      || eventUrl.search("settings") !== -1
    ) {
      if (eventUrl.search("edit") !== -1) {
        type = "edit";
        eventUrl = eventUrl.substring(0, eventUrl.search(type) + 4);
      } else if (eventUrl.search("view") !== -1) {
        type = "view";
        eventUrl = eventUrl.substring(0, eventUrl.search(type) + 4);
      } else if (eventUrl.search("scriptList") !== -1) {
        type = "scriptList";
        eventUrl = eventUrl.substring(0, eventUrl.search(type) + 10);
      } else if (eventUrl.search("settings") !== -1) {
        type = "settings";
        eventUrl = eventUrl.substring(0, eventUrl.search(type) + 8);
      }

    }
    eventUrl = eventUrl.split("/");
    this.createBreadcrumb(eventUrl);

  }

  ngOnInit() {
  }

  createBreadcrumb(urls) {
    let tempUrl = [];
    urls.forEach(url => {
      if (url === "" || url === "home") {
        tempUrl.push({
          "name": url,
          "urlLink": "/home/dashboard"
        })
      } else {
        tempUrl.push({
          "name": url,
          "urlLink": this.addressBarUrl.substring(0, this.addressBarUrl.search(url) + url.length)
        })
      }
    });
    this.url = tempUrl;
  }


  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
