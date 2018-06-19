import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MakeServices } from '../make.service';
import { MakeConstants } from "../make.contants";
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  @ViewChild('f') makeForm: NgForm;
  id: number;
  editMode = false;
  title: String = "Make Details";
  make: any = {};
  errorMessage: String = "";
  oldDetails: any = {};

  constructor(private makeServices: MakeServices, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.makeForm.valueChanges.subscribe(() => {
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
      this.makeServices.getMakeDetails(this.id).subscribe((data) => {
        this.make = data;
        this.oldDetails = Object.assign({}, this.make)
      })
    }
  }

  onSubmit() {
    var that = this;
    if (this.makeForm.valid) {
      if (this.make.name !== this.oldDetails.name) {
        this.makeServices.checkIfNameAvailable(this.make).subscribe((data) => {
          if (data.length) {
            this.errorMessage = MakeConstants.NAME_ALREADY_AVAILABLE
          } else {
            this.submitForm();
          }
        })
      }
      else {
        that.router.navigate(['/home/makes'], { relativeTo: that.route });
      }
    }
  }

  submitForm() {
    var that = this;
    if (this.editMode) {
      this.makeServices.editMake(this.make).subscribe(() => {
        that.router.navigate(['/home/makes'], { relativeTo: that.route });
      })
    } else {
      this.makeServices.createvinmake(this.make).subscribe(() => {
        that.router.navigate(['/home/makes'], { relativeTo: that.route });
      })
    }
  }

}
