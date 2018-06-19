import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModelServices } from '../model.service';
import { ModelConstants } from '../model.contants';
import { MakeServices } from '../../make/make.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {

  @ViewChild('f') modelForm: NgForm;
  id: number;
  editMode = false;
  title: String = "Model Details";
  model: any = {};
  makes: any = [];
  errorMessage: String = "";
  oldDetails: any = {};

  constructor(private modelServices: ModelServices, private makeServices: MakeServices, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.modelForm.valueChanges.subscribe(() => {
      this.errorMessage = ""
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });

    this.makeServices.getMakeList()
      .subscribe((data) => {
        this.makes = data;
      });
  }

  formDetails() {
    if (this.editMode) {
      this.modelServices.getModelDetails(this.id).subscribe((data) => {
        this.model = data;
        this.oldDetails = Object.assign({}, this.model)
      })
    }
  }

  onSubmit() {
    var that = this;
    if (this.modelForm.valid) {
      if (JSON.stringify(this.model) !== JSON.stringify(this.oldDetails)) {
        this.modelServices.checkIfNameForSameMakeAvailable(this.model).subscribe((data) => {
          if (data.length) {
            this.errorMessage = ModelConstants.NAME_ALREADY_AVAILABLE
          } else {
            this.submitForm();
          }
        })
      } else { that.router.navigate(['/home/models'], { relativeTo: that.route }); }
    }
  }

  submitForm() {
    var that = this;
    if (this.editMode) {
      this.modelServices.editModel(this.model).subscribe(() => {
        that.router.navigate(['/home/models'], { relativeTo: that.route });
      })
    } else {
      this.modelServices.createvinmodel(this.model).subscribe(() => {
        that.router.navigate(['/home/models'], { relativeTo: that.route });
      })
    }
  }

}
