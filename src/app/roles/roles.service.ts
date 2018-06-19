import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { RolesConstants } from "./roles.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()

export class RolesServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) { this.http = http; }

    getRolesList(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(RolesConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }


    getRolesDetails(id) {
        return this.http.get(RolesConstants.GET_ROLES_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }


    deleteRoles(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(RolesConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, RolesConstants.ROLES_DELETE_SUCCESS);
                return;
            });
    }

    checkIfNameAvailable(name) {
        return this.http.post(RolesConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createRole(rolesDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(RolesConstants.ADD_ROLE, rolesDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, RolesConstants.ROLES_ADD_SUCCESS);
                return;
            });
    }

    editRole(rolesDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(RolesConstants.EDIT_ROLE + "/" + rolesDetails.id + "/" + rolesDetails.id, rolesDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, RolesConstants.ROLES_EDIT_SUCCESS);
                return;
            });
    }
}