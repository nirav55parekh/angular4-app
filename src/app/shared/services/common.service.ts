import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit } from '@jaspero/ng2-confirmations/src/interfaces/resolve-emit';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AlertsService } from '@jaspero/ng2-alerts';
import { SharedContants } from '../shared.constants';
import { UserConstants } from '../../users/user.constants';
import { HttpClient } from './http-client.service';

@Injectable()
export class CommonServices {
    private response: any;
    userDetailsChanged = new Subject<any>();

    constructor(
        private _confirmation: ConfirmationService,
        private _alert: AlertsService,
        private http: HttpClient,
        private toastr: ToastrService
    ) { this.http = http; }

    confirmationBox(message) {
        return this._confirmation.create('Confirm', message)
            .map((ans: ResolveEmit) => {
                return ans.resolved;
            });
    }

    alertBox(type, message) {
        this._alert.create(type, message);
    }

    promptBox(message) {
        return this._confirmation.create('Confirm', message)
            .map((ans: ResolveEmit) => {
                return ans.resolved;
            });
    }

    toastrMessage(type, message, options = {}) {

        if (options == {}) {
            options = {
                timeOut: 2000,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
                progressBar: true,
                progressAnimation: 'decreasing'
            }
        }

        if (message) {
            switch (type) {
                case 1:
                    this.toastr.success(message, 'Success!', {});
                    break;

                case 2:
                    this.toastr.error(message, 'Fail!', options);
                    break;
                default:
                    break;
            }
        }
    }

    removeToastr() {
        this.toastr.clear();
    }

    onUserDetailsChanged(id, isDataAvailable) {
        var that = this;
        if (isDataAvailable) {
            SharedContants.setUserDetails();
            this.userDetailsChanged.next();
        } else {
            this.http.get(UserConstants.GET_USER_DETAILS + "/" + id)
                .map((res: Response) => {
                    this.response = res.json();
                    return this.response;
                }).subscribe((data) => {
                    localStorage.setItem("user", JSON.stringify({ "user": data }));
                    SharedContants.setUserDetails();
                    that.userDetailsChanged.next();
                });
        }
    }
}