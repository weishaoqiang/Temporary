angular.module('mngApp.marketMiniDetails',['ngRoute'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
  var getTimeStamp = function(){
    return Math.floor(Date.now()/1000);
  };
  $routeProvider.when('/marketMng_miniDetails/:id/:businessType',{
    templateUrl: 'marketMng_miniDetails.html?t=' + getTimeStamp(),
    controller: 'marketMngMiniDetails_ctrl'
  })
  .otherwise({
    redirectTo: '/marketMng_index'
  })
}])
.controller('marketMngMiniDetails_ctrl',['$rootScope','$scope','$q','$routeParams', '$http', 'discountRuleList', 'dateSer','$timeout', function($rootScope,$scope,$q,$routeParams,$http,discountRuleList,dateSer,$timeout){
  $rootScope.globalPath.initPath({
    'name': '活动详情',
    'url': '../../..' + window.location.pathname + '#/marketMng_miniDetails/'+$routeParams.id + '/'+ $routeParams.businessType
  }, 'LV2');
  $scope.title = "活动详情";
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
  $scope.businessType = $routeParams.businessType;
  // $scope.tblToolbar = {
  //   getPromotionShopList: function(){
  //     var self = this;
  //     var deferred = $q.defer();
  //     var promise = deferred.promise;
  //     // Get cities list
  //     $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getNotInPromotionNameBKMgr?type=1&pageSize=10000&curPage=1&isAll=0&cityID=')
  //       .success(function(ret) {
  //         console.log(ret);
  //         if (ret.success) {
  //           // self.cityListPure = ret.data.data.slice(0);
  //           self.promotionShopList = ret.data.data;
  //           console.log(self.promotionShopList);
  //           deferred.resolve(true);
  //         } else {
  //           deferred.resolve(false);
  //         }
  //       }).error(function(msg) {
  //         console.log("Fail! Messgae is: " + msg);
  //       });
  //     return promise;
  //   },
  // };
  $scope.tblNormal = {
    getMiniDetails: function(id,businessType){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get miniDetals data
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPromotionBKMgr?id='+id+'&businessType='+ businessType)
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.miniDetails = ret.data;
            self.miniDetails.rule = JSON.parse(ret.data.rule);
            self.miniDetails.startDate = ret.data.startDate.slice(0,10);
            self.miniDetails.endDate = ret.data.endDate.slice(0,10);
            // self.miniDetails.objs.replace('/(,)/g','123');
            self.miniDetails.objs = (self.miniDetails.objs.split(',')).join('，');
            console.log(self.miniDetails);
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
      window.history.go(-1)
    },
    cancel: function(data) {
      console.log(data);
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updatePromotionBKMgr?rule='+ angular.toJson(data.rule) +'&discountType='+ data.discountType +'&id='+ data.id +'&name='+ data.name +'&remarks='+ data.remarks +'&startDate='+ data.startDate+ ' 00:00:00' +'&endDate='+ dateSer.getNowDateStr()+ '&state'+data.state;
      console.log(url);
      $scope.modalBasic.header.content = "提示";
      $scope.modalBasic.body.content = '您确定结束该活动吗？';
      $scope.modalBasic.footer.btn = [{
        'name': '确定',
        'styleList': ['btn', 'btn-confirm'],
        'func': function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.post(url)
            .success(function(ret){
              console.log(ret);
              console.log('活动已结束');
              if(ret.success){
                window.history.go(-1);
              }
            })
            .error(function() {
              console.log('结束活动失败');
            });
          });
        }
      },{
        'name': '取消',
        'styleList': ['btn', 'btn-cancel'],
        'func':function(){
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
  $q.all([$scope.tblNormal.getMiniDetails($scope.id,$scope.businessType)]);
}])
.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
