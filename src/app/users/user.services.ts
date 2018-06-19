import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { UserConstants } from "./user.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedContants } from "../shared/shared.constants";
import { AuthService } from "../auth/auth.service";

@Injectable()

export class UserServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private commonServices: CommonServices
    ) {
        this.http = http;
    }

    getUserList(query: any = {}) {
        this.blockUI.start('Loading...');
        let id = (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("users_view_admin")) ? 'all' : SharedContants.USER_ID;
        return this.http.get(UserConstants.GET_LIST + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getUserDetails(id) {
        return this.http.get(UserConstants.GET_USER_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    deleteUser(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(UserConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, UserConstants.USER_DELETE_SUCCESS);
                return;
            });
    }

    createuser(userDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(UserConstants.ADD_USER, userDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, UserConstants.USER_ADD_SUCCESS);
                return;
            });
    }

    approveUsers(userDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(UserConstants.APPROVE_USERS, userDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, UserConstants.USER_ADD_SUCCESS);
                return;
            });
    }

    editUser(userDetails, fromProfile = 0) {
        if (fromProfile == 0) {
            this.blockUI.start('Loading...');
            return this.http.put(UserConstants.EDIT_USER + "/" + userDetails.id + "/" + userDetails.id, userDetails)
                .map((res: Response) => {
                    this.blockUI.stop();
                    this.response = res.json();
                    this.commonServices.toastrMessage(1, UserConstants.USER_EDIT_SUCCESS);
                    return;
                });
        } else {
            return this.http.put(UserConstants.EDIT_USER + "/" + userDetails.id + "/" + userDetails.id, userDetails)
                .map((res: Response) => {
                    this.response = res.json();
                    return;
                });
        }

    }
}