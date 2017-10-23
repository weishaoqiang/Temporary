/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', [function() {
    // Put sth belongs to the specific mng-module here
  }])
  .controller('editMyPwd_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', function($scope, $rootScope, $routeParams, $http, $timeout) {
    $rootScope.globalPath.initPath({
      'name': '修改登录密码',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_editShopPwd/' + $scope.param
    }, 'LV2');

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $scope.formResult = {};
    $scope.valiResult = {
      pwdError: false,
      repwdError: false,
    };

    $scope.tblDetails = {
      valiForm: function() {
        var self = this;
        var regPwd = /^.{1,}$/;
        var canSave = true;
        // 验证密码
        if (!regPwd.test($scope.formResult.pwd)) {
          $scope.valiResult.pwdError = true;
          canSave = false;
        } else {
          $scope.valiResult.pwdError = false;
          canSave &= true;
        }
        // 验证重复密码
        if ($scope.formResult.pwd !== $scope.formResult.repwd) {
          $scope.valiResult.repwdError = true;
          canSave = false;
        } else {
          $scope.valiResult.repwdError = false;
          canSave &= true;
        }
        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          /* 配置模拟数据 *
          if(0){
            // 成功
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateAdminPswBKMgr', {
              data: 'Modified Successfully!',
              message: '请求成功',
              success: true,
            });
          }else{
            // 失败
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateAdminPswBKMgr', {
              data: 'Modified Failed!',
              message: '请求失败',
              success: false,
            });
          }
          /*------------------------------------------------------------------------*/

          var data = $.param({
            password: $scope.formResult.pwd
          });
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateAdminPswBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "修改成功！";
                $scope.modalBasic.footer.btn = [{
                  "name": '完成',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.history.go(-1);
                    });
                  }
                }];
              } else {
                $scope.modalBasic.body.content = "修改失败！" + ret.message;
                $scope.modalBasic.footer.btn = [{
                    "name": '返回',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  },
                  {
                    "name": '重新修改',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
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
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      toggleVisibility: function() {
        this.visible = !this.visible;
        if (this.visible) {
          this.pwdType = 'text';
        } else {
          this.pwdType = 'password';
        }
      },
      visible: true,
      pwdType: 'text',
      cityVal: {
        id: ''
      },
    };
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/editMyPwd', {
        templateUrl: 'editMyPwd.html?t=' + getTimeStamp(),
        controller: 'editMyPwd_ctrl'
      })
      .otherwise({
        redirectTo: '/editMyPwd'
      });
    $httpProvider.interceptors.push('myInterceptor');
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
