angular.module('mngApp.marketPriceIndex', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_priceIndex', {
        templateUrl: 'marketMng_priceIndex.html?t=' + getTimeStamp(),
        controller: 'marketMngPriceIndex_ctrl'
      })
      .when('/marketMng_priceFixAdd', {
        templateUrl: 'marketMng_priceFix.html?t=' + getTimeStamp(),
        controller: 'marketMngPriceFixAdd_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_priceIndex'
      });
  }])
  .controller('marketMngPriceIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$q', 'itemNumList', 'promotionStateList', 'RememberSer', 'TblPagination', 'dateSer', function($scope, $rootScope, $http, $timeout, $route, $q, itemNumList, promotionStateList, RememberSer, TblPagination, dateSer) {
    $rootScope.globalPath.initPath({
      'name': '浮动定价管理',
      'url': '../../..' + window.location.pathname + '#/marketMng_priceIndex'
    }, 'LV1');
    $scope.isActive = 0;
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      setIsActive: function() {
        $scope.isActive = promotionStateList[1].id;
      },
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
      cityValChange: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          }
        }
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.promotionStateVal.id, 1);
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if (!self.promotionStateVal) {
          self.promotionStateVal = {
            id: ''
          }
        }
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.promotionStateVal.id, 1);
      },
      getActivitiesByTag: function(tag) {
        var self = this;
        $scope.isActive = tag;
        self.promotionStateVal.id = tag;
        console.log(self.promotionStateVal.id);
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.promotionStateVal.id, 1);
      },
      launchSearch: function() {
        var self = this;
        $scope.tblNormal.getInfoList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal, self.promotionStateVal.id, 1);
      },
      cityVal: {
        id: ''
      },
      itemNumList: itemNumList,
      promotionStateList: promotionStateList,
      promotionStateVal: promotionStateList[1],
      cityVal: {
        id: ''
      },
      searchVal: "",
      itemNumVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[0];

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
      getInfoList: function(cityID, pageSize, curPage, key, state, businessType) {
        var self = this;
        $http.post('http://' + $rootScope.globalURL.hostURL + '/api/getDynamicPricesBKMgr?cityID=' + cityID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&state=' + state)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            console.log(self.dataList);
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cancel: function(data) {
        var self = this;
        console.log(data);
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updateDynamicPriceBKMgr?id=' + data.id + '&name=' + data.name + '&remarks=' + data.remarks + '&startDate=' + data.startDate + '&endDate=' + dateSer.getNowDateStr();
          $scope.modalBasic.header.content = "提示";
          $scope.modalBasic.body.content = '您确定取消此活动吗？!';
          $scope.modalBasic.footer.btn = [{
            'name': '确定',
            'styleList': ['btn', 'btn-confirm'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                $http.get(url)
                .success(function(ret) {
                  // console.log(ret);
                  console.log('活动已结束');
                  if (ret.success) {
                    self.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, '', $scope.tblToolbar.promotionStateVal.id, 1);
                  } else {

                  }
                })
                .error(function(msg) {
                  /* Act on the event */
                  console.log('Fail! '+msg);
                });
              });
            }
          },{
            'name': '取消',
            'styleList': ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {

              })
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
      $scope.tblNormal.getInfoList(tblToolbar.cityVal.id, self.pageSize, pageNum, tblToolbar.searchVal, tblToolbar.promotionStateVal.id, 1);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal, $scope.tblToolbar.promotionStateVal.id, 1);
    } else {
      $scope.tblNormal.getInfoList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, 1, '', $scope.tblToolbar.promotionStateVal.id, 1);
    };
    $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.setIsActive()])
  }])
