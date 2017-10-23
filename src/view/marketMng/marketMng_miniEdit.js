angular.module('mngApp.marketMiniEdit', ['ngRoute'])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider.when('/marketMng_miniEdit/:id/:businessType', {
        templateUrl: 'marketMng_miniAdd.html?t=' + getTimeStamp(),
        controller: 'marketMngMiniEdit_ctrl'
      })
      .otherwise({
        redirectTo: '/marketMng_index'
      });
  }])
  .controller('marketMngMiniEdit_ctrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$q', '$http', 'discountRuleList', 'TblPagination', function($scope, $rootScope, $routeParams, $timeout, $q, $http, discountRuleList, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '编辑活动',
      'url': '../../..' + window.location.pathname + '#/marketMng_miniAdd/'+$routeParams.id+'/'+$routeParams.businessType
    }, 'LV2');
    // 获取传过来的id
    $scope.id = $routeParams.id;
    $scope.businessType = $routeParams.businessType;
    // 定义编辑页标记
    $scope.viewTag = true;
    // 定义对象接受查询结果
    $scope.queryResult = {};

    $scope.title = "编辑促销信息";
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
        max: '2099-06-16 23:59:59', //最大日期
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
    $scope.typeOneList = [{
      condition: '',
      discount: '',
    }];
    $scope.typeTwoList = [{
      condition: '',
      discount: ''
    }];
    $scope.typeThreeList = [{
      condition: '',
      discount: ''
    }];
    $scope.activeRuleList = [];
    $scope.discountTyprError = false;
    $scope.currentCity = {
      id:'',
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
      getPromotionShopList: function(cityID, pageSize, curPage, promotionID ){
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getNotInPromotionNameBKMgr?type=1&pageSize=' + pageSize + '&curPage=' + curPage + '&cityID=' + cityID + '&isAll=0&key=&promotionID='+ promotionID)
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
      // changeSaleType: function(type) {
      //   $scope.salesType = type;
      // // },
      addSaleRules: function(type) {
        switch (type) {
          case 1:
            $scope.typeOneList.push({
              condition: '',
              discount: '',
            });
            break;
          case 2:
            $scope.typeTwoList.push({
              condition: '',
              discount: ''
            });
            break;
          case 3:
            $scope.typeThreeList.push({
              condition: '',
              discount: ''
            });
            break;
        }
      },
      removeSaleRules: function(type,index){
        switch (type) {
          case 1:
            if($scope.typeOneList.length <= 1){
              return;
              break;
            }
            $scope.typeOneList.splice(index,1);
            break;
          case 2:
            if($scope.typeTwoList.length <= 1){
              return;
              break;
            }
            $scope.typeTwoList.splice(index,1);
            break;
          case 3:
            if($scope.typeThreeList.length <= 1){
              return;
              break;
            }
            $scope.typeThreeList.splice(index,1);
            break;
        }
      },
      stepEvent: function(type) {
        console.log($scope.activeStartTime,$scope.activeEndTime);
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
                break;
              case 2:
                switch ($scope.salesType) {
                  case 1:
                    if (!self.noEmptyItem($scope.typeOneList)) {
                      alert("请填写完整活动列表，请输入数字");
                      return;
                    }
                    $scope.activeRuleList = $scope.typeOneList;
                    break;
                  case 2:
                    if (!self.noEmptyItem($scope.typeTwoList)) {
                      alert("请填写完整活动列表，请输入数字");
                      return;
                    }
                    $scope.activeRuleList = $scope.typeTwoList;
                    break;
                  case 3:
                    if (!self.noEmptyItem($scope.typeThreeList)) {
                      alert("请填写完整活动列表，请输入数字");
                      return;
                    }
                    $scope.activeRuleList = $scope.typeThreeList;
                    break;
                }
                break;
              case 3:
                if ($scope.shopSelectList.length <= 0) {
                  alert("请选择参加活动的门店");
                } else {
                  self.addActivity();
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
        console.log(step);
        console.log($scope.activeStartTime,$scope.activeEndTime);
        var self = this;
        if(step>=4){
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
            switch ($scope.salesType) {
              case 1:
                if (!self.noEmptyItem($scope.typeOneList)) {
                  alert("请填写完整活动列表，请输入数字");
                  return;
                }
                $scope.activeRuleList = $scope.typeOneList;
                break;
              case 2:
                if (!self.noEmptyItem($scope.typeTwoList)) {
                  alert("请填写完整活动列表，请输入数字");
                  return;
                }
                $scope.activeRuleList = $scope.typeTwoList;
                break;
              case 3:
                if (!self.noEmptyItem($scope.typeThreeList)) {
                  alert("请填写完整活动列表，请输入数字");
                  return;
                }
                $scope.activeRuleList = $scope.typeThreeList;
                break;
            }
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
            if($scope.salesType==1&&(!self.noEmptyItem($scope.typeOneList))){
              alert("请填写完整活动列表，请输入数字");
              $scope.step = 2;
              return;
            }
            if($scope.salesType==2&&(!self.noEmptyItem($scope.typeTwoList))){
              alert("请填写完整活动列表，请输入数字");
              $scope.step = 2;
              return;
            }
            if($scope.salesType==3&&(!self.noEmptyItem($scope.typeThreeList))){
              alert("请填写完整活动列表，请输入数字");
              $scope.step = 2;
              return;
            }
            if ($scope.shopSelectList.length <= 0) {
              alert("请选择参加活动的门店");
              return;
            }
            break;
          case 4:
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
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getNotInPromotionNameBKMgr?type=1&pageSize=' + pageSize + '&curPage=' + curPage + '&cityID=' + cityID + '&isAll=1')
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
              console.log(data);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      /** 获取当前活动的详情 **/
      getPromotionDetails: function(id,businessType,callback){
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get miniDetals data
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getPromotionBKMgr?id='+id+'&businessType='+businessType)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
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
      /**
       * [移除已选择项，需要根据shopID进行判断，移除是是否要向shopPreList数组中添加]
       * @param  {[type]} item  [description]
       * @param  {[type]} index [description]
       * @return {[type]}       [description]
       */
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
        this.getPromotionShopList($scope.currentCity.id, $scope.urlParam.pageSize, $scope.urlParam.curPage,$scope.id);
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
        // $scope.shopSelectList = $scope.shopSelectList.concat(list);
        for (var i = 0; i < $scope.shopPreList.length; i++) {
          $scope.shopPreList[i].isAttended = 2;
        }
      },
      /**
       * [清除全部，只有shopPreList中不存在的子项才添加进去，已经存在的项直接跳过]
       * @param  {[type]} list [description]
       * @return {[type]}      [description]
       */
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
        for(var j = 0; j < list.length; j++){
          for (var i = 0; i < $scope.shopPreList.length; i++) {
            if (list[j].shopID === $scope.shopPreList[i].shopID) {
              $scope.shopPreList[i].isAttended = 1;
            }
          }
        }
        list.length = 0;
      },
      addActivity: function() {
        var self = this;
        $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updatePromotionBKMgr?id=' + $scope.id +'&name=' +$scope.activeTitle +'&startDate=' +$scope.activeStartTime +' 00:00:00'+'&endDate=' + $scope.activeEndTime +' 23:59:59'+'&discountType=' + $scope.salesType +'&rule='+ angular.toJson($scope.activeRuleList) +'&remarks=')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              /* 弹出提示窗 */
              // var data = ret.data;
              self.addActivityStep2($scope.id);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      addActivityStep2: function(id) {
        var shopIDList = [];
        for (var i = 0; i < $scope.shopSelectList.length; i++) {
          shopIDList.push($scope.shopSelectList[i].shopID);
        }
        console.log(shopIDList);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updatePromotionObjBKMgr?promotionID=' + id + "&shopID=" + shopIDList)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var data = ret.data.data;
              $scope.step = 4;
              $scope.modalBasic.header.content = '提示';
              $scope.modalBasic.body.content = '修改成功!';
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
      discountRuleChange: function(){
        var self = this;
        $scope.salesType = self.discountRuleVal.id;
      },
      discountRuleList: discountRuleList,
      // discountRuleVal: discountRuleList[1],
    };
    $scope.stepControl.getPromotionDetails($scope.id,$scope.businessType,function(queryResult){
      $scope.currentCity.id = queryResult.cityID;
      $scope.activeTitle = queryResult.name;
      $scope.salesType = queryResult.discountType;
      $scope.activeStartTime = queryResult.startDate.slice(0, 10);
      $scope.activeEndTime = queryResult.endDate.slice(0, 10);
      switch (queryResult.discountType) {
        case 1:
          $scope.typeOneList = JSON.parse(queryResult.rule);
          $scope.stepControl.discountRuleVal = discountRuleList[0];
          break;
        case 2:
          $scope.typeTwoList = JSON.parse(queryResult.rule);
          $scope.stepControl.discountRuleVal = discountRuleList[1];
          break;
        case 3:
          $scope.typeThreeList = JSON.parse(queryResult.rule);
          $scope.stepControl.discountRuleVal = discountRuleList[2];
          break;
        default:
      }
      console.log($scope.typeOneList);
      $scope.stepControl.getCities(queryResult.cityID);
      $scope.stepControl.getPromotionShopList(queryResult.cityID, $scope.urlParam.pageSize, $scope.urlParam.curPage, $scope.id);
    });
  }])
