angular.module('mngApp.marketMiniUnit', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_index', {
        templateUrl: 'marketMng_index.html?t=' + getTimeStamp(),
        controller: 'marketMngIndex_ctrl'
      })
      .when('/marketMng_storageCostAdd',{
        templateUrl: 'marketMng_storageCostAdd.html?t=' + getTimeStamp(),
        controller: 'marketMngStorageCostAdd_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_index'
      });
  }])
  .controller('marketMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$q', 'itemNumList', 'promotionStateList', 'RememberSer', 'TblPagination', 'dateSer', function($scope, $rootScope, $http, $timeout, $route, $q, itemNumList, promotionStateList, RememberSer, TblPagination ,dateSer) {
    $rootScope.globalPath.initPath({
      'name': '自存仓定价',
      'url': '../../..' + window.location.pathname + '#/marketMng_index'
    }, 'LV1');
    $scope.pageType = 'REMINDEXPAGE';
    $scope.remCfg = [
      'tblToolbar',
      'tblNormal',
      'miniPagination',
      'priceFixPagination',
    ];
    $scope.tblToolbar = {
      /* 自存仓数据 */
      miniGetCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              // self.cityListPure = ret.data.data.slice(0);
              self.miniCityList = ret.data.data;
              console.log(self.miniCityList);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      miniGetShopList: function(cityID) {
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
              self.miniShopList = ret.data.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      miniCityValChange: function(){
        var self = this;
        if(!self.miniCityVal){
          self.miniCityVal = {
            id: ''
          }
        }
        self.miniGetShopList(self.miniCityVal.id);
        $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal, self.miniStateVal.id, 1);
      },
      miniShopValChange: function(){
        var self = this;
        if(!self.miniShopVal){
          self.miniShopVal = {
            id: ''
          }
        }
        $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal, self.miniStateVal.id, 1);
      },
      miniStateValChange: function(){
        var self = this;
        if(!self.miniStateVal){
          self.miniStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal, self.miniStateVal.id, 1);
      },
      miniItemNumValChanged: function() {
        var self = this;
        if (!self.miniCityVal) {
          self.miniCityVal = {
            id: ''
          };
        }
        if(!self.miniStateVal){
          self.miniStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal,  self.miniStateVal.id, 1);
      },
      miniLaunchSearch: function() {
        var self = this;
        // 清空城市id
        self.miniCityVal = {
          id: ''
        };
        self.miniStateVal = {
          id: ''
        }
        $scope.tblNormal.miniGetInfoList(self.miniCityVal.id, self.miniShopVal.id, self.miniItemNumVal.id, 1, self.miniSearchVal,self.miniStateVal.id,1);
      },
      miniItemNumList: itemNumList,
      miniStateList: promotionStateList,
      miniStateVal: promotionStateList[1],
      miniCityVal:{
        id: ''
      },
      miniShopVal:{
        id: ''
      },
      miniSearchVal: "",
      miniItemNumVal: itemNumList[0],

      /* 浮动定价 */
      priceFixGetCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              // self.cityListPure = ret.data.data.slice(0);
              self.priceFixCityList = ret.data.data;
              console.log(self.priceFixCityList);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      priceFixGetShopList: function(cityID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list by cityID
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + cityID +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            if (ret.success) {
              self.priceFixShopList = ret.data.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      priceFixCityValChange: function(){
        var self = this;
        if(!self.priceFixCityVal){
          self.priceFixCityVal = {
            id: ''
          }
        }
        self.priceFixGetShopList(self.priceFixCityVal.id);
        $scope.tblNormal.priceFixGetInfoList(self.priceFixCityVal.id, self.priceFixShopVal.id, self.priceFixItemNumVal.id, 1, self.priceFixSearchVal, self.priceFixStateVal.id, 1);
      },
      priceFixShopValChange: function(){
        var self = this;
        if(!self.priceFixShopVal){
          self.priceFixShopVal = {
            id: ''
          }
        }
        $scope.tblNormal.priceFixGetInfoList(self.priceFixCityVal.id, self.priceFixShopVal.id, self.priceFixItemNumVal.id, 1, self.priceFixSearchVal, self.priceFixStateVal.id, 1);
      },
      priceFixStateValChange: function(){
        var self = this;
        if(!self.priceFixStateVal){
          self.priceFixStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.priceFixGetInfoList(self.priceFixCityVal.id, self.priceFixShopVal.id, self.priceFixItemNumVal.id, 1, self.priceFixSearchVal, self.priceFixStateVal.id, 1);
      },
      priceFixItemNumValChanged: function() {
        var self = this;
        if (!self.priceFixCityVal) {
          self.priceFixCityVal = {
            id: ''
          };
        }
        if(!self.priceFixStateVal){
          self.priceFixStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.priceFixGetInfoList(self.priceFixCityVal.id, self.priceFixShopVal.id, self.priceFixItemNumVal.id, 1, self.priceFixSearchVal,  self.priceFixStateVal.id, 1);
      },
      priceFixLaunchSearch: function() {
        var self = this;
        // 清空城市id
        self.priceFixCityVal = {
          id: ''
        };
        self.priceFixStateVal = {
          id: ''
        }
        $scope.tblNormal.priceFixGetInfoList(self.priceFixCityVal.id,self.priceFixShopVal.id,self.priceFixItemNumVal.id, 1, self.priceFixSearchVal,self.priceFixStateVal.id,1);
      },
      priceFixItemNumList: itemNumList,
      priceFixStateList: promotionStateList,
      priceFixStateVal: promotionStateList[1],
      priceFixCityVal:{
        id: ''
      },
      priceFixShopVal:{
        id: ''
      },
      priceFixSearchVal: "",
      priceFixItemNumVal: itemNumList[0],
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
      miniGetInfoList: function(cityID, shopID, pageSize, curPage, key, state, businessType) {
        var self = this;
        $http.post('http://' + $rootScope.globalURL.hostURL + '/api/getPromotionListBKMgr?cityID='+cityID +'&shopID='+ shopID +'&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&state='+ state +'&businessType=' + businessType)
          .success(function(ret) {
            // console.log(ret);
            self.miniDataList = ret.data.data;
            for(var i=0; i < self.miniDataList.length; i++){
              self.miniDataList[i].rule = JSON.parse(self.miniDataList[i].rule);
            }
            console.log(self.miniDataList);
            $scope.miniPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      priceFixGetInfoList: function(cityID, shopID, pageSize, curPage, key, state) {
        var self = this;
        $http.post('http://' + $rootScope.globalURL.hostURL + '/api/getDynamicPricesBKMgr?cityID='+cityID +'&shopID='+ shopID +'&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&state='+ state)
          .success(function(ret) {
            // console.log(ret);
            self.priceFixDataList = ret.data.data;
            console.log(self.priceFixDataList);
            for(var i=0; i < self.priceFixDataList.length; i++){
              self.priceFixDataList[i].rules = JSON.parse(self.priceFixDataList[i].rules);
            }
            // console.log(self.priceFixDataList);
            $scope.priceFixPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      deleteMiniPromotion: function(id){
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/deletePromotionBKMgr?promotionID='+id;
        $scope.modalBasic.header.content = "提示";
        $scope.modalBasic.body.content = '您确定删除该活动吗?';
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
                console.log('活动已结束');
                if(ret.success){
                  $scope.tblNormal.miniGetInfoList($scope.tblToolbar.miniCityVal.id,$scope.tblToolbar.miniShopVal.id, $scope.tblToolbar.miniItemNumVal.id, 1,  $scope.tblToolbar.miniSearchVal,  $scope.tblToolbar.miniStateVal.id, 1);
                }else{
                }
              })
              .error(function(ret) {
                console.log('结束活动失败');
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
      deletepriceFixPromotion: function(id){
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/deleteDynamicPriceBKMgr?dynamicPriceID='+id;
        $scope.modalBasic.header.content = "提示";
        $scope.modalBasic.body.content = '您确定删除该活动吗?';
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
                console.log('活动已结束');
                if(ret.success){
                  self.priceFixGetInfoList($scope.tblToolbar.priceFixCityVal.id,$scope.tblToolbar.priceFixShopVal.id,$scope.tblToolbar.priceFixItemNumVal.id, 1, $scope.tblToolbar.priceFixSearchVal, $scope.tblToolbar.priceFixStateVal.id,1);
                }else{
                }
              })
              .error(function(ret) {
                console.log('结束活动失败');
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
    };
    $scope.miniPagination = new TblPagination();
    $scope.priceFixPagination = new TblPagination();
    $scope.miniPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.miniGetInfoList(tblToolbar.miniCityVal.id,tblToolbar.miniShopVal.id,self.pageSize, pageNum, tblToolbar.miniSearchVal,tblToolbar.miniStateVal.id,1);
    };
    $scope.priceFixPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.priceFixGetInfoList(tblToolbar.priceFixCityVal.id,tblToolbar.priceFixShopVal.id,self.pageSize, pageNum, tblToolbar.priceFixSearchVal,tblToolbar.priceFixStateVal.id,1);
    };
    $q.all([$scope.tblToolbar.miniGetCityList(),$scope.tblToolbar.priceFixGetCityList(),$scope.tblToolbar.miniGetShopList(''),$scope.tblToolbar.priceFixGetShopList('')])
    .then(function(flagBuf) {
      var flag = true;
      for (var i in flagBuf) {
        flag &= flagBuf[i];
      }
      if (flag) {
        if (RememberSer.restore($scope)) {
          // 恢复页面
          console.log('有缓存===========================');
          $scope.tblNormal.miniGetInfoList($scope.tblToolbar.miniCityVal.id, $scope.tblToolbar.miniShopVal.id, $scope.tblToolbar.miniItemNumVal.id, $scope.miniPagination.curPage, $scope.tblToolbar.miniSearchVal,  $scope.tblToolbar.miniStateVal.id, 1);
          $scope.tblNormal.priceFixGetInfoList($scope.tblToolbar.priceFixCityVal.id,$scope.tblToolbar.priceFixShopVal.id,$scope.tblToolbar.priceFixItemNumVal.id, $scope.priceFixPagination.curPage, $scope.tblToolbar.priceFixSearchVal, $scope.tblToolbar.priceFixStateVal.id,1);
        } else {
          console.log('没缓存===========================');
          $scope.tblNormal.miniGetInfoList($scope.tblToolbar.miniCityVal.id, $scope.tblToolbar.miniShopVal.id, $scope.tblToolbar.miniItemNumVal.id, 1,  '',  $scope.tblToolbar.miniStateVal.id, 1);
          $scope.tblNormal.priceFixGetInfoList($scope.tblToolbar.priceFixCityVal.id,$scope.tblToolbar.priceFixShopVal.id,$scope.tblToolbar.priceFixItemNumVal.id, 1, '', $scope.tblToolbar.priceFixStateVal.id,1);
        }
      }
    });
  }])
