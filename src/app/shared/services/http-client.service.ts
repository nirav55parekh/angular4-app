import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AlertsService } from '@jaspero/ng2-alerts';
import { Observable } from 'rxjs/Observable';
import { SharedContants } from '../shared.constants';

@Injectable()
export class HttpClient {

    @BlockUI() blockUI: NgBlockUI;

    constructor(private http: Http, private router: Router, private toastr: ToastrService, private _alert: AlertsService,
        private route: ActivatedRoute) { }

    createAuthorizationHeader(headers: Headers) {

        if (!("user" in localStorage) || JSON.parse(localStorage.getItem("user")).user.id === SharedContants.USER_ID) {
            // This code is for single tab (client) can open config page
            // Also if we are duplicate tab though can not open config page
            var tabID = sessionStorage.tabID ? sessionStorage.tabID : sessionStorage.tabID = Math.random();
            if (sessionStorage.tabID) {
                if (!window.name) {
                    window.name = "unkonwn";
                    tabID = sessionStorage.tabID = Math.random();
                }
            } else {
                tabID = sessionStorage.tabID = Math.random();
            }

            let token = JSON.parse(localStorage.bse_token).token || null;
            headers.append('Authorization', 'JWT ' +
                token);

            headers.append('clientTab', tabID);
        }
    }

    checkAuthorized(statusCode) {
        if (statusCode == 401 || statusCode == 0) {
            this.blockUI.start('Token Expired. Redirecting on Login Page');
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
                this.blockUI.stop();
            }, 3000);
        }
    }

    validationErrorMessage(statusCode, msg) {
        this._alert.create("error", msg);
        this.blockUI.stop();
    }

    get(url) {
        if (!("user" in localStorage) || JSON.parse(localStorage.getItem("user")).user.id === SharedContants.USER_ID) {
            let headers = new Headers();
            this.createAuthorizationHeader(headers);
            return this.http.get(url, {
                headers: headers,
                withCredentials: true
            }).catch((err) => {
                this.checkAuthorized(err.status);
                let response = err.json();
                this.validationErrorMessage(err.status, response.error);
                return Observable.throw(err)
            })
        } else {
            this.blockUI.start('Token Expired. Getting new logged in information');
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
                this.blockUI.stop();
            }, 3000);
            window.location.reload();
        }

    }

    post(url, data) {
        if (JSON.parse(localStorage.getItem("user")).user.id === SharedContants.USER_ID) {
            let headers = new Headers();
            this.createAuthorizationHeader(headers);
            return this.http.post(url, data, {
                headers: headers,
                withCredentials: true
            }).catch((err) => {
                this.checkAuthorized(err.status);
                let response = err.json();
                this.validationErrorMessage(err.status, response.error);
                return err;
            })
        } else {
            this.blockUI.start('Token Expired. Getting new logged in information');
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
                this.blockUI.stop();
            }, 3000);
            window.location.reload();
        }
    }

    put(url, data) {
        if (JSON.parse(localStorage.getItem("user")).user.id === SharedContants.USER_ID) {
            let headers = new Headers();
            this.createAuthorizationHeader(headers);
            return this.http.put(url, data, {
                headers: headers,
                withCredentials: true
            }).catch((err) => {
                this.checkAuthorized(err.status);
                let response = err.json();
                this.validationErrorMessage(err.status, response.error);
                return err;
            })
        } else {
            this.blockUI.start('Token Expired. Getting new logged in information');
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
                this.blockUI.stop();
            }, 3000);
            window.location.reload();
        }
    }

    delete(url, data: any = "") {
        if (JSON.parse(localStorage.getItem("user")).user.id === SharedContants.USER_ID) {
            let headers = new Headers();
            this.createAuthorizationHeader(headers);
            return this.http.delete(url, {
                headers: headers,
                withCredentials: true
            }).catch((err) => {
                this.checkAuthorized(err.status);
                return err;
            })
        } else {
            this.blockUI.start('Token Expired. Getting new logged in information');
            setTimeout(() => {
                localStorage.clear();
                this.router.navigate(['/login']);
                this.blockUI.stop();
            }, 3000);
            window.location.reload();
        }
    }
}