import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, Injectable, TemplateRef, Pipe, PipeTransform, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { SharedContants } from '../../shared/shared.constants';
import { DeviceServices } from '../device.service';
import { CommonServices } from '../../shared/services/common.service';
import { DeviceConstants } from '../device.constants';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import Swal from 'sweetalert2';

import * as _ from "lodash";
import { environment } from '../../../environments/environment';
import { SocketOne } from '../devices.module';
// import { SocketOne, SocketTwo } from '../devices.module';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()

@Pipe({ name: 'module' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.styles.css']
})
export class ListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('template1') template1: ElementRef;
  userId = SharedContants.USER_ID;
  public devices: any = [];
  showModal = false;
  type = 'list';
  selectedModule: any = { name: "" };
  selectedStatus = [];
  deviceSessionSocket: any = [];
  modalRef: BsModalRef;
  device: any
  alert_2_hide = null;
  usedCredit: Number = 0;

  deviceSocket: any[] = [];
  // scriptSelected;
  vinmakeSelected = null;
  vinmodelSelected = null;
  vinyearSelected = null;
  makes;
  models;
  years;
  modules: any = [];
  deviceSelected: any = { info: {} };
  scanning = [DeviceConstants.SCAN_START_TEXT];
  selectedMakeModelYear = '';
  showLogsAction = false;
  timeInMs = 0;
  promptText = '';
  promptAns = '';
  timerPromise = null;
  timerPromise1 = null;
  yourAngSession = '';
  scriptlist: any = [];
  codes: any = [];
  newDefaultSocket: any = {};
  tempId = null;

  constructor(
    private ngxPermissionsService: NgxPermissionsService,
    private ref: ChangeDetectorRef,
    private deviceServices: DeviceServices,
    private socket: Socket,
    private commonServices: CommonServices,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getList();
    this.showcodesallmodules();
    this.vinmakeList();
  }

  newDeviceSocket() {
    var that = this;
    this.newDefaultSocket = new SocketOne();

    this.newDefaultSocket.on('connect', function (socket) {
      var those = that;
      that.newDefaultSocket.emit("authentication", { "serial": "AngularL0gin1!", "email": "ashish.pate@rishabhsoft.com" });
      that.newDefaultSocket.on('authenticated', function (msg) {
        that.newDefaultSocket.emit('default_websubscribe', "deafult_device");

        that.newDefaultSocket.on('updatedevice', function (id) {
          if (_.result(_.find(those.devices, function (obj) {
            return obj.id === id;
          }), 'id')) {
            that.deviceServices.getDeviceDetails(id).subscribe((data) => {
              let dindex = _.findIndex(that.devices, function (o) { return o.id == id; })
              those.devices[dindex] = { ...those.devices[dindex], ...data };
              those.deviceSocket[data.client_dev_no] = [];
              those.devices[dindex].websubscribe = false;
              those.showProcedure(data, dindex);
              those.getChromeData(data, dindex);
            })
          } else {
            //This will do later.....
            //if (SharedContants.IS_ADMIN) {
            //  that.deviceServices.getDeviceDetails(id).subscribe((data) => {
            //    those.devices.push(data);
            //    those.deviceSocket[data.client_dev_no] = [];
            //    those.showProcedure(data, those.devices.length - 1);
            //    those.getChromeData(data, those.devices.length - 1);
            //    those.tempId = null;
            //  })
            //}
          }

        })

      });
    })

    this.newDefaultSocket.on('disconnect',
      function (data) {
        console.log("New device : DISCONNECT");
        that.newDeviceSocket();
      });

  }

  getList() {
    var that = this;
    this.deviceServices.getDeviceList()
      .subscribe((data) => {
        this.devices = data;
        this.newDeviceSocket();
        this.devices.forEach((device, index) => {
          this.connectProcedureServere(device, index);
          if (device.vin !== undefined && device.vin !== "false")
            this.getChromeData(device, index);
        });
      });
  }

  getChromeData(device, dindex) {
    var those = this;
    var there = this;

    those.deviceSelected.info = ("vin" in device) ? { vin: device.vin } : { vin: null };
    if (!those.devices[dindex].vinDetails) {
      if (those.deviceSelected.info.vin) {
        var them = those;
        those.deviceServices.getchromedata({ vin: those.deviceSelected.info.vin })
          .subscribe((vindetails) => {
            if (vindetails.success) {
              device.info = vindetails;
              device.vinDetails = vindetails;
              there.devices[dindex].vinDetails = vindetails;
              device.vinDetails.vinName = device.vinDetails.year + " " + device.vinDetails.make + " " + device.vinDetails.model;

              there.deviceServices.getscriptbymakemodelyear({ make: device.vinDetails.make, model: device.vinDetails.model, year: device.vinDetails.year })
                .subscribe((vinScripts) => {
                  if (!vinScripts.error) {
                    them.devices[dindex].scriptlist = vinScripts.data;
                    them.scriptlist = vinScripts.data;

                    them.deviceSelected.client_dev_no = device.client_dev_no;
                    them.deviceSelected.id = device.id;
                    them.deviceSelected.dindex = dindex;
                    them.selectedMakeModelYear = '';
                  }
                });
            }
          });
      }
    }
  }

  checkForViewEditDelete(device) {
    if ("user" in device) {
      let deviceUsers = device.user.split(",");
      if (deviceUsers.indexOf(SharedContants.USER_ID) !== -1) {
        return true;
      }
    }
    return false;
  }

  showcodesallmodules() {
    var that = this;
    this.deviceServices.showcodesallmodules()
      .subscribe(function (modules) {
        if (!modules.error) {
          that.modules = _.toArray(modules.sort());
        }
      });
  }

  vinmakeList() {
    var that = this;
    this.deviceServices.vinmakeList()
      .subscribe(function (makes) {
        makes[makes.length] = { id: 0, name: "Please select option" };
        that.vinmakeSelected = { id: 0, name: "Please select option" };
        that.makes = makes;
      });
  }

  getVinModel = function (vinmakeSelected) {
    var that = this;
    this.models = null;
    this.years = null;
    this.selectedMakeModelYear = '';
    this.deviceServices.getvinmodelbymake(vinmakeSelected).subscribe(function (models) {
      models[models.length] = { id: 0, name: "Please select option" };
      that.vinmodelSelected = { id: 0, name: "Please select option" };
      that.models = models;
    });
  }

  getVinYear(vinmodelSelected) {
    this.years = null;
    var that = this;
    this.selectedMakeModelYear = '';
    this.deviceServices.getvinyearbymakemodel(this.vinmakeSelected, vinmodelSelected)
      .subscribe((years) => {
        years[years.length] = { id: 0, name: "Please select option" };
        that.vinyearSelected = { id: 0, name: "Please select option" };
        that.years = years;
      });
  }

  executeForScript = function (vinyearSelected) {
    var that = this;
    this.selectedMakeModelYear = this.vinmakeSelected.name + ' ' + this.vinmodelSelected.name + ' ' + vinyearSelected.name;

    this.deviceServices.vinYear(vinyearSelected).subscribe((year) => {
      let those = that;
      this.deviceServices.getprogramslist(year.programs).subscribe((scripts) => {
        those.devices[those.deviceSelected.dindex].scriptlist = scripts;
        those.scriptlist = scripts;
      })
    })

  }

  runProgram(id, device, dindex) {

    //                    $scope.deviceSelected = device;
    var that = this;
    var used_credit = 0;
    if (SharedContants.USER_DETAILS.used_credit) {
      used_credit = SharedContants.USER_DETAILS.used_credit;
    }
    this.deviceSelected.scriptSelected = device.scriptSelected;

    if ((device.scriptSelected.credit == 0 || device.scriptSelected.credit == undefined) || (((device.scriptSelected.credit + used_credit) <= parseInt(SharedContants.USER_DETAILS.earned_credit)) || SharedContants.USER_DETAILS.providers.local.role.id.toString() !== "2")) {

      if (device.scriptSelected.credit == 0 || device.scriptSelected.credit == undefined) {
        this.deviceSelected.client_dev_no = device.client_dev_no;
        this.deviceSelected.id = device.id;
        this.deviceSelected.dindex = dindex;
        this.usedCredit = device.scriptSelected.credit || 0;
        this.showLogsAction = true;
        this.checkapplicabletorun(id, device, dindex)
      }
      else if (SharedContants.USER_DETAILS.providers.local.role.id.toString() == "2" && SharedContants.USER_DETAILS.earned_credit !== null) {
        this.deviceSelected.client_dev_no = device.client_dev_no;
        this.deviceSelected.id = device.id;
        this.deviceSelected.dindex = dindex;
        this.usedCredit = device.scriptSelected.credit || 0;
        this.showLogsAction = true;
        this.checkapplicabletorun(id, device, dindex)
      } else if (SharedContants.USER_DETAILS.providers.local.role.id.toString() !== "2") {
        this.deviceSelected.client_dev_no = device.client_dev_no;
        this.deviceSelected.id = device.id;
        this.deviceSelected.dindex = dindex;
        this.usedCredit = device.scriptSelected.credit || 0;
        this.showLogsAction = true;
        this.checkapplicabletorun(id, device, dindex)
      } else {
        this.commonServices.alertBox('error', "You have insufficient credits to run the script!");
        this.showLogsAction = false;
      }
    } else {
      this.commonServices.alertBox('error', "You have insufficient credits to run the script!");
      this.showLogsAction = false;
    }
  }

  openModelLogs(template1) {
    this.modalRef = this.modalService.show(template1);
  }

  checkapplicabletorun(id, device, dindex) {
    var that = this;
    return this.deviceServices.checkdeviceabletorunscript({ justcheck: false, device: this.deviceSelected.id, user: SharedContants.USER_DETAILS })
      .subscribe(function (data) {
        that.devices[that.deviceSelected.dindex].angular_session = { session: data.angular_session };
        if (data.runable && !that.devices[that.deviceSelected.dindex].webuser) {
          that.yourAngSession = data.angular_session;
          that.devices[that.deviceSelected.dindex].webuser = true;
          var those = that;
          that.deviceSocket[that.deviceSelected.client_dev_no].on('webuser', function (msg) {
            those.putScanningMsg(msg);
          });

          that.deviceSocket[that.deviceSelected.client_dev_no].on('pdfreport', function (msg) {
            msg = String(msg);
            var jsonData = '';
            try {
              jsonData = JSON.parse(msg);
              those.printPDF(jsonData, device);
            } catch (err) {
              console.log("For pdf report we are not getting proper JSON");
            }
          });

          that.deviceSocket[that.deviceSelected.client_dev_no].on('webinput', function (msg) {
            if (!those.devices[those.deviceSelected.dindex].takeControl) {
              those.promptText = msg;
              let resp = "";

              Swal({
                title: msg,
                input: 'text',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'OK',
                showLoaderOnConfirm: true,
                allowOutsideClick: false
              }).then((result) => {
                if (result.value) {
                  those.promptCallback(result.value);
                } else {
                  those.promptCallback("Cancelled");
                }
              })

              // if (resp = window.prompt(msg)) {
              //   those.promptCallback(resp);
              // } else {
              //   those.promptCallback("Cancelled");
              // }
              // those.global.promptMessage(msg).then(function (result) {
              //   if (result === null) { result = "Cancelled"; }
              //   those.promptCallback(result);
              // });
            }

          });

          that.deviceSocket[that.deviceSelected.client_dev_no].on('webprompt', function (msg) {
            if (!those.devices[those.deviceSelected.dindex].takeControl) {
              those.promptText = msg;
              those.commonServices.alertBox('warning', msg);
              those.promptCallback("OK");
            }

          });

          that.deviceSocket[that.deviceSelected.client_dev_no].on("managedevicecontrol", function (instruction) {
            if (instruction.stop && instruction.stop.session == those.yourAngSession) {
              those.deviceSelected.aborted = true;
              those.deviceSelected.aborted_by = instruction.user;
              those.stopProgram(those.deviceSelected.id, those.deviceSelected);
            }
          });

          if (data.runable && data.running == 0) {
            that.deviceSelected.errors = null;
            that.deviceSelected.info = null;
            that.deviceSelected.pid = 0;
            that.scanning = [environment.scanstartText];
            var scriptprogramid = device.scriptSelected.id;
            var those = that;

            those.deviceServices.runpythonscriptprogram(id, scriptprogramid, those.usedCredit).subscribe((obj) => {
              those.deviceSelected.pid = obj.data;
              those.commonServices.onUserDetailsChanged(SharedContants.USER_ID, false);
              those.showLogsAction = true;
              those.modalRef = those.modalService.show(those.template1);
            }, (err) => {
              those.showLogsAction = false;
              those.commonServices.onUserDetailsChanged(SharedContants.USER_ID, false);
            })
          }
        } else {
          var those = that;
          if (data.runable && !data.running) {
            that.yourAngSession = data.angular_session;
            if (data.runable) {
              that.deviceSelected.errors = null;
              that.deviceSelected.info = null;
              that.deviceSelected.pid = 0;
              that.scanning = [environment.scanstartText];
              var scriptprogramid = device.scriptSelected.id;
              var those = that;

              that.deviceServices.runpythonscriptprogram(id, scriptprogramid, that.usedCredit).subscribe((obj) => {
                those.deviceSelected.pid = obj.data;
                those.commonServices.onUserDetailsChanged(SharedContants.USER_ID, false);
                those.showLogsAction = true;
                those.modalRef = those.modalService.show(those.template1);
              }, (err) => {
                those.showLogsAction = false;
                those.commonServices.onUserDetailsChanged(SharedContants.USER_ID, false);
              })
            }
          } else {
            that.devices[that.deviceSelected.dindex].takeControl = true;
            that.devices[that.deviceSelected.dindex].workingUser = data.workingUser;
            that.takecontrolFromOtherUser();
          }
        }
      });
  }

  stopProgram(id, device, scriptSelected = undefined) {
    //                    $scope.deviceSelected = device;
    this.deviceSelected.client_dev_no = device.client_dev_no;
    this.deviceSelected.id = device.id;
    this.deviceSelected.errors = null;
    this.deviceSelected.info = null;
    var that = this;
    var scriptprogramid = ("scriptSelected" in device) ? device.scriptSelected.id : scriptSelected.id;

    this.deviceServices.stoppythonscriptprogram(device.pid, scriptprogramid, id).subscribe((obj) => {
      if (that.deviceSelected.aborted) {
        that.showLogsAction = false;
        that.deviceSelected.aborted = false;
        that.scanning.push("Aborted procedure by " + device.aborted_by);
        that.deviceSelected.aborted = "";
      } else {
        that.scanning.push("Stop procedure...");
      }
      that.deviceSelected.pid = '';
    });
    that.resetDeviceConnection();
  }

  clickThis(params, actionDef) {
    // if ($scope.global.isSignedIn()) {
    //     $state.go(actionDef, { deviceId: params });
    // }
  }


  cleanPIN(device) {
    device.pin = "";
  }

  checkPIN(device) {
    if (device.connected) {
      if (device.pin) {
        return false;
      } else if (!device.processStart) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  checkPINProcess(device) {
    if (device.processStart) {
      return true;
    } else {
      return false;
    }
  }

  checkPINExist(device) {
    if (device.pin) {
      return true;
    } else {
      return false;
    }
  }

  promptCallback(result) {
    this.deviceSocket[this.deviceSelected.client_dev_no].emit("webdata", result);
    this.promptAns = result;
  };

  getPromptText() {
    return this.promptText;
  };

  promptCallbackCancelled() {
    this.deviceSocket[this.deviceSelected.client_dev_no].emit("webdata", "cancelled");
    this.promptAns = 'cancelled';
  };

  putScanningMsg(msg) {
    if (this.scanning.length > 0) {
      this.scanning.push(msg);
    } else {
      this.scanning = [environment.scanstartText];
      this.scanning.push(msg);
    }

  }

  printPDF(msg, device) {
    var key = "FULL SCAN";
    if (msg[key]) {
      msg[key].device = device;

      this.deviceServices.printpdf({ contents: msg })
        .subscribe((response) => {
          this.scanning.push("Please click <a target='_blank' href='https://s3-us-west-2.amazonaws.com/reportpdf-rocketbox/" + response.data + ".pdf'>here</a> to download pdf report");
        });
    }
  };

  //   $scope.$on('$destroy', function () {
  //     $timeout.cancel($scope.timerPromise);
  //     $interval.cancel($scope.timerPromise1);
  //     var keys = Object.keys($scope.deviceSocket);
  //     keys.forEach(function (element) {
  //         $scope.deviceSocket[element].disconnect(true);
  //     }, this);
  // });

  countUp() {

    this.devices.forEach((value, index) => {
      if (!this.devices[index].connected) {
        this.devices[index].connected = false;
      }
    });
    this.timerPromise = setTimeout(this.countUp, environment.heartBeat);
  }

  runmakemodelyear(device, dindex, template: TemplateRef<any>) {
    this.deviceSelected.client_dev_no = device.client_dev_no;
    this.deviceSelected.id = device.id;
    this.deviceSelected.dindex = dindex;
    this.selectedMakeModelYear = '';
    this.modalRef = this.modalService.show(template);
  }

  consequentCheckDeviceControl = function () {
    if (this.deviceSelected.id) {
      var that = this;
      this.deviceServices.checkdeviceabletorunscript({ justcheck: true, device: this.deviceSelected.id, user: SharedContants.USER_DETAILS })
        .subscribe(function (data) {
          that.devices[that.deviceSelected.dindex].angular_session = { session: data.angular_session };
          that.devices[that.deviceSelected.dindex].workingUser = data.workingUser;

          if (!data.runable) {
            that.devices[that.deviceSelected.dindex].takeControl = true;
          } else {
            that.devices[that.deviceSelected.dindex].takeControl = false;
          }
        });
    }
    this.timerPromise = setTimeout(this.consequentCheckDeviceControl, environment.deviceControl);
  }

  deleteDevice(id, device) {
    this.commonServices.confirmationBox(SharedContants.CONFIRM_DELETE)
      .subscribe((ans: boolean) => {
        if (ans) {
          this.deviceServices.deleteDevice(id, device).subscribe(() => {
            this.getList();
          });
        }
      });
  }

  connectProcedureServere = function (device, dindex) {
    //            device.info = { "vin" : "2C2AH19ZOD5251555" ,  "powertrain" : [ "U0518","U0212","U0123"], "chassis" : [ "C0123","C0124","C0125"],"body" : [ "U0123","U0023","U020F"], "network" : [ "U03A1","U102F","U01A1"] };
    //            Restangular.one('devices/validatevin/'+device.info.vin).get().then(function (obj) {
    //                device.info.more = obj; 
    //            }); 

    this.showProcedure(device, dindex);
  }

  checkconnected = function (device) {
    if (device.connected)
      return true;
    else
      return false;
  }

  // onDeviceChanges = function (device, dindex) {
  //   this.deviceSessionSocket[device.client_dev_no] = new SocketTwo();
  //   var that = this;
  //   this.deviceSessionSocket[device.client_dev_no].on('deviceSession' + device.id, function (newSession) {
  //     that.devices[dindex].session = newSession.session;
  //     that.devices[dindex].websubscribe = false;

  //     that.deviceSocket[device.client_dev_no].disconnect();
  //     that.showProcedure(newSession, dindex);
  //     that.getChromeData(newSession, dindex);

  //   });
  // }

  showProcedure(device, dindex) {
    if (!device.session) return false;
    var firstTimeConnected = false;
    var that = this;
    var allthow = this;
    this.deviceSocket[device.client_dev_no] = new SocketOne();
    // this.onDeviceChanges(device, dindex);
    this.deviceSocket[device.client_dev_no].on('connect', function (socket) {
      var those = that;
      that.deviceSocket[device.client_dev_no].emit("authentication", { "serial": "AngularL0gin1!", "email": "ashish.pate@rishabhsoft.com" });
      that.deviceSocket[device.client_dev_no].on('authenticated', function (msg) {
        if (that.devices[dindex].websubscribe) {
          var angSession = "";
        } else if (device.session) {
          console.log("COme for websubscribe");
          firstTimeConnected = true;
          that.devices[dindex].websubscribe = true;
          that.deviceSocket[device.client_dev_no].emit('websubscribe', device.session);
        }
      });

      that.deviceSocket[device.client_dev_no].on('updatedevice', function (id) {
        that.deviceServices.getDeviceDetails(id).subscribe((data) => {
          if (data.vin !== "false" && data.vin !== those.devices[dindex].vin) {
            // those.devices[dindex].vin = data.vin;
            those.getChromeData(data, dindex);
          }
          if ((data.session && data.session !== those.devices[dindex].session)) {
            those.deviceSocket[device.client_dev_no].disconnect();
            those.devices[dindex] = { ...those.devices[dindex], ...data };
            those.showProcedure(those.devices[dindex], dindex);
          }
          those.devices[dindex] = { ...those.devices[dindex], ...data };
        })
      });

      that.deviceSocket[device.client_dev_no].on('frompodctrl', function (msg) {

        if (msg.includes("Disconnected")) {
          allthow.devices[dindex].vin = "false";
          allthow.devices[dindex].vinDetails = null;
          allthow.devices[dindex].connected = false;

          allthow.devices[dindex].connected1 = false;
          allthow.devices[dindex].connected4 = false;
          allthow.devices[dindex].connected3 = false;
          allthow.devices[dindex].connected2 = false;

          allthow.devices[dindex].deviceconnectedOnce = false;
          // $(".procedureServer").hide();
          // this.checkPIN(device);
          allthow.devices[dindex].processStart = false;
          allthow.showLogsAction = false;
          allthow.resetDeviceConnection();
        } else {
          allthow.devices[dindex].connected = true;
          allthow.devices[dindex].deviceconnectedOnce = true;

          if (msg.includes("Connected4") || msg.includes("Connected")) {
            allthow.devices[dindex].connected4 = true;
            allthow.devices[dindex].connected3 = true;
            allthow.devices[dindex].connected2 = true;
            allthow.devices[dindex].connected1 = true;
          }
          if (msg.includes("Connected3")) {
            allthow.devices[dindex].connected3 = true;
            allthow.devices[dindex].connected2 = true;
            allthow.devices[dindex].connected1 = true;
            allthow.devices[dindex].connected4 = false;
          }
          if (msg.includes("Connected2")) {
            allthow.devices[dindex].connected2 = true;
            allthow.devices[dindex].connected1 = true;
            allthow.devices[dindex].connected3 = false;
            allthow.devices[dindex].connected4 = false;
          }
          if (msg.includes("Connected1")) {
            allthow.devices[dindex].connected1 = true;
            allthow.devices[dindex].connected4 = false;
            allthow.devices[dindex].connected3 = false;
            allthow.devices[dindex].connected2 = false;
          }

        }

      });


    });

    this.deviceSocket[device.client_dev_no].on('disconnect',
      function (data) {
        console.log("ANgular : DISCONNECT");
        if (!firstTimeConnected && device.session) {
          console.log("Tring again" + device.client_dev_no);
          that.showProcedure(device, dindex);
        }
      });

    if (device.processStart) {
      return false;
    }
    else {
      this.devices[dindex].processStart = true;
    }
    // $("#procedureServer_" + device.id).html('');

    // $(".procedureServer").show();
    // $("#procedureServer_" + device.id).show();
    this.showModal = !this.showModal;
  }

  takecontrolFromOtherUser = function () {
    var that = this;
    this.commonServices.confirmationBox('In Use by ' + this.devices[this.deviceSelected.dindex].workingUser + '<br>Please press Ok to abort other user procedure<br>Press Cancel to keep waiting...')
      .subscribe((result: boolean) => {
        if (!result) {

        } else {
          var angSession = "";
          if (that.deviceSelected.dindex > -1) {
            if (that.devices[that.deviceSelected.dindex].angular_session) {
              angSession = that.devices[that.deviceSelected.dindex].angular_session;
            }
          }
          if (angSession) {
            that.deviceSocket[that.deviceSelected.client_dev_no].emit('managedevicecontrol', { stop: angSession, user: SharedContants.USER_DETAILS.providers.local.name });
            that.resetDeviceConnection();
          } else {
            this.commonServices.confirmationBox("Finding issue while takecontrol: Please contact admin\nWe are resolving this issue.", "Warning", "warning")
              .subscribe((result: boolean) => { });
          }
        }
      });
    // this.global.popConfirm('In Use by ' + this.devices[this.deviceSelected.dindex].workingUser + '<br>Please press Ok to abort other user procedure<br>Press Cancel to keep waiting...').then(function (result) {
    //   if (!result) {

    //   } else {
    //     var angSession = "";
    //     if (this.deviceSelected.dindex > -1) {
    //       if (this.devices[this.deviceSelected.dindex].angular_session) {
    //         angSession = this.devices[this.deviceSelected.dindex].angular_session;
    //       }
    //     }
    //     if (angSession) {
    //       this.deviceSocket[this.deviceSelected.client_dev_no].emit('managedevicecontrol', { stop: angSession, user: JSON.parse(localStorage.getItem("user")).name });
    //       this.resetDeviceConnection();
    //     } else {
    //       this.global.popMessage("Finding issue while takecontrol: Please contact admin\nWe are resolving this issue.", "Warning", "warning");
    //     }

    //   }
    // });
  }

  resetDeviceConnection = function () {
    this.deviceServices.resetdeviceangularsession({ device: this.deviceSelected.id, user: SharedContants.USER_DETAILS })
      .subscribe((data) => {
        if ("deviceSelected" in this) {
          var dev = this.devices[this.deviceSelected.dindex];
          this.devices[this.deviceSelected.dindex].webuser = false;
          this.devices[this.deviceSelected.dindex].takeControl = false;
          dev.websubscribe = false;
          this.deviceSocket[this.deviceSelected.client_dev_no].disconnect();
          this.showProcedure(dev, this.deviceSelected.dindex);
        }
      });
  }

  checkLogs = function (device) {
    if (device.log && !device.connected) {
      return true;
    } else {
      return false;
    }
  }

  showLogs = function (logs, module) {
    this.selectedModule.name = module;
    this.selectedStatus = [];
    var getCodesOnly = [];
    this.statuses = [];
    var inc = 0;
    //            this.statuses[inc] = this.statusNull;
    //            inc++;
    logs.forEach(function (value, index) {
      value.forEach(function (status, code) {
        getCodesOnly[index] = code;
        if (this.statuses.indexOf(status) < 0) {
          this.statuses[inc] = status;
          inc = inc + 1;
        }
      });
    });
    //            this.statuses = [this.statusNull,"Active","Stored","Ready","Other","Confirmed","Pending","Failed","Test Incomplete","Test Failed Now","Test Failed","Test Incomplete"];
    // $(".imgmap_css_container").hide();
    // $(".error_details_content").show();
    //            $(".error_details_content").html(logs);
    // $(".error_details_back").show();
    var collectNotFound = [];
    this.deviceServices.showpostcodes(getCodesOnly)
      .subscribe((codes) => {
        if (codes.length > 0) {
          codes.forEach(function (value, index) {
            this.codes[value.code] = value;
            if (!logs[value.code]) {
              collectNotFound[index] = value.code;
            }
          });
        } else {
          collectNotFound = logs;
        }
        if (collectNotFound.length > 0) {
          //                    this.postNearEqualsCodes(collectNotFound);
        }

        this.selectedModule.logs = [];
        this.selectedModule.logs = logs;
      });
  }

  showDeviceImage = function (device) {
    this.deviceSocket[device.client_dev_no].on('webjson', function (msg) {

    });
  }


  remove = function (devicePass) {

    this.deviceServices.getDeviceDetails(devicePass.id)
      .subscribe((device) => {
        this.deviceServices.deleteDevice(devicePass.id, device).subscribe((device) => {
          this.deviceServices.getDeviceList.subscribe((devices) => {
            this.devices = _.toArray(devices);
          });
        }
        );
      });
    // this.state.reload();
  }



  refreshState = function () {
    this.state.reload();
  }

  compareStatus = function (status) {
    if (this.selectedStatus.indexOf(status) > -1) {
      return true;
    }
    return false;
  }



  postNearEqualsCodes = function (collected) {
    var makeNear = [];
    collected.forEach(function (value, index) {
      var n = value.indexOf("-");
      if (n > 0) {
        var newValue = value.split("-");
        if (this.codes[newValue[0]]) {
          this.codes[value] = this.codes[newValue[0]];
        } else {
          makeNear[index] = newValue[0];
        }
      }
    });

    this.deviceServices.shownearpostcodes(makeNear).subscribe((codes) => {
      codes.forEach(function (value, index) {
        this.codes[value.code] = value;
      });

      collected.forEach(function (value, index) {
        var n = value.indexOf("-");
        if (n > 0) {
          var newValue = value.split("-");
          if (this.codes[newValue[0]]) {
            this.codes[value] = this.codes[newValue[0]];
          }
        }
      });
    });
  }

  hideLogs = function (logs) {
    // $(".imgmap_css_container").show();
    // $(".error_details_content").hide();
    // $(".error_details_back").hide();
  }

  ngAfterViewChecked(): void {
    // this.ref.detectChanges();
    this.ref.detach();
    this.ref.detectChanges();
    this.ref.reattach();
  }

  ngOnDestroy() {
    this.devices.forEach((device, index) => {
      if (this.deviceSocket[device.client_dev_no]) {
        this.deviceSocket[device.client_dev_no].disconnect();
        // this.deviceSessionSocket[device.client_dev_no].disconnect();
      }
    });
  }

}
