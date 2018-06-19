import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, enableProdMode } from '@angular/core';
import { HttpModule } from '@angular/http';
import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';
import { JasperoAlertsModule } from '@jaspero/ng2-alerts';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule, ModalModule, TypeaheadModule, AccordionModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { environment } from "../environments/environment";
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BlockUIModule } from 'ng-block-ui';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';

import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';

import { SharedModule } from './shared/shared.module';

import { LoginComponent } from './auth/login/login.component';
import { AuthService } from './auth/auth.service';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { CommonServices } from './shared/services/common.service';
import { UserServices } from './users/user.services';

const config: SocketIoConfig = {
  url: environment.POD_SERVER_URL + ":" + environment.POD_SERVER_PORT + environment.POD_SERVER_ROOM,
  options: {}
};

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = function () { };
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    JasperoAlertsModule,
    AppRouting,
    HttpModule,
    HomeModule,
    FormsModule,
    BrowserAnimationsModule,
    JasperoConfirmationsModule,
    ImgFallbackModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
    }),
    SocketIoModule.forRoot(config),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgSelectModule.forRoot({}),
    BlockUIModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [AuthService, UserServices, CommonServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
