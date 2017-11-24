angular.module('mngApp.marketPriceFixEdit', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_priceFixEdit/:id', {
        templateUrl: 'marketMng_priceFix.html?t=' + getTimeStamp(),
        controller: 'marketMngPriceFixEdit_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_priceIndex'
      });
  }])
  .controller('marketMngPriceFixEdit_ctrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$q', '$http', 'discountRuleList', 'TblPagination', function($scope, $rootScope, $routeParams, $timeout, $q, $http, discountRuleList, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '编辑活动',
      'url': '../../..' + window.location.pathname + '#/marketMng_priceFixEdit/'+$routeParams.id
    }, 'LV2');
    // 获取传过来的id
    $scope.id = $routeParams.id;
    $scope.businessType = $routeParams.businessType;
    // 定义编辑页标记
    $scope.viewTag = true;
    // 定义对象接受查询结果
    $scope.queryResult = {};

    $scope.title = "编辑定价信息";
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
    $scope.salesType = '';
    $scope.rateList = [{
      condition: '',
      discount: '',
    }];
    $scope.activeRuleList = [];
    $scope.currentCity = {
      id: '',
    };
    $scope.shopPreList = [];
    $scope.shopSelectList = [];
    // 定义参数容器，通过全部选择之后再统一发送请求
    $scope.urlParam = {
      pageSize: 100, // 每页的信息条数
      curPage: 1, // 当前的页数
    };
    $scope.stepControl = {
      /** 获取参加该活动的门店（只能是同一城市的） **/
      getPriceList: function(cityID, pageSize, curPage, dynamicPriceID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getParticipateShopBKMgr?pageSize=' + pageSize + '&curPage=' + curPage + '&cityID=' + cityID + '&isAll=2&dynamicPriceID='+dynamicPriceID)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              // self.cityListPure = ret.data.data.slice(0);
              self.promotionShopList = ret.data.data;
              console.log(self.promotionShopList);
              $scope.shopSelectList = self.promotionShopList;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      changeSaleType: function(type) {
        $scope.salesType = type;
      },
      addSaleRules: function(type) {
        $scope.rateList.push({
          condition: '',
          discount: '',
        });
      },
      removeSaleRules: function(index){
        // console.log(1234567);
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
                self.updateActivityInfo()
                break;
              case 2:
                for (var i = 0; i < $scope.rateList.length; i++) {
                  $scope.rateList[i].dynamicPriceID = $scope.id;
                }
                if (!self.noEmptyItem($scope.rateList)) {
                  alert("请填写完整定价列表，请输入数字");
                  return;
                }
                $scope.activeRuleList = $scope.rateList;
                self.updateActivityRules();
                break;
              case 3:
                if ($scope.shopSelectList.length <= 0) {
                  alert("请选择参加活动的门店");
                } else {
                  self.updateActivityObjs();
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
      editStepEvent: function(step) {
        var self = this;
        if(step >= 4){
          return;
        }
        $scope.step = step;
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
            break;
          case 2:
            for (var i = 0; i < $scope.rateList.length; i++) {
              $scope.rateList[i].dynamicPriceID = $scope.id;
            }
            if (!self.noEmptyItem($scope.rateList)) {
              alert("请填写完整定价列表");
              return;
            }
            $scope.activeRuleList = $scope.rateList;
            break;
          case 3:
          if($scope.activeTitle === ''||$scope.activeStartTime === ''||$scope.activeEndTime === ''){
            if($scope.activeTitle === ''){
              $scope.valiResult.activeTitleError = true;
            }
            if($scope.activeTitle === ''){
              $scope.valiResult.activeStartTimeError = true;
            }
            if($scope.activeTitle === ''){
              $scope.valiResult.activeEndTimeError = true;
            }
            $scope.step = 1;
            return;
          }
          if(!self.noEmptyItem($scope.rateList)){
            alert("请填写完整活动列表");
            $scope.step = 2;
            return;
          }
          if ($scope.shopSelectList.length <= 0) {
            $scope.step = 3;
            alert("请选择参加活动的门店");
            return;
          }
            if ($scope.shopSelectList.length <= 0) {
              alert("请选择参加活动的门店");
              return;
            }
            break;
          case 4:

            // self.updateActivityInfo()
            // self.updateActivityRules();
            // self.updateActivityObjs();
        }
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
      getCities: function(cityID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=1000&curPage=1')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              for(var i= 0;i< data.length; i++){
                if(data[i].id === cityID){
                  self.cityList = [].concat(data[i]);
                }
              }
              self.getShopList($scope.currentCity.id, $scope.urlParam.pageSize, $scope.urlParam.curPage);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      /** 获取所有门店 **/
      getShopList: function(cityID, pageSize, curPage) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getParticipateShopBKMgr?pageSize=' + pageSize + '&curPage=' + curPage + '&cityID=' + cityID + '&isAll=1')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              console.log(data);
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
      /** 获取当前活动的详情 **/
      getPriceDetails: function(id, businessType, callback) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get miniDetals data
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getDynamicPriceBKMgr?dynamicPriceID=' + id)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              // console.log(ret.data.cityID);
              // $scope.currentCity = ret.data.cityID;
              console.log($scope.queryResult);
              callback($scope.queryResult);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
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
        var shopIDList = [];
        $scope.shopSelectList.splice(index, 1);
        angular.forEach($scope.shopPreList,function(item,index){
          shopIDList.push(item.shopID)
        })
        angular.forEach([].concat(item),function(item,index){
          if(shopIDList.indexOf(item.shopID) == -1){
            $scope.shopPreList.push(item);
          }
        })
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
        this.getPriceList($scope.currentCity.id, $scope.urlParam.pageSize, $scope.urlParam.curPage, $scope.id);
      },
      checkAll: function(list) {
        var shopIDList = [];
        var promotionshopIDList = [];
        angular.forEach($scope.shopSelectList,function(item,index){
          promotionshopIDList.push(item.shopID);
        })
        angular.forEach(list,function(item,index){
          shopIDList.push(item.shopID)
        })
        angular.forEach(shopIDList,function(val,index){
          if(promotionshopIDList.indexOf(val) == -1){
            $scope.shopSelectList.push(list[index]);
            console.log($scope.shopPreList);
          }
        })
        // $scope.shopSelectList = [].concat(list);
        for (var i = 0; i < $scope.shopPreList.length; i++) {
          $scope.shopPreList[i].isAttended = 2;
        }
      },
      clearAll: function(list){
        var shopIDList = [];
        var promotionshopIDList = [];
        angular.forEach($scope.shopPreList,function(item,index){
          shopIDList.push(item.shopID)
        })
        angular.forEach(list,function(item,index){
          promotionshopIDList.push(item.shopID)
        })
        angular.forEach(promotionshopIDList,function(val,index){
          if(shopIDList.indexOf(val) == -1){
            $scope.shopPreList.push(list[index]);
            console.log($scope.shopPreList);
          }
        })
        console.log($scope.shopPreList);
        for(var j = 0; j < list.length; j++){
          for (var i = 0; i < $scope.shopPreList.length; i++) {
            if (list[j].shopID === $scope.shopPreList[i].shopID) {
              $scope.shopPreList[i].isAttended = 1;
            }
          }
        }
        list.length = 0;
      },
      updateActivityInfo: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateDynamicPriceBKMgr?id=' + $scope.id + '&name=' + $scope.activeTitle + '&startDate=' + $scope.activeStartTime + ' 00:00:00' + '&endDate=' + $scope.activeEndTime + ' 23:59:59' + '&remarks=' + '')
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      updateActivityRules: function() {
        var self = this;
        var rules = angular.toJson($scope.activeRuleList);
        console.log(rules);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateDynamicPriceRuleBKMgr?dynamicPriceRules=' + rules)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      updateActivityObjs: function() {
        var shopIDList = [];
        for (var i = 0; i < $scope.shopSelectList.length; i++) {
          shopIDList.push($scope.shopSelectList[i].shopID);
        }
        console.log(shopIDList);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateDynamicPriceObjBKMgr?dynamicPriceID=' + $scope.id + "&objIDs=" + shopIDList)
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
      }
    };
    $scope.stepControl.getPriceDetails($scope.id, $scope.businessType, function(queryResult) {
      console.log(queryResult.cityID);
      $scope.currentCity.id = queryResult.cityID;
      $scope.activeTitle = queryResult.name;
      $scope.salesType = queryResult.discountType;
      $scope.activeStartTime = queryResult.startDate.slice(0, 10);
      $scope.activeEndTime = queryResult.endDate.slice(0, 10);
      $scope.rateList = JSON.parse(queryResult.rules);
      $scope.stepControl.getCities(queryResult.cityID);
      $scope.stepControl.getPriceList(queryResult.cityID, $scope.urlParam.pageSize, $scope.urlParam.curPage, $scope.id);
    });
  }])
