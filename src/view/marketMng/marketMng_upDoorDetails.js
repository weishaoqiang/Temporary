angular.module('mngApp.marketUpDoorDetails',['ngRoute'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider){
  var getTimeStamp = function(){
    return Math.floor(Date.now()/1000);
  };
  $routeProvider.when('/marketMng_upDoorDetails/:id/:businessType',{
    templateUrl: 'marketMng_upDoorDetails.html?t=' + getTimeStamp(),
    controller: 'marketMngUpDoorDetails_ctrl'
  })
  .otherwise({
    redirectTo: '/marketMng_index'
  })
}])
.controller('marketMngUpDoorDetails_ctrl',['$rootScope','$scope','$q','$routeParams', '$http', 'discountRuleList', 'dateSer', '$timeout', function($rootScope,$scope,$q,$routeParams,$http,discountRuleList,dateSer,$timeout){
  $rootScope.globalPath.initPath({
    'name': '活动详情',
    'url': '../../..' + window.location.pathname + '#/marketMng_upDoorDetails/'+$routeParams.id + '/'+ $routeParams.businessType
  }, 'LV2');
  $scope.title = "活动详情";
  $scope.id = $routeParams.id;
  $scope.businessType = $routeParams.businessType;
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
  $scope.tblNormal = {
    getUpDoorDetails: function(id,businessType){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get miniDetals data
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPromotionBKMgr?id='+id+'&businessType='+ businessType)
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.upDoorDetails = ret.data;
            self.upDoorDetails.rule = JSON.parse(ret.data.rule);
            self.upDoorDetails.startDate = ret.data.startDate.slice(0,10);
            self.upDoorDetails.endDate = ret.data.endDate.slice(0,10);
            self.upDoorDetails.objs = (self.upDoorDetails.objs.split(',')).join('，');
            console.log(self.upDoorDetails);
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
      window.history.go(-1);
    },
    cancel: function(data) {
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updatePromotionBKMgr?rule='+ angular.toJson(data.rule) +'&discountType='+ data.discountType +'&id='+ data.id +'&name='+ data.name +'&remarks='+ data.remarks +'&startDate='+ data.startDate+ ' 00:00:00' +'&endDate='+ dateSer.getNowDateStr()+ '&state' + data.state;
      // console.log(url);

      $scope.modalBasic.header.content = "提示";
      $scope.modalBasic.body.content = '您确定结束该活动吗？';
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
                window.history.go(-1);
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
  $q.all([$scope.tblNormal.getUpDoorDetails($scope.id,$scope.businessType)]);
}])
.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
