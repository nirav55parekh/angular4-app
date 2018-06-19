import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { PermissionServices } from './permissions.service';
import * as _ from "lodash";
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styles: []
})
export class PermissionsComponent implements OnInit, AfterViewChecked {
  @Input('') roleId;
  @Input('') editMode;
  checkAll: Boolean = false;
  permissionList: any = [];
  rolesPermissionListId = undefined;
  rolesPermissionList: any = undefined;
  constructor(private permissionServices: PermissionServices, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getPermissionList();
  }

  getPermissionList() {
    this.permissionServices.getPermissionList().subscribe((data) => {
      this.permissionList = _.chain(data).groupBy("module_key").map(function (v, i) {
        return {
          module_key: i,
          permissions: v
        }
      }).value();
      if (this.editMode)
        this.getRolesPermissionList();
    });
  }

  getRolesPermissionList() {
    this.permissionServices.getRolesPermissionList(this.roleId).subscribe((data) => {
      this.rolesPermissionListId = data[0].id;
      this.rolesPermissionList = data[0];
      this.setCheckedPermissions();
    });
  }

  setCheckedPermissions() {
    this.permissionList.forEach(permissionGroup => {
      permissionGroup.permissions.forEach(permission => {
        this.compareWithRolePermissions(permission);
        this.onAnyPermissionChange(permissionGroup, permission);
      });
    });
  }

  compareWithRolePermissions(permission) {
    if (this.rolesPermissionList) {
      this.rolesPermissionList.permissions.forEach(fpermission => {
        if (fpermission.permission_key === permission.permission_key) {
          permission.isCheckedOwner = fpermission.isCheckedOwner || false;
          permission.isCheckedAdmin = fpermission.isCheckedAdmin || false;
        }
      });
    }
  }

  onAdminPermissionChange(permission) {
    if (permission.isCheckedAdmin == true) {
      permission.isCheckedOwner = true;
    }
  }

  onAnyPermissionChange(permissionGroup, permission) {
    let flagView = false;
    let flagViewAdmin = false;
    if (permission.name !== "View" && (permission.isCheckedAdmin || permission.isCheckedOwner)) {
      permissionGroup.permissions.forEach(groupPermission => {
        if (groupPermission.name === "View") {
          groupPermission.isCheckedOwner = true;
        }
        if (groupPermission.name === "View" && permission.isCheckedAdmin) {
          groupPermission.isCheckedAdmin = true;
        }
        if (groupPermission.name !== "View" && (groupPermission.isCheckedOwner || groupPermission.isCheckedAdmin)) {
          flagView = true;
        }
      });
    }

    if (permission.name !== "View") {
      permissionGroup.permissions.forEach(groupPermission => {
        if (groupPermission.name !== "View" && (groupPermission.isCheckedOwner || groupPermission.isCheckedAdmin)) {
          flagView = true;
        }
        if (groupPermission.name !== "View" && groupPermission.isCheckedAdmin) {
          flagViewAdmin = true;
        }
      });
      permissionGroup.permissions.forEach(groupPermission => {
        if (groupPermission.name === "View") {
          groupPermission.viewDisable = flagView;
          groupPermission.adminViewDisable = flagViewAdmin;
        }
      });
    }

  }

  onPermissionGroupAllChange(permissionGroup, checkAll) {
    permissionGroup.permissions.forEach(permission => {
      permission.isCheckedOwner = checkAll;
      permission.isCheckedAdmin = checkAll;
    });
  }

  onCheckAll() {
    this.permissionList.forEach(permissionGroup => {
      permissionGroup.checkAll = this.checkAll
      permissionGroup.permissions.forEach(permission => {
        permission.isCheckedOwner = this.checkAll;
        permission.isCheckedAdmin = this.checkAll;
      });
    });
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }


}
