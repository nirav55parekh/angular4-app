import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { ScriptGroupsConstants } from "./script-groups.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedContants } from "../shared/shared.constants";
import { AuthService } from "../auth/auth.service";

@Injectable()

export class ScriptGroupsServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private commonServices: CommonServices
    ) { this.http = http; }

    getScriptGroupsList(query: any = {}) {
        this.blockUI.start('Loading...');
        let id = (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("script_groups_view_admin")) ? 'all' : SharedContants.USER_ID;
        return this.http.get(ScriptGroupsConstants.GET_LIST + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    scriptsOfScriptGroup(id) {
        this.blockUI.start('Loading...');
        return this.http.get(ScriptGroupsConstants.SCRIPTS_OF_SCRIPT_GROUPS + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }


    getScriptGroupsDetails(id) {
        return this.http.get(ScriptGroupsConstants.GET_SCRIPT_GROUPS_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getSelectedScriptGroups(id) {
        return this.http.get(ScriptGroupsConstants.GET_SELECTED_SCRIPT_GROUPS_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getUserCreatedScriptGroups(userId, selectedScriptGroups) {
        return this.http.get(ScriptGroupsConstants.GET_USER_CREATED_SCRIPT_GROUPS_DETAILS + "/" + userId)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }


    deleteScriptGroups(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(ScriptGroupsConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptGroupsConstants.SCRIPT_GROUPS_DELETE_SUCCESS);
                return;
            });
    }

    checkIfNameAvailable(name) {
        return this.http.post(ScriptGroupsConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createScriptGroup(scriptGroupsDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(ScriptGroupsConstants.ADD_SCRIPT_GROUP, scriptGroupsDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptGroupsConstants.SCRIPT_GROUPS_ADD_SUCCESS);
                return;
            });
    }

    editScriptGroup(scriptGroupsDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(ScriptGroupsConstants.EDIT_SCRIPT_GROUP + "/" + scriptGroupsDetails.id + "/" + scriptGroupsDetails.id, scriptGroupsDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptGroupsConstants.SCRIPT_GROUPS_EDIT_SUCCESS);
                return;
            });
    }
}