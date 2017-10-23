
angular.module('mngApp.marketVoucherEdit', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_voucherEdit/:id', {
        templateUrl: 'marketMng_voucherAdd.html?t=' + getTimeStamp(),
        controller: 'marketMngVoucherEdit_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_index'
      });
  }])
  .controller('marketMngVoucherEdit_ctrl', ['$scope', '$rootScope', '$timeout', '$http', '$routeParams','$q', 'discountRuleList', 'TblPagination', function($scope, $rootScope, $timeout, $http, $routeParams, $q, discountRuleList, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '编辑抵用券',
      'url': '../../..' + window.location.pathname + '#/marketMng_voucherEdit/'+$routeParams.id
    }, 'LV2');
    $scope.title = "编辑抵用券";
    $scope.viewTag = 'Edit';
    $scope.couponsID = $routeParams.id;
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
    $scope.formResult = {}
    // $scope.endMinDate = '';
    $scope.startDatePicker = {
      opt: {
        elem: '#startDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01',
        max: '2099-06-16', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.startDate = datas;
          // $scope.endMinDate = datas;
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
        min: $scope.formResult.startDate,
        max: '2099-06-16', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.endDate = datas;
        },
        clear: function() {
          $scope.formResult.endDate = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        self.opt.min = $scope.formResult.startDate;
        laydate(self.opt);
      },
    };
    $scope.tblDetails = {
      getDataList: function(id){
        console.log(id);
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get miniDetals data
        $http.post('http://' + $rootScope.globalURL.hostURL + '/api/getCouponsDetailsBKMgr?couponsID='+id)
          .success(function(ret) {
            // console.log(ret);
            if (ret.success) {
              $scope.formResult = ret.data;
              // self.voucherDetails.rule = JSON.parse(ret.data.rule);
              $scope.formResult.startDate = ret.data.startDate.slice(0,10);
              $scope.formResult.endDate = ret.data.endDate.slice(0,10);
              // $scope.endMinDate = $scope.formResult.endDate;
              // self.voucherDetails.objs = (self.voucherDetails.objs.split(',')).join('，');
              console.log($scope.formResult);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      getCityList: function() {
        console.log($scope.couponsID );
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
              // console.log(self.cityList);
              for(var item in self.cityList){
                if(self.cityList[item].name == $scope.formResult.cityName){
                  self.cityVal = self.cityList[item];
                }
              }
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
        // var reginitNum = /^[0-9]*[1-9][0-9]*$/;
        // if(reginitNum.test($scope.formResult.amount)){
        //   $scope.valiResult.couponsNumError = false;
        //   cansubmit = true;
        // }else{
        //   $scope.valiResult.couponsNumError = true;
        //   cansubmit = false;
        // }
        if(regfloatNum.test($scope.formResult.cash)){
          $scope.valiResult.couponsAmountError = false;
          cansubmit = true;
        }else{
          $scope.valiResult.couponsAmountError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.startDate){
          console.log(123);
          $scope.valiResult.startDateError = false;
          cansubmit = true;
        }else{
          console.log(321);
          $scope.valiResult.startDateError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.endDate){
          $scope.valiResult.endDateError = false;
          cansubmit = true;
        }else{
          $scope.valiResult.endDateError = true;
          cansubmit = false;
        }
        if(!!$scope.formResult.cityName){
          $scope.valiResult.cityNameError = false;
          cansubmit = true;
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
          var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updateCouponsBKMgr?cityID=' + self.cityVal.id + '&startDate=' + $scope.formResult.startDate+' 00:00:00' + '&endDate=' + $scope.formResult.endDate + ' 23:59:59' + '&cash=' + $scope.formResult.cash + '&id=' + $scope.couponsID;
          console.log(url);
          $http.post(url)
            .success(function(ret){
              console.log(ret);
              $scope.modalBasic.header.content = '提示';
              if(ret.success){
                $scope.modalBasic.body.content = '修改抵用券成功！';
                $scope.modalBasic.footer.btn = [{
                  'name': '查看详情',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.href = '#/marketMng_voucherDetails/'+$scope.couponsID;
                    });
                  }
                },{
                  'name': '返回列表',
                  'styleList': ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.location.href = '#/marketMng_voucher';
                    });
                  }
                }]
              } else {
                $scope.modalBasic.body.content = '修改抵用券失败！'+ret.message;
                $scope.modalBasic.footer.btn = [{
                  'name': '继续修改',
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
                      window.location.href = '#/marketMng_voucher';
                    });
                  }
                }]
              }
            })
            .error(function(msg){
              $scope.modalBasic.header.content = '提示';
              $scope.modalBasic.body.content = '添加抵用券失败！'+ msg;
              $scope.modalBasic.footer.btn = [{
                'name': '继续修改',
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
                    window.location.href = '#/marketMng_voucher';
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
    $q.all([$scope.tblDetails.getDataList($scope.couponsID)])
    .then(function(){
      $scope.tblDetails.getCityList();
    })
  }])
