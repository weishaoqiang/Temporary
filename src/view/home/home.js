/**
 * Created by heh12 on 2016/3/22.
 */


angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', ['$scope', function($scope) {
    // Put sth belongs to the specific mng-module here
    // $scope.adminModules = JSON.parse(window.sessionStorage.getItem('adminModules'));
  }])
  .controller('homeIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    $rootScope.globalPath.initPath({
      'name': '仪表盘',
      'url': '../../..' + window.location.pathname + '#/home_index'
    }, 'LV1');
    // Init data
    $scope.rentRateDatepicker = {
      dateStartOpt: {
        elem: '#rentRateDateStart',
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
          $scope.rentRateDatepicker.dateEndOpt.min = datas; //开始日选好后，重置结束日的最小日期
          $scope.rentRateDatepicker.dateEndOpt.start = datas //将结束日的初始值设定为开始日
          $scope.tblStatics.rentRateStart = datas;
          $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
        }
      },
      dateEndOpt: {
        elem: '#rentRateDateEnd',
        format: 'YYYY/MM/DD',
        min: '2011-01-01',
        max: laydate.now(),
        isclear: false,
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.rentRateDatepicker.dateStartOpt.max = datas; //结束日选好后，重置开始日的最大日期
          $scope.tblStatics.rentRateEnd = datas;
          $scope.tblStatics.rentRateDateChanged(); //日期更新后进行图表的相关操作
        }
      },
      showStart: function() {
        laydate($scope.rentRateDatepicker.dateStartOpt);
      },
      showEnd: function() {
        laydate($scope.rentRateDatepicker.dateEndOpt);
      },
    };
    $scope.allIncomeDatepicker = {
      dateStartOpt: {
        elem: '#allIncomeDateStart',
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
          $scope.allIncomeDatepicker.dateEndOpt.min = datas; //开始日选好后，重置结束日的最小日期
          $scope.allIncomeDatepicker.dateEndOpt.start = datas //将结束日的初始值设定为开始日
          $scope.tblStatics.allIncomeStart = datas;
          $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
        }
      },
      dateEndOpt: {
        elem: '#allIncomeDateEnd',
        format: 'YYYY/MM/DD',
        min: '2011-01-01',
        max: laydate.now(),
        isclear: false,
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.allIncomeDatepicker.dateStartOpt.max = datas; //结束日选好后，重置开始日的最大日期
          $scope.tblStatics.allIncomeEnd = datas;
          $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
        }
      },
      showStart: function() {
        laydate($scope.allIncomeDatepicker.dateStartOpt);
      },
      showEnd: function() {
        laydate($scope.allIncomeDatepicker.dateEndOpt);
        // var layDateLeft = Number($('#laydate_box').css('left').slice(0,-2));
        // var layDateWidth = Number($('#laydate_box').css('width').slice(0,-2));
        // if((layDateLeft+layDateWidth+50) > window.innerWidth){
        //   var adj = (layDateLeft-50)+'px';
        //   $('#laydate_box').css('left', adj);
        // }
      },
    };
    $scope.tblToolbar = {
      "getCityList": function() {
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            $scope.tblToolbar.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getShopList": function() {
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + ($scope.tblToolbar.cityVal ? $scope.tblToolbar.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            $scope.tblToolbar.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      //
      "cityValChanged": function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        self.getShopList();
        $scope.tblStatics.getAllData();
      },
      "shopValChanged": function() {
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        $scope.tblStatics.getAllData();
      },
      "shopVal": {
        id: ''
      },
      "cityVal": {
        id: ''
      },
    };
    $scope.tblStatics = {
      /* 仓位出租率 和 容积出租率 -- 已经废弃，更换成如下方法
      "getRentRate": function(){
        var self = this;
        var interfaceStr = 'crtAllRentStatisticsFromBKMgr';
        if($scope.tblToolbar.cityVal.id){
          if($scope.tblToolbar.shopVal.id){
            interfaceStr = 'crtShopRentStatisticsFromBKMgr?shopID='+$scope.tblToolbar.shopVal.id;
          }else{
            interfaceStr = 'crtCityRentStatisticsFromBKMgr?cityID='+$scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://'+$rootScope.globalURL.hostURL+'/api/'+interfaceStr)
          .success(function(ret){
            console.log(ret);
            if(ret.success){
              self.unitsRentRate = Number((ret.data.countRentRate*100).toFixed(4)) + '%';
              self.capacityRentRate = Number((ret.data.volumeRentRate*100).toFixed(4)) + '%';
            }
          }).error(function(msg){
            console.log("Fail! Messgae is: " + msg);
          });
      },  */
      // 同时获取"仓位出租率"和"容积出租率"
      "getCountAndVolumeRent": function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/countAndVolumeRentBKMgr?cityID=' + $scope.tblToolbar.cityVal.id +
            '&shopID=' + $scope.tblToolbar.shopVal.id)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.rentCount = ret.data.rentCount;
              self.allCount = ret.data.allCount;
              self.rentVolume = ret.data.rentVolume;
              self.allVolume = ret.data.allVolume;
              self.countRentRate = Number((ret.data.countRentRate * 100).toFixed(4));
              self.volumeRentRate = Number((ret.data.volumeRentRate * 100).toFixed(4));
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getReveletScale": function() {
        var self = this;
        var interfaceStr = 'allRenewalRateFromBKMgr';
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'shopRenewalRateFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id;
          } else {
            interfaceStr = 'cityRenewalRateFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.reveletScale = Number((ret.data * 100).toFixed(4));
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getIncomeInSevDays": function() {
        var self = this;
        var interfaceStr = 'incomeSBySevDayFromBKMgr';
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'shopIncomeSBySevDayFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id;
          } else {
            interfaceStr = 'cityIncomeSBySevDayFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.incomeInSevDays = Number(ret.data.toFixed(2));
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getAllClientCnt": function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserCountFromBKMgr')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.allClientCnt = Number(ret.data);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getNewOrderCnt": function() {
        var self = this;
        var interfaceStr = 'allNewOrdersFromBKMgr';
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'shopNewOrdersFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id;
          } else {
            interfaceStr = 'cityNewOrdersFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.newOrderCnt = Number(ret.data);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
        });
      },
      "getNewIntentionCnt": function() {
        var self = this;
        var interfaceStr = 'newThreadUsersBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.newIntentionCnt = Number(ret.data);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getSoonExpireOrderCnt": function() {
        var self = this;
        var interfaceStr = 'allWillExpireOrdersFromBKMgr';
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'shopWillExpireOrdersFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id;
          } else {
            interfaceStr = 'cityWillExpireOrdersFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.soonExpireOrderCnt = Number(ret.data);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getExpireOrderCnt": function() {
        var self = this;
        var interfaceStr = 'allExpireOrdersFromBKMgr';
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'shopExpireOrdersFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id;
          } else {
            interfaceStr = 'cityExpireOrdersFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.expireOrderCnt = Number(ret.data);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getStaticsRentRate": function() {
        var self = this;
        var reg = /\//g;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRentsStatisticsBKMgr?cityID=' + $scope.tblToolbar.cityVal.id +
            '&shopID=' + $scope.tblToolbar.shopVal.id +
            '&startTime=' + self.rentRateStart.replace(reg, '-') +
            '&endTime=' + self.rentRateEnd.replace(reg, '-'))
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var reg = /-/g;
              var option = window.homeStaticsChart.rentRateOption;
              // Set X-AXIS
              // option.xAxis[0].min = new Date(self.rentRateStart).getTime();
              // option.xAxis[0].max = new Date(self.rentRateEnd).getTime();
              // var splitNum = ((option.xAxis[0].max - option.xAxis[0].min)/24/3600/1000)+1;
              // option.xAxis[0].splitNumber = splitNum;
              // Set data
              if (ret.data.length === 0) {
                option.xAxis[0].data = [0];
                option.series[0].data = [0];
              } else {
                option.xAxis[0].data = [];
                option.series[0].data = [];
                for (var i in ret.data) {
                  option.xAxis[0].data.push(ret.data[i].statisticsDate);
                  option.series[0].data.push({
                    value: Number((ret.data[i].volumeRate * 100).toFixed(2)),
                    statisticsDate: ret.data[i].statisticsDate,
                    rentVolume: Number((ret.data[i].rentVolume ? (ret.data[i].rentVolume).toFixed(2) : 0)),
                    allVolume: Number((ret.data[i].allVolume ? (ret.data[i].allVolume).toFixed(2) : 0)),
                  });
                }
              }
              window.homeStaticsChart.rentRateChart.clear();
              // window.homeStaticsChart.rentRateChart.refresh();
              window.homeStaticsChart.rentRateChart.setOption(window.homeStaticsChart.rentRateOption);
              // window.myChart.refresh();
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getStaticsAllIncome": function() {
        var self = this;
        var reg = /\//g;
        var interfaceStr = 'queryIncomeStatisticFromBKMgr?startTime=' + self.allIncomeStart.replace(reg, '-') +
          '&endTime=' + self.allIncomeEnd.replace(reg, '-') +
          '&timeType=' + self.timePeriodType;
        if ($scope.tblToolbar.cityVal.id) {
          if ($scope.tblToolbar.shopVal.id) {
            interfaceStr = 'queryShopIncomeStatisticFromBKMgr?shopID=' + $scope.tblToolbar.shopVal.id +
              '&startTime=' + self.allIncomeStart.replace(reg, '-') +
              '&endTime=' + self.allIncomeEnd.replace(reg, '-') +
              '&timeType=' + self.timePeriodType;
          } else {
            interfaceStr = 'queryCityIncomeStatisticFromBKMgr?cityID=' + $scope.tblToolbar.cityVal.id +
              '&startTime=' + self.allIncomeStart.replace(reg, '-') +
              '&endTime=' + self.allIncomeEnd.replace(reg, '-') +
              '&timeType=' + self.timePeriodType;
          }
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + interfaceStr)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var reg = /-/g;
              var option = window.homeStaticsChart.allIncomeOption;
              // Set X-AXIS
              switch (self.timePeriodType) {
                case 1:
                  option.tooltip.formatter = function(params) {
                    console.log(params);
                    var data = params.data;
                    if (data) {
                      return data.date + '<br/>' +
                        '总收款：' +
                        data.value.toFixed(2) +
                        '元';
                    } else {
                      return '温馨提示：此阶段暂无数据';
                    }
                  };
                  // Set data
                  if (ret.data.length === 0) {
                    option.xAxis[0].data = [0];
                    option.series[0].data = [0];
                  } else {
                    option.xAxis[0].data = [];
                    option.series[0].data = [];
                    for (var i in ret.data) {
                      option.xAxis[0].data.push(ret.data[i].statisticsDate);
                      option.series[0].data.push({
                        value: Number(ret.data[i].income.toFixed(2)),
                        date: ret.data[i].statisticsDate,
                      });
                    }
                  }
                  break;
                case 2:
                case 3:
                  //Set data
                  if (ret.data.length === 0) {
                    option.series[0].data = [0];
                    option.xAxis[0].data = [0];
                  } else {
                    option.series[0].data = [];
                    option.xAxis[0].data = [];
                    if (self.timePeriodType === 2) {
                      option.xAxis[0].name = "时间/周";
                    } else {
                      option.xAxis[0].name = "时间/月";
                    }
                    option.tooltip.formatter = function(params) {
                      console.log(params);
                      var data = params.data;
                      if (params.data) {
                        if (self.timePeriodType === 2) {
                          var timeStr = data.date.slice(0, 4) + '年 第' + data.date.slice(4) + '周';
                        } else if (self.timePeriodType === 3) {
                          var timeStr = data.date.slice(0, 4) + '年' + data.date.slice(4) + '月';
                        }
                        return '时间：' + timeStr + '<br/>' +
                          '收款：' +
                          data.value.toFixed(2) +
                          '元';
                      } else {
                        return '温馨提示：此阶段暂无数据';
                      }
                    };
                    for (var i in ret.data) {
                      if (self.timePeriodType === 2) {
                        option.xAxis[0].data.push(ret.data[i].time.slice(0, 4) + '年\n第' + ret.data[i].time.slice(4) + '周');
                      } else {
                        option.xAxis[0].data.push(ret.data[i].time.slice(0, 4) + '年' + ret.data[i].time.slice(4) + '月');
                      }
                      option.series[0].data.push({
                        value: ret.data[i].income,
                        date: ret.data[i].time,
                      });
                    }
                  }
                  break;
              }

              window.homeStaticsChart.allIncomeChart.clear();
              window.homeStaticsChart.allIncomeChart.setOption(window.homeStaticsChart.allIncomeOption);
              console.log(window.homeStaticsChart.allIncomeChart.getOption())
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      "getAllData": function() {
        var self = this;
        self.getCountAndVolumeRent();
        self.getIncomeInSevDays();
        self.getAllClientCnt();
        self.getReveletScale();
        self.getNewOrderCnt();
        self.getNewIntentionCnt();
        self.getSoonExpireOrderCnt();
        self.getExpireOrderCnt();
        self.getStaticsRentRate();
        self.getStaticsAllIncome();
      },
      "rentRateDateChanged": function() {
        var self = this;
        self.getStaticsRentRate();
      },
      "allIncomeDateChanged": function() {
        var self = this;
        self.getStaticsAllIncome();
      },

      "unitsRentRate": 0,
      "capacityRentRate": 0,
      "incomeInSevDays": 0,
      "reveletScale": 0,
      "newOrderCnt": 0,
      "newIntentionCnt": 0,
      "soonExpireOrderCnt": 0,
      "expireOrderCnt": 0,
      // "staticsRentRate": 0,
      "rentRateStart": (function() {
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
        // return '2016/06/20';
      })(),
      "rentRateEnd": (function() {
        var date = new Date();
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
      "allIncomeStart": (function() {
        // return '2016/06/20'
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
      "allIncomeEnd": (function() {
        var date = new Date();
        return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
      })(),
      "timePeriodType": 1,
    };
    $scope.timePeriod = {
      changed: function(e) {
        if (e.target.nodeName !== 'A') {
          return;
        }
        $(".timePeriod>a").removeClass('timePeriodChsn');
        $(e.target).addClass('timePeriodChsn');
        switch ($(e.target).html()) {
          case '日':
            $scope.tblStatics.timePeriodType = 1;
            $scope.tblStatics.allIncomeStart = (function() {
              var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
              return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
            })();
            break;
          case '周':
            $scope.tblStatics.timePeriodType = 2;
            $scope.tblStatics.allIncomeStart = (function() {
              var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7 * 4);
              return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
            })();
            break;
          case '月':
            $scope.tblStatics.timePeriodType = 3;
            $scope.tblStatics.allIncomeStart = (function() {
              var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 31 * 3);
              return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
            })();
            break;
        }
        $scope.tblStatics.allIncomeEnd = (function() {
          var date = new Date();
          return (date.getFullYear() + '/' + ((date.getMonth() + 1 + 100) + '').slice(1) + '/' + ((date.getDate() + 100) + '').slice(1));
        })();
        $scope.tblStatics.allIncomeDateChanged(); //日期更新后进行图表的相关操作
      },
    };
    // Trig function firstly
    $scope.tblToolbar.getCityList();
    $scope.tblToolbar.getShopList();

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
          var rentRateOption = {
            title: {
              show: false,
              text: '容积出租率趋势图',
            },
            color: ['#FACE9F'],
            animation: true,
            animationDuration: 1000,
            noDataLoadingOption: {
              effect: function(params) {
                console.log(arguments);
                console.log(params);
                params.start = function(h) {
                  console.log(h);
                };
                params.stop = function() {};
                return params;
              },
            },
            tooltip: {
              trigger: 'item',
              enterable: true,
              formatter: function(params) {
                var data = params.data;
                if (data) {
                  return data.statisticsDate + '<br/>' +
                    '出租容积：' + data.rentVolume + ' m³<br/>' +
                    '总容积：' + data.allVolume + ' m³<br/>' +
                    '出租率：' + Number(data.value).toFixed(2) + '%';
                } else {
                  return '温馨提示：此阶段暂无数据';
                }
              },
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
            // dataZoom: {
            //     show: false,
            //     start : 50
            // },
            legend: {
              x: 'right',
              data: ['容积出租率']
            },
            grid: {
              x: 40,
              y: 30,
              x2: 60,
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
                  width: 1,
                  color: '#E6E7F0'
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
              name: '出租率 / %',
              type: 'value',
              min: 0,
              max: 100,
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
              name: '容积出租率',
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
              data: [0],
            }]
          };
          var allIncomeOption = {
            title: {
              show: false,
              text: '总收款趋势图',
            },
            color: ['#7EBFD7'],
            animation: true,
            animationDuration: 1000,
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
            // dataZoom: {
            //     show: false,
            //     start : 50
            // },
            legend: {
              x: 'right',
              data: ['总收款']
            },
            grid: {
              x: 60,
              y: 30,
              x2: 60,
              y2: 40,
              borderColor: '#E6E7F0'
            },
            xAxis: [{
              type: 'category',
              name: '时间 / 日',
              data: [0],
              boundaryGap: false,
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
                lineStyle: {}
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
              name: '收款 / 元',
              type: 'value',
              // min: 0,
              // max: 100,
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
              name: '总收款',
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
              data: [
                [0]
              ]
            }]
          };
          window.homeStaticsChart = {
            rentRateChart: ec.init(document.getElementById('rentRateDiagram')),
            rentRateOption: rentRateOption,
            allIncomeChart: ec.init(document.getElementById('allIncomeDiagram')),
            allIncomeOption: allIncomeOption
          };
          $(window).on('resize', function() {
            window.homeStaticsChart.rentRateChart.resize();
            window.homeStaticsChart.allIncomeChart.resize();
          });

          window.homeStaticsChart.rentRateChart.setOption(window.homeStaticsChart.rentRateOption);
          window.homeStaticsChart.allIncomeChart.setOption(window.homeStaticsChart.allIncomeOption);
          //引入完毕后才从服务器拉取数据
          $scope.tblStatics.getAllData();
        });
    });
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/home_index', {
        templateUrl: 'home_index.html?t=' + getTimeStamp(),
        controller: 'homeIndex_ctrl'
      })
      .otherwise({
        redirectTo: '/home_index'
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
