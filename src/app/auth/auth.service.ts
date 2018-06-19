import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpClient } from '../shared/services/http-client.service';
import { Response } from "@angular/http";
import 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs/Rx';
import * as _ from "lodash";
@Injectable()
export class AuthService {
    permissionsChanged = new Subject<any[]>();
    response: any = [];
    permissions: any = [];
    cloneOfPermissions = [];
    constructor(
        private http: HttpClient,
        private ngxPermissionsService: NgxPermissionsService
    ) { }

    setPermissionArray(permissions) {
        let tempArray = [];
        permissions.forEach(permission => {
            if ("isCheckedAdmin" in permission && permission.isCheckedAdmin) {
                tempArray.push(permission.permission_key + "_admin");
            }
            if ("isCheckedOwner" in permission && permission.isCheckedOwner) {
                tempArray.push(permission.permission_key + "_owner");
            }
        });
        this.cloneOfPermissions = tempArray;
        return tempArray
    }

    setPermissions(permissions) {
        permissions = this.setPermissionArray(permissions);
        this.ngxPermissionsService.loadPermissions(permissions);
        this.permissionsChanged.next(permissions);
    }

    getPermissions(roleId) {
        return this.http.get(environment.SERVER_URL + "rolesPermissionList/" + roleId)
            .map((res: Response) => {
                this.response = res.json();
                this.permissions = this.response[0].permissions;
                this.setPermissions(this.permissions);
            })
    }

    checkIsAdminRights(permissionName) {
        return (this.cloneOfPermissions.indexOf(permissionName) !== -1) ? true : false
    }

}