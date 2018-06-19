import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { CommonServices } from "../shared/services/common.service";
import { ModelConstants } from "./model.contants";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()

export class ModelServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) { this.http = http; }

    getModelList(query: any = {}) {
        this.blockUI.start('Loading...');
        return this.http.get(ModelConstants.GET_LIST)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getModelDetails(id) {
        return this.http.get(ModelConstants.GET_MODEL_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getvinmodelbymake(id) {
        return this.http.get(ModelConstants.GET_MODELS_BY_MAKE + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    checkIfNameForSameMakeAvailable(name) {
        return this.http.post(ModelConstants.CHECK_NAME, name)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    createvinmodel(modelDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(ModelConstants.ADD_MODEL, modelDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ModelConstants.MODEL_ADD_SUCCESS);
                return;
            });
    }

    editModel(modelDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(ModelConstants.EDIT_MODEL + "/" + modelDetails.id + "/" + modelDetails.id, modelDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ModelConstants.MODEL_EDIT_SUCCESS);
                return;
            });
    }

    deleteModel(id) {
        this.blockUI.start('Loading...');
        return this.http.delete(ModelConstants.REMOVE + "/" + id + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, ModelConstants.MODEL_DELETE_SUCCESS);
                return;
            });
    }
}