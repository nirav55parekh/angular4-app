import { Component, OnInit } from '@angular/core';
import { ModuleCodesServices } from '../module-codes.service';

@Component({
  selector: 'app-codes',
  templateUrl: './codes.component.html',
})
export class CodesComponent implements OnInit {

  private codes: any = [];
  constructor(private moduleCodesServices: ModuleCodesServices) { }

  ngOnInit() {
    var that = this;
    this.moduleCodesServices.codeChanged.subscribe((moduleName: String) => {
      this.moduleCodesServices.getCodes(moduleName)
        .subscribe((data) => {
          that.codes = data;
        });
    });

  }

}
