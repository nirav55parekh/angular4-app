import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Response } from '@angular/http/src/static_response';
import { ErrorHandler } from '@angular/core/src/error_handler';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from '../auth.service';
import { SharedContants } from '../../shared/shared.constants';
import { UserServices } from '../../users/user.services';
import { Subscription } from 'rxjs';
import { UserConstants } from '../../users/user.constants';
import { CommonServices } from '../../shared/services/common.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f') loginForm: NgForm;
  @ViewChild('f1') signupForm: NgForm;
  user: any = {};
  lForm: Boolean = true;
  sForm: Boolean = false;
  subscription: Subscription;
  loginError: String = "";
  storeLoginUrl = environment.STORE_LOGIN;
  isStoreLogin: boolean = false;
  id;

  constructor(
    private ngxPermissionsService: NgxPermissionsService,
    private http: Http,
    private router: Router,
    private authService: AuthService,
    private userServices: UserServices,
    private commonServices: CommonServices,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.isStoreLogin = true;
        this.id = +params['id'];
        var that = this;
        this.ngxPermissionsService.flushPermissions();
        this.blockUI.start('Please Wait...');
        localStorage.setItem("bse_token", JSON.stringify({ "token": params['token'] }));
        this.userServices.getUserDetails(this.id).subscribe((data) => {
          localStorage.setItem("user", JSON.stringify({ "user": data }));

          setTimeout(() => {
            that.commonServices.onUserDetailsChanged(null, true);
          }, 10000);
          that.setRoleAndPermissions();
          that.blockUI.stop();
        })
      } else {
        let roleId = undefined;
        let userId = undefined;
        if (localStorage.getItem("bse_token") == null) {
          this.router.navigate(['/login'], { relativeTo: this.route });
        } else {
          this.commonServices.onUserDetailsChanged(null, true);
          this.subscription = this.authService.permissionsChanged.subscribe(() => { });

          roleId = SharedContants.USER_DETAILS.providers.local.role.id;
          this.authService.getPermissions(roleId).subscribe(() => { })

          userId = SharedContants.USER_DETAILS.id;
          this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
        }
      }
    })
  }


  login() {
    var that = this;
    var permissions;
    this.user.email = this.user.email.toLowerCase();
    this.http.post(environment.LOGIN_URL + "users/apilogin", this.user)
      .toPromise()
      .then((data: Response) => {
        localStorage.setItem("bse_token", JSON.stringify({ "token": data.json().token }));
        localStorage.setItem("user", JSON.stringify(data.json()));
        this.commonServices.onUserDetailsChanged(null, true);
        this.setRoleAndPermissions();
      }, (error: any) => {
        this.loginError = "Invalid email or password!";
      })
  }

  setRoleAndPermissions() {
    if (!("USER_DETAILS" in SharedContants)) {
      let roleId = JSON.parse(localStorage.getItem("user")).user.providers.local.role.id
      this.authService.getPermissions(roleId).subscribe(() => {
        this.router.navigate(['./home/dashboard']);
      });
    }
    let roleId = SharedContants.USER_DETAILS.providers.local.role.id;
    this.authService.getPermissions(roleId).subscribe(() => {
      this.router.navigate(['./home/dashboard']);
    });
  }

  showForm($event) {
    if ($event.target.innerText === "Login") {
      this.lForm = true;
      this.sForm = false;
    } else {
      this.lForm = false;
      this.sForm = true;
    }
  }

  signup() {
    let that = this;
    this.blockUI.start('Loading...');
    this.user.role = { id: 2, name: "Customer" };
    this.user.email = this.user.email.toLowerCase();
    this.http.post(UserConstants.REGISTER_USER, this.user)
      .map((res: Response) => {
        that.blockUI.stop();
        that.commonServices.toastrMessage(1, UserConstants.USER_ADD_SUCCESS);
        that.user = {};
        that.router.navigate(['/login'], { relativeTo: that.route });
        that.lForm = true;
        that.sForm = false;
        return res.json()
      })
      .catch((error: any) => {
        that.blockUI.stop();
        that.commonServices.toastrMessage(2, error.json().msg);
        return Observable.throw(error.statusText);
      })
      .subscribe(() => {
      });
  }

}
