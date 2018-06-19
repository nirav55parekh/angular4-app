import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { environment } from "../../environments/environment";
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { UserServices } from '../users/user.services';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CommonServices } from '../shared/services/common.service';
import { SharedContants } from '../shared/shared.constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @ViewChild('f') userForm: NgForm;
  @ViewChild('f1') userPasswordForm: NgForm;
  @ViewChild('myImage') myImage: ElementRef;
  @BlockUI() blockUI: NgBlockUI;
  protected cities: any[] = [{ id: 1, name: "United Kingdom" }];
  protected states: any[] = [{ id: 1, name: "England" }];
  protected countries: any[] = [{ id: 1, name: "London" }];
  protected user: any = {
    providers: {
      local: {
        role: {}
      }
    }
  };
  protected errorMessage: String = "";
  protected id: Number = SharedContants.USER_DETAILS.id;
  protected time = new Date().getTime();
  protected oldDetails: any = {};
  protected url = "";
  protected changePassword: any = {};
  protected confirmPassword = "";
  file: File;

  constructor(private commonServices: CommonServices, private userServices: UserServices, private http: Http, private router: Router, private ref: ChangeDetectorRef,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.userForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.formDetails();
  }

  formDetails() {
    this.userServices.getUserDetails(this.id).subscribe((data) => {
      this.user = data;
      this.oldDetails = Object.assign({}, this.user)
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

  onImageClick() {
    let el: HTMLElement = this.myImage.nativeElement as HTMLElement;
    el.click();
  }

  fileChange(event) {
    this.file = event.target.files[0];
  }

  submitForm() {
    var that = this;
    this.user.providers.local["profilePic"] = "profilePic" + "-" + this.user.id + ".jpg";
    if (this.changePassword.password) {
      this.user.providers.local.password = this.changePassword.password
    }
    this.userServices.editUser(this.user, 1).subscribe(() => {
      that.uploadFile();
    })
  }

  uploadFile() {
    var that = this;
    if (this.file) {
      let formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);
      var filename = this.user.providers.local["profilePic"];
      let headers = new Headers();
      let options = new RequestOptions({ headers: headers });
      this.blockUI.start('Loading...');
      this.http.post(environment.SERVER_URL + 'users/uploadProfileImage/' + filename + "/" + this.user.id,
        formData, { "headers": headers })
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(() => {
          that.blockUI.stop();
          that.commonServices.toastrMessage(1, "Profile details updated");
          that.commonServices.onUserDetailsChanged(SharedContants.USER_ID, false);
          that.router.navigate(['/home/dashboard'], { relativeTo: that.route });
        })
    } else {
      this.commonServices.toastrMessage(1, "Profile details updated");
      this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
    }
  }

}
