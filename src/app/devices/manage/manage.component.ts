import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DeviceServices } from '../device.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DeviceConstants } from '../device.constants';
import * as _ from "lodash";
import { SharedContants } from '../../shared/shared.constants';
import { UserServices } from '../../users/user.services';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {

  @ViewChild('f') deviceForm: NgForm;
  id: number;
  editMode = false;
  isAdmin = SharedContants.IS_ADMIN;
  title: String = "Device Details";
  device: any = {};
  errorMessage: String = "";
  oldDetails: any = {};
  users: any = [];
  deviceUsers: any = [];
  isCustomer: boolean = (SharedContants.USER_DETAILS.providers.local.role.id == 2) ? true : false;

  constructor(private userServices: UserServices, private deviceServices: DeviceServices, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.deviceForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
      this.getCustomerList();
    });
  }

  formDetails() {
    if (this.editMode) {
      this.deviceServices.getDeviceDetails(this.id).subscribe((data) => {
        this.device = data;
      })
    }
  }

  getCustomerList() {
    this.userServices.getUserList().subscribe((data) => {
      this.users = data;
      this.getSelecteUserList(this.device.user);
    })
  }

  getSelecteUserList(users) {
    if (users) {
      users = ("created_by" in this.device) ? users + "," + this.device.created_by : users;
    } else {
      users = ("created_by" in this.device) ? this.device.created_by : "";
    }

    if (users) {
      this.deviceServices.getSelectedUserList(users).subscribe((data) => {
        this.deviceUsers = data;
      })
    }
  }

  onSubmit() {
    var that = this;
    if (this.deviceForm.valid) {
      this.submitForm();
    }
  }

  submitForm() {
    var that = this;
    this.device.user = _.map(this.deviceUsers, 'id').toString();
    this.device.created_by = SharedContants.USER_ID;
    if (this.editMode) {
      this.deviceServices.editDevice(this.device).subscribe(() => {
        that.router.navigate(['/home/devices'], { relativeTo: that.route });
      })
    } else {
      this.deviceServices.createvindevice(this.device).subscribe(() => {
        that.router.navigate(['/home/devices'], { relativeTo: that.route });
      })
    }
  }

}
