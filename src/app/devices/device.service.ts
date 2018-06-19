import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { DeviceConstants } from "./device.constants";
import { CommonServices } from "../shared/services/common.service";
import { HttpClient } from "../shared/services/http-client.service";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SharedContants } from "../shared/shared.constants";
import { AuthService } from "../auth/auth.service";
import { Observable } from "rxjs/Observable";

@Injectable()

export class DeviceServices {

    private response: any;
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices,
        private authService: AuthService
    ) { this.http = http; }

    getDeviceList(query: any = {}) {
        this.blockUI.start('Loading...');
        let id = (SharedContants.IS_ADMIN || this.authService.checkIsAdminRights("device_view_admin")) ? 'all' : SharedContants.USER_ID;
        return this.http.get(DeviceConstants.GET_LIST + "/" + id)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                return this.response;
            })
    }

    getuserlist(query: any = {}) {
        return this.http.get(DeviceConstants.GET_CUSTOMER_LIST)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getSelectedUserList(query: any = {}) {
        return this.http.get(DeviceConstants.GET_SELECTED_USER_LIST + "/" + query)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }


    getDeviceDetails(id) {
        return this.http.get(DeviceConstants.GET_DEVICE_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    getConfigDeviceDetails(id) {
        return this.http.get(DeviceConstants.GET_CONFIG_DEVICE_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    removeConfigDeviceDetails(id) {
        return this.http.get(DeviceConstants.GET_REMOVE_CONFIG_DEVICE_DETAILS + "/" + id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }


    deleteDevice(id, device) {
        this.blockUI.start('Loading...');
        return this.http.delete(DeviceConstants.REMOVE + "/" + id + "/" + id, device)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, DeviceConstants.DEVICE_DELETE_SUCCESS);
                return;
            });
    }

    createvindevice(deviceDetails) {
        this.blockUI.start('Loading...');
        return this.http.post(DeviceConstants.ADD_DEVICE, deviceDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, DeviceConstants.DEVICE_ADD_SUCCESS);
                return;
            });
    }

    editDevice(deviceDetails) {
        this.blockUI.start('Loading...');
        return this.http.put(DeviceConstants.EDIT_DEVICE + "/" + deviceDetails.id + "/" + deviceDetails.id, deviceDetails)
            .map((res: Response) => {
                this.blockUI.stop();
                this.response = res.json();
                this.commonServices.toastrMessage(1, DeviceConstants.DEVICE_EDIT_SUCCESS);
                return;
            });
    }

    getchromedata(payload) {
        return this.http.post(DeviceConstants.GET_CHROME_DATA, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getscriptbymakemodelyear(payload) {
        return this.http.post(DeviceConstants.GET_SCRIPT_BY_MAKE_MODEL_YEAR, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    resetdeviceangularsession(payload) {
        return this.http.post(DeviceConstants.RESET_DEVICE_ANGULAR_SESSION, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    showpostcodes(payload) {
        return this.http.post(DeviceConstants.SHOW_POST_CODES, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    shownearpostcodes(payload) {
        return this.http.post(DeviceConstants.SHOW_NEAR_POST_CODES, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    printpdf(payload) {
        return this.http.post(DeviceConstants.PRINT_PDF, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            }).catch((err) => {
                return Observable.throw(err)
            })
    }

    checkdeviceabletorunscript(payload) {
        return this.http.post(DeviceConstants.CHECK_DEVICE_ABLETO_RUN_SCRIPT, payload)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    showcodesallmodules() {
        return this.http.get(DeviceConstants.SHOW_CODES_ALL_MODULES)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    vinmakeList() {
        return this.http.get(DeviceConstants.MAKE_LIST)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getvinmodelbymake(makeObj) {
        return this.http.get(DeviceConstants.GET_MODEL_BY_MAKE + makeObj.id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getvinyearbymakemodel(makeObj, modelObj) {
        return this.http.get(DeviceConstants.GET_VIN_YEAR_BY_MAKE_MODEL + makeObj.id + '/' + modelObj.id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    vinYear(vinyear) {
        return this.http.get(DeviceConstants.VIN_YEAR + vinyear.id)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getprogramslist(programs) {
        return this.http.get(DeviceConstants.GET_PROGRAM_LIST + programs + '\'')
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    runpythonscriptprogram(id, scriptprogramid, scriptCredit) {
        return this.http.get(DeviceConstants.RUN_PYTHON_SCRIPT_PROGRAM + id + '/' + scriptprogramid + '/' + scriptCredit)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            }).catch((err) => {
                return Observable.throw(err)
            })
    }

    stoppythonscriptprogram(id, scriptprogramid, deviceId) {
        return this.http.get(DeviceConstants.STOP_PYTHON_SCRIPT_PROGRAM + id + '/' + scriptprogramid + "/" + deviceId)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }

    getdevicebynumber(devicenumbertocheck) {
        return this.http.get(DeviceConstants.GET_DEVICE_BY_NUMBER + devicenumbertocheck + "/" + devicenumbertocheck)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            });
    }
}