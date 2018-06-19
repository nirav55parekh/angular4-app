import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../../../shared/services/common.service";
import { HttpClient } from "../../../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { PermissionsConstants } from "./permissions.constant";

@Injectable()
export class PermissionServices {
    private response: any;
    @BlockUI() blockUI: NgBlockUI;
    constructor(private http: HttpClient,
        private commonServices: CommonServices) { this.http = http; }

    getPermissionList() {
        this.blockUI.start('Loading...');
        return this.http.get(PermissionsConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getRolesPermissionList(id) {
        this.blockUI.start('Loading...');
        return this.http.get(PermissionsConstants.GET_ROLES_PERMISSION_LIST + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

}