import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DeviceServices } from '../devices/device.service';
import { Socket } from 'ng-socket-io';
import { SocketOne } from '../devices/devices.module';
import { HttpClient } from '../shared/services/http-client.service';
import { SharedContants } from '../shared/shared.constants';
import { CommonServices } from '../shared/services/common.service';
import Swal from 'sweetalert2';

@Injectable()
export class CommonService {
  mem = {};
  currentStage = '';
  timeObject;
  checkProcess;
  constructor(private commonServices: CommonServices, private http: HttpClient, private deviceServices: DeviceServices, private socket: Socket) { }

  store(key, value) {
    this.currentStage = key;
    this.mem[key] = value;

    return this.mem[key];
  }
  get(key) {
    return this.mem[key];
  }
  promptMessageL = function (msg) {
    return this.commonService.confirmationBox(msg, function (result) {
      return result;
    });
  }
  callMeagainL() {
    if (!this.checkProcess) {
      this.promptMessageL("Script has run for 300 seconds - press Cancle to abort or press OK to continue for another 300 seconds").then(function (result) {
        if (!result) {
          return "You had aborted process";
        } else {
          this.timeObject = setTimeout(() => {
            this.callMeagainL();
          }, 300000);
        }
      });
    }
  }
  popMessage(msg, title, type) {
    // bootbox.dialog({
    //   message: msg,
    //   title: title,
    //   alertType: type
    // });
    this.commonServices.alertBox(type, msg);
  }
  popConfirm(msg) {
    return this.commonServices.confirmationBox(msg)
      .subscribe((ans: boolean) => {
        return ans
      });
    // bootbox.confirm(msg, function (result) {
    //   deferred.resolve(result);
    // });
    // return deferred.promise;
  }
  promptMessage(msg) {
    return window.prompt(msg);
    // return this.commonServices.promptBox(msg)
    //   .subscribe((ans: boolean) => {
    //     return ans
    //   });
    // bootbox.prompt(msg, function (result) {
    //   deferred.resolve(result);
    // });
    // return deferred.promise;

  }
  previewPythonScript() {
    this.mem[this.currentStage].errorMsg = '';
    this.mem[this.currentStage].successMsg = '';
    var localMsg = '';
    if (!this.mem[this.currentStage].contents) {
      localMsg = "Please enter Contents (Python) \r\n";
    }
    if (!this.mem[this.currentStage].devicenumbertocheck) {
      localMsg = localMsg + "Device number is required";
    }

    if (localMsg) {
      this.mem[this.currentStage].errorMsg = localMsg;
      return false;
    }

    this.mem[this.currentStage].successMsg = '<img src="assets/images/spin.gif">';

    var scriptContent = {
      contents: this.mem[this.currentStage].contents,
      deviceId: this.mem[this.currentStage].devicenumbertocheck
    };
    var that = this;

    this.deviceServices.getdevicebynumber(this.mem[this.currentStage].devicenumbertocheck)
      .subscribe((device) => {
        that.mem[that.currentStage].devices[0] = device;
        that.showProcedurePreview(device, 0);

        that.mem[that.currentStage].deviceSelected.client_dev_no = device.client_dev_no;
        that.mem[that.currentStage].deviceSelected.id = device.id;

        that.mem[that.currentStage].deviceSelected.errors = null;
        that.mem[that.currentStage].deviceSelected.info = null;
        that.mem[that.currentStage].deviceSelected.pid = 0;
        that.mem[that.currentStage].scanning = [environment.scanstartText];

        var those = that;
        that.validatepythonscript(scriptContent).subscribe((success: any) => {
          those.mem[this.currentStage].pid = 0;
          those.mem[this.currentStage].deviceSocket[those.mem[those.currentStage].devices[0].client_dev_no].disconnect();
          if (success.error === "none") {
            those.mem[those.currentStage].errorMsg = '';
            those.mem[those.currentStage].successMsg = '';
            those.mem[those.currentStage].successMsg = JSON.stringify(success.output);
          } else {
            those.mem[those.currentStage].successMsg = '';
            those.mem[those.currentStage].errorMsg = success;
            those.mem[those.currentStage].stopProgram();
          }
        });
      });



    this.mem[this.currentStage].pid = 1;
    return this.mem[this.currentStage];
  }

  validatepythonscript(data) {

    var checkProcess = false;
    return this.http.post(environment.SERVER_URL + 'validatepythonscript', data)
      .map((successData: any) => {
        var success = successData.json();
        checkProcess = true;
        if (success.error == "none") {
          if (data.deviceId) {
            return success
          } else {
            return success
          }
        } else if (success.error) {
          var stringError = success.error;
          stringError = stringError.trim();
          return stringError.replace("Error: Error:", "")
        } else {
          return "none";
        }
      })
    // .toPromise().then(
    // function (successData: any) {
    //   var success = successData.data;
    //   checkProcess = true;
    //   if (success.error == "none") {
    //     if (data.deviceId) {
    //       return success
    //     } else {
    //       return success
    //     }
    //   } else if (success.error) {
    //     var stringError = success.error;
    //     stringError = stringError.trim();
    //     return stringError.replace("Error: Error:", "")
    //   } else {
    //     return "none";
    //   }
    // },
    // function (error) {
    //   checkProcess = true;
    //   return "Something went wrong....Server time out/Script is not valid...."
    // });

  }

  printPDF(msg, device) {
    var key = "FULL SCAN";
    var that = this;
    if (msg[key]) {
      msg[key].device = device;
      msg[key].device.vinDetails = { "url": "testing", "vin": "testing", "vinName": "testing", "year": "testing" };
      this.deviceServices.printpdf({ contents: msg })
        .subscribe((response) => {
          this.mem[this.currentStage].scanning.push("Please click <a target='_blank' href='https://s3-us-west-2.amazonaws.com/reportpdf-rocketbox/" + response.data + ".pdf'>here</a> to download pdf report");
        });
    }
  }

  putScanningMsg(msg) {
    if (this.mem[this.currentStage].scanning.length > 0) {
      this.mem[this.currentStage].scanning.push(msg);
    } else {
      this.mem[this.currentStage].scanning = [environment.scanstartText];
      this.mem[this.currentStage].scanning.push(msg);
    }
  }
  showProcedurePreview(device, dindex) {
    var that = this;
    var namespace = environment.POD_SERVER_ROOM;
    this.mem[this.currentStage].deviceSocket[device.client_dev_no] = new SocketOne();
    this.mem[this.currentStage].deviceSocket[device.client_dev_no].on('connect', function (socket) {
      that.mem[that.currentStage].deviceSocket[device.client_dev_no].emit("authentication", { "serial": "AngularL0gin1!", "email": SharedContants.USER_DETAILS.email });
      var those = that;
      that.mem[that.currentStage].deviceSocket[device.client_dev_no].on('authenticated', function (msg) {
        if (those.mem[those.currentStage].devices[dindex].websubscribe) {
        } else if (device.session) {
          those.mem[those.currentStage].devices[dindex].websubscribe = true;
          those.mem[those.currentStage].deviceSocket[device.client_dev_no].emit('websubscribe', device.session);
        }
      });
      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('webuser', function (msg) {
        those.mem[those.currentStage].commonService.putScanningMsg(msg);
      });

      var theyall = those;
      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('webprompt', function (msg) {
        Swal({
          title: '',
          text: msg,
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            theyall.mem[those.currentStage].deviceSocket[theyall.mem[theyall.currentStage].deviceSelected.client_dev_no].emit("webdata", "OK");
          } else {
            theyall.mem[those.currentStage].deviceSocket[theyall.mem[theyall.currentStage].deviceSelected.client_dev_no].emit("webdata", "Cancelled");
          }
        });
      });

      var there = those;
      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('webinput', function (msg) {
        there.mem[there.currentStage].promptText = msg;
        there.mem[there.currentStage].countdown = 30;
        // there.mem[there.currentStage].$broadcast('timer-start');

        //                                this.mem[this.currentStage].common.putScanningMsg(msg);
        var then = there;
        if (msg.indexOf("{") == 0) {
          var msgPopup = JSON.parse(msg);

          var optionsStyle = "";
          msgPopup.forEach((value, index) => {
            optionsStyle = optionsStyle + index + ": " + value + "<br>";
          });

          let resp = "";
          // if (resp = window.prompt(optionsStyle + "<br>Please enter number from above options")) {
          //   then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", resp);
          // } else {
          //   then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", "Cancelled");
          // }

          Swal({
            title: optionsStyle + "<br>Please enter number from above options",
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
              then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", result.value);
            } else {
              then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", "Cancelled");
            }
          })
          // there.mem[there.currentStage].commonService.promptMessage(optionsStyle + "<br>Please enter number from above options").subscribe(function (result) {
          //   if (result === null) { result = "Cancelled"; }
          //   then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", result);
          //   //                    
          // });
        } else {
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
              then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", result.value);
            } else {
              then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", "Cancelled");
            }
          })

          // there.mem[there.currentStage].commonService.promptMessage(msg).subscribe(function (result) {
          //   if (result === null) { result = "Cancelled"; }
          //   then.mem[then.currentStage].deviceSocket[then.mem[then.currentStage].deviceSelected.client_dev_no].emit("webdata", resp);
          //   //                    
          // });
        }

      });

      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('pdfreport', function (msg) {
        var jsonData = '';
        try {
          jsonData = JSON.parse(msg);
          there.mem[there.currentStage].commonService.printPDF(jsonData, device);
        } catch (err) {
          console.log("For pdf report we are not getting proper JSON");
        }
      });
      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('webjson', function (msg) {
        there.mem[there.currentStage].devices[dindex].info = JSON.parse(msg);
        //                            Restangular.one('devices/validatevin/' + device.info.vin).get().then(function (obj) {
        //                                device.info.more = obj;
        //                            });

        msg = String(msg);
        var jsonData = JSON.parse(msg);
        if (jsonData.errors) {
          there.mem[there.currentStage].deviceSelected.errors = jsonData.errors;
          there.mem[there.currentStage].scanning = [];
          there.mem[there.currentStage].deviceSelected.pid = '';
        } else {
          there.mem[there.currentStage].deviceSelected.info = JSON.parse(msg);
        }
      });

      those.mem[those.currentStage].deviceSocket[device.client_dev_no].on('frompodctrl', function (msg) {
        if (msg.includes("Disconnected")) {
          there.mem[there.currentStage].devices[dindex].connected = false;
          there.mem[there.currentStage].devices[dindex].deviceconnectedOnce = false;
          // $(".procedureServer").hide();
          there.mem[there.currentStage].checkPIN(device);
          there.mem[there.currentStage].devices[dindex].processStart = false;
        } else {
          there.mem[there.currentStage].devices[dindex].connected = true;
          there.mem[there.currentStage].devices[dindex].deviceconnectedOnce = true;
        }
      });
    });

    if (device.processStart) {
      return false;
    }
    else {
      this.mem[this.currentStage].devices[dindex].processStart = true;
    }
    // $("#procedureServer_" + device.id).html('');

    // $(".procedureServer").show();
    // $("#procedureServer_" + device.id).show();
    this.mem[this.currentStage].showModal = !this.mem[this.currentStage].showModal;
  }


}
