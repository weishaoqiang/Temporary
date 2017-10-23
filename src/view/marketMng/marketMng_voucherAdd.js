
angular.module('mngApp.marketVoucherAdd', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_voucherAdd', {
        templateUrl: 'marketMng_voucherAdd.html?t=' + getTimeStamp(),
        controller: 'marketMngVoucherAdd_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_index'
      });
  }])
  .controller('marketMngVoucherAdd_ctrl', ['$scope', '$rootScope', '$timeout', '$http', '$q', 'discountRuleList', 'TblPagination', function($scope, $rootScope, $timeout, $http, $q, discountRuleList, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '新增抵用券',
      'url': '../../..' + window.location.pathname + '#/marketMng_voucherAdd'
    }, 'LV2');
    $scope.title = "新增抵用券";
    $scope.viewTag = 'Add';
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
    $scope.valiResult = {
      couponsNumError: false,
      couponsAmountError: false,
      startDateError: false,
      endDateError: false,
      cityNameError: false,
    };
    $scope.formResult = {
      amount: '',
      cash: '',
      startDate: '',
      endDate: '',
      allowCity: '',
      adminID: window.localStorage.getItem('vks-web-adminID'),
    }
    $scope.startDatePicker = {
      opt: {
        elem: '#startDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        // min: '2000-01-01',
        // max: '2099-06-16', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.startDate = datas;
        },
        clear: function() {
          $scope.formResult.startDate = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        laydate(self.opt);
      },
    };
    $scope.endDatePicker = {
      opt: {
        elem: '#endDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        // min: '2000-01-01',
        min: $scope.formResult.startDate,
        max: '2099-06-16', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          // console.log($scope.formResult.startDate);
          $scope.formResult.endDate = datas;
        },
        clear: function() {
          $scope.formResult.endDate = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        self.opt.min = $scope.formResult.startDate,
        laydate(self.opt);
        laydate.reset();
      },
    };
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              // self.cityListPure = ret.data.data.slice(0);
              self.cityList = ret.data.data;
              console.log(self.cityList);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getAdminID:function(){
        // return adminID;
      },
      validateForm: function(){
        // console.log('我进来了');
        // var result = false;
        var cansubmit = false;
        var regfloatNum = /^(\d+)(\.\d+)?$/;
        var reginitNum = /^[0-9]*[1-9][0-9]*$/;
        if(reginitNum.test($scope.formResult.amount)){
          $scope.valiResult.couponsNumError = false;
          cansubmit = true;
        }else{
          $scope.valiResult.couponsNumError = true;
          cansubmit = false;
        }
        if(regfloatNum.test($scope.formResult.cash)){
          $scope.valiResult.couponsAmountError = false;
          cansubmit = cansubmit && true;
        }else{
          $scope.valiResult.couponsAmountError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.startDate){
          console.log(123);
          $scope.valiResult.startDateError = false;
          cansubmit = cansubmit && true;
        }else{
          console.log(321);
          $scope.valiResult.startDateError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.endDate){
          $scope.valiResult.endDateError = false;
          cansubmit = cansubmit && true;
        }else{
          $scope.valiResult.endDateError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.allowCity){
          $scope.valiResult.cityNameError = false;
          cansubmit = cansubmit && true;
        }else{
          $scope.valiResult.cityNameError = true;
          cansubmit = false;
        }
        return cansubmit;
      },
      cityValChanged: function(){
        var self = this;
        if(!self.cityVal){
          self.cityVal = {
            id: ''
          }
        }
        $scope.formResult.allowCity = self.cityVal.id;
      },
      save: function(){
        console.log($scope.formResult);
        var self = this;
        if(self.validateForm()){
          console.log('我进来了');
          var url = 'http://' + $rootScope.globalURL.hostURL + '/api/addCouponsBKMgr?cityID=' + $scope.formResult.allowCity + '&amount=' + $scope.formResult.amount + '&startDate=' + $scope.formResult.startDate+' 00:00:00' + '&endDate=' + $scope.formResult.endDate + ' 23:59:59' + '&cash=' + $scope.formResult.cash + '&adminID=' + $scope.formResult.adminID;
          console.log(url);
          $http.post(url)
            .success(function(ret){
              console.log(ret);
              $scope.modalBasic.header.content = '提示';
              if(ret.success){
                $scope.modalBasic.body.content = '添加抵用券成功！';
                $scope.modalBasic.footer.btn = [{
                  'name': '继续添加',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.reload();
                    });
                  }
                },{
                  'name': '返回列表',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.href = '#/marketMng_voucher/reload';
                    });
                  }
                }]
              } else {
                $scope.modalBasic.body.content = '添加抵用券失败！'+ret.message;
                $scope.modalBasic.footer.btn = [{
                  'name': '继续添加',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.reload();
                    });
                  }
                },{
                  'name': '返回列表',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.href = '#/marketMng_voucher/reload';
                    });
                  }
                }]
              }
            })
            .error(function(msg){
              $scope.modalBasic.header.content = '提示';
              $scope.modalBasic.body.content = '添加抵用券失败！'+ msg;
              $scope.modalBasic.footer.btn = [{
                'name': '继续添加',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.location.reload();
                  });
                }
              },{
                'name': '返回列表',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.location.href = '#/marketMng_voucher/reload';
                  });
                }
              }]
            })
            $timeout(function() {
              $("#myModal").modal({
                show: true,
                backdrop: 'static' //点击周围区域时不会隐藏模态框
              });
            }, 0);
        }
      },
      cancel: function(){
        window.history.go(-1);
        return false;
      },
      cityVal: {
        id: '',
      },
    };
    $scope.tblDetails.getCityList();
    $scope.tblDetails.getAdminID();
  }])
