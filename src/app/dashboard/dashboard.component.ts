import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { SharedContants } from '../shared/shared.constants';
import { AuthService } from '../auth/auth.service';
import { UserServices } from '../users/user.services';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  dashboardData: any = undefined;
  selectAll: Boolean = false;
  isAdmin: Boolean = SharedContants.IS_ADMIN;
  constructor(private http: Http, private router: Router, private authService: AuthService, private userServices: UserServices) { }


  createAuthorizationHeader(headers: Headers) {
    headers.append('Authorization', 'JWT ' +
      JSON.parse(localStorage.bse_token).token);
  }

  ngOnInit() {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    let data = {
      devices: (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("device_view_admin")) ? 'all' : SharedContants.USER_ID,
      scripts: (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("scripts_view_admin")) ? 'all' : SharedContants.USER_ID,
      customers: (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("users_view_admin")) ? 'all' : SharedContants.USER_ID,
      scriptGroups: (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("script_groups_view_admin")) ? 'all' : SharedContants.USER_ID
    };
    this.http.post(environment.SERVER_URL + "users/getDashboardDetails", data, {
      headers: headers,
      withCredentials: true
    })
      .catch((e: any) => Observable.throw(this.errorHandler(e)))
      .subscribe((res) => {
        this.dashboardData = res.json();
      })
  }

  errorHandler(err) {
    var that = this;
    if (err.status == 401 || err.status == 0) {
      that.blockUI.start('Token Expired. Redirecting on Login Page');
      setTimeout(() => {
        localStorage.clear();
        that.router.navigate(['/login']);
        that.blockUI.stop();
      }, 3000);
    }
  }

  onApprove() {
    this.submit();
  }

  onApproveAll() {
    this.dashboardData.customers.waitingForApproval.forEach(customer => {
      customer.providers.local.approved = true;
    });
    this.submit();
  }

  submit() {
    this.userServices.approveUsers(this.dashboardData.customers.waitingForApproval).subscribe(() => {

    });
  }



}
