angular.module('mngApp.facilityMngSmoke', ['ngRoute'])
.controller('facilityMngSmoke_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q','$route', 'itemNumList', 'guardDeviceStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $q, $route, itemNumList, guardDeviceStateList, RememberSer, TblPagination) {
  $rootScope.globalPath.initPath({
    'name': '烟感设备',
    'url': '../../..' + window.location.pathname + '#/facilityMng_smoke'
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
    // 获取门店
    getShopList: function(cityID) {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get shops list by cityID
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + cityID +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
        .success(function(ret) {
          if (ret.success) {
            console.log(ret);
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
    whenValChanged: function() {
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

      // if (!self.stateVal) {
      //   self.stateVal = {
      //     id: ''
      //   };
      // }
      $scope.tblNormal.getSmokeList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
    },
    cityValChanged: function() {
      var self = this;
      if(!self.cityVal) {
        self.cityVal = {
          id: '',
        }
      }
      self.getShopList(self.cityVal.id)
      this.whenValChanged();
    },
    shopValChanged: function() {
      this.whenValChanged();
    },
    // stateValChanged: function() {
    //   this.whenValChanged();
    // },
    itemNumValChanged: function() {
      this.whenValChanged();
    },
    launchSearch: function() {
      this.whenValChanged();
    },
    itemNumList: itemNumList,
    // guardDeviceStateList: guardDeviceStateList.slice(0, -1).reverse(),
    cityVal: {
      id: ''
    },
    shopVal: {
      id: ''
    },
    // stateVal: {
    //   id: ''
    // },
    searchVal: "",
  };
  $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
  // $scope.tblToolbar.getCityList();
  // $scope.tblToolbar.getShopList('');

  $scope.tblNormal = {
    getSmokeList: function(cityID, shopID, pageSize, curPage, key) {
      var self = this;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getSmokeListOfDeviceBKMgr?cityID=' + cityID + '&shopID=' + shopID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
        .success(function(ret) {
          console.log(ret);
          self.dataList = ret.data.data;
          $scope.tblPagination.initPagination(ret);
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
    },
    // skipToEdit: function() {
    //   window.sessionStorage.setItem('skipSource', 'facilityMngGuard_ctrl');
    // },
    delete: function(id){
      $scope.modalBasic.header.content = '提示';
      $scope.modalBasic.body.content = '您确定要删除这个设备吗？';
      $scope.modalBasic.footer.btn[1].name = '确定';
      $scope.modalBasic.footer.btn[1].func = function() {
        $("#myModal").off(); //先解绑所有事件
        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteSmokeBKMgr?id='+id)
          .success(function(ret){
            window.history.go(0);
          })
        });
      };
      $scope.modalBasic.footer.btn[0].name = '取消';
      $scope.modalBasic.footer.btn[0].func = function() {
        $("#myModal").off(); //先解绑所有事件
        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
        });
      };
      $timeout(function() {
        $("#myModal").modal({
          'show': true,
          'backdrop': 'static' //点击周围区域时不会隐藏模态框
        });
      }, 0);
    },
    // unlockGuard: function(deviceCode) {
    //   var self = this;
    //   $http.get('http://' + $rootScope.globalURL.hostURL + '/api/openLLDoorBKMgr?SN=' + deviceCode)
    //     .success(function(ret) {
    //       $scope.modalBasic.header.content = '开锁提示';
    //       $scope.modalBasic.body.contentType = 'text';
    //       if (ret.success) {
    //         $scope.modalBasic.body.content = '开锁成功！';
    //         $scope.modalBasic.footer.btn = [{
    //           styleList: ['btn', 'btn-confirm'],
    //         }];
    //         $scope.modalBasic.footer.btn[0].name = '完成';
    //         $scope.modalBasic.footer.btn[0].func = function() {
    //           $("#myModal").off(); //先解绑所有事件
    //           $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
    //         };
    //       } else {
    //         $scope.modalBasic.body.content = '开锁失败！';
    //         $scope.modalBasic.footer.btn = [{
    //           styleList: ['btn', 'btn-cancel'],
    //         }];
    //         $scope.modalBasic.footer.btn[0].name = '返回';
    //         $scope.modalBasic.footer.btn[0].func = function() {
    //           $("#myModal").off(); //先解绑所有事件
    //           $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
    //         };
    //       }
    //       $timeout(function() {
    //         $("#myModal").modal({
    //           show: true,
    //           backdrop: 'static' //点击周围区域时不会隐藏模态框
    //         });
    //       }, 10);
    //     })
    //     .error(function(msg) {});
    // }
  };

  $scope.modalBasic = {
    "header": {
      "content": ''
    },
    "body": {
      "content": ''
    },
    "footer": {
      "btn": [{
          styleList: ['btn', 'btn-cancel'],
        },
        {
          styleList: ['btn', 'btn-confirm'],
        }
      ]
    }
  };

  $scope.tblPagination = new TblPagination();
  $scope.tblPagination.hookAfterChangePage = function(pageNum) {
    var self = this;
    var tblToolbar = $scope.tblToolbar;
    $scope.tblNormal.getSmokeList(tblToolbar.cityVal.id, tblToolbar.shopVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
  };
  $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.getShopList('')])
  .then(function(){
    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getSmokeList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.shopVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getSmokeList('', '', $scope.tblToolbar.itemNumVal.id, 1, '');
    }
  })
}])
