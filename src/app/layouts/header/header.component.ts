import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserServices } from '../../users/user.services';
import { NgxPermissionsService } from 'ngx-permissions';
import { SharedContants } from '../../shared/shared.constants';
import { CommonServices } from '../../shared/services/common.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, AfterViewChecked {
  user: any;
  protected time = new Date().getTime();
  isAdmin: boolean = false;
  @BlockUI() blockUI: NgBlockUI;
  protected storeLoginUrl = environment.STORE_URL;
  protected isCustomer = SharedContants.USER_DETAILS.providers.local.role.id.toString() == "2" ? true : false;
  constructor(private ref: ChangeDetectorRef, private commonService: CommonServices, private ngxPermissionsService: NgxPermissionsService, private userServices: UserServices, private http: Http, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    var that = this;
    let id = SharedContants.USER_DETAILS.id;
    this.user = SharedContants.USER_DETAILS;
    this.isAdmin = SharedContants.IS_ADMIN;
    this.user.used_credit = (this.user.used_credit !== undefined) ? parseInt(this.user.used_credit) : 0;

    this.commonService.userDetailsChanged.subscribe(() => {
      that.user = SharedContants.USER_DETAILS;
      that.user.used_credit = (that.user.used_credit !== undefined) ? parseInt(that.user.used_credit) : 0;
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

  signOutFromStore() {
    localStorage.clear();
    this.ngxPermissionsService.flushPermissions();

    setTimeout(() => {
      this.blockUI.start('Redirecting on Store...');
    }, 3000);
    this.blockUI.stop();
    window.location.href = environment.STORE_URL + environment.STORE_LOGOUT;
  }

  refreshCoins() {
    this.commonService.onUserDetailsChanged(SharedContants.USER_ID, false);
  }

  onGotoStore() {
    localStorage.clear();
    this.ngxPermissionsService.flushPermissions();

    setTimeout(() => {
      this.blockUI.start('Redirecting on Store...');
    }, 3000);
    this.blockUI.stop();
    window.location.href = environment.STORE_URL;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
