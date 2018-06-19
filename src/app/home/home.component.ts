import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  loggedIn = false;
  constructor(private http: Http, private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    if (localStorage.getItem("bse_token") === null) {
      this.blockUI.start('Token Expired. Redirecting on Login Page');
      this.router.navigate(['/login']);
      this.blockUI.stop();
    } else {
      this.loggedIn = true;
    }
  }

}
