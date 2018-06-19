import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { YearConstants } from "./year.constants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()

export class YearServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) { this.http = http; }

    getYearList(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(YearConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getYearDetails(id) {
        return this.http.get(YearConstants.GET_YEAR_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    deleteYear(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(YearConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, YearConstants.YEAR_DELETE_SUCCESS);
                return;
            });
    }

    checkIfNameAvailable(name) {
        return this.http.post(YearConstants.CHECK_YEAR, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createvinyear(yearDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(YearConstants.ADD_YEAR, yearDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return;
            });
    }

    editYear(yearDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(YearConstants.EDIT_YEAR + "/" + yearDetails.id + "/" + yearDetails.id, yearDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return;
            });
    }
}