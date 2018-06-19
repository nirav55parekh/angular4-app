import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RolesServices } from '../roles.service';
import { RolesConstants } from "../roles.constants";
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { AuthService } from '../../auth/auth.service';
import { SharedContants } from '../../shared/shared.constants';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit, AfterViewChecked {
  @ViewChild('f') roleForm: NgForm;
  @ViewChild(PermissionsComponent) childPermissionGroup;
  id: number;
  editMode = false;
  title: String = "Role Details";
  role: any = {};
  errorMessage: String = "";
  oldDetails: any = {};

  constructor(private rolesServices: RolesServices, private router: Router, private authService: AuthService,
    private route: ActivatedRoute, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.roleForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });
  }

  formDetails() {
    if (this.editMode) {
      this.rolesServices.getRolesDetails(this.id).subscribe((data) => {
        this.role = data;
        this.oldDetails = Object.assign({}, this.role)
      })
    }
  }

  onSubmit(form) {
    var that = this;
    if (this.roleForm.valid) {
      if (this.role.name !== this.oldDetails.name) {
        this.rolesServices.checkIfNameAvailable(this.role).subscribe((data) => {
          if (data.length) {
            this.errorMessage = RolesConstants.NAME_ALREADY_AVAILABLE
          } else {
            this.submitForm();
          }
        })
      }
      else {
        this.submitForm();
      }
    }
  }

  createRolesPermissions() {
    let permissionList = this.childPermissionGroup.permissionList;
    let tempPermissionList: any = [];

    permissionList.forEach(permissionGroup => {
      permissionGroup.permissions.forEach(permission => {
        tempPermissionList.push({
          module_key: permissionGroup.module_key,
          permission_key: permission.permission_key,
          isCheckedOwner: ("isCheckedOwner" in permission) ? permission.isCheckedOwner : false,
          isCheckedAdmin: ("isCheckedAdmin" in permission) ? permission.isCheckedAdmin : false,
        });
      });
    });

    return tempPermissionList;

  }

  submitForm() {
    var that = this;
    this.role.permissionList = this.createRolesPermissions();
    this.role.permissionListId = this.childPermissionGroup.rolesPermissionListId;
    if (this.editMode) {
      this.rolesServices.editRole(this.role).subscribe(() => {
        that.getNewPermissionList();
      })
    } else {
      this.rolesServices.createRole(this.role).subscribe(() => {
        that.router.navigate(['/home/roles'], { relativeTo: that.route });
      })
    }
  }

  getNewPermissionList() {
    let roleId = SharedContants.USER_DETAILS.providers.local.role.id;
    var that = this;
    this.authService.getPermissions(roleId).subscribe(() => {
      that.router.navigate(['/home/roles'], { relativeTo: that.route });
    })
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
