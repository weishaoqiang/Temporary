angular.module('mngApp.expensesEdit', ['ngRoute'])
.controller('financeMngExpensesEdit_ctrl',['$rootScope','$scope','$q','$routeParams','$http','$timeout',function($rootScope,$scope,$q,$routeParams,$http,$timeout){
  $scope.id = $routeParams.id;
  $scope.globalPath.initPath({
    'name': '编辑支出',
    'url': '../../..' + window.location.pathname + '#/financeMng_expensesEdit/' + $scope.id
  }, 'LV2');
  $scope.title = "编辑支出";
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
  $scope.formResult = {}
  $scope.valiResult = {
    cityIDError: false,
    amountError: false,
    feeTypeIDError: false,
    startDateError: false,
    endDateError: false,
    payDateError: false,
    useNameError: false,
  };
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
  $scope.payDatePicker = {
    opt: {
      elem: '#payDate',
      // format: 'YYYY/MM/DD hh:mm:ss',
      format: 'YYYY-MM-DD',
      // min: laydate.now(), //设定最小日期为当前日期
      // min: '2000-01-01',
      // max: '2099-06-16', //最大日期
      // max: laydate.now(), //最大日期
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.formResult.payDate = datas;
      },
      clear: function() {
        $scope.formResult.payDate = '';
      }
    },
    showOpenDate: function() {
      var self = this;
      laydate(self.opt);
      console.log($scope.formResult);
    },
  };
  $scope.tblToolbar = {
    getCityList: function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          //console.log(ret);
          if (ret.success) {
            ret.data.data.unshift({
              id: 0,
              name: '万物仓'
            });
            self.cityList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    // 获取门店
    getShopList: function(cityID,keyword) {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + cityID +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate&key='+keyword)
        .success(function(ret) {
          if (ret.success) {
            ret.data.data.unshift({
              id: '',
              name: '- 请选择门店 -'
            })
            self.shopList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    searchShops: function(keyword){
      var self = this;
      self.getShopList(self.cityVal.id,keyword)
    },
    // 获取费用类类型
    getExpenseList: function(expensekey){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getExpenseTypeBKMgr?feeTypeID=&key='+expensekey)
        .success(function(ret) {
          if (ret.success) {
            self.expenseList = ret.data;
            console.log(self.expenseList);
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    searchExpense: function(expensekey){
      var self = this;
      self.getExpenseList(expensekey);
    },
    cityValChanged: function(){
      var self = this;
      if(!self.cityVal&&self.cityVal!=0){
        self.cityVal = {
          id: ''
        }
        console.log(self.cityVal.id);
      }
      $scope.formResult.shopID = '';
      self.shopName = '';
      console.log($scope.formResult);
      self.getShopList(self.cityVal.id,'');
      $scope.formResult.cityID = self.cityVal.id;
    },
    shopValChanged: function(id,name){
      var self = this;
      if(!self.shopVal){
        self.shopVal = {
          id:''
        }
      }
      self.shopVal.id = id;
      self.shopName = name;
      $scope.formResult.shopID = self.shopVal.id;
      console.log($scope.formResult);
    },
    expenseValChanged: function(id,name){
      var self = this;
      if(!self.expenseVal){
        self.expenseVal = {
          id: ''
        }
      }
      self.expenseVal.id = id;
      self.expenseName = name;
      $scope.formResult.feeTypeID = self.expenseVal.id;
    },
    cityVal: {
      id: '',
    },
    shopVal: {
      id: '',
    },
    expenseVal: {
      id: '',
    },
    keyword: '',
    shopName: '',
    expensekey: '',
    expenseName: '',
  }
  $scope.tblDetails = {
    getExpensesDetails: function(id){
      var self = this;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getExpenseDetailBKMgr?ID=' + id)
        .success(function(ret) {
          console.log(ret);
          $scope.formResult = ret.data;
          $scope.tblToolbar.shopName = $scope.formResult.shopName;
          $scope.tblToolbar.expenseName = $scope.formResult.feeType;
          $scope.tblToolbar.cityVal.id = $scope.formResult.cityID;
          console.log($scope.formResult);
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
    },
    validateForm: function(){
      var cansubmit = false;
      var regfloatNum = /^(\d+)(\.\d+)?$/;
      if($scope.formResult.cityID !== ''){
        $scope.valiResult.cityIDError = false;
        cansubmit =  true;
      }else{
        $scope.valiResult.cityIDError = true;
        cansubmit =  false;
      }
      if(regfloatNum.test($scope.formResult.amount)){
        $scope.valiResult.amountError = false;
        cansubmit = cansubmit && true;
      }else{
        $scope.valiResult.amountError = true;
        cansubmit = false;
      }
      if(!$scope.formResult.feeTypeID){
        $scope.valiResult.feeTypeIDError = true;
        cansubmit = false;
      }else{
        $scope.valiResult.feeTypeIDError = false;
        cansubmit = cansubmit && true;
      }
      if(!!$scope.formResult.startDate){
        $scope.valiResult.startDateError = false;
        cansubmit = cansubmit && true;
      }else{
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
      if(!!$scope.formResult.payDate){
        $scope.valiResult.payDateError = false;
        cansubmit = cansubmit && true;
      }else{
        $scope.valiResult.payDateError = true;
        cansubmit = false;
      }
      if($scope.formResult.useName == ''){
        $scope.valiResult.useNameError = true;
        cansubmit = false;
      }else{
        $scope.valiResult.useNameError = false;
        cansubmit = cansubmit && true;
      }
      return cansubmit;
    },
    save: function(){
      console.log($scope.formResult);
      var self = this;
      console.log(self.validateForm());
      if(self.validateForm()){
        // 重置$scope.formResult的空值，若值为空，则将值设置成空字符串，而不是null
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/updateExpenseBKMgr?cityID=' + $scope.formResult.cityID + '&shopID=' + ($scope.formResult.shopID || '') + '&amount=' + $scope.formResult.amount + '&feeTypeID=' + $scope.formResult.feeTypeID + '&startDate=' + $scope.formResult.startDate+ '&endDate='+ $scope.formResult.endDate + '&payDate=' + $scope.formResult.payDate + '&useName=' + $scope.formResult.useName + '&matterContent=' + $scope.formResult.matterContent + '&id='+ $scope.id;
        console.log(url);
        $http.post(url)
          .success(function(ret){
            console.log(ret);
            $scope.modalBasic.header.content = '提示';
            if(ret.success){
              $scope.modalBasic.body.content = '更新支出成功！';
              $scope.modalBasic.footer.btn = [{
                'name': '查看详情',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.location.href = '#/financeMng_expensesDetails/' + $scope.id;
                  });
                }
              },{
                'name': '返回列表',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.location.href = '#/financeMng_expensesList';
                  });
                }
              }]
            } else {
              $scope.modalBasic.body.content = '更新支出失败！'+ret.message;
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
                    window.location.href = '#/financeMng_expensesList';
                  });
                }
              }]
            }
          })
          .error(function(msg){
            $scope.modalBasic.header.content = '提示';
            $scope.modalBasic.body.content = '添加支出失败！'+ msg;
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
                  window.location.href = '#/financeMng_expensesList';
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
      window.location.href="#/financeMng_expensesList";
    }
  }
  $q.all([$scope.tblToolbar.getCityList(),$scope.tblToolbar.getShopList($scope.tblToolbar.cityVal.id,''),$scope.tblToolbar.getExpenseList(''),$scope.tblDetails.getExpensesDetails($scope.id)])
  .then(function(){
    // 给城市，门店，给用类型赋初始值
    // console.log($scope.tblToolbar.cityList);
    // console.log($scope.tblToolbar.shopList);
    // console.log($scope.tblToolbar.expenseList);
    console.log($scope.formResult);
    $scope.tblToolbar.getShopList($scope.formResult.cityID,'');
    angular.forEach($scope.tblToolbar.cityList,function(item){
      if($scope.formResult.cityID === item.id){
        $scope.tblToolbar.cityVal = item;
      }
    })
    angular.forEach($scope.tblToolbar.shopList,function(item){
      if($scope.formResult.shopID === item.id){
        $scope.tblToolbar.shopVal = item;
      }
    })
    angular.forEach($scope.tblToolbar.expenseList,function(item){
      // console.log(item);
      if($scope.formResult.feeTypeID === item.id){
        // console.log($scope.formResult);
        $scope.tblToolbar.expenseVal = item;
        console.log(item);
      }
    })
  })
}])
