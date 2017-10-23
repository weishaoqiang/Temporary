angular.module('mngApp.expensesDetails',['ngRoute'])
.controller('financeMngExpensesDetails_ctrl',['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', '$location', '$window', function($scope, $rootScope, $routeParams, $http,$timeout, $q, $location, $window){
  $scope.id = $routeParams.id;
  $scope.globalPath.initPath({
    'name': '支出详情',
    'url': '../../..' + window.location.pathname + '#/financeMng_expensesDetails/' + $scope.id
  }, 'LV2');
  $scope.tblNormal = {
    getExpensesDetails: function(id){
      var self = this;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getExpenseDetailBKMgr?ID=' + id)
        .success(function(ret) {
          console.log(ret);
          self.expensesDetails = ret.data;
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
    },
    back: function(){
      $window.location.href = "#/financeMng_expensesList";
    }
  }
  $q.all([$scope.tblNormal.getExpensesDetails($scope.id)])
}])
