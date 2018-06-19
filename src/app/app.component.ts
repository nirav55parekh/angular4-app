import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { SharedContants } from './shared/shared.constants';
import { CommonServices } from './shared/services/common.service';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'app';
  countInternetLost = 0;
  subscription: Subscription;
  constructor(
    private http: Http, private router: Router, private route: ActivatedRoute, private authService: AuthService, private commonServices: CommonServices
  ) {
  }
  ngOnInit() {
    let roleId = undefined;
    let userId = undefined;
    if (localStorage.getItem("bse_token") == null) {
      //this.router.navigate(['/login'], { relativeTo: this.route });
    } else {
      var that = this;
      this.commonServices.onUserDetailsChanged(null, true);

      this.subscription = this.authService.permissionsChanged.subscribe(() => { });

      roleId = SharedContants.USER_DETAILS.providers.local.role.id;
      this.authService.getPermissions(roleId).subscribe(() => { })

      userId = SharedContants.USER_DETAILS.id;

      setInterval(() => {
        this.http.get(environment.LOGIN_URL + "ping")
          .timeout(5000)
          .toPromise()
          .then((data: any) => {
            that.countInternetLost = 0;
            that.commonServices.removeToastr();
          })
          .catch((err) => {
            if (that.countInternetLost == 3) {
              that.commonServices.toastrMessage(2,
                "Can not connect to the Rocketpod server. Please check your internet connection",
                {
                  positionClass: "toast-top-center", tapToDismiss: true,timeOut: 30000,
                })
            } else {
              that.countInternetLost++;
            }
          })
      }, 15000)

      //this.router.navigate(['/home/dashboard'], { relativeTo: this.route });
    }

  }

  confirmBoxOptions = {
    overlay: false, // Default: true
    overlayClickToClose: false, // Default: true
    showCloseButton: true, // Default: true
    confirmText: "Yes", // Default: 'Yes'
    declineText: "No", // Default: 'No'
  }

  alertBoxOptions = {
    overlay: false, // Default: true
    overlayClickToClose: false, // Default: true
    showCloseButton: true, // Default: true
    duration: 5000
  }

}