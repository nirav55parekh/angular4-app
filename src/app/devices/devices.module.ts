import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceServices } from './device.service';
import { AccordionModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';

import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesComponent } from './devices.component';
import { ListComponent, KeysPipe } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../shared/shared.module';
import { Socket, SocketIoModule } from 'ng-socket-io';
import { environment } from '../../environments/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ViewComponent } from './view/view.component';
import { SettingsComponent } from './settings/settings.component';

@Injectable()
export class SocketOne extends Socket {

  constructor() {
    super({ url: environment.POD_SERVER_URL + ":" + environment.POD_SERVER_PORT + environment.POD_SERVER_ROOM, options: {} });
  }

}

// @Injectable()
// export class SocketTwo extends Socket {

//   constructor() {
//     super({ url: environment.POD_SERVER_URL + ':' + environment.ANGULAR_PORT, options: {} });
//   }

// }

@NgModule({
  imports: [
    CommonModule,
    DevicesRoutingModule,
    SharedModule,
    SocketIoModule,
    NgxPermissionsModule.forChild(),
    AccordionModule.forRoot(),
    UiSwitchModule
  ],
  declarations: [
    DevicesComponent,
    ListComponent,
    ManageComponent,
    ViewComponent,
    KeysPipe,
    ViewComponent,
    SettingsComponent
  ],
  providers: [SocketOne]
  // providers: [SocketOne, SocketTwo]
})
export class DevicesModule { }
