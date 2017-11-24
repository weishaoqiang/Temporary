angular.module('mngApp.marketVoucher', ['ngRoute'])
.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  // 获取当前的时间作为参数
  var getTimeStamp = function() {
    return Math.floor(Date.now() / 1000);
  };
  $routeProvider.when('/marketMng_voucher',{
      templateUrl: 'marketMng_voucher.html?t=' + getTimeStamp(),
      controller: 'marketMngVoucher_ctrl'
    })
    .when('/marketMng_voucher/:reload',{
        templateUrl: 'marketMng_voucher.html?t=' + getTimeStamp(),
        controller: 'marketMngVoucher_ctrl'
      })
    .otherwise({
      redirectTo: '/marketMng_index'
    });
}])
.controller('marketMngVoucher_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$route', '$q', 'itemNumList', 'couponsStateList', 'RememberSer', 'TblPagination', 'dateSer', function($scope, $rootScope, $http, $timeout, $routeParams, $route, $q, itemNumList, couponsStateList, RememberSer, TblPagination ,dateSer) {
  $rootScope.globalPath.initPath({
    'name': '抵用券管理',
    'url': '../../..' + window.location.pathname + '#/marketMng_voucher'
  }, 'LV1');
  $scope.pageType = 'REMPAGE';
  $scope.reload = $routeParams.reload;
  $scope.tblToolbar = {
    /* 自存仓数据 */
    getCityList: function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            // self.cityListPure = ret.data.data.slice(0);
            self.cityList = ret.data.data;
            console.log(self.cityList);
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    cityValChange: function(){
      var self = this;
      if(!self.cityVal){
        self.cityVal = {
          id: ''
        }
      }
      // self.getShopList(self.miniCityVal.id);
      $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.stateVal.id);
    },
    shopValChange: function(){
      var self = this;
      if(!self.miniShopVal){
        self.miniShopVal = {
          id: ''
        }
      }
      $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal, self.miniStateVal.id, 1);
    },
    stateValChange: function(){
      var self = this;
      if(!self.stateVal){
        self.stateVal = {
          id: ''
        }
      }
      $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.stateVal.id);
    },
    itemNumValChanged: function() {
      var self = this;
      if (!self.cityVal) {
        self.cityVal = {
          id: ''
        };
      }
      if(!self.stateVal){
        self.stateVal = {
          id: ''
        }
      }
      $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.stateVal.id);
    },
    launchSearch: function() {
      var self = this;
      // 清空城市id
      self.cityVal = {
        id: ''
      };
      self.stateVal = {
        id: ''
      }
      console.log(self.searchVal);
      $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal,self.stateVal.id);
    },
    itemNumList: itemNumList,
    stateList: couponsStateList,
    stateVal: {
      id:''
    },
    cityVal:{
      id: ''
    },
    searchVal: "",
    itemNumVal: itemNumList[0],
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
  $scope.tblNormal = {
    getInfoList: function(cityID, pageSize, curPage, key, state) {
      var self = this;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCouponsListBKMgr?cityID='+cityID +'&pageSize=' + pageSize + '&curPage=' + curPage + '&couponsID=' + key + '&state='+ state)
        .success(function(ret) {
          angular.forEach(ret.data.data,function(item,index){
            item.passDue = false;
            if((+new Date(item.endDate)) < (+new Date())){
              item.passDue = true;
            }
          })
          self.dataList = ret.data.data;
            console.log(self.dataList);
          // for(var i in $scope.tblNormal.dataList){
          //   if((+new Date($scope.tblNormal.dataList[i].endDate)) < (+new Date())){
          //     $scope.tblNormal.dataList[i].couponsState = '已过期';
          //     $scope.tblNormal.dataList[i].state = 3;
          //   }
          // }
          $scope.tblPagination.initPagination(ret);
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
    },
    deleteVoucher: function(couponsID){
      console.log(couponsID);
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/deleteCouponsBKMgr?couponsID='+couponsID;
      $scope.modalBasic.header.content = "提示";
      $scope.modalBasic.body.content = '您确定要删除此抵用券吗?';
      $scope.modalBasic.footer.btn = [{
        'name': '确定',
        'styleList': ['btn', 'btn-confirm'],
        'func': function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            // $scope.isActive = 3;
            $http.post(url)
            .success(function(ret){
              console.log(ret);
              if(ret.success){
                $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal, $scope.tblToolbar.stateVal.id);
              }else{
              }
            })
            .error(function(ret) {
              console.log('删除活动失败');
            });
          });
        }
      },{
        'name': '取消',
        'styleList': ['btn', 'btn-cancel'],
        'func': function(e){
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {})
        }
      }];
      $timeout(function() {
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      }, 0);
    },
    deleteAllDue: function(cityID){
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/deleteAllOverdateCouponsBKMgr?cityID='+cityID.id;
      $scope.modalBasic.header.content = "提示";
      if(cityID.id===''){
        $scope.modalBasic.body.content = '请选择需要操作的城市';
        $scope.modalBasic.footer.btn = [{
          'name': '确定',
          'styleList': ['btn', 'btn-confirm'],
          'func': function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {})
        }
        }]
      }else{
        $scope.modalBasic.body.content = '您确定要删除本城市所有过期的抵用券吗?';
        $scope.modalBasic.footer.btn = [{
          'name': '确定',
          'styleList': ['btn', 'btn-confirm'],
          'func': function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
              // $scope.isActive = 3;
              console.log(url);
              $http.post(url)
              .success(function(ret){
                console.log(ret);
                if(ret.success){
                  $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal, $scope.tblToolbar.stateVal.id);
                }else{
                }
              })
              .error(function(ret) {
                console.log('操作失败');
              });
            });
          }
        },{
          'name': '取消',
          'styleList': ['btn', 'btn-cancel'],
          'func': function(e){
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {})
          }
        }];
      }
      $timeout(function() {
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      }, 0);
    },
  };
  $scope.tblPagination = new TblPagination();
  $scope.tblPagination.hookAfterChangePage = function(pageNum) {
    var self = this;
    var tblToolbar = $scope.tblToolbar;
    $scope.tblNormal.getInfoList(tblToolbar.cityVal.id,self.pageSize, pageNum, tblToolbar.searchVal,tblToolbar.stateVal.id);
  };
  $q.all([$scope.tblToolbar.getCityList()])
  .then(function(flagBuf) {
    var flag = true;
    for (var i in flagBuf) {
      flag &= flagBuf[i];
    }
    if (flag) {
      if (RememberSer.restore($scope)&&($scope.reload !== 'reload')) {
        // 恢复页面
        console.log('有缓存===========================');
        $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal,  $scope.tblToolbar.stateVal.id);
      } else {
        console.log('没缓存===========================');
        $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1,  '',  $scope.tblToolbar.stateVal.id);
      }
    }
  })
}])
