angular.module('mngApp.editSmoke', ['ngRoute'])
.controller('shopMngEditSmoke_ctrl',['$rootScope','$scope','$routeParams','$http','$timeout',function($rootScope,$scope,$routeParams,$http,$timeout){
  $scope.viewTag = 'Edit';
  $scope.id = $routeParams.id;
  $scope.shopID = $routeParams.shopID;
  $scope.title = '编辑烟感设备';
  $rootScope.globalPath.initPath({
    'name': '编辑烟感设备',
    'url': '../../..' + window.location.pathname + '#/shopMng_editTempHum/' + $scope.shopID
  }, 'LV3');
  $scope.formResult = {}
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
    getSmokeDetails: function(id){
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getSmokeDetailBKMgr?id=' + id)
      .success(function(reg){
        if(reg.success){
          $scope.formResult = reg.data;
          console.log($scope.formResult);
        }
      })
      .error(function(msg){
        console.log('请求失败!' + msg);
      })
    },
    validateForm: function() {
      var self = this;
      var canSubmit = true;
      var reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
      //Vali unit's name
      if (!reg.test($scope.formResult.deviceName)) {
        $scope.valiResult.deviceNameError = true;
        canSubmit = false;
      } else {
        $scope.valiResult.deviceNameError = false;
        canSubmit = canSubmit && true;
      }
      return canSubmit;
    },
    save: function(){
      var self = this;
      if(self.validateForm()){
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateSmokeBKMgr?id=' + $scope.formResult.id + '&deviceName=' + $scope.formResult.deviceName + '&deviceSN=' + $scope.formResult.deviceSN + '&shopID='+$scope.shopID)
        .success(function(ret) {
          console.log(ret);
          $scope.modalBasic.header.content = '提示';
          if (ret.success) {
            //如果添加仓位成功
            $scope.modalBasic.body.content = '编辑烟感设备成功！';
            $scope.modalBasic.footer.btn[0].name = '完成';
            $scope.modalBasic.footer.btn[0].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(-1);
              });
            };
            $scope.modalBasic.footer.btn[1].name = '继续编辑';
            $scope.modalBasic.footer.btn[1].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(0);
              });
            };
          } else {
            //添加仓位失败
            $scope.modalBasic.body.content = '编辑烟感设备失败！' + ret.message;
            $scope.modalBasic.footer.btn[0].name = '取消';
            $scope.modalBasic.footer.btn[0].func = function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                window.history.go(-1);
              });
            };
            $scope.modalBasic.footer.btn[1].name = '重新编辑';
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

  $scope.tblDetails.getSmokeDetails($scope.id);
}])
