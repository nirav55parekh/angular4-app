import { Response } from "@angular/http";
import { Injectable } from "@angular/core";
import 'rxjs/Rx';
import { Subject } from "rxjs/Subject";
import { CommonServices } from "../shared/services/common.service";
import { ModuleCodesConstants } from "./module-codes.constants";
import { HttpClient } from "../shared/services/http-client.service";



@Injectable()

export class ModuleCodesServices {

    private response: any;
    codeChanged = new Subject<String>();

    constructor(
        private http: HttpClient,
        private commonServices: CommonServices
    ) {this.http = http; }

    getModuleCodesList(query: any = {}) {
        return this.http.get(ModuleCodesConstants.GET_LIST)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }

    onCodeChange(moduleName) {
        this.codeChanged.next(moduleName);
    }

    getCodes(moduleName) {
        return this.http.get(ModuleCodesConstants.GET_CODES + "/" + moduleName)
            .map((res: Response) => {
                this.response = res.json();
                return this.response;
            })
    }
}