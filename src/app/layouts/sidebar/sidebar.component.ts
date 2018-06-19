import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserServices } from '../../users/user.services';
import { NgxPermissionsService } from 'ngx-permissions';
import { SharedContants } from '../../shared/shared.constants';
import { CommonServices } from '../../shared/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
    `.sidebar-user-info-inner {
      padding : 10px 10px 10px 10px
    }`
  ]
})
export class SidebarComponent implements OnInit, AfterViewChecked {
  protected user: any;
  protected time = new Date().getTime();
  protected userType = null;
  protected isAdmin = false;
  constructor(private ref: ChangeDetectorRef, private commonService: CommonServices, private ngxPermissionsService: NgxPermissionsService, private userServices: UserServices, private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    let that = this;
    let id = SharedContants.USER_DETAILS.id;

    this.isAdmin = SharedContants.IS_ADMIN;
    this.user = SharedContants.USER_DETAILS;

    this.commonService.userDetailsChanged.subscribe(() => {
      that.user = SharedContants.USER_DETAILS;
      that.userType = that.user.providers.local.role.id;
    });
  }

  signOut() {
    var that = this;
    this.http.get(environment.LOGOUT_URL + "signout")
      .toPromise()
      .then(() => {
        localStorage.clear();
        that.ngxPermissionsService.flushPermissions();
        that.router.navigate(['./login']);
      }, (error: any) => {

      })
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
