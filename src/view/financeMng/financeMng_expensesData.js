angular.module('mngApp.expensesData', ['ngRoute'])
.controller('financeMngExpensesData_ctrl',['$rootScope','$scope','$q','$http',function($rootScope,$scope,$q,$http){
  $scope.globalPath.initPath({
    'name': '数据分析',
    'url': '../../..' + window.location.pathname + '#/financeMng_expensesData'
  }, 'LV1');
  $scope.cashDatepicker = {
    dateStartOpt: {
      elem: '#cashDateStart',
      // format: 'YYYY/MM/DD hh:mm:ss',
      format: 'YYYY/MM/DD',
      // min: laydate.now(), //设定最小日期为当前日期
      min: '2011-01-01',
      // max: '2099-06-16 23:59:59', //最大日期
      max: laydate.now(), //最大日期
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.cashDatepicker.dateEndOpt.min = datas; //开始日选好后，重置结束日的最小日期
        $scope.cashDatepicker.dateEndOpt.start = datas //将结束日的初始值设定为开始日
        $scope.tblToolbar.cashStartDate = datas;
        // $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
        $scope.tblDetails.getCashAnalysisData($scope.tblToolbar.cashCityVal.id,$scope.tblToolbar.cashShopVal.id,$scope.tblToolbar.cashStartDate,$scope.tblToolbar.cashEndDate,$scope.tblToolbar.cashDateType)
      }
    },
    dateEndOpt: {
      elem: '#cashDateEnd',
      format: 'YYYY/MM/DD',
      min: '2011-01-01',
      max: laydate.now(),
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.cashDatepicker.dateStartOpt.max = datas; //结束日选好后，重置开始日的最大日期
        $scope.tblToolbar.cashEndDate = datas;
        // $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
        $scope.tblDetails.getCashAnalysisData($scope.tblToolbar.cashCityVal.id,$scope.tblToolbar.cashShopVal.id,$scope.tblToolbar.cashStartDate,$scope.tblToolbar.cashEndDate,$scope.tblToolbar.cashDateType)
      }
    },
    showStart: function() {
      laydate($scope.cashDatepicker.dateStartOpt);
    },
    showEnd: function() {
      laydate($scope.cashDatepicker.dateEndOpt);
    },
  };
  $scope.rateDatepicker = {
    dateStartOpt: {
      elem: '#rateDateStart',
      // format: 'YYYY/MM/DD hh:mm:ss',
      format: 'YYYY/MM/DD',
      // min: laydate.now(), //设定最小日期为当前日期
      min: '2011-01-01',
      // max: '2099-06-16 23:59:59', //最大日期
      max: laydate.now(), //最大日期
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.rateDatepicker.dateEndOpt.min = datas; //开始日选好后，重置结束日的最小日期
        $scope.rateDatepicker.dateEndOpt.start = datas //将结束日的初始值设定为开始日
        $scope.tblToolbar.rateStartDate = datas;
        $scope.tblDetails.getRateAnalysisData($scope.tblToolbar.rateCityVal.id,$scope.tblToolbar.rateShopVal.id,$scope.tblToolbar.rateStartDate,$scope.tblToolbar.rateEndDate,$scope.tblToolbar.rateDateType)
        // $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
      }
    },
    dateEndOpt: {
      elem: '#rateDateEnd',
      format: 'YYYY/MM/DD',
      min: '2011-01-01',
      max: laydate.now(),
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.rateDatepicker.dateStartOpt.max = datas; //结束日选好后，重置开始日的最大日期
        $scope.tblToolbar.rateEndDate = datas;
        $scope.tblDetails.getRateAnalysisData($scope.tblToolbar.rateCityVal.id,$scope.tblToolbar.rateShopVal.id,$scope.tblToolbar.rateStartDate,$scope.tblToolbar.rateEndDate,$scope.tblToolbar.rateDateType)
        // $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
      }
    },
    showStart: function() {
      laydate($scope.rateDatepicker.dateStartOpt);
    },
    showEnd: function() {
      laydate($scope.rateDatepicker.dateEndOpt);
    },
  };
  $scope.apportDatepicker = {
    dateStartOpt: {
      elem: '#apportDateStart',
      // format: 'YYYY/MM/DD hh:mm:ss',
      format: 'YYYY/MM/DD',
      // min: laydate.now(), //设定最小日期为当前日期
      min: '2011-01-01', //设定最小日期为当前日期
      // max: '2099-06-16 23:59:59', //最大日期
      max: laydate.now(), //最大日期
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.apportDatepicker.dateEndOpt.min = datas; //开始日选好后，重置结束日的最小日期
        $scope.apportDatepicker.dateEndOpt.start = datas //将结束日的初始值设定为开始日
        $scope.tblToolbar.apportStartDate = datas;
        $scope.tblDetails.getApportAnalysisData($scope.tblToolbar.apportCityVal.id,$scope.tblToolbar.apportShopVal.id,$scope.tblToolbar.apportStartDate,$scope.tblToolbar.apportEndDate,$scope.tblToolbar.apportDateType)
        // $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
      }
    },
    dateEndOpt: {
      elem: '#apportDateEnd',
      format: 'YYYY/MM/DD',
      min: '2011-01-01',
      max: laydate.now(),
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.apportDatepicker.dateStartOpt.max = datas; //结束日选好后，重置开始日的最大日期
        $scope.tblToolbar.apportEndDate = datas;
        $scope.tblDetails.getApportAnalysisData($scope.tblToolbar.apportCityVal.id,$scope.tblToolbar.apportShopVal.id,$scope.tblToolbar.apportStartDate,$scope.tblToolbar.apportEndDate,$scope.tblToolbar.apportDateType)
        // $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
      }
    },
    showStart: function() {
      laydate($scope.apportDatepicker.dateStartOpt);
    },
    showEnd: function() {
      laydate($scope.apportDatepicker.dateEndOpt);
    },
  };
  $scope.tblToolbar = {
    // 现金流
    cashGetCityList: function(){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          //console.log(ret);
          if (ret.success) {
            self.cashCityList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    cashGetShopList: function(id){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + id +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
        .success(function(ret) {
          if (ret.success) {
            self.cashShopList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    cashCityValChanged: function(){
      var self = this;
      if(!self.cashCityVal){
        self.cashCityVal = {
          id: ''
        }
      }
      self.cashGetShopList(self.cashCityVal.id);
      $scope.tblDetails.getCashAnalysisData(self.cashCityVal.id,self.cashShopVal.id,self.cashStartDate,self.cashEndDate,self.cashDateType);
    },
    cashShopValChanged: function(){
      var self = this;
      if(!self.cashShopVal){
        self.cashShopVal = {
          id: ''
        }
      }
      $scope.tblDetails.getCashAnalysisData(self.cashCityVal.id,self.cashShopVal.id,self.cashStartDate,self.cashEndDate,self.cashDateType);
    },
    cashDateTypeChanged: function(){},
    cashCityVal: {id: ''},
    cashShopVal: {id: ''},
    cashStartDate:(function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
    cashEndDate: (function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
    cashDateType: 1,
    // 毛利率
    rateGetCityList: function(){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          //console.log(ret);
          if (ret.success) {
            self.rateCityList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    rateGetShopList: function(id){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + id +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
        .success(function(ret) {
          if (ret.success) {
            self.rateShopList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    rateCityValChanged: function(){
      var self = this;
      if(!self.rateCityVal){
        self.rateCityVal = {
          id: ''
        }
      }
      self.rateGetShopList(self.rateCityVal.id);
      $scope.tblDetails.getRateAnalysisData(self.rateCityVal.id,self.rateShopVal.id,self.rateStartDate,self.rateEndDate,self.rateDateType);
    },
    rateShopValChanged: function(){
      var self = this;
      if(!self.rateShopVal){
        self.rateShopVal = {
          id: ''
        }
      }
      $scope.tblDetails.getRateAnalysisData(self.rateCityVal.id,self.rateShopVal.id,self.rateStartDate,self.rateEndDate,self.rateDateType);
    },
    rateDateTypeChanged:function(){},
    rateCityVal: {id: ''},
    rateShopVal: {id: ''},
    rateStartDate: (function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      // return '2016/06/20';
      })(),
    rateEndDate: (function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
    rateDateType: 1,
    // 分摊收入
    apportGetCityList: function(){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      // Get cities list
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          //console.log(ret);
          if (ret.success) {
            self.apportCityList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    apportGetShopList: function(id){
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL +
          '/api/getShopsByCity?cityID=' + id +
          '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
        .success(function(ret) {
          if (ret.success) {
            self.apportShopList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {
          console.log("Fail! Messgae is: " + msg);
        });
      return promise;
    },
    apportCityValChanged: function(){
      var self = this;
      if(!self.apportCityVal){
        self.apportCityVal = {
          id: ''
        }
      }
      self.apportGetShopList(self.apportCityVal.id);
      $scope.tblDetails.getApportAnalysisData(self.apportCityVal.id,self.apportShopVal.id,self.apportStartDate,self.apportEndDate,self.apportDateType);
    },
    apportShopValChanged: function(){
      var self = this;
      if(!self.apportShopVal){
        self.apportShopVal = {
          id: ''
        }
      }
      $scope.tblDetails.getApportAnalysisData(self.apportCityVal.id,self.apportShopVal.id,self.apportStartDate,self.apportEndDate,self.apportDateType);
    },
    apportDateTypeChanged: function(){},
    apportCityVal: {id: ''},
    apportShopVal: {id: ''},
    apportStartDate: (function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      // return '2016/06/20';
      })(),
    apportEndDate: (function() {
      var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
      return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
    apportDateType: 1,
  }
  $scope.timePeriod = {
    cashChanged: function(e) {
      if (e.target.nodeName !== 'A') {
        return;
      }
      $(".cashTimePeriod>a").removeClass('timePeriodChsn');
      $(e.target).addClass('timePeriodChsn');
      switch ($(e.target).html()) {
        case '日':
          $scope.tblToolbar.cashDateType = 1;
          $scope.tblToolbar.cashStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '周':
          $scope.tblToolbar.cashDateType = 2;
          $scope.tblToolbar.cashStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7 * 4);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '月':
          $scope.tblToolbar.cashDateType = 3;
          $scope.tblToolbar.cashStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 31 * 3);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
      }
      $scope.tblToolbar.cashEndDate = (function() {
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })();
      // $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
     $scope.tblDetails.getCashAnalysisData($scope.tblToolbar.cashCityVal.id,$scope.tblToolbar.cashShopVal.id,$scope.tblToolbar.cashStartDate,$scope.tblToolbar.cashEndDate,$scope.tblToolbar.cashDateType)
    },
    rateChanged: function(e) {
      if (e.target.nodeName !== 'A') {
        return;
      }
      $(".rateTimePeriod>a").removeClass('timePeriodChsn');
      $(e.target).addClass('timePeriodChsn');
      switch ($(e.target).html()) {
        case '日':
          $scope.tblToolbar.rateDateType = 1;
          $scope.tblToolbar.rateStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '周':
          $scope.tblToolbar.rateDateType = 2;
          $scope.tblToolbar.rateStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7 * 4);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '月':
          $scope.tblToolbar.rateDateType = 3;
          $scope.tblToolbar.rateStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 31 * 3);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
      }
      $scope.tblToolbar.rateEndDate = (function() {
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })();
      // $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
     $scope.tblDetails.getRateAnalysisData($scope.tblToolbar.rateCityVal.id,$scope.tblToolbar.rateShopVal.id,$scope.tblToolbar.rateStartDate,$scope.tblToolbar.rateEndDate,$scope.tblToolbar.rateDateType)
    },
    apportChanged: function(e) {
      if (e.target.nodeName !== 'A') {
        return;
      }
      $(".apportTimePeriod>a").removeClass('timePeriodChsn');
      $(e.target).addClass('timePeriodChsn');
      switch ($(e.target).html()) {
        case '日':
          $scope.tblToolbar.apportDateType = 1;
          $scope.tblToolbar.apportStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '周':
          $scope.tblToolbar.apportDateType = 2;
          $scope.tblToolbar.apportStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7 * 4);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '月':
          $scope.tblToolbar.apportDateType = 3;
          $scope.tblToolbar.apportStartDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 31 * 3);
            return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
      }
      $scope.tblToolbar.apportEndDate = (function() {
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })();
      // $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
     $scope.tblDetails.getApportAnalysisData($scope.tblToolbar.apportCityVal.id,$scope.tblToolbar.apportShopVal.id,$scope.tblToolbar.apportStartDate,$scope.tblToolbar.apportEndDate,$scope.tblToolbar.apportDateType)
    },
  };
  $scope.tblDetails = {
    getCashAnalysisData:function(cityID,shopID,startDate,endDate,dateType){
      var self = this;
      var reg = /\//g;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getCashFlowDataBKMgr?cityID='+ cityID + '&shopID='+ shopID +'&startDate='+ startDate.replace(reg,'-') + '&endDate='+ endDate.replace(reg,'-') + '&dateType=' + dateType;
      console.log(url);
      $http.post(url)
      .success(function(ret){
        if(ret.success){
          var option = window.homeStaticsChart.cashOption;
          self.data = ret.data;
          // console.log(self.data);
          // self.data.statsDate = self.data.statsDate.replace(/-/g,'');
          // self.data.startDate = ret.data.startDate.replace(/-/g,'');
          switch($scope.tblToolbar.cashDateType){
            case 1:
            option.tooltip.formatter = function(params){
                var data = params.data;
                console.log(data);
                if (data) {
                  return data.date + '<br/>' +
                    '现金流：' + data.value + ' 元'
                } else {
                  return '温馨提示：此阶段暂无数据';
                }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              option.xAxis[0].name = "时间 / 日";
              angular.forEach(self.data,function(item){
                option.xAxis[0].data.push(item.statsDate);
                option.series[0].data.push({
                  date: item.statsDate,
                  value: Number(item.cashFlow ? item.cashFlow.toFixed(2) : 0)
                })
              })
            }
            break;
            case 2:
            case 3:
            option.tooltip.formatter = function(params){
                var data = params.data;
                if (data) {
                  data.date = data.date.replace(/[-]/g,'');
                  if($scope.tblToolbar.cashDateType ===2){
                    return data.date.slice(0, 4) + '年 第' + data.date.slice(4) + '周' + '<br/>' +
                      '现金流：' + data.value + ' 元'
                  }else if($scope.tblToolbar.cashDateType ===3){
                    return data.date.slice(0, 4) + '年' + data.date.slice(4) + '月' + '<br/>' +
                      '现金流：' + data.value + ' 元'
                  }
                } else {
                  return '温馨提示：此阶段暂无数据';
                }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              if ($scope.tblToolbar.cashDateType === 2) {
                option.xAxis[0].name = "时间 / 周";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年\n第' + item.statsDate.slice(4) + '周');
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.cashFlow ? item.cashFlow.toFixed(2) : 0)
                  })
                })
              } else {
                option.xAxis[0].name = "时间 / 月";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年' + item.statsDate.slice(4) + '月');
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.cashFlow ? item.cashFlow.toFixed(2) : 0)
                  })
                })
              }
            }
          }
          window.homeStaticsChart.cashChart.clear();
          console.log(window.homeStaticsChart.cashOption);
          console.log(window.homeStaticsChart.cashChart.getOption())
          // window.homeStaticsChart.rentRateChart.refresh();
          window.homeStaticsChart.cashChart.setOption(window.homeStaticsChart.cashOption);
          console.log(window.homeStaticsChart.cashChart.getOption())
          // window.myChart.refresh();
        }
      }).error(function(msg){
        console.log("Fail! Messgae is: "+ msg);
      })
    },
    getRateAnalysisData:function(cityID,shopID,startDate,endDate,dateType){
      var self = this;
      var reg = /\//g;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getExpenseAnalysisDataBKMgr?cityID='+ cityID + '&shopID='+ shopID +'&startDate='+ startDate.replace(reg,'-') + '&endDate='+ endDate.replace(reg,'-') + '&dateType=' + dateType;
      console.log(url);
      $http.post(url)
      .success(function(ret){
        console.log(ret);
        if(ret.success){
          var option = window.homeStaticsChart.rateOption;
          self.data = ret.data;
          switch($scope.tblToolbar.rateDateType){
            case 1:
            option.tooltip.formatter = function(params){
              var data = params.data;
              console.log(data);
              if (data) {
                return data.date + '<br/>' +
                '毛利率：' + data.value + ' %'
              } else {
                return '温馨提示：此阶段暂无数据';
              }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              option.xAxis[0].name = '时间 / 日';
              angular.forEach(self.data,function(item){
                option.xAxis[0].data.push(item.statsDate);
                option.series[0].data.push({
                  date: item.statsDate,
                  value: Number(item.grossProfitMargin ? item.grossProfitMargin.toFixed(2)*100 : 0)
                })
              })
            }
            break;
            case 2:
            case 3:
            option.tooltip.formatter = function(params){
              var data = params.data;
              console.log(data);
              if (data) {
                data.date = data.date.replace(/[-]/g,'');
                if($scope.tblToolbar.rateDateType === 2){
                  return data.date.slice(0, 4) + '年 第' + data.date.slice(4) + '周' + '<br/>' +
                  '毛利率：' + data.value + ' %'
                }else if($scope.tblToolbar.rateDateType === 3){
                  return data.date.slice(0, 4) + '年' + data.date.slice(4) + '月' + '<br/>' +
                  '毛利率：' + data.value + ' %'
                }
              } else {
                return '温馨提示：此阶段暂无数据';
              }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              if ($scope.tblToolbar.rateDateType === 2) {
                option.xAxis[0].name = "时间 / 周";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年\n第' + item.statsDate.slice(4) + '周');
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.grossProfitMargin ? item.grossProfitMargin.toFixed(2)*100 : 0)
                  })
                })
              } else {
                option.xAxis[0].name = "时间 / 月";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年' + item.statsDate.slice(4) + '月');
                  console.log(self.data);
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.grossProfitMargin ? item.grossProfitMargin.toFixed(2)*100 : 0)
                  })
                })
              }
            }
            break;
          }
          window.homeStaticsChart.rateChart.clear();
          console.log(window.homeStaticsChart.rateOption);
          console.log(window.homeStaticsChart.rateChart.getOption())
          // window.homeStaticsChart.rentRateChart.refresh();
          window.homeStaticsChart.rateChart.setOption(window.homeStaticsChart.rateOption);
          console.log(window.homeStaticsChart.rateChart.getOption())
          // window.myChart.refresh();
        }
      }).error(function(msg){
        console.log("Fail! Messgae is: "+ msg);
      })
    },
    getApportAnalysisData:function(cityID,shopID,startDate,endDate,dateType){
      var self = this;
      var reg = /\//g;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getExpenseAnalysisDataBKMgr?cityID='+ cityID + '&shopID='+ shopID +'&startDate='+ startDate.replace(reg,'-') + '&endDate='+ endDate.replace(reg,'-') + '&dateType=' + dateType;
      console.log(url);
      $http.post(url)
      .success(function(ret){
        console.log(ret);
        if(ret.success){
          var option = window.homeStaticsChart.apportOption;
          self.data = ret.data;
          switch($scope.tblToolbar.apportDateType){
            case 1:
            option.tooltip.formatter = function(params){
              var data = params.data;
              console.log(data);
              if (data) {
                return data.date + '<br/>' +
                '分摊收入：' + data.value + ' 元'
              } else {
                return '温馨提示：此阶段暂无数据';
              }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              option.xAxis[0].name = '时间 / 日';
              angular.forEach(self.data,function(item){
                option.xAxis[0].data.push(item.statsDate);
                option.series[0].data.push({
                  date: item.statsDate,
                  value: Number(item.incomeAmount ? item.incomeAmount.toFixed(2) : 0)
                })
              })
            }
            break;
            case 2:
            case 3:
            option.tooltip.formatter = function(params){
              var data = params.data;
              console.log(data);
              if (data) {
                data.date = data.date.replace(/[-]/g,'');
                if($scope.tblToolbar.apportDateType === 2){
                  return data.date.slice(0, 4) + '年 第' + data.date.slice(4) + '周' + '<br/>' +
                    '分摊收入：' + data.value + ' 元'
                }else if($scope.tblToolbar.apportDateType === 3){
                  return data.date.slice(0, 4) + '年' + data.date.slice(4) + '月' + '<br/>' +
                    '分摊收入：' + data.value + ' 元'
                }
              } else {
                return '温馨提示：此阶段暂无数据';
              }
            };
            if(self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
            }else{
              option.xAxis[0].data = [];
              option.series[0].data = [];
              if ($scope.tblToolbar.apportDateType === 2) {
                option.xAxis[0].name = "时间 / 周";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年\n第' + item.statsDate.slice(4) + '周');
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.incomeAmount ? item.incomeAmount.toFixed(2) : 0)
                  })
                })
              } else {
                option.xAxis[0].name = "时间 / 月";
                angular.forEach(self.data,function(item){
                  item.statsDate = item.statsDate.replace(/[-]/g,'');
                  option.xAxis[0].data.push(item.statsDate.slice(0, 4) + '年' + item.statsDate.slice(4) + '月');
                  option.series[0].data.push({
                    date: item.statsDate,
                    value: Number(item.incomeAmount ? item.incomeAmount.toFixed(2) : 0)
                  })
                })
              }
            }
          }
          window.homeStaticsChart.apportChart.clear();
          console.log(window.homeStaticsChart.apportOption);
          console.log(window.homeStaticsChart.apportChart.getOption())
          // window.homeStaticsChart.rentRateChart.refresh();
          window.homeStaticsChart.apportChart.setOption(window.homeStaticsChart.apportOption);
          console.log(window.homeStaticsChart.apportChart.getOption())
          // window.myChart.refresh();
        }
      }).error(function(msg){
        console.log("Fail! Messgae is: "+ msg);
      })
    },
    /*getAllData: function(){
      var self = this;
      var tblToolbar = $scope.tblToolbar;
        self.getCashAnalysisData(tblToolbar.cashCityVal.id,tblToolbar.cashShopVal.id,tblToolbar.cashStartDate,tblToolbar.cashEndDate,tblToolbar.cashDateType)
    },*/
  }
  // 引入line.js ------
  // 路径配置
  jQuery.getScript('../../js/echarts.js', function() {
    require.config({
      paths: {
        echarts: '../../js'
      }
    });
    require(
      [
        'echarts',
        'echarts/chart/line'
      ],
      function(ec) {
        var cashOption = {
          title: {
            show: false,
            text: '总现金流趋势图',
          },
          color: ['#FACE9F'],
          animation: true,
          animationDuration: 1000,
          /*noDataLoadingOption: {
            effect: function(params) {
              console.log(arguments);
              console.log(params);
              params.start = function(h) {
                console.log(h);
              };
              params.stop = function() {};
              return params;
            },
          },*/
          tooltip: {
            trigger: 'item',
            enterable: true,
            axisPointer: {
              type: 'none',
              lineStyle: {
                color: '#242424',
                type: 'dashed',
                width: 1
              }
            },
            textStyle: {
              fontSize: 12,
            }
          },
          legend: {
            x: 'right',
            data: ['现金流']
          },
          grid: {
            x: 80,
            y: 30,
            x2: 50,
            y2: 40,
            borderColor: '#E6E7F0'
          },
          xAxis: [{
            // scale: true,
            show: true,
            boundaryGap: false,
            type: 'category',
            name: '时间 / 日',
            data: [0],
            // 坐标轴线设置
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            //坐标轴小标记
            axisTick: {
              show: true,
              inside: true,
              interval: 0,
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            // 坐标轴文本标签选项
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
            // 分割线选项
            splitLine: {
              show: false,
              lineStyle: {
                // width: 1,
                // color: '#E6E7F0'
              }
            },
            // 分隔区域选项
            splitArea: {
              show: false,
              areaStyle: {
                type: 'default', // 目前仅支持这个
                color: [
                  '#ffffff',
                  '#F1F3FA'
                ]
              },
            },
          }],
          yAxis: [{
            name: '现金流（元）',
            type: 'value',
            // min: 0,
            // max: 100000,
            splitNumber: 10,
            splitLine: {
              lineStyle: {
                width: 1,
                color: '#E6E7F0'
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
          }],
          series: [{
            name: '现金流',
            type: 'line',
            smooth: false,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 3,
            // symbolSize: function (value){
            //     return Math.round(value[2]/10) + 2;
            // },
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default'
                }
              }
            },
            data: [[0]],
            // offset: -5,
          }]
        };
        var rateOption = {
          title: {
            show: false,
            text: '毛利率趋势图',
          },
          color: ['#4cb1ff'],
          animation: true,
          animationDuration: 1000,
          /*noDataLoadingOption: {
            effect: function(params) {
              console.log(arguments);
              console.log(params);
              params.start = function(h) {
                console.log(h);
              };
              params.stop = function() {};
              return params;
            },
          },*/
          tooltip: {
            trigger: 'item',
            enterable: true,
            axisPointer: {
              type: 'none',
              lineStyle: {
                color: '#242424',
                type: 'dashed',
                width: 1
              }
            },
            textStyle: {
              fontSize: 12,
            }
          },
          legend: {
            x: 'right',
            data: ['毛利率']
          },
          grid: {
            x: 80,
            y: 30,
            x2: 50,
            y2: 40,
            borderColor: '#E6E7F0'
          },
          xAxis: [{
            // scale: true,
            show: true,
            boundaryGap: false,
            type: 'category',
            name: '时间 / 日',
            data: [0],
            // 坐标轴线设置
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            //坐标轴小标记
            axisTick: {
              show: true,
              inside: true,
              interval: 0,
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            // 坐标轴文本标签选项
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
            // 分割线选项
            splitLine: {
              show: false,
              lineStyle: {
                // width: 1,
                // color: '#E6E7F0'
              }
            },
            // 分隔区域选项
            splitArea: {
              show: false,
              areaStyle: {
                type: 'default', // 目前仅支持这个
                color: [
                  '#ffffff',
                  '#F1F3FA'
                ]
              },
            },
          }],
          yAxis: [{
            name: '毛利率 / %',
            type: 'value',
            // min: 0,
            // max: 100000,
            splitNumber: 10,
            splitLine: {
              lineStyle: {
                width: 1,
                color: '#E6E7F0'
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
          }],
          series: [{
            name: '毛利率',
            type: 'line',
            smooth: false,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 3,
            // symbolSize: function (value){
            //     return Math.round(value[2]/10) + 2;
            // },
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default'
                }
              }
            },
            data: [[0]],
            // offset: -5,
          }]
        };
        var apportOption = {
          title: {
            show: false,
            text: '分摊收入趋势图',
          },
          color: ['#81d16b'],
          animation: true,
          animationDuration: 1000,
          /*noDataLoadingOption: {
            effect: function(params) {
              console.log(arguments);
              console.log(params);
              params.start = function(h) {
                console.log(h);
              };
              params.stop = function() {};
              return params;
            },
          },*/
          tooltip: {
            trigger: 'item',
            enterable: true,
            axisPointer: {
              type: 'none',
              lineStyle: {
                color: '#242424',
                type: 'dashed',
                width: 1
              }
            },
            textStyle: {
              fontSize: 12,
            }
          },
          legend: {
            x: 'right',
            data: ['分摊收入']
          },
          grid: {
            x: 80,
            y: 30,
            x2: 50,
            y2: 40,
            borderColor: '#E6E7F0'
          },
          xAxis: [{
            // scale: true,
            show: true,
            boundaryGap: false,
            type: 'category',
            name: '时间 / 日',
            data: [0],
            // 坐标轴线设置
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            //坐标轴小标记
            axisTick: {
              show: true,
              inside: true,
              interval: 0,
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            // 坐标轴文本标签选项
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
            // 分割线选项
            splitLine: {
              show: false,
              lineStyle: {
                // width: 1,
                // color: '#E6E7F0'
              }
            },
            // 分隔区域选项
            splitArea: {
              show: false,
              areaStyle: {
                type: 'default', // 目前仅支持这个
                color: [
                  '#ffffff',
                  '#F1F3FA'
                ]
              },
            },
          }],
          yAxis: [{
            name: '分摊收入（元）',
            type: 'value',
            // min: 0,
            // max: 100000,
            splitNumber: 10,
            splitLine: {
              lineStyle: {
                width: 1,
                color: '#E6E7F0'
              }
            },
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#9D9FA7'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#9D9FA7'
              }
            },
          }],
          series: [{
            name: '分摊收入',
            type: 'line',
            smooth: false,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 3,
            // symbolSize: function (value){
            //     return Math.round(value[2]/10) + 2;
            // },
            itemStyle: {
              normal: {
                areaStyle: {
                  type: 'default'
                }
              }
            },
            data: [[0]],
            // offset: -5,
          }]
        };
        window.homeStaticsChart = {
          cashChart: ec.init(document.getElementById('cashDiagram')),
          cashOption: cashOption,
          rateChart: ec.init(document.getElementById('rateDiagram')),
          rateOption: rateOption,
          apportChart: ec.init(document.getElementById('apportDiagram')),
          apportOption: apportOption,
          // allIncomeChart: ec.init(document.getElementById('allIncomeDiagram')),
          // allIncomeOption: allIncomeOption
        };
        $(window).on('resize', function() {
          window.homeStaticsChart.cashChart.resize();
          window.homeStaticsChart.rateChart.resize();
          window.homeStaticsChart.apportChart.resize();
          // window.homeStaticsChart.allIncomeChart.resize();
        });

        window.homeStaticsChart.cashChart.setOption(window.homeStaticsChart.cashOption);
        window.homeStaticsChart.rateChart.setOption(window.homeStaticsChart.rateOption);
        window.homeStaticsChart.apportChart.setOption(window.homeStaticsChart.apportOption);
        // //引入完毕后才从服务器拉取数据
        // $scope.tblDetails.getAllData();
        $scope.tblDetails.getCashAnalysisData($scope.tblToolbar.cashCityVal.id,$scope.tblToolbar.cashShopVal.id,$scope.tblToolbar.cashStartDate,$scope.tblToolbar.cashEndDate,$scope.tblToolbar.cashDateType)
        $scope.tblDetails.getRateAnalysisData($scope.tblToolbar.rateCityVal.id,$scope.tblToolbar.rateShopVal.id,$scope.tblToolbar.rateStartDate,$scope.tblToolbar.rateEndDate,$scope.tblToolbar.rateDateType)
        $scope.tblDetails.getApportAnalysisData($scope.tblToolbar.apportCityVal.id,$scope.tblToolbar.apportShopVal.id,$scope.tblToolbar.apportStartDate,$scope.tblToolbar.apportEndDate,$scope.tblToolbar.apportDateType)
      });
  });
  $q.all([$scope.tblToolbar.cashGetCityList(),$scope.tblToolbar.cashGetShopList($scope.tblToolbar.cashCityVal.id),
          $scope.tblToolbar.rateGetCityList(),$scope.tblToolbar.rateGetShopList($scope.tblToolbar.rateCityVal.id),
          $scope.tblToolbar.apportGetCityList(),$scope.tblToolbar.apportGetShopList($scope.tblToolbar.apportCityVal.id)])
}])
