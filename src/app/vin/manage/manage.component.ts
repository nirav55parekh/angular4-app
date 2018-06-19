import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { VinServices } from '../../vin/vin.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { VinConstants } from '../vin.constants';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {

  @ViewChild('f') vinForm: NgForm;
  id: number;
  editMode = false;
  title: String = "Vin Details";
  vin: any = {};
  errorMessage: String = "";
  oldDetails: any = {};

  constructor(private vinServices: VinServices, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.vinForm.valueChanges.subscribe(() => {
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
      this.vinServices.getVinDetails(this.id).subscribe((data) => {
        this.vin = data;
        this.oldDetails = Object.assign({}, this.vin)
      })
    }
  }

  onSubmit() {
    var that = this;
    if (this.vinForm.valid) {
      if (JSON.stringify(this.vin) !== JSON.stringify(this.oldDetails)) {
        this.submitForm();
      }
      else {
        that.router.navigate(['/home/vins'], { relativeTo: that.route });
      }
    }
  }

  submitForm() {
    var that = this;
    if (this.editMode) {
      this.vinServices.editVin(this.vin).subscribe(() => {
        that.router.navigate(['/home/vins'], { relativeTo: that.route });
      })
    } else {
      this.vinServices.createvinvin(this.vin).subscribe(() => {
        that.router.navigate(['/home/vins'], { relativeTo: that.route });
      })
    }
  }

}
