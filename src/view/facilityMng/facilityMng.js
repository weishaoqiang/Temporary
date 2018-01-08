/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule','mngApp.facilityMngSmoke','mngApp.facilityMngTempHum'])
  .controller('mngCtrl', [function() {
    // Put sth belongs to the specific mng-module here
  }])
  .controller('facilityMngGuard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'guardDeviceStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, guardDeviceStateList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '门禁设备',
      'url': '../../..' + window.location.pathname + '#/facilityMng_guard'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      getCityList: function() {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            $scope.tblToolbar.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      whenValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if (!self.stateVal) {
          self.stateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getGuardList(self.cityVal.id, self.stateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      cityValChanged: function() {
        this.whenValChanged();
      },
      stateValChanged: function() {
        this.whenValChanged();
      },
      itemNumValChanged: function() {
        this.whenValChanged();
      },
      launchSearch: function() {
        this.whenValChanged();
      },
      itemNumList: itemNumList,
      guardDeviceStateList: guardDeviceStateList.slice(0, -1).reverse(),
      cityVal: {
        id: ''
      },
      stateVal: {
        id: ''
      },
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
    $scope.tblToolbar.getCityList();

    $scope.tblNormal = {
      getGuardList: function(cityID, state, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryDevicesBKMgr?cityID=' + cityID + '&state=' + state + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      skipToEdit: function() {
        window.sessionStorage.setItem('skipSource', 'facilityMngGuard_ctrl');
      },
      delGuard: function(deviceCode) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.contentType = 'text';
        $scope.modalBasic.body.content = '确认删除该门禁设备？';
        $scope.modalBasic.footer.btn = [{
          styleList: ['btn', 'btn-cancel'],
        }, {
          styleList: ['btn', 'btn-confirm'],
        }];
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        $scope.modalBasic.footer.btn[1].name = '确认';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delLLDeviceBKMgr?deviceCode=' + deviceCode)
              .success(function(ret) {
                $scope.modalBasic.header.content = '删除结果';
                $scope.modalBasic.body.contentType = 'text';
                $scope.modalBasic.footer.btn = [{
                  styleList: ['btn', 'btn-confirm'],
                }];
                if (ret.success) {
                  $scope.modalBasic.body.content = '删除指定门禁 成功!';
                  $scope.modalBasic.footer.btn[0].name = '完成';
                  $scope.modalBasic.footer.btn[0].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    self.getGuardList('',$scope.tblToolbar.stateVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal);
                  };
                } else {
                  $scope.modalBasic.body.content = '删除指定门禁 失败! ' + ret.message;
                  $scope.modalBasic.footer.btn[0].name = '取消';
                  $scope.modalBasic.footer.btn[0].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                  $scope.modalBasic.footer.btn[1].name = '重新删除';
                  $scope.modalBasic.footer.btn[1].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 10);
              })
              .error(function(msg) {});
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 10);
      },
      unlockGuard: function(deviceCode) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/openLLDoorBKMgr?SN=' + deviceCode)
          .success(function(ret) {
            $scope.modalBasic.header.content = '开锁提示';
            $scope.modalBasic.body.contentType = 'text';
            if (ret.success) {
              $scope.modalBasic.body.content = '开锁成功！';
              $scope.modalBasic.footer.btn = [{
                styleList: ['btn', 'btn-confirm'],
              }];
              $scope.modalBasic.footer.btn[0].name = '完成';
              $scope.modalBasic.footer.btn[0].func = function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              };
            } else {
              $scope.modalBasic.body.content = '开锁失败！';
              $scope.modalBasic.footer.btn = [{
                styleList: ['btn', 'btn-cancel'],
              }];
              $scope.modalBasic.footer.btn[0].name = '返回';
              $scope.modalBasic.footer.btn[0].func = function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              };
            }
            $timeout(function() {
              $("#myModal").modal({
                show: true,
                backdrop: 'static' //点击周围区域时不会隐藏模态框
              });
            }, 10);
          })
          .error(function(msg) {});
      }
    };

    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getGuardList(tblToolbar.cityVal.id, tblToolbar.stateVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getGuardList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.stateVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getGuardList('', '', $scope.tblToolbar.itemNumVal.id, 1, '');
    }
  }])
  .controller('facilityMngCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'userTypeList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, userTypeList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '门禁卡',
      'url': '../../..' + window.location.pathname + '#/facilityMng_card'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.modalBasic = {
      header: {
        content: ''
      },
      body: {
        content: ''
      },
      footer: {
        btn: []
      }
    };

    $scope.tblToolbar = {
      whenValChanged: function() {
        var self = this;
        if (!self.userTypeVal) {
          self.userTypeVal = {
            id: ''
          };
        }
        $scope.tblNormal.getCardList(self.userTypeVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      userTypeValChanged: function() {
        this.whenValChanged();
      },
      itemNumValChanged: function() {
        this.whenValChanged();
      },
      launchSearch: function() {
        this.whenValChanged();
      },
      itemNumList: itemNumList,
      userTypeList: userTypeList,
      userTypeVal: {
        id: ''
      },
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getCardList: function(userType, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryCardsBKMgr?userType=' + userType + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      skipToEdit: function() {
        window.sessionStorage.setItem('skipSource', 'facilityMngGuard_ctrl');
      },
      delCard: function(uid) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确认删除该门禁卡？';
        $scope.modalBasic.footer.btn = [{
          styleList: ['btn', 'btn-cancel'],
        }, {
          styleList: ['btn', 'btn-confirm'],
        }];
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        $scope.modalBasic.footer.btn[1].name = '确认';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delCardBKMgr?uid=' + uid)
              .success(function(ret) {
                $scope.modalBasic.header.content = '删除提示';
                if (ret.success) {
                  $scope.modalBasic.body.content = '删除指定门禁卡 成功！';
                  $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }];
                  self.getCardList($scope.tblToolbar.userTypeVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal);
                } else {
                  $scope.modalBasic.body.content = '删除指定门禁卡 失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                    "name": '返回',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {});
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 1);
      }
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getCardList(tblToolbar.userTypeVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getCardList($scope.tblToolbar.userTypeVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getCardList('', $scope.tblToolbar.itemNumVal.id, 1, '');
    }
  }])
  .controller('facilityMngLocker_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'wjlDeviceStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, wjlDeviceStateList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '储物柜',
      'url': '../../..' + window.location.pathname + '#/facilityMng_locker'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      whenValChanged: function() {
        var self = this;
        if (!self.stateVal) {
          self.stateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getLockerList(self.stateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      stateValChanged: function() {
        this.whenValChanged();
      },
      itemNumValChanged: function() {
        this.whenValChanged();
      },
      launchSearch: function() {
        this.whenValChanged();
      },
      itemNumList: itemNumList,
      lockerStateList: wjlDeviceStateList,
      stateVal: {
        id: ''
      },
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getLockerList: function(state, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/querySmartShopsBKMgr?deviceStatus=' + state + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      skipToEdit: function() {
        window.sessionStorage.setItem('skipSource', 'facilityMngLocker_ctrl');
      },
      generateQRCode: function(deviceName, deviceSN) {
        var self = this;
        // 正式支付环境
        // var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa9c846f2f41ae85e&redirect_uri=http%3a%2f%2fyouminfo.com%2fwwg%2f%23!%2fhome&response_type=code&scope=snsapi_base&state=" + deviceSN + "#wechat_redirect";
        var link = "http://weixin.qq.com/r/Ajg-J13EgwD8rRlE920Q?deviceSN=" + deviceSN + "&type=1";
        // 测试支付环境
        // var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa9c846f2f41ae85e&redirect_uri=http%3a%2f%2fl168k85439.iok.la%2f%23!%2fhome&response_type=code&scope=snsapi_base&state=" + deviceSN + "#wechat_redirect";

        this.qrcodeName = deviceName;
        $.cachedScript('../../js/qrcode.min.js').done(function() {
          if (!self.qrcode) {
            self.qrcode = new QRCode('scode', {
              text: link,
              width: 240,
              height: 240,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
            // 将生成的短连接显示出来
            self.qrCodeShortLink = link;
            // console.log(ret.data);
          } else {
            self.qrcode.clear();
            self.qrcode.makeCode(link);
          }
          self.qrShowState = true;
        });
      },
      qrHide: function() {
        this.qrShowState = false;
      },
      qrcode: null,
      qrcodeName: '',
      qrShowState: false,
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getLockerList(tblToolbar.stateVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getLockerList($scope.tblToolbar.stateVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getLockerList('', $scope.tblToolbar.itemNumVal.id, 1, '');
    }
  }])
  .controller('facilityMngGarage_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'wjlDeviceStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, wjlDeviceStateList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '共享储物柜',
      'url': '../../..' + window.location.pathname + '#/facilityMng_garage'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      whenValChanged: function() {
        var self = this;
        if (!self.stateVal) {
          self.stateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getGarageList(self.stateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      stateValChanged: function() {
        this.whenValChanged();
      },
      itemNumValChanged: function() {
        this.whenValChanged();
      },
      launchSearch: function() {
        this.whenValChanged();
      },
      itemNumList: itemNumList,
      lockerStateList: wjlDeviceStateList,
      stateVal: {
        id: ''
      },
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getGarageList: function(state, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/querySmartCarsBKMgr?onlinestate=' + state + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      skipToEdit: function() {
        window.sessionStorage.setItem('skipSource', 'facilityMngGarage_ctrl');
      },
      generateQRCode: function(deviceName, deviceSN) {
        var self = this;
        // 正式支付环境
        // var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa9c846f2f41ae85e&redirect_uri=http%3a%2f%2fyouminfo.com%2fwwg%2f%23!%2fhome&response_type=code&scope=snsapi_base&state=" + deviceSN + "#wechat_redirect";
        var link = "http://weixin.qq.com/r/Ajg-J13EgwD8rRlE920Q?deviceSN=" + deviceSN + "&type=3";

        // 测试支付环境
        // var link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa9c846f2f41ae85e&redirect_uri=http%3a%2f%2fl168k85439.iok.la%2f%23!%2fhome&response_type=code&scope=snsapi_base&state=" + deviceSN + "#wechat_redirect";

        this.qrcodeName = deviceName;
        $.cachedScript('../../js/qrcode.min.js').done(function() {
          if (!self.qrcode) {
            self.qrcode = new QRCode('scode', {
              text: link,
              width: 240,
              height: 240,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
            // 将生成的短连接显示出来
            self.qrCodeShortLink = link;
            // console.log(ret.data);
          } else {
            self.qrcode.clear();
            self.qrcode.makeCode(link);
          }
          self.qrShowState = true;
        });
      },
      qrHide: function() {
        this.qrShowState = false;
      },
      qrcode: null,
      qrcodeName: '',
      qrShowState: false,
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getGarageList(tblToolbar.stateVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getGarageList($scope.tblToolbar.stateVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getGarageList('', $scope.tblToolbar.itemNumVal.id, 1, '');
    }
  }])
  .controller('facilityMngAddSpecialCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function($scope, $rootScope, $http, $timeout, $routeParams) {
    $scope.title = "授权工程门禁卡";
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '授权工程门禁卡',
      'url': '../../..' + window.location.pathname + '#/clientMng_addCard/' + $scope.param
    }, 'LV1');
    $scope.tblDetails = {
      showDatepickerEnd: function() {
        laydate({
          elem: '#endDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          isclear: false,
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
            $scope.formResult.overDueDate = datas;
          },
        });
      },
      validateForm: function() {
        var canSubmit = true;
        var regID = /^([0-9]|[a-zA-Z]){1,}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        //
        if (!$scope.formResult.uid || !regID.test($scope.formResult.uid)) {
          $scope.valiResult.uidError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.uidError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.deviceCode || !regID.test($scope.formResult.deviceCode)) {
          $scope.valiResult.deviceCodeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceCodeError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regDate.test($scope.formResult.overDueDate)) {
          $scope.valiResult.overDueDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.overDueDateError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.managerID = $scope.param;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '授权工程门禁卡提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addPermCardBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '授权工程门禁卡 成功！';
                  $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }, {
                    "name": '继续新增',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  }];
                } else {
                  var errorMsg = (ret.message.indexOf('empty') !== -1) ? '该管理员未授权门店或门店无门禁设备' : ret.message;
                  $scope.modalBasic.body.content = '授权工程门禁卡 失败！' + errorMsg;
                  $scope.modalBasic.footer.btn = [{
                    "name": '返回',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }, {
                    "name": '重新添加',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {
                console.log('Fail! ' + msg);
              });

          }
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityVal: {
        name: '-请选择-',
        id: ''
      },
      shopVal: {
        name: '-请选择-',
        id: ''
      },
      deviceVal: {
        name: '-请选择-',
        id: ''
      },
    };
    $scope.formResult = {};
    $scope.modalBasic = {
      header: {
        content: ''
      },
      body: {
        content: ''
      },
      footer: {
        btn: []
      }
    };
    $scope.valiResult = {
      cityError: false,
      shopError: false,
      cardIDError: false,
      overDueDateError: false,
    };
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/facilityMng_guard', {
        templateUrl: 'facilityMng_guard.html?t=' + getTimeStamp(),
        controller: 'facilityMngGuard_ctrl',
      })
      .when('/facilityMng_smoke', {
        templateUrl: 'facilityMng_smoke.html?t=' + getTimeStamp(),
        controller: 'facilityMngSmoke_ctrl',
      })
      .when('/facilityMng_tempHum', {
        templateUrl: 'facilityMng_tempHum.html?t=' + getTimeStamp(),
        controller: 'facilityMngTempHum_ctrl',
      })
      .when('/facilityMng_card', {
        templateUrl: 'facilityMng_card.html?t=' + getTimeStamp(),
        controller: 'facilityMngCard_ctrl',
      })
      .when('/facilityMng_locker', {
        templateUrl: 'facilityMng_locker.html?t=' + getTimeStamp(),
        controller: 'facilityMngLocker_ctrl',
      })
      .when('/facilityMng_garage', {
        templateUrl: 'facilityMng_garage.html?t=' + getTimeStamp(),
        controller: 'facilityMngGarage_ctrl',
      })
      .when('/facilityMng_addSpecialCard', {
        templateUrl: 'facilityMng_addSpecialCard.html?t=' + getTimeStamp(),
        controller: 'facilityMngAddSpecialCard_ctrl',
      })
      .otherwise({
        redirectTo: '/facilityMng_guard'
      });
    $httpProvider.interceptors.push('myInterceptor'); //拦截器
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
