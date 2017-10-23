angular.module('mngApp.marketPriceFixDetail', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_priceFixDetail/:id', {
        templateUrl: 'marketMng_priceFixDetail.html?t=' + getTimeStamp(),
        controller: 'marketMngPriceFixDetail_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_priceIndex'
      })
  }])
  .controller('marketMngPriceFixDetail_ctrl', ['$rootScope', '$scope', '$q', '$routeParams', '$http', 'discountRuleList', 'dateSer', '$timeout', function($rootScope, $scope, $q, $routeParams, $http, discountRuleList,dateSer,$timeout) {
    $rootScope.globalPath.initPath({
      'name': '定价详情',
      'url': '../../..' + window.location.pathname + '#/marketMng_priceDetails/' + $routeParams.id + '/' + $routeParams.businessType
    }, 'LV2');
    $scope.title = "定价详情";
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
    $scope.tblNormal = {
      getPriceFixDetails: function(id) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get miniDetals data
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getDynamicPriceBKMgr?dynamicPriceID=' + id)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.priceDetails = ret.data;
              // var data = ret.data.rules;
              self.priceDetails.rules = JSON.parse(ret.data.rules);
              self.priceDetails.startDate = ret.data.startDate.slice(0,10);
              self.priceDetails.endDate = ret.data.endDate.slice(0,10);
              self.priceDetails.shops = (self.priceDetails.shops.split(',')).join('，');
              console.log(self.priceDetails);
              console.log(ret.data.rules);
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
        console.log(data);
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updateDynamicPriceBKMgr?id=' + data.id + '&name=' + data.name + '&remarks=' + data.remarks + '&startDate=' + data.startDate + ' 00:00:00' + '&endDate=' + dateSer.getNowDateStr();
          $scope.modalBasic.header.content = "提示";
          $scope.modalBasic.body.content = '您确定结束该活动吗？!';
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
                    window.history.go(-1);
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
    $q.all([$scope.tblNormal.getPriceFixDetails($scope.id)]);
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
