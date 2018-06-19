import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingsServices } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  @ViewChild('f') settingsForm: NgForm;
  title: String = "Settings";
  settings: any = {};
  constructor(private settingsServices: SettingsServices) { }

  ngOnInit() {
    this.formDetails();
  }

  formDetails() {
    this.settingsServices.getSettings().subscribe((data) => {
      this.settings = data;
    })
  }

  onSubmit() {
    var that = this;
    if (this.settingsForm.valid) {
      this.submitForm();
    }
  }

  submitForm() {
    var that = this;
    this.settingsServices.editSettings(this.settings).subscribe(() => {

    })
  }
}
