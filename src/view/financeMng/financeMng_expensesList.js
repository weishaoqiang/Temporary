angular.module('mngApp.expensesList', [])
.controller('financeMngExpensesList_ctrl',['$scope','$rootScope','$routeParams','$http','$timeout','$q','itemNumList','RememberSer','TblPagination',function($scope,$rootScope,$routeParams,$http,$timeout,$q,itemNumList,RememberSer,TblPagination){
  $scope.globalPath.initPath({
    'name': '支出管理',
    'url': '../../..' + window.location.pathname + '#/financeMng_expensesList'
  }, 'LV1');
  $scope.pageType = 'REMPAGE';
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
  $scope.tblToolbar = {
    getCityList: function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          //console.log(ret);
          if (ret.success) {
            ret.data.data.unshift({
              id: 0,
              name: '万物仓'
            });
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
    // 获取门店
    getShopList: function(cityID,keyword) {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + cityID +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate&key='+keyword)
        .success(function(ret) {
          if (ret.success) {
            self.shopList = ret.data.data;
            self.shopList.unshift({
              id: '',
              name: '- 所有门店 -'
            })
            console.log(self.shopList);
            if(!!self.shopVal){
              angular.forEach(self.shopList,function(item){
                if(item.id === self.shopVal.id){
                  self.shopName = item.name;
                }
              })
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
    searchShops: function(keyword){
      var self = this;
      self.getShopList(self.cityVal.id,keyword)
    },
    // 城市值变化
    cityValChanged: function() {
      var self = this;
      if (!self.cityVal) {
        self.cityVal = {
          id: '',
        }
      }
      self.shopVal.id = '';
      self.shopName = '';
      self.getShopList(self.cityVal.id,'');
      // console.log(self.cityVal.id);
      $scope.tblNormal.getExpensesList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
    },
    // 门店之变化
    shopValChanged: function(id,name) {
      var self = this;
      if (!self.shopVal) {
        self.shopVal = {
          id: '',
        }
      }
      console.log(id,name);
      // console.log(self.shopVal.id);
      self.shopVal.id = id;
      self.shopName = name;
      $scope.tblNormal.getExpensesList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
    },
    itemNumValChanged: function() {
      var self = this;
      if (!self.itemNumVal) {
        self.itemNumVal = {
          id: '',
        }
      }
      $scope.tblNormal.getExpensesList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
    },
    launchSearch: function() {
      var self = this;
      $scope.tblNormal.getExpensesList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, self.searchVal);
    },
    cityList: '',
    cityVal: {
      id: ''
    },
    shopList: '',
    shopVal: {
      id: '',
    },
    itemNumList: itemNumList,
    itemNumVal: itemNumList[1],
    searchVal: "",
    keyword: "",
    shopName: '',
  }
  $scope.tblNormal = {
    // 获取未确认订单
    getExpensesList: function(cityID, shopID, pageSize, curPage, key) {
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getExpenseListBKMgr?cityID=' + cityID + '&shopID=' + shopID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key;
      console.log($scope.tblToolbar.shopList);
      $http.post(url)
        .success(function(ret) {
          if (ret.success) {
            self.dataList = ret.data.data;
            console.log(self.dataList);
            $scope.tblPagination.initPagination(ret);
          }
        }).error(function(msg) {
          console.log("Fail! " + msg);
        });
    },
    deleteItem: function(id){
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/deleteExpenseBKMgr?ID='+id;
      $scope.modalBasic.header.content = "提示";
      $scope.modalBasic.body.content = '您确定要删除此支出吗？';
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
              console.log('删除支出成功');
              if(ret.success){
                $scope.tblNormal.getExpensesList(
                  $scope.tblToolbar.cityVal.id,
                  $scope.tblToolbar.shopVal.id,
                  $scope.tblToolbar.itemNumVal.id,
                  $scope.tblPagination.curPage,'');
              }else{
              }
            })
            .error(function(ret) {
              console.log('删除支出失败');
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
  }
  $scope.tblPagination = new TblPagination();
  $scope.tblPagination.hookAfterChangePage = function(pageNum){
    var self = this;
    var tblToolbar = $scope.tblToolbar;
    $scope.tblNormal.getExpensesList(tblToolbar.cityVal.id, tblToolbar.shopVal.id, tblToolbar.itemNumVal.id, pageNum,  tblToolbar.searchVal);
  }
  $q.all([$scope.tblToolbar.getCityList()])
  .then(function(flagBuf) {
    var flag = true;
    for (var i in flagBuf) {
      flag &= flagBuf[i];
    }
    if (flag) {
      if (RememberSer.restore($scope)) {
        $scope.tblNormal.getExpensesList(
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.shopVal.id,
          $scope.tblToolbar.itemNumVal.id,
          $scope.tblPagination.curPage,'');
        $scope.tblToolbar.getShopList($scope.tblToolbar.cityVal.id,'')
      } else {
        $scope.tblNormal.getExpensesList('', '', $scope.tblToolbar.itemNumVal.id, 1, '');
        $scope.tblToolbar.getShopList($scope.tblToolbar.cityVal.id,'')
      }
    }
  });
}])
