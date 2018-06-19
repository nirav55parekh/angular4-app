import { Component, OnInit, Input } from '@angular/core';
import { ModuleCodesServices } from '../module-codes.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
})
export class ModulesComponent implements OnInit {

  codes: any;
  @Input() modules: any;

  constructor(private moduleCodesServices: ModuleCodesServices) { }

  ngOnInit() {
  }

  showCodes(moduleName) {
    this.moduleCodesServices.onCodeChange(moduleName);
  }

}
