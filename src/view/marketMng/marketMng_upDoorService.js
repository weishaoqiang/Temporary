angular.module('mngApp.marketUpDoorService', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_upDoorService', {
        templateUrl: 'marketMng_upDoorService.html?t=' + getTimeStamp(),
        controller: 'marketMngUpDoorService_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_upDoorService'
      });
  }])
  .controller('marketMngUpDoorService_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', '$route', 'itemNumList', 'RememberSer', 'TblPagination', 'promotionStateList', 'dateSer', function($scope, $rootScope, $http, $timeout, $q, $route, itemNumList, RememberSer, TblPagination, promotionStateList, dateSer ) {
    $rootScope.globalPath.initPath({
      'name': '上门搬存定价',
      'url': '../../..' + window.location.pathname + '#/marketMng_upDoorService'
    }, 'LV1');
    $scope.pageType = "REMPAGE";
    // $scope.remCfg = [
    //   'tblToolbar',
    //   'tblNormal',
    //   'tblPagination',
    // ];
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
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.promotionStateVal.id, '');
      },
      promotionStateValChange: function(){
        var self = this;
        if(!self.promotionStateVal){
          self.promotionStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.promotionStateVal.id, '');
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if(!self.promotionStateVal){
          self.promotionStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.promotionStateVal.id, '');
      },
      launchSearch: function() {
        var self = this;
        self.cityVal = {
            id: ''
          }
        self.promotionStateVal = {
            id: ''
          }
        $scope.tblNormal.getInfoList('', self.itemNumVal.id, 1, '', self.searchVal);
      },
      itemNumList: itemNumList,
      searchVal: "",
      itemNumVal: itemNumList[0],
      cityVal: {
        id: ''
      },
      promotionStateList: promotionStateList,
      promotionStateVal: promotionStateList[1],
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

    $scope.tblNormal = {
      /**
       * [查询城市上门搬存价格]
       * @return {[type]} [description]
       */
      getAllStoreFee: function(){
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getAllStoreFeeBKMgr';
        // console.log(url);
        $http.get(url)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.upDoorPriceList = ret.data;
              console.log(self.upDoorPriceList);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      /**
       * [获取上门搬存活动列表]
       * @param  {[type]} cityID   [description]
       * @param  {[type]} pageSize [description]
       * @param  {[type]} curPage  [description]
       * @param  {[type]} state    [description]
       * @param  {[type]} key      [description]
       * @return {[type]}          [description]
       */
      getInfoList: function(cityID, pageSize, curPage, state, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPromotionListBKMgr?cityID='+ cityID +'&pageSize=' + pageSize + '&curPage=' + curPage +'&state='+ state +'&businessType=2&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            for(var i=0; i < self.dataList.length; i++){
              self.dataList[i].rule = JSON.parse(self.dataList[i].rule);
            }
            console.log(self.dataList);
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cancel: function(data) {
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updatePromotionBKMgr?rule='+ data.rule +'&discountType='+ data.discountType +'&id='+ data.id +'&name='+ data.name +'&remarks='+ data.remarks +'&startDate='+ data.startDate +'&endDate='+ dateSer.getNowDateStr()+ '&state' + data.state;
        // console.log(url);

        $scope.modalBasic.header.content = "提示";
        $scope.modalBasic.body.content = '您确定结束该活动？';
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
                  self.getInfoList($scope.tblToolbar.cityVal.id,$scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.promotionStateVal.id, '');
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
      deletePromotion: function(id){
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
                  self.getInfoList($scope.tblToolbar.cityVal.id,$scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.promotionStateVal.id, '');
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

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, pageNum, $scope.tblToolbar.promotionStateVal.id, $scope.tblToolbar.searchVal);
    };
    // ,$scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.promotionStateVal.id, '')
    $scope.tblNormal.getAllStoreFee()
    $q.all([$scope.tblToolbar.getCityList()])
    .then(function(flagBuf) {
      console.log(flagBuf);
      var flag = true;
      for (var i in flagBuf) {
        flag &= flagBuf[i];
      }
      if (flag) {
        if (RememberSer.restore($scope)) {
          console.log('有缓存===========================');
          // 恢复页面
          console.log($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.promotionStateVal.id, $scope.tblToolbar.searchVal);
          $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.promotionStateVal.id, $scope.tblToolbar.searchVal);
        } else {
          console.log('无缓存===========================');
          $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.promotionStateVal.id, '');
        }
      }
    });
  }])
