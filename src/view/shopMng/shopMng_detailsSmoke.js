angular.module('mngApp.detailsSmoke', ['ngRoute'])
.controller('shopMngDetailsSmoke_ctrl',['$rootScope','$scope','$routeParams','$http',function($rootScope,$scope,$routeParams,$http){
  $scope.deviceID = $routeParams.id;
  $rootScope.globalPath.initPath({
    'name': '烟感详情',
    'url': '../../..' + window.location.pathname + '#/shopMng_detailsSmoke/' + $scope.deviceID
  }, 'LV3');
  $scope.smokeDatepicker = {
    dateOpt: {
      elem: '#smokeDate',
      format: 'YYYY-MM-DD',
      min: '2011-01-01',
      max: laydate.now(),
      isclear: false,
      istime: false,
      istoday: true,
      choose: function(datas) {
        $scope.tblToolbar.smokeDate = datas;
        $scope.tblDetails.getSmokeData($scope.tblToolbar.smokeDate, $scope.tblToolbar.smokeDate);
      }
    },
    showDate: function() {
      laydate($scope.smokeDatepicker.dateOpt);
    },
  };
  $scope.timePeriod = {
    smokeChanged: function(e) {
      if (e.target.nodeName !== 'A') {
        return;
      }
      $(".smokeTimePeriod>a").removeClass('timePeriodChsn');
      $(e.target).addClass('timePeriodChsn');
      switch ($(e.target).html()) {
        case '昨天':
          // $scope.tblToolbar.cashDateType = 1;
          $scope.tblToolbar.smokeDate = (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
            return (date.getFullYear() + '-' + ((date.getMonth() + 1 + 100) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
        case '今天':
          // $scope.tblToolbar.cashDateType = 2;
          $scope.tblToolbar.smokeDate = (function() {
            var date = new Date((new Date()).getTime());
            return (date.getFullYear() + '-' + ((date.getMonth() + 1 + 100) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
          })();
          break;
      }
      $scope.tblDetails.getSmokeData($scope.tblToolbar.smokeDate,$scope.tblToolbar.smokeDate)
    },
  };
  $scope.tblToolbar = {
    smokeDate:(function() {
      var date = new Date((new Date()).getTime());
      return (date.getFullYear() + '-' + ((date.getMonth() + 1 + 100) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
    })(),
  }
  $scope.tblDetails = {
    getSmokeData: function(startDate,endDate){
      var self = this;
      var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getSmokeHistoryBKMgr?deviceID='+ $scope.deviceID + '&startDate='+ startDate + '&endDate='+ endDate;
      if($scope.tblToolbar.smokeDate === (function() {
        var date = new Date((new Date()).getTime());
        return (date.getFullYear() + '-' + ((date.getMonth() + 1 + 100) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
      })()){
        $(".smokeTimePeriod>a").removeClass('timePeriodChsn');
        $('.smokeTimePeriod>.timePeriodToday').addClass('timePeriodChsn');
      } else if($scope.tblToolbar.smokeDate === (function() {
        var date = new Date((new Date()).getTime() - 24 * 3600 * 1000);
        return (date.getFullYear() + '-' + ((date.getMonth() + 1 + 100) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
      })()){
        $(".smokeTimePeriod>a").removeClass('timePeriodChsn');
        $('.smokeTimePeriod>.timePeriodPrev').addClass('timePeriodChsn');
      } else {
          $(".smokeTimePeriod>a").removeClass('timePeriodChsn');
      }
      $http.get(url)
      .success(function(ret){
        if(ret.success) {
          console.log(ret);
          var option = window.homeStaticsChart.smokeOption;
            option.tooltip.formatter = function(params){
              var data = params.data;
              if (data) {
                return ('日期：' + data.date.slice(0,10) + '<br/>'+'时间：' + data.date.slice(11,13)+ '时'+ data.date.slice(14,16)+ '分' + '<br/>'+'烟浓度：' + data.value + '%FT');
              } else {
                return '温馨提示：此阶段暂无数据';
              }
            };
            self.data = ret.data;
            if (self.data.length === 0){
              option.xAxis[0].data = [0];
              option.series[0].data = [0];
              console.log(1231);
            } else {
              console.log(87978);
              option.xAxis[0].data = [];
              option.series[0].data = [];
              angular.forEach(self.data,function(item){
                option.xAxis[0].data.push(item.statsDate.slice(11,13)+'时'+item.statsDate.slice(14,16)+'分'+ '\n'+ item.statsDate.slice(0,10));
                option.series[0].data.push({
                  date: item.statsDate,
                  value: Number(item.smoke ? item.smoke.toFixed(2) : 0)
                })
              })
            }
            console.log(option.xAxis[0]);
            console.log(option.series[0]);
          window.homeStaticsChart.smokeChart.clear();
          window.homeStaticsChart.smokeChart.setOption(window.homeStaticsChart.smokeOption);
        }
      })
      .error(function(msg){
        console.log("Fail! Messgae is: "+ msg);
      })
    },
  };
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
        var smokeOption = {
          title: {
            show: false,
            text: '烟感统计趋势图',
          },
          color: ['#FACE9F'],
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
          legend: {
            x: 'right',
            data: ['烟感']
          },
          grid: {
            x: 30,
            y: 30,
            x2: 65,
            y2: 40,
            borderColor: '#E6E7F0'
          },
          xAxis: [{
            // scale: true,
            show: true,
            boundaryGap: false,
            type: 'category',
            name: '时间 / 5min',
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
            name: '烟感 / %FT',
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
            name: '烟感',
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
            // offset: -5,
          }]
        };
        window.homeStaticsChart = {
          smokeChart: ec.init(document.getElementById('smokeDiagram')),
          smokeOption: smokeOption,
        };
        $(window).on('resize', function() {
          window.homeStaticsChart.smokeChart.resize();
        });
        window.homeStaticsChart.smokeChart.setOption(window.homeStaticsChart.smokeOption);
        //引入完毕后才从服务器拉取数据
        $scope.tblDetails.getSmokeData($scope.tblToolbar.smokeDate, $scope.tblToolbar.smokeDate);
      });
  });
}])
