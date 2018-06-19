import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { UserServices } from '../user.services';
import { CommonServices } from '../../shared/services/common.service';
import { SharedContants } from '../../shared/shared.constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SearchComponent } from '../../layouts/search/search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, AfterViewChecked {
  userId = SharedContants.USER_ID;
  private users: any = [];
  private temp: any = [];
  private searchList = [];
  private searchField = 'name';
  @ViewChild(DatatableComponent) table: DatatableComponent; @ViewChild(SearchComponent) searchComp;

  constructor(private userServices: UserServices, private commonServices: CommonServices, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.searchList = [
      { "name": "name", "label": "Name", "type": "text", "value": "", "options": null },
    ];
    this.getList();
  }

  getList() {
    let that = this;
    this.userServices.getUserList()
      .subscribe((data) => {
        this.users = this.convertUserList(data);
        let tempData = this.convertUserList(data);
        this.temp = [...tempData];
      });
  }

  convertUserList(data) {

    let tempUserList = [];

    data.forEach((user) => {
      tempUserList.push({
        id: user.id,
        name: user.providers.local.name,
        role: user.providers.local.role.name,
        approved: user.providers.local.approved,
        email: user.email,
      });
    });

    return tempUserList;
  }

  deleteUser(id) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.userServices.deleteUser(id).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  onSearch(event) {
    this.table.offset = 0;
    this.users = event;
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

}
