import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy, HostListener } from '@angular/core';
import { SharedContants } from '../../shared/shared.constants';
import { UserServices } from '../../users/user.services';
import { DeviceServices } from '../device.service';
import { CommonServices } from '../../shared/services/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SocketOne } from '../devices.module';
import * as _ from "lodash";
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { SettingsServices } from '../../settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})


export class SettingsComponent implements OnInit, OnDestroy, AfterViewChecked {
  @BlockUI() blockUI: NgBlockUI;
  id: number;
  editMode = false;
  isAdmin = SharedContants.IS_ADMIN;
  title: String = "Device Details";
  device: any = {};
  errorMessage: String = "";
  oldDetails: any = {};
  users: any = [];
  deviceUsers: any = [];
  wifiPasswordSocket: any[] = []
  scanningForWifi: Boolean = true;
  wifis: any[] = [];
  deviceSocket: any = new SocketOne();
  wifiOnOff: Boolean = false;
  wifiOnOffColor: string = "red";
  selectedWifi: any = {};
  searching: Boolean = false;
  pleaseWait: Boolean = false;
  firstTimeConnected: Boolean = true;
  reboot: Boolean = false;
  osVersion: Boolean = false;
  applicationVersion: Boolean = false;
  applicationVersionUpdate: Boolean = false;
  applicationVersionName: String = "";
  applicationVersionUpdateName: String = "";
  osVersionName: String = "";
  timer: any = null;
  twominwaite = null;
  // getStatetimer: any = null;
  getNetworkTimeout: any = null;
  checkNetworkTimeout: any = null;
  instantcheckTimeout: any = null;
  wifiSetOnce: boolean = false;
  instantcheck: boolean = false;
  showmsg: boolean = false;
  allowedToRun: String = "";
  rebootMsg: String = "";
  settings: any = {};

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event) {
    if (!this.allowedToRun) {
      this.deviceServices.removeConfigDeviceDetails(this.id).subscribe((data) => {

      });
    }
  }

  constructor(private settingsServices: SettingsServices, private userServices: UserServices, private ref: ChangeDetectorRef, private deviceServices: DeviceServices, private router: Router,
    private commonServices: CommonServices,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.formDetails();
    });

    this.settingsServices.getSettings().subscribe((data) => {
      this.settings = data;
    })


    this.twominwaite = setInterval(() => {
      if (!this.selectedWifi) {
        alert(" Reboot POD or Unplug/Plug pod!")
      }
    }, 120000)
  }

  formDetails() {
    var that = this;
    if (this.editMode) {
      this.deviceServices.getConfigDeviceDetails(this.id).subscribe((data) => {
        if (data.allowedToRun) {
          this.device = data;
          this.connectWifi();
        } else {
          that.allowedToRun = "Already opened page";
        }
      });
    }
  }

  connectWifi() {
    var connectedPod = false;
    var that = this;
    this.deviceSocket.on('connect', function (socket) {
      that.deviceSocket.emit("authentication", { "serial": "AngularL0gin1!", "email": "ashish.pate@rishabhsoft.com" });
      var those = that;
      that.deviceSocket.on('authenticated', function (msg) {
        if (connectedPod) { } else {
          connectedPod = true;
          those.deviceSocket.emit('websubscribe', those.device.session);
          var there = those;

          those.getState();
          // those.getStatetimer = setInterval(function () { there.getState(); }, 30000);
          those.deviceSocket.on('frompoddata', function (msg) {
            if (there.applicationVersion) {
              if (msg.length >= 19) {
                there.applicationVersionName = there.getDecodePODString(msg.substring(18, msg.length - 1));
                there.applicationVersion = false;
                there.getNetworks();
              }
            }

            if (there.applicationVersionUpdate) {
              if (msg.length >= 19) {
                var tempVName = there.getDecodePODString(msg.substring(18, msg.length - 1));
                if (tempVName !== there.applicationVersionName) {
                  there.applicationVersionUpdateName = tempVName;
                }
                there.applicationVersion = false;
              }
            }

            if (there.osVersion) {
              there.applicationVersionUpdateName = "";
              if (msg.length >= 19) {
                there.osVersionName = there.getDecodePODString(msg.substring(18, msg.length - 1));
                there.getApplicationVersion("tlsrelay");
                there.osVersion = false;
              }
            }



          });
          those.deviceSocket.on('frompodctrl', function (msg) {
            there.getFromPodCtrl(msg);

            if (msg.includes("Disconnected")) {
                // In future do something over here
            }

            // Wifi Setting Page of angluar request and response process.
            msg = String(msg);
            var jsonData: any = {};
            try {
              jsonData = JSON.parse(msg);
            } catch (err) {

            }
            if (jsonData) {
              var cmd = jsonData.cmd;

              switch (cmd) {
                case "wifiState":
                  if (!there.instantcheck) {
                    there.makeState(jsonData);
                  } else {
                    there.instantcheck = false;
                    there.reboot = false;
                    there.osVersionName = '';
                    clearTimeout(there.instantcheckTimeout);
                    there.makeState(jsonData);
                  }
                  break;
                case "wifiEnable":
                  if (jsonData['success']) {
                    there.wifiOnOff = true;
                    there.wifiOnOffColor = "green";
                    there.selectedWifi.ssid = jsonData.connectedAP;
                    there.showmsg = true;
                    there.selectedWifi.ip = jsonData.ip;
                    there.searching = true;
                    there.getOSVersion();
                    clearInterval(there.twominwaite);
                    setTimeout(() => {
                      there.showmsg = false;
                    }, 10000)
                  }
                  break;
                case "wifiScan":
                  jsonData['APs'].forEach(wifi => {

                    var index = _.findIndex(there.wifis, { ssid: wifi.ssid });
                    if (index > -1) {
                      there.wifis.splice(index, 1, { ...there.wifis[index], ...wifi });
                    } else {
                      there.wifis.push(wifi);
                    }
                  });

                  if (there.pleaseWait && !there.firstTimeConnected) {
                    there.pleaseWait = false;
                  }

                  if (!there.wifis) {
                    there.deviceSocket.emit('topodctrl', { "cmd": "wifiScan" });
                  } else {
                    there.searching = true;
                    there.getState();
                  }
                  break;
                case "wifiDelete":
                  if (jsonData['success']) {
                    there.pleaseWait = true;
                    there.firstTimeConnected = false;
                  }
                  break;
                case "wifiSelect":
                  there.showmsg = true;
                  there.blockUI.stop();
                  if (jsonData['success']) {
                    there.selectedWifi = jsonData;
                    there.selectedWifi.wificonnected = true;
                  } else {
                    there.selectedWifi = jsonData;
                    there.selectedWifi.wificonnected = false;
                  }

                  setTimeout(() => {
                    there.showmsg = false;
                  }, 10000)
                  break;
              }
            }
          });
        }
      });
    });

    this.deviceSocket.on('disconnect', function (socket) {
      that.firstTimeConnected = true;
      connectedPod = false;
      that.reboot = true;
      that.device.connected = 0;
      that.resetPage();
    });
  }

  makeState(jsonData) {
    var there = this;
    if (jsonData.enabled) {
      clearInterval(there.twominwaite);
      there.wifiOnOff = true;
      there.wifiOnOffColor = "green";
      there.selectedWifi.ssid = jsonData.connectedAP;
      there.selectedWifi.ip = jsonData.ip;


      there.searching = false;

      if (!there.osVersionName) {
        there.getOSVersion();
      }

    } else {
      there.wifiOnOff = false;
      there.wifiOnOffColor = "red";
      there.deviceSocket.emit("topodctrl", { "cmd": "wifiEnable" });
    }
  }

  getFromPodCtrl(msg) {

    if (msg.includes("Connected") && this.firstTimeConnected == false) {
      this.connectWifi();
    }

    if (msg.includes("Connected4") || msg.includes("Connected")) {
      this.device.connected = 4;
    }
    if (msg.includes("Connected3")) {
      this.device.connected = 3;
    }
    if (msg.includes("Connected2")) {
      this.device.connected = 2;
    }
    if (msg.includes("Connected1")) {
      this.device.connected = 1;
    }
    this.pleaseWait = false;
  }

  getNetworks() {
    var that = this;
    this.deviceSocket.emit('topodctrl', { "cmd": "wifiScan" });
    if (this.wifiSetOnce == false)
      this.getNetworkTimeout = setTimeout(function () { that.checkNetwork(); }, 5000);

  }

  checkNetwork() {
    var that = this;
    console.log("CheckNetworks called");
    if (this.wifiOnOff) {
      console.log("IN -1");
      console.log(this.wifis);
      if (this.wifis.length == 0) {
        console.log("Comming for again get Network.....");
        this.getNetworks();
      } else {
        this.wifiSetOnce = true;
        this.checkNetworkTimeout = setTimeout(function () { that.getNetworksInRecurringMode(); }, 30000);
      }
    }
  }


  getNetworksInRecurringMode() {
    var that = this;
    this.deviceSocket.emit('topodctrl', { "cmd": "wifiScan" });
    if (this.timer == null)
      this.timer = setInterval(function () { that.getNetworksInRecurringMode(); }, 30000);
  }

  getState() {
    this.deviceSocket.emit('topodctrl', { "cmd": "wifiState" });
  }

  rebootPod() {
    this.pleaseWait = true;
    this.deviceSocket.emit('reboot');

    this.checkforreboot("Rebooting wifi! Please wait");
  }

  connectme(wifi) {
    this.blockUI.start('Authenticating...');
    var that = this;
    this.deviceSocket.emit('topodctrl', { cmd: "wifiSelect", ssid: wifi.ssid, passphrase: wifi.password });

    this.checkforreboot("Configuring wifi! Please wait...");
  }

  removeWifi(wifi) {
  var that = this;
  this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          wifi.configured = false;
          that.deviceSocket.emit('topodctrl', { cmd: "wifiDelete", ssid: wifi.ssid });
          that.checkforreboot("Removing wifi profile! Please wait...");
        }
      });
    
  }

  ngAfterViewChecked(): void {
    this.ref.detach();
    this.ref.detectChanges();
    this.ref.reattach();
  }

  ngOnDestroy() {
    this.resetPage();
  }

  resetPage() {
    clearInterval(this.timer);
    //clearInterval(this.getStatetimer);
    clearTimeout(this.checkNetworkTimeout);
    clearTimeout(this.getNetworkTimeout);
    clearTimeout(this.instantcheckTimeout);
  }

  getOSVersion() {
    var acmd = "000A0000401200000000";
    this.deviceSocket.emit('topoddata', '99,99,' + acmd);
    this.osVersion = true;

  }

  getApplicationVersion(pname) {
    var acmd = "0000401300000000";
    var lengthPname = 2 + (acmd.length / 2) + pname.length;
    var ccmd = "00" + lengthPname.toString(16) + acmd + this.unicodeEscape(pname);
    this.deviceSocket.emit('topoddata', '99,99,' + ccmd);
    this.applicationVersion = true;
  }

  getDecodePODString(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    str = str.replace(/\0/g, '');
    return str;
  }

  unicodeEscape(str) {
    var result = '', index = 0, charCode, escape;
    while (!isNaN(charCode = str.charCodeAt(index++))) {
      escape = charCode.toString(16);
      result += charCode < 256
        ? (charCode > 15 ? '' : '0') + escape
        : ('0000' + escape).slice(-4);
    }
    return result;
  }

  checkForUpdate(pname) {
    console.log("Checkforupdate called");
    var acmd = "0000401400000000";
    var lengthPname = 2 + (acmd.length / 2) + pname.length;
    var ccmd = "00" + lengthPname.toString(16) + acmd + this.unicodeEscape(pname);
    this.deviceSocket.emit('topoddata', '99,99,' + ccmd);
    this.applicationVersionUpdate = true;

    this.checkforreboot("Updating POD! Please wait...");
  }

  // This function always call when there are below functions has been called
  //removeWifi
  //checkForUpdate
  //connectme
  //rebootPod
  checkforreboot(msg) {
    var that = this;
    this.resetPage();
    this.instantcheck = true;
    this.instantcheckTimeout = setTimeout(function () { that.instantcheckVariable(msg); }, 10000);
  }

  instantcheckVariable(msg) {
    var that = this;
    if (this.instantcheck) {
      this.reboot = true;
      this.rebootMsg = msg;
      this.blockUI.stop();
      this.getState();
      this.instantcheckTimeout = setTimeout(function () { that.instantcheckVariable(msg); }, 5000);
    }
  }

  toggleAccordian(event, type) {
    var that = this;
    if (type == 'about' && event == true) {
      if (this.wifiSetOnce !== false) {
        clearInterval(this.timer);
        //clearInterval(this.getStatetimer);
        clearTimeout(this.checkNetworkTimeout)
        clearTimeout(this.getNetworkTimeout)
      }
    } else if (type == 'network' && event == true) {
      if (this.wifiSetOnce !== false) {
        this.checkNetworkTimeout = setTimeout(function () { that.getNetworksInRecurringMode(); }, 30000);
        this.timer = setInterval(function () { that.getNetworksInRecurringMode(); }, 30000);
        this.getNetworkTimeout = setTimeout(function () { that.checkNetwork(); }, 5000);
      }
    }
  }

}
