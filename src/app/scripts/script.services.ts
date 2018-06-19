import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { ScriptConstants } from "./script.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedContants } from "../shared/shared.constants";
import { AuthService } from "../auth/auth.service";

@Injectable()

export class ScriptServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private commonServices: CommonServices
    ) { this.http = http; }

    getScriptList(query: any = {}) {
        this.blockUI.start('Loading...');
        let id = (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("scripts_view_admin")) ? 'all' : SharedContants.USER_ID;
        return this.http.get(ScriptConstants.GET_LIST + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    checkIfNameAvailable(name) {
        return this.http.post(ScriptConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }


    getScriptDetails(id) {
        return this.http.get(ScriptConstants.GET_SCRIPT_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getprogramslist(programs) {
        return this.http.get(ScriptConstants.GET_PROGRAM_LIST_BY_SCRIPT + "/" + programs)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    deleteScript(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(ScriptConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptConstants.SCRIPT_DELETE_SUCCESS);
                return;
            });
    }

    createscript(scriptDetails) {
        this.blockUI.start('Loading...');
        scriptDetails.user = SharedContants.USER_DETAILS
        return this.http.post(ScriptConstants.ADD_SCRIPT, scriptDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptConstants.SCRIPT_ADD_SUCCESS);
                return;
            });
    }

    editScript(scriptDetails) {
        this.blockUI.start('Loading...');
        scriptDetails.user = SharedContants.USER_DETAILS
        return this.http.put(ScriptConstants.EDIT_SCRIPT + "/" + scriptDetails.id + "/" + scriptDetails.id, scriptDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptConstants.SCRIPT_EDIT_SUCCESS);
                return;
            });
    }

    updateCredit(scriptDetails) {
        scriptDetails.user = SharedContants.USER_DETAILS
        return this.http.put(ScriptConstants.EDIT_SCRIPT + "/" + scriptDetails.id + "/" + scriptDetails.id, scriptDetails)
            .map((res: Response) => {
                this.response = res.json();
                this.commonServices.toastrMessage(1, ScriptConstants.CREDIT_ADDED);
                return;
            });
    }

    assginProgram(selectedProgram, vinyears) {
        return this.http.post(ScriptConstants.ASSIGN_PROGRAMS + selectedProgram, vinyears)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getVinYear() {
        return this.http.get(ScriptConstants.VIN_YEAR)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    stopprogram(devicenumbertocheck) {
        return this.http.get(ScriptConstants.STOP_PROGRAM + devicenumbertocheck + '/' + devicenumbertocheck)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getbytyped(typed) {
        return this.http.get(ScriptConstants.GET_BY_TYPED + typed + '/' + typed)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }
}