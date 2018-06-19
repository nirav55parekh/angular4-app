import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SettingsConstants } from "./settings.constant";
import { CommonServices } from "../shared/services/common.service";

@Injectable()

export class SettingsServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices,
    ) { this.http = http; }

    getSettings(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(SettingsConstants.GET_SETTINGS)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    editSettings(settings) {
        this.blockUI.start('Loading...');
        return this.http.put(SettingsConstants.UPDATE_SETTINGS + "/" + settings.id + "/" + settings.id, settings)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, SettingsConstants.SETTINGS_EDIT_SUCCESS);
                return;
            });
    }

}