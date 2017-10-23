/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', [function() {
    // Put sth belongs to the specific mng-module here
  }])
  .controller('clientMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'clientStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, clientStateList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '租客管理',
      'url': '../../..' + window.location.pathname + '#/clientMng_index'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      clientStateValChanged: function() {
        var self = this;
        if (!self.clientStateVal) {
          self.clientStateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getRentClientList(self.clientStateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.clientStateVal) {
          self.clientStateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getRentClientList(self.clientStateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        if (!self.clientStateVal) {
          self.clientStateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getRentClientList(self.clientStateVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      clientStateList: clientStateList,
      searchVal: "",
      clientStateVal: {
        id: ''
      },
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getRentClientList: function(state, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUsersFromBKMgr?state=' + state + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getRentClientList(tblToolbar.clientStateVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getRentClientList($scope.tblToolbar.clientStateVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getRentClientList($scope.tblToolbar.clientStateVal.id, $scope.tblToolbar.itemNumVal.id, 1, '');
    }

  }])
  .controller('clientMngIntent_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', '$q', 'dateSer', 'RememberSer', 'itemNumList', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, $routeParams, $q, dateSer, RememberSer, itemNumList, TblPagination) {
    $scope.param = $routeParams.param;
    switch ($scope.param) {
      case 'all':
        var pathName = '意向客户管理';
        break;
      case 'new':
        var pathName = '新增意向客户';
        break;
    }
    $rootScope.globalPath.initPath({
      'name': pathName,
      'url': '../../..' + window.location.pathname + '#/clientMng_intent/' + $scope.param + '/' + $routeParams.cityID + '/' + $routeParams.shopID
    }, 'LV1');
    $scope.dateSer = dateSer;
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.cityList = ret.data.data;
              for (var i in self.cityList) {
                if (self.cityList[i].id == $routeParams.cityID) {
                  self.cityVal = self.cityList[i];
                  break;
                }
              }
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getShopList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.shopList = ret.data.data;
              for (var i in self.shopList) {
                if (self.shopList[i].id == $routeParams.shopID) {
                  self.shopVal = self.shopList[i];
                  break;
                }
              }
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        self.getShopList();
        //Get intentClientList
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        $scope.tblNormal.getIntentClientList($scope.param, self.cityVal.id, '', self.itemNumVal.id, 1, '');
      },
      shopValChanged: function() {
        //Get intentClientList
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        console.log(self.shopVal);
        $scope.tblNormal.getIntentClientList($scope.param, self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, '');
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        //Get intentClientList
        $scope.tblNormal.getIntentClientList($scope.param, self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        //Get intentClientList
        $scope.tblNormal.getIntentClientList($scope.param, self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      shopVal: {
        id: ''
      },
      cityVal: {
        id: ''
      },
      searchVal: "",
      itemNumVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getIntentClientList: function(param, cityID, shopID, pageSize, curPage, key) {
        var self = this;
        switch (param) {
          case 'all':
            self.getAllIntentClientList(cityID, shopID, pageSize, curPage, key);
            break;
          case 'new':
            self.getNewIntentClientList(cityID, shopID, pageSize, curPage);
            break;
          default:
            self.getAllIntentClientList(cityID, shopID, pageSize, curPage, key);
            break;
        }
      },
      getAllIntentClientList: function(cityID, shopID, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryPotentialUsersFromBKAdmin?cityID=' + cityID + '&shopID=' + shopID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getNewIntentClientList: function(cityID, shopID, pageSize, curPage) {
        var self = this;
        var queryStr = '';
        if (shopID) {
          queryStr = '&shopID=' + shopID;
        } else if (cityID) {
          queryStr = '&cityID=' + cityID;
        } else {
          queryStr = '';
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/todayPotentialUsersFromBKMgr?' + 'pageSize=' + pageSize + '&curPage=' + curPage + queryStr)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      delIntentClient: function(id, name) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确定删除意向客户："' + name + '"  吗？';
        $scope.modalBasic.footer.btn = [{
            "name": '取消',
            "styleList": ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          },
          {
            "name": '确认',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delPotentialUserFromWXMgr?puID=' + id)
                .success(function(ret) {
                  if (ret.success) {
                    self.getIntentClientList($scope.param,
                      $routeParams.cityID == 0 ? '' : $routeParams.cityID,
                      $routeParams.shopID == 0 ? '' : $routeParams.shopID,
                      $scope.tblToolbar.itemNumVal.id, 1, '');
                  }
                }).error(function(msg) {
                  console.log("Fail");
                  console.log(msg);
                });
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          }
        ];
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getIntentClientList($scope.param,
        $routeParams.cityID == 0 ? '' : $routeParams.cityID,
        $routeParams.shopID == 0 ? '' : $routeParams.shopID,
        self.pageSize, pageNum, tblToolbar.searchVal);
    };

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.getShopList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            $scope.tblNormal.getIntentClientList($scope.param,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.shopVal.id,
              $scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage,
              $scope.tblToolbar.searchVal);
          } else {
            $scope.tblNormal.getIntentClientList($scope.param,
              $routeParams.cityID == 0 ? '' : $routeParams.cityID,
              $routeParams.shopID == 0 ? '' : $routeParams.shopID,
              $scope.tblToolbar.itemNumVal.id, 1, '');
          }
        }
      })
  }])
  .controller('clientMngAddIntent_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'unitTypeList', 'sexList', function($scope, $rootScope, $http, $timeout, unitTypeList, sexList) {
    $scope.title = "新增意向客户";
    $rootScope.globalPath.initPath({
      'name': '新增意向客户',
      'url': '../../..' + window.location.pathname + '#/clientMng_addIntent'
    }, 'LV2');
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getShopList: function() {
        var self = this;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getManagerList: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/queryManagersFromBKMgr?pageSize=100&curPage=1')
          .success(function(ret) {
            console.log(ret);
            self.managerList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        self.getShopList();
      },
      showDatepickerStart: function() {
        laydate({
          elem: '#startDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
            $scope.formResult.startDate = datas;
          },
          clear: function() {
            $("#startDate").val('');
          }
        });
      },
      validateForm: function() {
        var canSubmit = true;
        // var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){2,}$/;
        var reg = /^(.){1,}$/;
        var regPhone = /^1[3|4|5|8][0-9]{9}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        var regNum = /^[0-9]{1,}$/;
        // Validte client's name
        if (!reg.test($("#name").val())) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        // Validte client's phone
        if (!regPhone.test($("#phone").val())) {
          $scope.valiResult.phoneError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.phoneError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent sex
        if (!$("#sexSel").val()) {
          $scope.valiResult.sexError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.sexError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent shop
        if (!$("#shopSel").val()) {
          $scope.valiResult.shopIDError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopIDError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent unitType
        if (!$("#unitTypeSel").val()) {
          $scope.valiResult.unitTypeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitTypeError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent manager
        if (!$("#managerSel").val()) {
          $scope.valiResult.managerError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.managerError = false;
          canSubmit = canSubmit && true;
        }
        // Validte startDate
        if (!regDate.test($("#startDate").val())) {
          $scope.valiResult.startDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.startDateError = false;
          canSubmit = canSubmit && true;
        }
        // Validte rentLast
        if (!regNum.test($("#rentLast").val())) {
          $scope.valiResult.rentLastError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.rentLastError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.shopID = $scope.tblDetails.shopVal.id;
          $scope.formResult.unitType = $scope.tblDetails.unitTypeVal.id;
          $scope.formResult.managerID = $scope.tblDetails.managerVal.id;
          $scope.formResult.sex = $scope.tblDetails.sexVal.id;
          $scope.formResult.startDate = $("#startDate").val();
          var data = $.param($scope.formResult);
          $scope.modalBasic.header.content = '添加提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addPotentialUserFromWXMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '添加意向客户成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续添加',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '添加意向客户失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新添加',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
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
      unitTypeList: unitTypeList,
      sexList: sexList,
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
      nameError: false,
      phoneError: false,
      sexError: false,
      shopIDError: false,
      unitTypeError: false,
      managerError: false,
      startDateError: false,
      rentLastError: false,
    };
    $scope.tblDetails.getCityList();
    $scope.tblDetails.getShopList();
    $scope.tblDetails.getManagerList();
  }])
  .controller('clientMngEditIntent_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$q', 'unitTypeList', 'sexList', function($scope, $rootScope, $http, $timeout, $routeParams, $q, unitTypeList, sexList) {
    $scope.title = '编辑意向客户';
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '编辑意向客户',
      'url': '../../..' + window.location.pathname + '#/clientMng_editIntent/' + $scope.param
    }, 'LV2');
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
            deferred.resolve(true);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getShopList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
            deferred.resolve(true);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getManagerList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/queryManagersFromBKMgr?pageSize=100&curPage=1')
          .success(function(ret) {
            console.log(ret);
            self.managerList = ret.data.data;
            deferred.resolve(true);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getIntentClientDetail: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPUDetailFromBKMgr?id=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              $scope.formResult = {
                name: ret.data.name,
                phone: ret.data.phone,
                sex: ret.data.sex,
                shopID: ret.data.shopID,
                unitType: ret.data.unitType,
                managerID: ret.data.managerID,
                startDate: ret.data.startDate,
                rentLast: ret.data.rentLast,
                address: ret.data.address,
              };
              for (var i in self.sexList) {
                if (self.sexList[i].id === Number($scope.formResult.sex)) {
                  self.sexVal = self.sexList[i];
                  break;
                }
              }
              for (var i in self.shopList) {
                if (self.shopList[i].id === Number($scope.formResult.shopID)) {
                  self.shopVal = self.shopList[i];
                  break;
                }
              }
              for (var i in self.unitTypeList) {
                if (self.unitTypeList[i].id === Number($scope.formResult.unitType)) {
                  self.unitTypeVal = self.unitTypeList[i];
                  break;
                }
              }
              for (var i in self.managerList) {
                if (self.managerList[i].id === Number($scope.formResult.managerID)) {
                  self.managerVal = self.managerList[i];
                  break;
                }
              }
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        self.getShopList();
      },
      showDatepickerStart: function() {
        laydate({
          elem: '#startDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
          },
          clear: function() {
            $("#startDate").val('');
          }
        });
      },
      validateForm: function() {
        var canSubmit = true;
        // var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){1,}$/;
        var reg = /^(.){1,}$/;
        var regPhone = /^1[3|4|5|8][0-9]{9}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        var regNum = /^[0-9]{1,}$/;
        // Validte client's name
        if (!reg.test($("#name").val())) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        // Validte client's phone
        if (!regPhone.test($("#phone").val())) {
          $scope.valiResult.phoneError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.phoneError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent sex
        if (!$("#sexSel").val()) {
          $scope.valiResult.sexError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.sexError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent shop
        if (!$("#shopSel").val()) {
          $scope.valiResult.shopIDError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopIDError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent unitType
        if (!$("#unitTypeSel").val()) {
          $scope.valiResult.unitTypeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitTypeError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent manager
        if (!$("#managerSel").val()) {
          $scope.valiResult.managerError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.managerError = false;
          canSubmit = canSubmit && true;
        }
        // Validte startDate
        if (!regDate.test($("#startDate").val())) {
          $scope.valiResult.startDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.startDateError = false;
          canSubmit = canSubmit && true;
        }
        // Validte rentLast
        if (!regNum.test($("#rentLast").val())) {
          $scope.valiResult.rentLastError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.rentLastError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.id = $scope.param;
          $scope.formResult.shopID = $scope.tblDetails.shopVal.id;
          $scope.formResult.unitType = $scope.tblDetails.unitTypeVal.id;
          $scope.formResult.managerID = $scope.tblDetails.managerVal.id;
          $scope.formResult.sex = $scope.tblDetails.sexVal.id;
          $scope.formResult.startDate = $("#startDate").val();
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '添加提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updatePotentialUserFromBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '更新意向客户成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '更新意向客户失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
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
      unitTypeList: unitTypeList,
      sexList: sexList,
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
      nameError: false,
      phoneError: false,
    };
    $q.all([$scope.tblDetails.getCityList(), $scope.tblDetails.getShopList(), $scope.tblDetails.getManagerList()])
      .then(function(flag) {
        var canRun = true;
        for (var i in flag) {
          canRun &= flag[i];
        }
        if (canRun) {
          console.log('xxxx');
          $scope.tblDetails.getIntentClientDetail();
        }
      });
  }])
  .controller('clientMngQueryIntent_ctrl', ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', function($scope, $rootScope, $http, $routeParams, $timeout) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '查询意向客户',
      'url': '../../..' + window.location.pathname + '#/clientMng_queryIntent/' + $scope.param
    }, 'LV2');
    $scope.queryResult = {};
    $scope.formResult = {
      userPotentialID: $scope.param,
      content: '',
    };
    $scope.valiResult = {
      recordError: false,
      recordSubmitted: false,
    };
    $scope.tblDetails = {
      getIntentClientDetail: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPUDetailFromBKMgr?id=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              // $http.get('http://'+$rootScope.globalURL.hostURL+'/api/getShop?shopID='+$scope.queryResult.shopID)
              //   .success(function(ret){
              //     if(ret.success){
              //       $scope.queryResult.shopName = ret.data.name;
              //     }
              //   })
              //   .error(function(msg){});
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getFollowRecordList: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUserTrackFromWXMgr?userPotentialID=' + $scope.param)
          // $http.get('http://'+$rootScope.globalURL.hostURL+'/api/queryUserTrackFromWXMgr?userPotentialID=1')
          .success(function(ret) {
            if (ret.success) {
              self.followRecordList = ret.data;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      togglePanel: function() {
        if ($('#collapseExample').hasClass('in')) {
          $('#followRecord>span.fa').addClass('fa-chevron-circle-right');
          $('#followRecord>span.fa').removeClass('fa-chevron-circle-down');
        } else {
          $('#followRecord>span.fa').removeClass('fa-chevron-circle-right');
          $('#followRecord>span.fa').addClass('fa-chevron-circle-down');
        }
        $('#collapseExample').collapse('toggle');
      },
      validateForm: function() {
        var canSubmit = true;
        if (!$("#followRecordText").val()) {
          $scope.valiResult.recordError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.recordError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      saveFollowRecords: function() {
        var self = this;
        var data = $.param($scope.formResult);
        if (self.validateForm()) {
          $("#followRecordText").val(''); //Clear the input
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addUserTrackFromWXMgr', data)
            .success(function(ret) {
              if (ret.success) {
                $scope.valiResult.recordSubmitted = true;
                $timeout(function() {
                  $scope.valiResult.recordSubmitted = false;
                }, 2000);
                self.getFollowRecordList();
              }
            })
            .error(function(msg) {
              console.log('Fail! ' + msg);
            });
        }
      },
    };
    $scope.tblDetails.getFollowRecordList();
    $scope.tblDetails.getIntentClientDetail();
  }])
  .controller('clientMngQueryRentClient_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'TblPagination', function($scope, $rootScope, $routeParams, $http, $timeout, TblPagination) {
    if (window.sessionStorage.getItem('skipSource') === 'shopMngQueryShop_ctrl') {
      window.sessionStorage.removeItem('skipSource');
      $timeout(function() {
        $('body').animate({
          scrollTop: $('#cardsInfo').offset().top
        }, 500);
      }, 500);
    }

    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '租客详情',
      'url': '../../..' + window.location.pathname + '#/clientMng_queryRentClient/' + $scope.param
    }, 'LV2');

    $scope.queryResult = {};
    $scope.formResult = {
      userPotentialID: $scope.param,
      content: '',
    };
    $scope.valiResult = {
      recordError: false,
      recordSubmitted: false,
    };
    $scope.modalPhoto = {
      "header": {
        "content": ''
      },
      "body": {
        "imgSrc": ''
      },
      "footer": {
        "btn": []
      }
    };
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
    $scope.tblDetails = {
      getRentClientDetail: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserFromAdm?id=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      togglePanel: function(linkID, collapseID) {
        // $('.collapse.in:not('+ collapseID +')').removeClass('in');
        // $('.fa-chevron-circle-down').removeClass('fa-chevron-circle-down')
        //   .addClass('fa-chevron-circle-right');
        if ($(collapseID).hasClass('in')) {
          $(linkID + '>span.fa').addClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-down');
        } else {
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').addClass('fa-chevron-circle-down');
        }
        $(collapseID).collapse('toggle');
      },
      checkPhoto: function(arg) {
        var imgSrc = '';
        switch (arg) {
          case 'FRONT':
            imgSrc = $scope.queryResult.certFrontUrl;
            break;
          case 'BACK':
            imgSrc = $scope.queryResult.certBackUrl;
            break;
        }
        $scope.modalPhoto.body.imgSrc = 'http://' + imgSrc;
        $("#myModalPhoto").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
    };
    $scope.tblNormal = {
      getClientOrderList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUserOrdersFromBKMgr?userID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            if (ret.success) {
              self.orderList = ret.data.data;
              $scope.tblOrderPagination.initPagination(ret);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getClientGuardList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUserLocksFromBKMgr?userID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            console.log(ret.data.data);
            if (ret.success) {
              //console.log(self.guardList);
              self.guardList = ret.data.data;
              $scope.tblGuardPagination.initPagination(ret);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getClientCardsList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUserCardsBKMgr?userID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.cardsList = ret.data.data;
              $scope.tblcardsPagination.initPagination(ret);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      delCard: function(uid) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确认删除该门禁卡？';
        $scope.modalBasic.footer.btn = [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ];
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
                  self.getClientCardsList(10, 1);
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

    $scope.tblGuardPagination = new TblPagination();
    $scope.tblGuardPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getClientGuardList(self.pageSize, pageNum);
    };

    $scope.tblOrderPagination = new TblPagination();
    $scope.tblOrderPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getClientOrderList(self.pageSize, pageNum);
    };

    $scope.tblcardsPagination = new TblPagination();
    $scope.tblcardsPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getClientCardsList(self.pageSize, pageNum);
    };

    $scope.tblDetails.getRentClientDetail();
    $scope.tblNormal.getClientOrderList(10, 1);
    $scope.tblNormal.getClientGuardList(10, 1);
    $scope.tblNormal.getClientCardsList(10, 1);

  }])
  .controller('clientMngEditRentClient_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$q', 'certTypeList', 'sexList', 'clientStateList', function($scope, $rootScope, $http, $timeout, $routeParams, $q, certTypeList, sexList, clientStateList) {
    $scope.title = '编辑租客信息';
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '编辑租客信息',
      'url': '../../..' + window.location.pathname + '#/clientMng_editIntent/' + $scope.param
    }, 'LV2');
    $scope.modalPhoto = {
      "header": {
        "content": ''
      },
      "body": {
        "imgSrc": ''
      },
      "footer": {
        "btn": []
      }
    };
    $scope.tblDetails = {
      getRentClientDetail: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserFromAdm?id=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              $scope.formResult = {
                name: ret.data.name,
                phone: ret.data.phone,
                sex: ret.data.sex,
                state: ret.data.state,
                shopID: ret.data.shopID,
                certType: ret.data.certType,
                certNumber: ret.data.certNumber,
                certBackUrl: ret.data.certBackUrl,
                certFrontUrl: ret.data.certFrontUrl,
                address: ret.data.address,
              };
              for (var i in self.sexList) {
                if (self.sexList[i].id === Number($scope.formResult.sex)) {
                  self.sexVal = self.sexList[i];
                  break;
                }
              }
              for (var i in self.clientStateList) {
                if (self.clientStateList[i].id === Number($scope.formResult.state)) {
                  self.clientStateVal = self.clientStateList[i];
                  break;
                }
              }
              for (var i in self.certTypeList) {
                if (self.certTypeList[i].id === Number($scope.formResult.certType)) {
                  self.certTypeVal = self.certTypeList[i];
                  break;
                }
              }
              for (var i in self.managerList) {
                if (self.managerList[i].id === Number($scope.formResult.managerID)) {
                  self.managerVal = self.managerList[i];
                  break;
                }
              }
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        self.getShopList();
      },
      showDatepickerStart: function() {
        laydate({
          elem: '#startDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
          }
        });
      },
      validateForm: function() {
        var canSubmit = true;
        // var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){2,}$/;
        var reg = /^(.){1,}$/;
        // var regPhone = /^1[3|4|5|8][0-9]{9}$/; //原本手机号校验规则
        var regPhone = /^1[0-9]{10}$/; //新手机号校验规则
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        var regNum = /^[0-9]{1,}$/;
        // Validte client's name
        if (!reg.test($("#name").val())) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        // Validte client's phone
        if (!regPhone.test($("#phone").val())) {
          $scope.valiResult.phoneError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.phoneError = false;
          canSubmit = canSubmit && true;
        }
        // Validte  sex
        if (!$("#sexSel").val()) {
          $scope.valiResult.sexError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.sexError = false;
          canSubmit = canSubmit && true;
        }
        // Validte  clientState
        if (!$("#clientStateSel").val()) {
          $scope.valiResult.clientStateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.clientStateError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent certType
        if (!$("#certTypeSel").val()) {
          $scope.valiResult.certTypeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.certTypeError = false;
          canSubmit = canSubmit && true;
        }
        // Validte intent certNumber
        if (!$("#certNumber").val()) {
          $scope.valiResult.certNumberError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.certNumberError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.id = $scope.param;
          $scope.formResult.certType = $scope.tblDetails.certTypeVal.id;
          $scope.formResult.sex = $scope.tblDetails.sexVal.id;
          $scope.formResult.state = $scope.tblDetails.clientStateVal.id;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '更新提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addOrUpdateUser', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '更新租客信息成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '更新租客信息失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
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
      checkPhoto: function(arg) {
        var imgSrc = '';
        switch (arg) {
          case 'FRONT':
            imgSrc = $scope.queryResult.certFrontUrl;
            break;
          case 'BACK':
            imgSrc = $scope.queryResult.certBackUrl;
            break;
        }
        $scope.modalPhoto.body.imgSrc = 'http://' + imgSrc;
        $("#myModalPhoto").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      certTypeList: certTypeList,
      sexList: sexList,
      clientStateList: clientStateList,
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
      nameError: false,
      phoneError: false,
    };

    $scope.tblDetails.getRentClientDetail();
  }])
  .controller('clientMngAddCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$sce', '$q', function($scope, $rootScope, $http, $timeout, $routeParams, $sce, $q) {
    $scope.title = "新增门禁卡";
    $scope.viewTag = 'ADD';
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '新增门禁卡',
      'url': '../../..' + window.location.pathname + '#/clientMng_addCard/' + $scope.param
    }, 'LV2');
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getShopList: function() {
        var self = this;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getDeviceList: function() {
        var self = this;
        // Get device list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopDevicesBKMgr?shopID=' + self.shopVal.id + '&pageSize=100&curPage=1')
          .success(function(ret) {
            console.log(ret);
            var list = ret.data.data;
            self.deviceList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.getShopList();
      },
      shopValChanged: function() {
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        self.getDeviceList();
      },
      deviceValChanged: function() {
        var self = this;
        if (!self.deviceVal) {
          self.deviceVal = {
            id: ''
          };
        }
        console.log(self.deviceVal);
        if (self.detectItem(self.deviceVal.id)) {
          self.chsnDevice.push({
            id: self.deviceVal.id,
            deviceName: self.deviceVal.deviceName,
            deviceCode: self.deviceVal.deviceCode,
          });
        }
        self.deviceVal = {
          id: ''
        };
        console.log(self.chsnDevice);
      },
      removeItem: function(id) {
        var self = this;
        for (var i in self.chsnDevice) {
          if (self.chsnDevice[i].id === id) {
            self.chsnDevice.splice(i, 1);
            return;
          }
        }
      },
      detectItem: function(id) {
        var self = this;
        if (!id) {
          return false;
        }
        for (var i in self.chsnDevice) {
          if (self.chsnDevice[i].id === id) {
            return false;
          }
        }
        return true;
      },
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
        // 不校验city
        if (false && (!$scope.tblDetails.cityVal || !$scope.tblDetails.cityVal.id)) {
          $scope.valiResult.cityError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.cityError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.tblDetails.shopVal || !$scope.tblDetails.shopVal.id) {
          $scope.valiResult.shopError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopError = false;
          canSubmit = canSubmit && true;
        }
        //
        if ($scope.tblDetails.chsnDevice.length === 0) {
          $scope.valiResult.deviceError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceError = false;
          canSubmit = canSubmit && true;
        }
        // if(!$scope.tblDetails.deviceVal || !$scope.tblDetails.deviceVal.id){
        //   $scope.valiResult.deviceError = true;
        //   canSubmit = false;
        // }else{
        //   $scope.valiResult.deviceError = false;
        //   canSubmit = canSubmit && true;
        // }
        //
        if (!$scope.formResult.uid || !regID.test($scope.formResult.uid)) {
          $scope.valiResult.uidError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.uidError = false;
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
          $scope.formResult.shopID = self.shopVal.id;
          var deviceCodesBuff = [];
          for (var i in self.chsnDevice) {
            deviceCodesBuff.push(self.chsnDevice[i].deviceCode);
          }
          $scope.formResult.deviceCodes = deviceCodesBuff.join(',');
          $scope.formResult.userID = $scope.param;
          // $scope.formResult.deviceCode = $scope.tblDetails.deviceVal.deviceCode;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '新增门禁卡提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addCardBKMgr', data)
              .success(function(ret) {
                if (ret.success) {
                  $scope.modalBasic.body.content = '成功！';
                  $scope.modalBasic.body.htmlContent = $sce.trustAsHtml('<span class="msgSuccess" style="font-size:12px;margin-top:20px;">' + ret.data + '</span>');
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续新增',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '';
                  $scope.modalBasic.body.htmlContent = $sce.trustAsHtml('失败！' +
                    ret.message +
                    '<p style="margin-top:10px;">' + (ret.message.indexOf('已被') !== -1 ? ' 是否删除再添加？' : '') + '</p>');
                  $scope.modalBasic.footer.btn = [{
                      "name": '否',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          // window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '是',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          $timeout(function() {
                            (self.delCard($scope.formResult.uid)).then(function(success) {
                              if (success) {
                                // 删除成功后，重新保存
                                self.save();
                              } else {
                                // 删除失败后，出现提示
                                $scope.modalBasic.header.content = '删除指定门禁卡提示';
                                $scope.modalBasic.body.content = '失败！';
                                $scope.modalBasic.footer.btn = [{
                                    "name": '返回',
                                    "styleList": ['btn', 'btn-cancel'],
                                    'func': function() {
                                      $("#myModal").off(); //先解绑所有事件
                                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                        window.history.go(-1);
                                      });
                                    }
                                  },
                                  {
                                    "name": '重新添加',
                                    "styleList": ['btn', 'btn-confirm'],
                                    'func': function() {
                                      $("#myModal").off(); //先解绑所有事件
                                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                        window.history.go(0);
                                      });
                                    }
                                  }
                                ];
                                $timeout(function() {
                                  $("#myModal").modal({
                                    show: true,
                                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                                  });
                                }, 10);
                              }
                            });
                          }, 50);
                        });
                      }
                    }
                  ];
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
      delCard: function(uid) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delCardBKMgr?uid=' + uid)
          .success(function(ret) {
            if (ret.success) {
              // 删除门禁卡成功
              deferred.resolve(true);
            } else {
              // 删除门禁卡失败
              deferred.resolve(false);
            }
          })
          .error(function(msg) {});
        return promise;
      },
      chsnDevice: [],
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
    $scope.tblDetails.getCityList();
    $scope.tblDetails.getShopList();
  }])
  .controller('clientMngEditCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$q', function($scope, $rootScope, $http, $timeout, $routeParams, $q) {
    $scope.title = "编辑门禁卡";
    $scope.viewTag = 'EDIT';
    $scope.param = $routeParams.param;
    // $scope.clientID = $routeParams.clientID;
    $rootScope.globalPath.initPath({
      'name': '编辑门禁卡',
      'url': '../../..' + window.location.pathname + '#/clientMng_addCard/' + $scope.param
    }, 'LV2');
    $scope.queryResult = {};
    $scope.formResult = {};
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.cityList = ret.data.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getShopList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.shopList = ret.data.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getDeviceList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get device list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopDevicesBKMgr?shopID=' + self.shopVal.id + '&pageSize=100&curPage=1')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var list = ret.data.data;
              self.deviceList = ret.data.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getCardDetails: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryCardDetailBKMgr?cdID=' + $scope.param + '&userType=1') //1--客户；2--管理员
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult = ret.data;
              $scope.formResult = {
                id: $scope.param,
                overDueDate: $scope.queryResult.overDueDate,
              };
              console.log($scope.formResult);
            }
          })
          .error(function(msg) {});
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.getShopList();
      },
      shopValChanged: function() {
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        self.getDeviceList();
      },
      deviceValChanged: function() {
        var self = this;
        if (!self.deviceVal) {
          self.deviceVal = {
            id: ''
          };
        }
      },
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
        console.log($scope.formResult.overDueDate);
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
          // 不需要cityID
          // $scope.formResult.cityID = $scope.tblDetails.cityVal.id;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '编辑门禁卡信息提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateCardByIDBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '修改门禁卡信息 成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '修改门禁卡信息 失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
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
      }
    };
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
      endDateError: false,
    };
    $scope.tblDetails.getCardDetails();
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/clientMng_index', {
        templateUrl: 'clientMng_index.html?t=' + getTimeStamp(),
        controller: 'clientMngIndex_ctrl',
        resolve: {
          myData: function() {
            return 'MYDATA';
          },
        }
      })
      .when('/clientMngIndexBack', {
        templateUrl: 'clientMng_indexBack.html?t=' + getTimeStamp(),
        controller: 'clientMngIndexBack_ctrl'
      })
      .when('/clientMng_intent/:param/:cityID/:shopID', { //意向客户列表
        templateUrl: 'clientMng_intent.html?t=' + getTimeStamp(),
        controller: 'clientMngIntent_ctrl'
      })
      .when('/clientMngIntentBack/:param/:cityID/:shopID', { //意向客户列表
        templateUrl: 'clientMng_intentBack.html?t=' + getTimeStamp(),
        controller: 'clientMngIntentBack_ctrl'
      })
      .when('/clientMng_addIntent', { //添加意向客户
        templateUrl: 'clientMng_addIntent.html?t=' + getTimeStamp(),
        controller: 'clientMngAddIntent_ctrl'
      })
      .when('/clientMng_editIntent/:param', { //编辑意向客户
        templateUrl: 'clientMng_addIntent.html?t=' + getTimeStamp(),
        controller: 'clientMngEditIntent_ctrl'
      })
      .when('/clientMng_queryIntent/:param', { //查询意向客户
        templateUrl: 'clientMng_queryIntent.html?t=' + getTimeStamp(),
        controller: 'clientMngQueryIntent_ctrl'
      })
      .when('/clientMng_queryRentClient/:param', {
        templateUrl: 'clientMng_queryRentClient.html?t=' + getTimeStamp(),
        controller: 'clientMngQueryRentClient_ctrl'
      })
      .when('/clientMng_editRentClient/:param', {
        templateUrl: 'clientMng_addRentClient.html?t=' + getTimeStamp(),
        controller: 'clientMngEditRentClient_ctrl'
      })
      .when('/clientMng_addCard/:param', {
        templateUrl: 'clientMng_addCard.html?t=' + getTimeStamp(),
        controller: 'clientMngAddCard_ctrl'
      })
      // .when('/clientMng_editCard/:param/:clientID', {
      .when('/clientMng_editCard/:param', {
        templateUrl: 'clientMng_addCard.html?t=' + getTimeStamp(),
        controller: 'clientMngEditCard_ctrl'
      })
      .otherwise({
        redirectTo: '/clientMng_index'
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
