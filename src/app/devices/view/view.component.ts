import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { DeviceServices } from '../device.service';
import { SharedContants } from '../../shared/shared.constants';

@Component({
  selector: 'app-view',
  template: `
    <view-mode [details]="details" [title]="device.nickname" ></view-mode>
  `,
  styles: []
})
export class ViewComponent implements OnInit, AfterViewChecked {
  device: any = {};
  details: any = {};
  constructor(private router: Router,
    private route: ActivatedRoute,
    private deviceServices: DeviceServices,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let id = +params['id'];
      this.getViewDetails(id);
    });
  }

  getViewDetails(id) {
    this.deviceServices.getDeviceDetails(id).subscribe((data) => {
      this.device = data;
      this.createKeyValuePair(data);
    })
  }

  createKeyValuePair(data) {
    this.details = {
      "Id": data.id,
      "Client SW No": data.client_sw_no,
      "Nickname": data.nickname,
      "Client Dev No": data.client_dev_no,
      "Client Public Key": data.client_public_key,
      "Client Certificate": data.client_certificate,
    }

    if (SharedContants.IS_ADMIN)
      this.details.User = ("user" in data) ? data.user.toString() : "";

  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
