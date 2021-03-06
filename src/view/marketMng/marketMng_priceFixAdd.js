angular.module('mngApp.marketPriceFixAdd', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_priceFixAdd', {
        templateUrl: 'marketMng_priceFix.html?t=' + getTimeStamp(),
        controller: 'marketMngPriceFixAdd_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_priceIndex'
      });
  }])
  .controller('marketMngPriceFixAdd_ctrl', ['$scope', '$rootScope', '$timeout', '$http', 'discountRuleList', 'TblPagination', function($scope, $rootScope, $timeout, $http, discountRuleList, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '新增活动',
      'url': '../../..' + window.location.pathname + '#/marketMng_priceFixAdd'
    }, 'LV2');
    $scope.title = "添加定价信息";
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
      activeTitleError: false,
      activeStartTimeError: false,
      activeEndTimeError: false,
    };
    $scope.discountTyprError = false;
    $scope.activeTitle = '';
    $scope.activeStartTime = '';
    $scope.activeEndTime = '';
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
          $scope.activeStartTime = datas;
        },
        clear: function() {
          $scope.activeStartTime = '';
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
        min: $scope.activeStartTime,
        max: '2099-06-16', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.activeEndTime = datas;
        },
        clear: function() {
          $scope.activeEndTime = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        self.opt.min = $scope.activeStartTime;
        laydate(self.opt);
      },
    };
    $scope.step = 1;
    $scope.rateList = [{
      condition: '',
      discount: '',
    }];
    $scope.activeRuleList = [];
    $scope.currentCity = '';
    $scope.shopPreList = [];
    $scope.shopSelectList = [];
    // 定义参数容器，通过全部选择之后再统一发送请求
    $scope.urlParam = {
      pageSize: 100, // 每页的信息条数
      curPage: 1, // 当前的页数
    };
    $scope.stepControl = {
      addSaleRules: function() {
        $scope.rateList.push({
          condition: '',
          discount: '',
        });
      },
      removeSaleRules: function(index){
        if($scope.rateList.length <= 1){
          return;
        }
        $scope.rateList.splice(index,1);
      },
      stepEvent: function(type) {
        var self = this;
        if (type === 'next') {
          if ($scope.step === 4) {
            return;
          } else {
            switch ($scope.step) {
              case 1:
                if ($scope.activeTitle === '') {
                  $scope.valiResult.activeTitleError = true;
                  return;
                }
                if ($scope.activeStartTime === '') {
                  $scope.valiResult.activeStartTimeError = true;
                  return;
                }
                if ($scope.activeEndTime === '') {
                  $scope.valiResult.activeEndTimeError = true;
                  return;
                }
                self.addActivityInfo();
                break;
              case 2:
                for (var i = 0; i < $scope.rateList.length; i++) {
                  $scope.rateList[i].dynamicPriceID = $scope.activityID;
                }
                if (!self.noEmptyItem($scope.rateList)) {
                  alert("请填写完整的定价列表，请输入数字");
                  return;
                }
                $scope.activeRuleList = $scope.rateList;
                self.addActivityRules();
                break;
              case 3:
                if ($scope.shopSelectList.length <= 0) {
                  alert("请选择参加活动的门店");
                } else {
                  self.addActivityObjs();
                }
                return;
                break;
            }
            $scope.step += 1;
          }
        } else {
          if ($scope.step === 1) {
              window.history.go(-1);
          } else {
            $scope.step -= 1;
          }
        }
      },
      editStepEvent: function(){
        return;
      },
      noEmptyItem: function(array) {
        var result = false;
        var regRealNum = /^(\d+)(\.\d+)?$/;
        for (var i = 0; i < array.length; i++) {
          if (!regRealNum.test(array[i]['condition']) || !regRealNum.test(array[i]['discount'])) {
            $scope.discountTyprError = true;
            return;
          }
        }
        $scope.discountTyprError = false;
        result = true;
        return result;
      },
      getCities: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=1000&curPage=1')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              self.cityList = data;
              $scope.currentCity = data[0];
              self.getShopList($scope.currentCity.id, $scope.urlParam.pageSize, $scope.urlParam.curPage);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      getShopList: function(cityID, pageSize, curPage) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getParticipateShopBKMgr?pageSize=' + pageSize + '&curPage=' + curPage + '&cityID=' + cityID + '&isAll=1')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              if (curPage === 1) {
                $scope.shopPreList = data;
              } else {
                for (var i = 0; i < data.length; i++) {
                  $scope.shopPreList.push(data[i]);
                }
              }
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      addShops: function(item) {
        if (item.isAttended === 1) {
          item.isAttended = 2;
          $scope.shopSelectList.push(item);
        } else {
          return;
        }
      },
      removeShops: function(item, index) {
        $scope.shopSelectList.splice(index, 1);
        // $scope.shopPreList.push(item)
        for (var i = 0; i < $scope.shopPreList.length; i++) {
          if (item.shopID === $scope.shopPreList[i].shopID) {
            $scope.shopPreList[i].isAttended = 1;
            break;
          }
        }
      },
      changeCity: function(item) {
        $scope.currentCity = item;
        this.getShopList($scope.currentCity.id, $scope.urlParam.pageSize, $scope.urlParam.curPage);
        $scope.shopSelectList = [];
      },
      checkAll: function(list) {
        $scope.shopSelectList = [].concat(list);
        for (var i = 0; i < $scope.shopPreList.length; i++) {
          $scope.shopPreList[i].isAttended = 2;
        }
      },
      clearAll: function(list){
        // $scope.shopPreList = $scope.shopPreList.concat(list);
        // console.log($scope.shopPreList);
        for(var j = 0; j < list.length; j++){
          for (var i = 0; i < $scope.shopPreList.length; i++) {
            if (list[j].shopID === $scope.shopPreList[i].shopID) {
              $scope.shopPreList[i].isAttended = 1;
            }
          }
        }
        list.length = 0;
      },
      addActivityInfo: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addDynamicPriceBKMgr?name=' + $scope.activeTitle + '&startDate=' + $scope.activeStartTime + ' 00:00:00' + '&endDate=' + $scope.activeEndTime + ' 23:59:59' + '&remarks=' + '')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data;
              $scope.activityID = data.id;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      addActivityRules: function() {
        var self = this;
        var rules = angular.toJson($scope.activeRuleList);
        console.log(rules);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addDynamicPriceRuleBKMgr?dynamicPriceRules=' + rules)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      addActivityObjs: function() {
        var shopIDList = [];
        for (var i = 0; i < $scope.shopSelectList.length; i++) {
          shopIDList.push($scope.shopSelectList[i].shopID);
        }
        console.log(shopIDList);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addDynamicPriceObjBKMgr?dynamicPriceID=' + $scope.activityID + "&objIDs=" + shopIDList)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              $scope.step = 4;
              $scope.modalBasic.header.content = '提示';
              $scope.modalBasic.body.content = '提交成功!';
              $scope.modalBasic.footer.btn = [{
                'name': '确定',
                'styleList': ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                }
              }];
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      recreate: function(){
        // window.history.go(0);
        window.location.reload();
        return false;
      }
    };
    $scope.stepControl.getCities();
  }])
