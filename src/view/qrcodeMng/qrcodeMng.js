var app = angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule']);
app.controller('mngCtrl', function() {
  // Put sth belongs to the specific mng-module here
});
app.controller('qrcodeMng_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'itemNumList', 'TblPagination', function($scope, $rootScope, $http, $timeout, itemNumList, TblPagination) {
  $scope.globalPath.initPath({
    'name': '二维码管理',
    'url': '../../..' + window.location.pathname + '#/qrcodeMng_product'
  }, 'LV1');
  //生成活动表单
  $scope.activity_form = {};
  $scope.activity_form.name = "";
  $scope.activity_form.content = "";
  //获取二维码tickets表单
  $scope.qrcode_form = {};
  $scope.qrcode_form.actionID = "";

  $scope.qrcode_url = "";
  $scope.qrcode_loading = false;

  //弹窗二维码url
  $scope.qrcode_pop = "";
  $scope.qrcode_ispopUP = false;
  $scope.qrcode_pop_name = "";

  //活动搜索对象 ------ start
  $scope.tblToolbar = {
    itemNumValChanged: function() {
      var self = this;
      $scope.tblNormal.getActivities(self.itemNumVal.id, 1, self.searchVal);
    },
    launchSearch: function() {
      var self = this;
      $scope.tblNormal.getActivities(self.itemNumVal.id, 1, self.searchVal);
    },
    itemNumList: itemNumList,
    shopVal: "",
    cityVal: "",
    searchVal: "",
  };
  $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
  //活动搜索对象 ------ end

  //活动表对象 ------ start
  $scope.tblNormal = {
    getActivities: function(pageSize, curPage, key) {
      var self = this;
      var form = {};
      form.pageSize = pageSize;
      form.curPage = curPage;
      form.key = key;
      var data = $.param(form);
      $http.post('http://' + $rootScope.globalURL.hostURL + '/api/queryActionsFromBKMgr', data)
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          } else {
            alert(ret.message);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
    },
  };
  //活动表对象 ------ end

  //活动表分页 ------ start
  $scope.tblPagination = new TblPagination();
  $scope.tblPagination.hookAfterChangePage = function(pageNum) {
    var self = this;
    $scope.tblNormal.getActivities(self.pageSize, pageNum, null);
  };
  //活动表分页 ------ end
  /**
   * 请求添加活动方法
   */
  $scope.addActivity = function() {
    if ($scope.activity_form.name === "") {
      alert("活动名不能为空");
      return;
    }
    $scope.qrcode_loading = true;
    var data = $.param($scope.activity_form);
    $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addActionFromBKMgr', data)
      .success(function(ret) {
        if (ret.success) {
          $scope.qrcodeProduct(ret.data.id);
        } else {
          alert(ret.messgae);
          $timeout(function() {
            $scope.qrcode_loading = false;
          }, 100);
        }
      })
      .error(function(msg) {
        alert(msg.message);
        $timeout(function() {
          $scope.qrcode_loading = false;
        }, 100);
      });
  };
  /**
   * 请求二维码tickets方法
   */
  $scope.qrcodeProduct = function(id) {
    $scope.qrcode_form.actionID = id;
    var data = $.param($scope.qrcode_form);
    $http.post('http://' + $rootScope.globalURL.hostURL + '/api/qrCodeFromBKMgr', data)
      .success(function(ret) {
        if (ret.success) {
          $scope.qrcode_url = "";
          $scope.qrcode_url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ret.data.ticket;
          $scope.tblNormal.getActivities(10, 1, null);
        } else {
          alert(ret.messgae);
        }
        $timeout(function() {
          $scope.qrcode_loading = false;
        }, 100);
      })
      .error(function(msg) {
        alert(msg.message);
        $timeout(function() {
          $scope.qrcode_loading = false;
        }, 10);
      });
  };
  /**
   * 展示历史二维码
   */
  $scope.showQRCode = function(ticket, name) {
    $scope.qrcode_pop = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + ticket;
    if (ticket === null) {
      $scope.qrcode_pop = "http://120.27.157.191:80/api/images?imgName=qrcode_for_gh_f0d80b9260c5_344.jpg";
    }
    $scope.qrcode_pop_name = name;
    $scope.qrcode_ispopUP = true;
  }
  $scope.hideQRCode = function() {
    $timeout(function() {
      $scope.qrcode_ispopUP = false;
    }, 10);
  }
  $scope.tblNormal.getActivities(10, 1, null);
}]);
app.controller('qrcodeMng_detail_ctrl', ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', 'itemNumList', 'TblPagination', function($scope, $rootScope, $http, $routeParams, $timeout, itemNumList, TblPagination) {
  $scope.param = $routeParams.param;
  $scope.content = $routeParams.activeContent;
  $scope.globalPath.initPath({
    'name': $routeParams.activeName,
    'url': '../../..' + window.location.pathname + '#/qrcodeMng_detail/' + $scope.param
  }, 'LV2');
  //用户搜索对象 ------ start
  $scope.tblToolbar = {
    itemNumValChanged: function() {
      var self = this;
      $scope.tblNormal.getActivityUsers($scope.param, self.itemNumVal.id, 1);
    },
    itemNumList: itemNumList,
    shopVal: "",
    cityVal: "",
    searchVal: "",
  };
  $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
  //用户搜索对象 ------ end

  //用户表对象 ------ start
  $scope.tblNormal = {
    getActivityUsers: function(id, pageSize, curPage) {
      var self = this;
      var form = {};
      form.pageSize = pageSize;
      form.curPage = curPage;
      form.actionID = id;
      var data = $.param(form);
      $http.post('http://' + $rootScope.globalURL.hostURL + '/api/queryActionUsersFromBKMgr', data)
        .success(function(ret) {
          if (ret.success) {
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          } else {
            alert(ret.message);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
    },
  };
  //用户表对象 ------ end

  //用户表分页 ------ start
  $scope.tblPagination = new TblPagination();
  $scope.tblPagination.hookAfterChangePage = function(pageNum) {
    var self = this;
    $scope.tblNormal.getActivityUsers($scope.param, self.pageSize, pageNum);
  };
  //用户表分页 ------ end
  $scope.tblNormal.getActivityUsers($scope.param, 10, 1);
}]);
app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  var getTimeStamp = function() {
    return Math.floor(Date.now() / 1000);
  };
  $routeProvider
    .when('/qrcodeMng_product', {
      templateUrl: 'qrcodeMng_product.html?t=' + getTimeStamp(),
      controller: 'qrcodeMng_ctrl'
    })
    .when('/qrcodeMng_detail/:param/:activeName/:activeContent', {
      templateUrl: 'qrcodeMng_detail.html?t=' + getTimeStamp(),
      controller: 'qrcodeMng_detail_ctrl'
    })
    .otherwise({
      redirectTo: '/qrcodeMng_product'
    });
  $httpProvider.interceptors.push('myInterceptor');
}]);
app.run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (typeof(current) !== 'undefined') {
      $templateCache.remove(current.templateUrl);
    }
  });
}]);
