import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { MakeConstants } from "./make.contants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()

export class MakeServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) { this.http = http; }

    getMakeList(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(MakeConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }


    getMakeDetails(id) {
        return this.http.get(MakeConstants.GET_MAKE_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getSelectedMakes(id) {
        return this.http.get(MakeConstants.GET_SELECTED_MAKES_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    deleteMake(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(MakeConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, MakeConstants.MAKE_DELETE_SUCCESS);
                return;
            });
    }

    checkIfNameAvailable(name) {
        return this.http.post(MakeConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createvinmake(makeDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(MakeConstants.ADD_MAKE, makeDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, MakeConstants.MAKE_ADD_SUCCESS);
                return;
            });
    }

    editMake(makeDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(MakeConstants.EDIT_MAKE + "/" + makeDetails.id + "/" + makeDetails.id, makeDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, MakeConstants.MAKE_EDIT_SUCCESS);
                return;
            });
    }
}