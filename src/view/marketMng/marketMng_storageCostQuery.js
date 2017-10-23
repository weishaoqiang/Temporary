angular.module('mngApp.marketStorageCostQuery',['ngRoute'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
  // 获取当前的时间作为参数
  var getTimeStamp = function(){
    return Math.floor(Date.now()/1000);
  };
  $routeProvider.when('/marketMng_storageCostQuery',{
    templateUrl:'marketMng_storageCostQuery.html?t='+getTimeStamp(),
    controller: 'marketMngStorageCostQuery_ctrl'
  })
  .otherwise({
    redirectTo: '/marketMng_index'
  });
}])
.controller('marketMngStorageCostQuery_ctrl',['$rootScope','$scope','$q','$http',function($rootScope,$scope,$q,$http){
  $scope.globalPath.initPath({
    'name': '存储费用',
    'url': '../../..' + window.location.pathname + '#/marketMng_storageCostQuery/',
  }, 'LV1');
  $scope.tblNormal = {
    getAllStoreFee: function(){
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getAllStoreFeeBKMgr';
      // console.log(url);
      $http.get(url)
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.dataList = ret.data;
            console.log(self.dataList);
          }
        }).error(function(msg) {
          console.log("Fail! " + msg);
        });
    }
  }
  $q.all([$scope.tblNormal.getAllStoreFee()]);
}])
.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
