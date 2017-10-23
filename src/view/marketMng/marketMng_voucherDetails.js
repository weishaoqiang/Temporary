angular.module('mngApp.marketVoucherDetails',['ngRoute'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
  var getTimeStamp = function(){
    return Math.floor(Date.now()/1000);
  };
  $routeProvider.when('/marketMng_voucherDetails/:id',{
    templateUrl: 'marketMng_voucherDetails.html?t=' + getTimeStamp(),
    controller: 'marketMngVoucherDetails_ctrl'
  })
  .otherwise({
    redirectTo: '/marketMng_index'
  })
}])
.controller('marketMngVoucherDetails_ctrl',['$rootScope','$scope','$q','$routeParams', '$http', 'discountRuleList', 'dateSer', '$timeout', function($rootScope,$scope,$q,$routeParams,$http,discountRuleList,dateSer,$timeout){
  $rootScope.globalPath.initPath({
    'name': '抵用券详情',
    'url': '../../..' + window.location.pathname + '#/marketMng_voucherDetails/'+$routeParams.id
  }, 'LV2');
  $scope.title = "抵用券详情";
  $scope.id = $routeParams.id;
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
  };
  $scope.passDue = false;
  $scope.tblNormal = {
    getVoucherDetails: function(id){
      console.log(id);
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get miniDetals data
      $http.post('http://' + $rootScope.globalURL.hostURL + '/api/getCouponsDetailsBKMgr?couponsID='+id)
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.voucherDetails = ret.data;
            // self.voucherDetails.rule = JSON.parse(ret.data.rule);
            if((+new Date(ret.data.endDate)) < +new Date()){
              $scope.passDue = true;
            }
            self.voucherDetails.startDate = ret.data.startDate.slice(0,10);
            self.voucherDetails.endDate = ret.data.endDate.slice(0,10);
            // self.voucherDetails.objs = (self.voucherDetails.objs.split(',')).join('，');
            // console.log(self.voucherDetails);
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    back: function(){
      window.location.href = '#/marketMng_voucher';
    },
  };
  $q.all([$scope.tblNormal.getVoucherDetails($scope.id)]);
}])
.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
