import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { VinConstants } from "./vin.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()

export class VinServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) { this.http = http; }

    getVinList(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(VinConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getVinDetails(id) {
        return this.http.get(VinConstants.GET_VIN_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    deleteVin(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(VinConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, VinConstants.VIN_DELETE_SUCCESS);
                return;
            });
    }

    checkIfNameAvailable(name) {
        return this.http.post(VinConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createvinvin(vinDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(VinConstants.ADD_VIN, vinDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, VinConstants.VIN_ADD_SUCCESS);
                return;
            });
    }

    editVin(vinDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(VinConstants.EDIT_VIN + "/" + vinDetails.id + "/" + vinDetails.id, vinDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, VinConstants.VIN_EDIT_SUCCESS);
                return;
            });
    }
}