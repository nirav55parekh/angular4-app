import { Component, OnInit } from '@angular/core';
import { ModuleCodesServices } from '../module-codes.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  private modules:any=[];
  private totalModuleCodess: number;

  constructor(private moduleCodesServices: ModuleCodesServices) { }

  ngOnInit() {
    this.getList();
  }

  getList() {
    var that = this;
    this.moduleCodesServices.getModuleCodesList()
      .subscribe((data) => {
        this.modules = data;
      });
  }

}
