/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', [function() {
    // Put sth belongs to the specific mng-module here
  }])
  .controller('bookMngIndex_ctrl', ['$q', '$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'bookStateList', 'RememberSer', 'TblPagination', function($q, $scope, $rootScope, $http, $timeout, $route, itemNumList, bookStateList, RememberSer, TblPagination) {
    $scope.globalPath.initPath({
      'name': '预约管理',
      'url': '../../..' + window.location.pathname + '#/bookMng_index'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      getCityList: function() {
        var deferred = $q.defer();
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            $scope.tblToolbar.cityList = ret.data.data;
            deferred.resolve(true);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return deferred.promise;
      },
      cityValChanged: function() {
        var self = this;
        self.searchVal = '';
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        console.log(self.cityVal);
        $scope.tblNormal.getBookList(self.cityVal.id, self.itemNumVal.id, 1, '');
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        $scope.tblNormal.getBookList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        $scope.tblNormal.getBookList(self.cityVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      cityVal: {
        id: ''
      },
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getBookList: function(cityID, pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryReserveMovesBKMgr?cityID=' + cityID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            for (var i in self.dataList) {
              // self.bookStateValBuffer[i] = self.bookStateList[self.dataList[i].state];
              for (var j in self.bookStateList) {
                if (self.bookStateList[j].id === self.dataList[i].state) {
                  self.bookStateValBuffer[i] = self.bookStateList[j];
                  break;
                }
              }
            }
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      bookStateValChanged: function(id, state) {
        console.log(arguments);
        var self = this;
        $scope.modalBasic.header.content = '操作提示';
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateReserveMoveBKMgr?id=' + id + '&state=' + state)
          .success(function(ret) {
            // self.getBookList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
            if (ret.success) {
              $scope.modalBasic.body.content = '操作成功！';
              $scope.modalBasic.footer.btn = [{
                  "name": '返回',
                  "styleList": ['btn', 'btn-cancel'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  }
                },
                {
                  "name": '完成',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  }
                }
              ];
            } else {
              $scope.modalBasic.body.content = '操作失败！';
              $scope.modalBasic.footer.btn = [{
                  "name": '返回',
                  "styleList": ['btn', 'btn-cancel'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  }
                },
                {
                  "name": '取消',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  }
                }
              ];
            }
            $timeout(function() {
              $("#myModal").modal({
                show: true,
                backdrop: 'static' //点击周围区域时不会隐藏模态框
              });
            }, 0);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      bookStateList: bookStateList,
      bookStateValBuffer: [],
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getBookList(tblToolbar.cityVal.id, self.pageSize, pageNum, tblToolbar.searchVal);
    };

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    ($scope.tblToolbar.getCityList()).then(function() {
      // $scope.cityList = $scope.tblToolbar.cityList;
      $scope.$broadcast('listLoaded', true);
      if (RememberSer.restore($scope)) {
        $scope.tblNormal.getBookList($scope.tblToolbar.cityVal.id, $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
      } else {
        $scope.tblNormal.getBookList('', $scope.tblToolbar.itemNumVal.id, 1, '');
      }
    });

  }])
  .config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/bookMng_index', {
        templateUrl: 'bookMng_index.html?t=' + getTimeStamp(),
        controller: 'bookMngIndex_ctrl',
      })
      .otherwise({
        redirectTo: '/bookMng_index'
      });
    $httpProvider.interceptors.push('myInterceptor'); //拦截器
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
