angular.module('mngApp.marketStorageCostEdit',['ngRoute'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
  // 获取当前的时间作为参数
  var getTimeStamp = function(){
    return Math.floor(Date.now()/1000);
  };
  $routeProvider.when('/marketMng_storageCostEdit',{
    templateUrl:'marketMng_storageCostEdit.html?t='+getTimeStamp(),
    controller: 'marketMngStorageCostEdit_ctrl'
  })
  .otherwise({
    redirectTo: '/marketMng_index'
  });
}])
.controller('marketMngStorageCostEdit_ctrl',['$rootScope','$scope','$q','$timeout','$http',function($rootScope,$scope,$q,$timeout,$http){
  $scope.globalPath.initPath({
    'name': '编辑存储标准单价',
    'url': '../../..' + window.location.pathname + '#/marketMng_storageCostEdit/',
  }, 'LV2');
  $scope.formResult = [];
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
    setUpdateData: function(item){
      var self = this;
      if(self.valiForm()){
        for(var oldItem in $scope.formResult){
          if($scope.formResult[oldItem].id === item.id){
            $scope.formResult[oldItem].storeFee = Number(item.storeFee);
          }
        }
      }
      console.log($scope.formResult);
    },
    getAllStoreFee: function(){
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getAllStoreFeeBKMgr';
      // console.log(url);
      $http.get(url)
        .success(function(ret) {
          if (ret.success) {
            $scope.formResult = ret.data;
            for(var j in $scope.formResult){
              $scope.formResult[j].storeFeeError = false;
            }
          }
        }).error(function(msg) {
          console.log("Fail! " + msg);
        });
    },
    valiForm: function(){
      var canSubmit = true;
      var regRealNum = /^([1-9][0-9]*)$/;
      for(var checkItem in $scope.formResult){
        if (!regRealNum.test($scope.formResult[checkItem].storeFee)) {
          canSubmit = false;
          $scope.formResult[checkItem].storeFeeError = true;
        } else {
          canSubmit = canSubmit && true;
          $scope.formResult[checkItem].storeFeeError = false;
        }
      }
      return canSubmit;
    },
    save: function(){
      var self = this;
      if(self.valiForm()){
        // updateBatchStoreFeeBKMgr
        var formmate = {};
        for(var i in $scope.formResult){
        formmate['storeFreeList['+i+'].id'] = $scope.formResult[i].id;
        formmate['storeFreeList['+i+'].cityID'] = $scope.formResult[i].cityID;
        formmate['storeFreeList['+i+'].storeFee'] = $scope.formResult[i].storeFee;
        }
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updateBatchStoreFeeBKMgr';
        var data = $.param(formmate);
        $http.post(url,data)
        .success(function(ret) {
            console.log(ret);
            $scope.modalBasic.header.content = '提示';
            if (ret.success) {
              $scope.modalBasic.body.content = '修改成功!';
              $scope.modalBasic.footer.btn = [{
                'name': '确定',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                }
              }]
            } else {
              $scope.modalBasic.body.content = '修改失败! ' + ret.message;
              $scope.modalBasic.footer.btn = [{
                'name': '确定',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                }
              }]
            }
            $timeout(function() {
              $("#myModal").modal({
                show: true,
                backdrop: 'static' //点击周围区域时不会隐藏模态框
              });
            }, 0);
          }).error(function(msg) {
        });
      }
    },
    cancel: function() {
      window.history.go(-1);
    }
  },
  $q.all([$scope.tblNormal.getAllStoreFee()]);
}])
.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
