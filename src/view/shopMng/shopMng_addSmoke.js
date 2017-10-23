angular.module('mngApp.addSmoke', ['ngRoute'])
.controller('shopMngAddSmoke_ctrl',['$rootScope','$scope','$routeParams','$http','$timeout',function($rootScope,$scope,$routeParams,$http,$timeout){
  $scope.shopID = $routeParams.shopID;
  $scope.title = '新增烟感设备';
  $rootScope.globalPath.initPath({
    'name': '添加烟感设备',
    'url': '../../..' + window.location.pathname + '#/shopMng_addTempHum/' + $scope.shopID
  }, 'LV3');
  $scope.formResult = {
    shopID: $scope.shopID,
    deviceName: '',
    deviceSN: NaN,
  }
  $scope.modalBasic = {
    "header": {
      "content": ''
    },
    "body": {
      "content": ''
    },
    "footer": {
      "btn": [{
          "styleList": ['btn', 'btn-cancel'],
        },
        {
          "styleList": ['btn', 'btn-confirm'],
        }
      ]
    }
  };

  $scope.valiResult = {
    deviceNameError: false,
    deviceSNError: false,
  };
  $scope.tblDetails = {
    validateForm: function() {
      var self = this;
      var canSubmit = true;
      var reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      var regRealNum = /^\d{8}$/;
      //Vali unit's name
      if (!reg.test($scope.formResult.deviceName)) {
        $scope.valiResult.deviceNameError = true;
        canSubmit = false;
      } else {
        $scope.valiResult.deviceNameError = false;
        canSubmit = canSubmit && true;
      }
      //Vali unit's size
      if (!regRealNum.test($scope.formResult.deviceSN)) {
        $scope.valiResult.deviceSNError = true;
        canSubmit = false;
      } else {
        $scope.valiResult.deviceSNError = false;
        canSubmit = canSubmit && true;
      }
      return canSubmit;
    },
    save: function(){
      var self = this;
      if(self.validateForm()){
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addSmokeBKMgr?shopID=' + $scope.formResult.shopID + '&deviceName=' + $scope.formResult.deviceName + '&deviceSN=' + $scope.formResult.deviceSN)
        .success(function(ret) {
          console.log(ret);
          $scope.modalBasic.header.content = '提示';
          if (ret.success) {
            //如果添加仓位成功
            $scope.modalBasic.body.content = '添加烟感设备成功！';
            $scope.modalBasic.footer.btn[0].name = '完成';
            $scope.modalBasic.footer.btn[0].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(-1);
              });
            };
            $scope.modalBasic.footer.btn[1].name = '继续添加';
            $scope.modalBasic.footer.btn[1].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(0);
              });
            };
          } else {
            //添加仓位失败
            $scope.modalBasic.body.content = '添加烟感设备失败！' + ret.message;
            $scope.modalBasic.footer.btn[0].name = '取消';
            $scope.modalBasic.footer.btn[0].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(-1);
              });
            };
            $scope.modalBasic.footer.btn[1].name = '重新添加';
            $scope.modalBasic.footer.btn[1].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            };
          }
          $timeout(function() {
            $("#myModal").modal({
              'show': true,
              'backdrop': 'static' //点击周围区域时不会隐藏模态框
            });
          }, 0);
        })
        .error(function(msg) {
          console.log("Fail! " + msg);
        });
      }
    },
    cancel: function(){
      window.history.go(-1);
    },
  }
}])
