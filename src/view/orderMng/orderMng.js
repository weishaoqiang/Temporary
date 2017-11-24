/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule','ngDraggable'])
  .controller('mngCtrl', [function() {
    // Put sth belongs to the specific mng-module here
  }])
  .controller('orderMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', '$window', '$routeParams', 'orderStateList', 'itemNumList', 'RememberSer', 'TblPagination', 'overDueDateList', 'isVankeList', function($scope, $rootScope, $http, $timeout, $q, $window, $routeParams, orderStateList, itemNumList, RememberSer, TblPagination, overDueDateList, isVankeList) {
    $rootScope.globalPath.initPath({
      'name': '业务订单',
      'url': '../../..' + window.location.pathname + '#/orderMng_index'
    }, 'LV1');

    $scope.pageType = 'REMPAGE';
    // 从URL中获取的参数，存放在这个对象中
    $scope.getUrlParam = {
      cityID: $routeParams.cityID || '',
      startDate: $routeParams.startDate || '',
      endDate: $routeParams.endDate || '',
      managerID: $routeParams.managerID || '',
      shopID: $routeParams.shopID || '',
    };
    // 定义参数容器，通过全部选择之后再统一发送请求
    $scope.urlParam = {
      cityID: '', // 城市id
      isVanke: '', // 项目类型
      shopID: '', //商店id
      orderState: '', // 订单状态
      overDueDate: '', // 过期时间
      startCreateDate: '', // 创建时间
      endCreateDate: '', // 结束时间
      pageSize: 10, // 每页的信息条数
      curPage: 1, // 当前的页数
      key: '',
      managerID: $scope.getUrlParam.managerID, // 管理员id
    };
    /* 模态窗引入 */
    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };
    /* 初始化页面之前先处理参数 */
    var dealParam = function() {
      var obj = {
        cityID: '',
        startDate: '',
        endDate: '',
        managerID: '',
        shopID: ','
      }
      if ($scope.getUrlParam.cityID) {
        obj.cityID = $scope.getUrlParam.cityID;
      } else {
        obj.cityID = $scope.urlParam.cityID;
      }
      if ($scope.getUrlParam.startDate) {
        obj.startDate = $scope.getUrlParam.startDate;
      } else {
        obj.startDate = $scope.urlParam.startCreateDate;
      }
      if ($scope.getUrlParam.endDate) {
        obj.endDate = $scope.getUrlParam.endDate;
      } else {
        obj.endDate = $scope.urlParam.endCreateDate;
      }
      if ($scope.getUrlParam.managerID) {
        obj.managerID = $scope.getUrlParam.managerID;
      } else {
        obj.managerID = '';
      }
      if ($scope.getUrlParam.shopID) {
        obj.shopID = $scope.getUrlParam.shopID;
      } else {
        obj.shopID = $scope.urlParam.shopID;
      }
      return obj;
    }
    /* 判断对象为空对象的方法 */
    var isEmpty = function(obj) {
      for (var key in obj) {
        return false;
      }
      return true;
    }
    // 获取参数的方法集合
    $scope.tblToolbar = {
      // 获得城市参数
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            //console.log(ret);
            if (ret.success) {
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
      getShopList: function(key) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list by cityID
        if ($scope.getUrlParam.cityID) {
          cityID = $scope.getUrlParam.cityID;
        } else {
          cityID = self.cityVal.id || '';
        }
        console.log(cityID);
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + cityID +
            '&pageSize=1000&curPage=1&sortType=1&orderColumn=openDate&key='+ key)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret);
              ret.data.data.unshift({
                name: '-全部-',
                id: ""
              });
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
      // 通过id找到门店名
      getShopNameById: function(shopID) {
        var shopName, self = this;
        // console.log(self.shopList);
        console.log(shopID);
        for(var i = 0; i< self.shopList.length; i++) {
          if( self.shopList[i].id === shopID){
             self.selectShopName = self.shopList[i].name;
             console.log(self.selectShopName);
             return false;
          }
        }
        self.selectShopName = '';
        return false;
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        $scope.getUrlParam['cityID'] = '';
        //Get intentClientList
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.getShopList('');
        self.searchVal = '';
        $scope.urlParam['cityID'] = self.cityVal.id;
        // 从url带过来的参数在重新选择城市的时候要重置为空
        //console.log(urlParam);
        //$scope.tblNormal.getOrderList(self.cityVal.id, '', self.orderStateVal.id, self.itemNumVal.id, 1, '');
      },
      shopValChanged: function(id, name) {
        //Get intentClientList
        console.log(id);
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        } else {
          self.shopVal.id = id;
        }
        self.searchVal = '';
        // $scope.urlParam
        $scope.getUrlParam['shopID'] = '';
        // console.log($scope.getUrlParam.shopID+'==============');
        $scope.urlParam['shopID'] = self.shopVal.id;
        self.selectShopName = name;

      },
      orderStateValChanged: function() {
        var self = this;
        if (!self.orderStateVal) {
          self.orderStateVal = {
            id: ''
          };
        }
        $scope.urlParam['orderState'] = self.orderStateVal.id;
      },
      // 当option选项的值改变，那么将对应的id赋值给$scope.urlParam.isVanke
      isVankeValChanged: function() {
        var self = this;
        if (!self.isVankeVal) {
          self.isVankeVal = {
            id: ''
          };
        }
        self.searchVal = '';
        $scope.urlParam['isVanke'] = self.isVankeVal.id;
      },
      isOverDueDateValChanged: function() {
        var self = this;
        if (!self.overDueDateVal) {
          self.overDueDateVal = {
            id: ''
          };
        }
        self.searchVal = '';
        $scope.urlParam['overDueDate'] = self.overDueDateVal.id;
      },
      // 页面页表的显示条数
      itemNumValChanged: function() {
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
        $scope.urlParam['key'] = self.searchVal;
      },
      launchSearch: function() {
        var self = this;
        $scope.urlParam.key = self.searchVal;
        $scope.tblNormal.getOrderList($scope.urlParam.cityID, $scope.urlParam.shopID, $scope.urlParam.orderState, $scope.urlParam.isVanke, $scope.urlParam.overDueDate, $scope.urlParam.startCreateDate, $scope.urlParam.endCreateDate, $scope.urlParam.pageSize, 1, $scope.urlParam.key, '');
      },
      // 数据筛选的方法
      itemFilter: function() {
        var self = this;
        // console.log($scope.urlParam);
        // $window.location.hash = '#/orderMng_index/';
        // $scope.tblNormal.getOrderList(dealParam().cityID, dealParam().shopID, $scope.urlParam.orderState, $scope.urlParam.isVanke, $scope.urlParam.overDueDate, dealParam().startDate, dealParam().endDate, $scope.urlParam.pageSize, 1, '', '');
        $scope.tblNormal.getOrderList($scope.urlParam.cityID, $scope.urlParam.shopID, $scope.urlParam.orderState, $scope.urlParam.isVanke, $scope.urlParam.overDueDate, $scope.urlParam.startCreateDate, $scope.urlParam.endCreateDate, $scope.urlParam.pageSize, 1, '', '');
        // window.sessionStorage.setItem('orderMngIndexroutePar','');
      },
      exportTblList: function() {
        var self = this;
        var param = $scope.urlParam;
        $scope.tblNormal.itemListExport(dealParam().cityID, dealParam().shopID, param.orderState, param.key, dealParam().managerID, param.overDueDate, dealParam().startDate, dealParam().endDate, param.isVanke);
      },
      // 获取到参数之后向服务器直接发送请求
      itemNumList: itemNumList,
      orderStateList: orderStateList,
      // isVankeList: $scope.paramData['isVanke'],
      // overDueDateList: $scope.paramData['overDueDate'],
      shopVal: {
        id: '',
        name: '全部'
      },
      cityVal: {
        id: '',
        name: '全部'
      },
      orderStateVal: {
        id: '',
        name: '全部'
      },
      searchVal: "", // 搜索框的搜索参数
      itemNumVal: "", // 选择当前页面列表的显示条数
      // 过期时间选项
      overDueDateList: overDueDateList,
      overDueDateVal: {
        id: '',
        name: '全部'
      },
      // 万科内外选项
      isVankeList: isVankeList,
      isVankeVal: {
        id: '',
        name: '全部'
      },
      startDate: '',
      endDate: '',
      managerID: dealParam().managerID,
      shopKeyword:'',
      selectShopName: '-全部-',
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
    $scope.tblNormal = {
      getOrderList: function(cityID, shopID, orderState, isVanke, overDueDate, startCreateDate, endCreateDate, pageSize, curPage, key, managerID) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getOrderListFromMgr?cityID=' + cityID +
          '&shopID=' + shopID + '&state=' + orderState + '&isVanke=' + isVanke + '&overDueDate=' + overDueDate + '&beforeCreateDate=' + startCreateDate + '&afterCreateDate=' + endCreateDate + '&pageSize=' + pageSize + '&curPage=' + curPage + '&sortType=1&orderColumn=createDate&key=' + key + '&managerID=' + managerID;
        console.log(url);
        console.log($scope.getUrlParam.shopID);
        $http.post(url)
          .success(function(ret) {
            //console.log(ret);
            if (ret.success) {
              $scope.tblNormal.dataList = ret.data.data;
              console.log($scope.tblNormal.dataList);
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      itemListExport: function(cityID, shopID, orderState, key, managerID, overDueDate, beforeCreateDate, afterCreateDate, isVanke) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportOrderListBKMgr?cityID=' + cityID + '&shopID=' + shopID + '&state=' + orderState + '&sortType=1&orderColumn=createDate&key=' + key + '&managerID=' + managerID + '&overDueDate=' + overDueDate + '&beforeCreateDate=' + beforeCreateDate + '&afterCreateDate=' + afterCreateDate + '&isVanke=' + isVanke;
        if($scope.tblNormal.dataList &&　$scope.tblNormal.dataList.length> 0){
          $window.location.href = url;
        } else {
          $scope.modalBasic.header.content = '导出数据为空';
          $scope.modalBasic.body.content = '请重新选择导出条件';
          $scope.modalBasic.footer.btn = [{
              "name": '确定',
              "styleList": ['btn', 'btn-confirm'],
              'func': function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              }
            }];
          $timeout(function() {
            $("#myModal").modal({
              show: true,
              backdrop: 'static' //点击周围区域时不会隐藏模态框
            });
          }, 0);
        }
      },
      showDatepickerStart: function(evt) {
        laydate({
          elem: '#startDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            $scope.tblToolbar.startDate = data;
            $scope.urlParam['startCreateDate'] = $scope.tblToolbar.startDate;
            $scope.tblNormal.pickerEndMinDate = data;
            $scope.getUrlParam['startDate'] = '';
          },
          clear: function() {
            $scope.urlParam['startCreateDate'] = '';
            $scope.getUrlParam['startDate'] = '';
          }
        });
        console.log($scope.urlParam);
        laydate.reset();
      },
      showDatepickerEnd: function() {
        laydate({
          elem: '#endDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          min: $scope.tblNormal.pickerEndMinDate,
          choose: function(data) { //选择日期完毕的回调
            $scope.tblToolbar.endDate = data;
            $scope.urlParam['endCreateDate'] = $scope.tblToolbar.endDate;
            $scope.getUrlParam['endDate'] = '';
          },
          clear: function() {
            $scope.urlParam['endCreateDate'] = '';
            $scope.getUrlParam['endDate'] = '';
          }
        });
        console.log($scope.urlParam);
        laydate.reset();
      },
      pickerEndMinDate: '',
    };
    /* 创建页面初始化对象 */
    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.urlParam['curPage'] = pageNum;
      //console.log($scope.getUrlParam);
      // console.log(pageNum );
      $scope.tblNormal.getOrderList(dealParam().cityID, dealParam().shopID, $scope.urlParam.orderState, $scope.urlParam.isVanke, $scope.urlParam.overDueDate, dealParam().startDate, dealParam().endDate, $scope.urlParam.pageSize, pageNum, $scope.urlParam.key, dealParam().managerID);
    };

    $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.getShopList('')])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope) && isEmpty($routeParams)) {
            // 用缓存值覆盖 $scope.urlParam 参数对象
            $scope.urlParam = {
              cityID: $scope.tblToolbar.cityVal.id, // 城市id
              isVanke: $scope.tblToolbar.isVankeVal.id, // 项目类型
              shopID: $scope.tblToolbar.shopVal.id, //商店id
              orderState: $scope.tblToolbar.orderStateVal.id, // 订单状态
              overDueDate: $scope.tblToolbar.overDueDateVal.id, // 过期时间
              startCreateDate: $scope.tblToolbar.startDate, // 创建时间
              endCreateDate: $scope.tblToolbar.endDate, // 结束时间
              pageSize: 10, // 每页的信息条数
              curPage: $scope.tblPagination.curPage, // 当前的页数
              key: $scope.tblToolbar.searchVal,
              managerID: $scope.getUrlParam.managerID, // 管理员id
            };
            $scope.tblToolbar.getShopNameById($scope.tblToolbar.shopVal.id);
            $scope.tblNormal.getOrderList($scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.shopVal.id,
              $scope.tblToolbar.orderStateVal.id,
              $scope.tblToolbar.isVankeVal.id,
              $scope.tblToolbar.overDueDateVal.id,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate,
              $scope.urlParam.pageSize,
              $scope.tblPagination.curPage,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID);
          } else {
            // if(window.sessionStorage.getItem('orderMngIndexroutePar') !==''){
            //   var param = JSON.parse(window.sessionStorage.getItem('orderMngIndexroutePar'));
            //   console.log(param);
            //   $scope.tblNormal.getOrderList(param.cityID, param.shopID, '', '', '', param.startDate, param.endDate, 10, 1, '', param.managerID);
            // }else{
            $scope.tblNormal.getOrderList(dealParam().cityID, dealParam().shopID, '', '', '', dealParam().startDate, dealParam().endDate, 10, 1, '', dealParam().managerID);
            // }
          }
        }
      });
  }])
  .controller('orderMngOther_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', 'itemNumList', 'RememberSer', 'TblPagination', 'otherIncomeTypeList', function($scope, $rootScope, $http, $timeout, $q, itemNumList, RememberSer, TblPagination, otherIncomeTypeList) {
    $rootScope.globalPath.initPath({
      'name': '其他收款订单',
      'url': '../../..' + window.location.pathname + '#/orderMng_other'
    }, 'LV1');

    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.cityList = ret.data.data;
              window.sessionStorage.setItem('vks-web-shopsCache', JSON.stringify(self.cityList));
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.searchVal = '';
        $scope.tblNormal.getOrderList(self.cityVal.id, self.otherIncomeTypeVal.id, self.itemNumVal.id, 1, '');
      },
      itemNumValChanged: function() {
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
        $scope.tblNormal.getOrderList(self.cityVal.id, self.otherIncomeTypeVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      otherIncomeTypeValChanged: function() {
        var self = this;
        if (!self.otherIncomeTypeVal) {
          self.otherIncomeTypeVal = {
            id: ''
          };
        }
        $scope.tblNormal.getOrderList(self.cityVal.id, self.otherIncomeTypeVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        $scope.tblNormal.getOrderList(self.cityVal.id, self.otherIncomeTypeVal.id, self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      otherIncomeTypeList: otherIncomeTypeList,
      cityVal: {
        id: ''
      },
      otherIncomeTypeVal: {
        id: ''
      },
      searchVal: "",
      itemNumVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getOrderList: function(cityID, payType, pageSize, curPage, key) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOtherOrderListLKL?cityID=' + cityID +
            '&payType=' + payType +
            '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data.data);
              $scope.tblNormal.dataList = ret.data.data;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getOrderList(tblToolbar.cityVal.id, tblToolbar.otherIncomeTypeVal.id,
        self.pageSize, pageNum, tblToolbar.searchVal);
    };

    $q.all([$scope.tblToolbar.getCityList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            $scope.tblNormal.getOrderList($scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.otherIncomeTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
          } else {
            $scope.tblNormal.getOrderList('', '', 10, 1, '');
          }
        }
      });
  }])
  .controller('orderMngIndexLimited_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', '$q', 'itemNumList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $routeParams, $q, itemNumList, RememberSer, TblPagination) {
    $scope.param = $routeParams.param;
    var pathName = '';
    switch ($scope.param) {
      case 'new':
        pathName = '今日新增订单';
        break;
      case 'soonExpire':
        pathName = '即将到期订单';
        break;
      case 'expired':
        pathName = '已到期订单';
        break;
    }
    $rootScope.globalPath.initPath({
      'name': pathName,
      'url': '../../..' + window.location.pathname + '#/orderMng_indexLimited/' + $scope.param + '/' + $routeParams.cityID + '/' + $routeParams.shopID
    }, 'LV2');
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.cityList = ret.data.data;
              for (var i in self.cityList) {
                if (self.cityList[i].id == $routeParams.cityID) {
                  self.cityVal = self.cityList[i];
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
      getShopList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.shopList = ret.data.data;
              for (var i in self.shopList) {
                if (self.shopList[i].id == $routeParams.shopID) {
                  self.shopVal = self.shopList[i];
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
      cityValChanged: function() {
        var self = this;
        //Get shopList
        self.getShopList();
        //Get intentClientList
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        $scope.tblNormal.getOrderList(self.cityVal.id, '', self.itemNumVal.id, 1);
      },
      shopValChanged: function() {
        //Get intentClientList
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: ''
          };
        }
        console.log(self.shopVal);
        $scope.tblNormal.getOrderList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1);
      },
      itemNumValChanged: function() {
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
        //Get intentClientList
        $scope.tblNormal.getOrderList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1);
      },
      itemNumList: itemNumList,
      shopVal: {
        id: ''
      },
      cityVal: {
        id: ''
      },
      searchVal: "",
      itemNumVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getOrderList: function(cityID, shopID, pageSize, curPage) {
        var self = this;
        var requestUrl = '';
        var baseUrl = '';
        switch ($scope.param) {
          case 'new':
            baseUrl = 'newOrdersFromBKMgr';
            break;
          case 'soonExpire':
            baseUrl = 'willExpireOrderListFromBKMgr';
            break;
          case 'expired':
            baseUrl = 'expireOrderListFromBKMgr';
            break;
        }
        if (cityID) {
          if (shopID) {
            // requestUrl = 'shopID='+shopID+'&pageSize='+pageSize+'&curPage='+curPage+'&type=1';
            requestUrl = 'shopID=' + shopID + '&pageSize=' + pageSize + '&curPage=' + curPage;
          } else {
            // requestUrl = 'cityID='+cityID+'&pageSize='+pageSize+'&curPage='+curPage+'&type=2';
            requestUrl = 'cityID=' + cityID + '&pageSize=' + pageSize + '&curPage=' + curPage;
          }
        } else {
          // requestUrl = 'pageSize='+pageSize+'&curPage='+curPage+'&type=3';
          requestUrl = 'pageSize=' + pageSize + '&curPage=' + curPage;
        }
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/' + baseUrl + '?' + requestUrl)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
            } else {
              self.dataList = [];
            }
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      exportDataListUrl: (function() {
        var url = '';
        switch ($scope.param) {
          case 'soonExpire':
            url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportWillExpireOrdersFromBKMgr';
            break;
          case 'expired':
            url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportExpireOrdersFromBKMgr';
            break;
          default:
            url = '';
            break;
        }
        return url;
      })(),
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getOrderList(tblToolbar.cityVal.id, tblToolbar.shopVal.id, self.pageSize, pageNum);
    };

    $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.getShopList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            $scope.tblNormal.getOrderList($scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.shopVal.id,
              $scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage);
          } else {
            $scope.tblNormal.getOrderList($routeParams.cityID == 0 ? '' : $routeParams.cityID,
              $routeParams.shopID == 0 ? '' : $routeParams.shopID,
              $scope.tblToolbar.itemNumVal.id, 1);
          }
        }
      });
  }])
  .controller('orderMngQueryOrder_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$q', '$timeout', 'payWayList', '$compile', function($scope, $rootScope, $routeParams, $http, $q, $timeout, payWayList, $compile) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '订单详情',
      'url': '../../..' + window.location.pathname + '#/orderMng_queryOrder/' + $scope.param
    }, 'LV2');
    document.addEventListener('dragleave',function(e){
			e.preventDefault();
		})
		document.addEventListener('drop',function(e){
			e.preventDefault();
		})
		document.addEventListener('dragenter',function(e){
			e.preventDefault();
		})
		document.addEventListener('dragover',function(e){
			e.preventDefault();
		})
    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };
    $scope.queryResult = {
      contractList: [],
    };
    $scope.queryClientResult = {};
    $scope.tblToolbar = {
      onDropComplete: function(index, data, evt) {
        console.log(evt);
        var self = this;
        var oldIndex = -1,
            oldFileIndex = -1,
            file = null;
        var oldData = self.imgInfo[index];
        var oldFile = self.fileArr[index];
        for (var i = 0; i < self.fileArr.length; i++) {
          if(self.fileArr[i].name === data.name) {
            oldFileIndex = i;
            file = self.fileArr[i];
          }
        }
        for (var i = 0; i < self.imgInfo.length; i++) {
          if(self.imgInfo[i].name === data.name) {
            oldIndex = i;
          }
        }
        self.imgInfo[index] = data;
        self.imgInfo[oldIndex] = oldData;
        self.fileArr[index] = file;
        self.fileArr[oldFileIndex] = oldFile;
        console.log(self.fileArr);
      },
      onDragStart: function(e) {
        e.target.parentNode.style.zIndex = 2;
      },
      onDragComplete: function(e) {
        e.event.target.parentNode.style.zIndex = 1;
      },
      // 通过file添加文件方法
		  fileAddFun: function(e) {
        var self = this;
  			var filelist = e.target.files;
  			console.log(filelist);
  			//检测是否是添加文件到页面的操作
  			if(filelist.length === 0){
  					return false;
  			}
  			var tempArr = Array.from(filelist);
        if(tempArr.length > 8) {
          $(".text-tip").html('合同最多可上传8张');
          self.tipShow = true;
          $scope.$apply();
          return false;
        } else {
          for (var item in tempArr) {
            self.readImage(tempArr[item]);
          }
        }
  		},
      // 删除文件的方法
      fileDelFun: function(index) {
        var self = this;
        self.imgInfo.splice(index,1);
        self.fileArr.splice(index,1);
      },
      // 解读图片文件
      readImage: function(file) {
        var self= this;
  			if (window.FileReader) {
  					var reader = new FileReader();
  			} else {
  					alert("您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！");
  			}
  			var isImage = /^(image\/)(jpg|gif|png|jpeg|svg)$/;
				if (isImage.test(file.type)) {
					for (var item in self.fileArr) {
						if (self.fileArr[item].name === file.name) {
							// console.log('不能重复添加同一张图片');
              $(".text-tip").html('不能重复添加同一张图片');
              self.tipShow = true;
              $scope.$apply();
							return false;
						}
					}
					reader.onload = function(e) {
						if (self.fileArr.length >= 8) {
              // console.log('合同最多可上传8张');
              $(".text-tip").html('合同最多可上传8张');
              self.tipShow = true;
              $scope.$apply();
							return false;
						} else {
              /* test start */
              var url = URL.createObjectURL(file);
              var img = new Image();
              img.onload = function() {
                var w = img.width;
                var h = img.height;
                var scale = w / h;
                w = parseInt(2000);
                h = parseInt(w / scale);
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.setAttribute("width", w);
                canvas.setAttribute("height", h);
                ctx.drawImage(img, 0, 0, w, h);
                var base64 = canvas.toDataURL('image/jpeg', 0.95);
                var blob = $scope.base642Img(base64);
                file.Blob = blob;
                self.fileArr.push(file);
              }
              img.src = url;
              /* test end */
              self.imgInfo.push({
                url: e.target.result,
                name: file.name,
                uploaded: false,
              });
              $scope.$apply();
						}
					};
				} else {
          // console.log('请添加图片文件');
          $(".text-tip").html('请添加图片文件');
          self.tipShow = true;
          $scope.$apply();
          return false;
				}
  			reader.readAsDataURL(file);
  		},
      // 上传文件方法
      uploadContract: function(){
        var self = this;
        if(self.fileArr.length <= 0){
          $(".text-tip").html('请添加图片');
          self.tipShow = true;
          return false;
        }
        var uploadCount = 0;
        self.uploading = true;
        if(self.uploadFlag){
          // var uploadList = this.getContractList();
          self.uploadFlag = false;
          angular.forEach(self.fileArr,function(item, index){
            var formData = new FormData();
            // console.log(item.name);
            item.Blob.name = item.name;
            formData.append('orderID', $scope.param);
            formData.append('pictureIndex', index);
            formData.append('file', item.Blob , item.name);
            console.log(formData.get('orderID'),' ',formData.get('pictureIndex'),' ',formData.get('file'));
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/orderContractImgUploadAliYunOpen',formData,{
              headers : {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": undefined,
              }
            })
            .success(function(res){
              if(res.success){
                self.imgInfo[index].uploaded = true;
                uploadCount++;
                // 如果图片全部上传
                if(uploadCount === self.fileArr.length){
                  // 关闭上传框
                  self.uploadView = false;
                  self.uploading = false;
                  // 刷新页面
                  $scope.modalBasic.header.content = '提示';
                  $scope.modalBasic.body.content = '全部上传完成';
                  $scope.modalBasic.footer.btn = [{
                    "name": '确定',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        var promiseContract = $scope.tblDetails.getContractDetails();
                        promiseContract.then(function(result){
                          if(result){
                            console.log($scope.querycontractResult);
                            $scope.queryResult.contractList = $scope.querycontractResult;
                              self.uploadFlag = true;
                              self.fileArr = [];
                              self.imgInfo = [];
                          }
                        })
                      });
                    }
                  }]
                  $timeout(function() {
                    $("#myModal").modal({
                      show: true,
                      backdrop: 'static' //点击周围区域时不会隐藏模态框
                    });
                  }, 400);
                }
              } else {
                self.uploadFlag = true;
                self.uploading = false;
                self.imgInfo[index].uploaded = false;
                self.uploadView = false;
                $scope.modalBasic.header.content = '提示';
                $scope.modalBasic.body.content = '有图片上传失败，请重新上传！';
                $scope.modalBasic.footer.btn = [{
                  "name": '重新上传',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      // 有图片上传失败，先清空数据库，再重新上传
                      $http.post('http://' + $rootScope.globalURL.hostURL + '/api/deleteOrderContractPictureByOrderIDWXMgr?orderID=' + $scope.param)
                      .success(function(res){
                        self.uploadView = true;
                        angular.forEach(self.imgInfo, function(item, index){
                          self.imgInfo[index].uploaded = false;
                        })
                      })
                    });
                  }
                }]
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 400);
              }
              console.log(self.imgInfo[index]);
              console.log(uploadCount);
              console.log(self.fileArr.length === uploadCount);
            })
          })
        } else {
          return false;
        }
      },
      // 取消上传方法
      canceluploadContract: function(){
        var self = this;
        if(self.uploading) {
          self.uploadView = false;
          $scope.modalBasic.header.content = '提示';
          $scope.modalBasic.body.content = '文件正在上传，无法取消！';
          $scope.modalBasic.footer.btn = [{
            "name": '确定',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                self.uploadView = true;
                $scope.$apply();
              })
            }
          }]
          $timeout(function() {
            $("#myModal").modal({
              show: true,
              backdrop: 'static' //点击周围区域时不会隐藏模态框
            });
          }, 400);
        } else {
          self.uploadView = false;
          self.fileArr = []; // file对象数组
          self.imgInfo = []; // 图片信息提取之后的数组
        }
      },
      // 显示上传文件框
      showUploadBox: function(){
        this.uploadView = true;
      },
      // 点击图片并展示
      viewContractImage: function(index){
        var self = this;
        self.imageIndex = index;
        self.viewUrl = $scope.queryResult.contractList[self.imageIndex].pictureUrl;
        // console.log(self.viewUrl);
        // $scope.$apply();
        // setViewBoxLH();
      },
      // 上一张合同图片
      prevContractImage: function() {
        var self = this;
        self.viewer.prev();
      },
      // 下一张合同图片
      nextContractImage: function() {
        var self = this;
        self.viewer.next();
      },
      // 查看图片
      loadImg: function(){
        var self = this;
        self.dom = document.getElementById("previewImg");
        self.image = self.dom.children;
        self.viewer = new Viewer(self.dom, {
          navbar: false,
          scalable: false,
          transition: false,
          title: true,
        });
        self.dom.addEventListener('hidden', function () {
          self.viewUrl = '';
          $scope.$apply();
        }, false);
      },
      // 定义文件存储数据
      fileArr: [], // file对象数组
      imgInfo: [], // 图片信息提取之后的数组
      uploadView: false,
      uploadFlag: true,
      uploading: false,
      tipShow: false,
      // firstImgViewTip: false,
      // lastImgViewTip: false,
      // turnRotate: -90,
      // count: 0,
    }

    /**
     * [将base64文件转成file Blob]
     * @param  {[type]} base64 [base64字符串]
     * @return {[type]}        [file blob]
     */
    $scope.base642Img = function(base64) {
       var byteString;
       if (base64.split(',')[0].indexOf('base64') >= 0)
         byteString = atob(base64.split(',')[1]);
       else
         byteString = unescape(base64.split(',')[1]);
       var mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
       var ia = new Uint8Array(byteString.length);
       for (var i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
       }
       return new Blob([ia], {
         type: mimeString,
       });
     };

    // 设置图片浏览是img-box的行高,使图片上下区中。
    // var setViewBoxLH = function(){
    //   var WindowH = $(window).height();
    //   $(".viewContract-outerbox .img-box").css({"line-height": WindowH+"px"})
    // }

    var watchtipShow = $scope.$watch('tblToolbar.tipShow',function(newVal){
      if(newVal === true){
        $timeout(function() {
          $scope.tblToolbar.tipShow = false;
          // watchtipShow();
        }, 2000);
      }
    })

    // var watchFirstImgViewTip = $scope.$watch('tblToolbar.firstImgViewTip',function(newVal){
    //   if(newVal === true){
    //     $timeout(function() {
    //       $scope.tblToolbar.firstImgViewTip = false;
    //       // watchtipShow();
    //     }, 800);
    //   }
    // })
    // var watchLastImgViewTip = $scope.$watch('tblToolbar.lastImgViewTip',function(newVal){
    //   if(newVal === true){
    //     $timeout(function() {
    //       $scope.tblToolbar.lastImgViewTip = false;
    //       // watchtipShow();
    //     }, 800);
    //  }
    // })
    $scope.$on('repeatDone',function(e){
        $scope.tblToolbar.loadImg();
    });
    $scope.tblDetails = {
      getOrderDetails: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOrderDetailFromBKMgr?orderID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data);
              $scope.queryResult = ret.data;
              $scope.queryResult.orderUnitList = JSON.parse($scope.queryResult.orderUnitNames);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
        return promise;
      },
      getContractDetails: function(){
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOrderContractPictureWXMgr?orderID=' + $scope.param)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.querycontractResult = ret.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
        return promise;
      },
      getClientDetails: function(clienID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserFromAdm?id=' + clienID)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret);
              $scope.queryClientResult = ret.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log("Fail! " + msg);
          });
        return promise;
      },
      exportContract: function(orderID) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/downloadContactBKMgr?orderID=' + $scope.queryResult.orderID)
          .success(function(ret) {
            if (ret.success === false) {
              $scope.modalBasic.header.content = '导出提示';
              $scope.modalBasic.body.content = '导出失败！' + ret.message;
              $scope.modalBasic.footer.btn = [{
                "name": '返回',
                "styleList": ['btn', 'btn-cancel'],
                'func': function() {
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                }
              }];
              $("#myModal").modal({
                show: true,
                backdrop: 'static' //点击周围区域时不会隐藏模态框
              });
            } else {
              window.location.href = 'http://' + $rootScope.globalURL.hostURL + '/api/downloadContactBKMgr?orderID=' + $scope.queryResult.orderID;
            }
          })
          .error(function(err) {});
      },
    };
    var promiseOrder = $scope.tblDetails.getOrderDetails();
    promiseOrder.then(function(result) {
      if (result) {
        var promiseClient = $scope.tblDetails.getClientDetails($scope.queryResult.userID);
        promiseClient.then(function(result) {
          if (result) {
            $scope.queryResult.userName = $scope.queryClientResult.name;
          }
        }, function(error) {});
        var promiseContract = $scope.tblDetails.getContractDetails();
        promiseContract.then(function(result){
          if(result){
            console.log($scope.querycontractResult);
            $scope.queryResult.contractList = $scope.querycontractResult;
          }
        })
      }
    }, function(error) {});
  }])
  .controller('orderMngQueryOtherOrder_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$q', 'payWayList', function($scope, $rootScope, $routeParams, $http, $q, payWayList) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '订单详情',
      'url': '../../..' + window.location.pathname + '#/orderMng_queryOtherOrder/' + $scope.param
    }, 'LV2');

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };
    $scope.queryResult = {};
    $scope.queryClientResult = {};
    $scope.tblDetails = {
      getShopList: function(cityID) {
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + cityID +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            if (ret.success) {
              self.shopList = ret.data.data;
            } else {}
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getOrderDetails: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOtherOrderLKL?orderID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data);
              $scope.queryResult = ret.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
        return promise;
      },
      cityList: (function() {
        return JSON.parse(window.sessionStorage.getItem('vks-web-shopsCache'));
      })(),
    };
    ($scope.tblDetails.getOrderDetails()).then(function(flag) {
      if (flag) {
        $scope.tblDetails.getShopList($scope.queryResult.cityID);
      }
    });
  }])
  .controller('orderMngEditOrder_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'payWayList', function($scope, $rootScope, $routeParams, $http, $timeout, $q, payWayList) {
    $scope.title = '编辑订单';
    $scope.param = $routeParams.param;
    $scope.globalPath.initPath({
      'name': '编辑订单',
      'url': '../../..' + window.location.pathname + '#/orderMng_editOrder/' + $scope.param
    }, 'LV2');
    $scope.formResult = {};
    $scope.queryResult = {};
    $scope.startDatepicker = {
      opt: {
        elem: '#startDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01',
        max: '2099-06-16 23:59:59', //最大日期
        // max: laydate.now(), //最大日期
        isclear: false,
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.startDate = datas;
        }
      },
      showStartDate: function() {
        var self = this;
        laydate(self.opt);
      },
    };
    $scope.payTimepicker = {
      opt: {
        elem: '#payTime',
        format: 'YYYY-MM-DD hh:mm:ss',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01 00:00:00',
        max: '2099-06-16 23:59:59', //最大日期
        // max: laydate.now(), //最大日期
        isclear: false,
        istime: true,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.payTime = datas;
        }
      },
      showPayTime: function() {
        var self = this;
        laydate(self.opt);
      },
    };

    $scope.tblDetails = {
      getOrderDetails: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOrderDetailFromBKMgr?orderID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              console.log($scope.queryResult.orderCancelDate);
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
        return promise;
      },
      getClientDetails: function(clienID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserFromAdm?id=' + clienID)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryClientResult = ret.data;
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log("Fail! " + msg);
          });
        return promise;
      },
      validateForm: function() {
        var canSubmit = true;
        var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){2,}$/;
        var regPhone = /^1[3|4|5|8][0-9]{9}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        var regTime = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
        var regNum = /^[1-9][0-9]*$/;
        var regRealNum = /^[0-9]+(.[0-9]{1,})?$/;
        var formResult = $scope.formResult;
        var queryResult = $scope.queryResult;
        //
        if (!regDate.test(formResult.startDate)) {
          $scope.valiResult.startDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.startDateError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (queryResult.orderPayTime && !regTime.test(formResult.payTime)) {
          $scope.valiResult.payTimeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.payTimeError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regNum.test(formResult.rentLast)) {
          $scope.valiResult.rentLastError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.rentLastError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regRealNum.test(formResult.deposit)) {
          $scope.valiResult.depositError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.depositError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regRealNum.test(formResult.price)) {
          $scope.valiResult.priceError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.priceError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regRealNum.test(formResult.discount)) {
          $scope.valiResult.discountError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.discountError = false;
          canSubmit = canSubmit && true;
        }
        //
        // if(!regRealNum.test(formResult.sumPrice)){
        if (formResult.sumPrice < 0) {
          $scope.valiResult.sumPriceError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.sumPriceError = false;
          canSubmit = canSubmit && true;
        }
        //
        // if(!regRealNum.test(formResult.actualPay)){
        if (formResult.actualPay < 0) {
          $scope.valiResult.actualPayError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.actualPayError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        console.log(self.validateForm());
        if (self.validateForm()) {
          $scope.formResult.id = $scope.param;
          $scope.formResult.adminID = window.localStorage.getItem('vks-web-adminID');
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '编辑提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateOrderFromBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '更新订单信息成功！';
                  $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }, {
                    "name": '重新编辑',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  }];
                } else {
                  $scope.modalBasic.body.content = '更新订单信息失败！' + ret.message;
                  $scope.modalBasic.footer.btn = [{
                    "name": '返回',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }, {
                    "name": '重新编辑',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  }];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {
                console.log('Fail! ' + msg);
              });

          }
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
    };
    $scope.modalBasic = {
      header: {
        content: ''
      },
      body: {
        content: ''
      },
      footer: {
        btn: []
      }
    };
    $scope.valiResult = {
      startDateError: false,
      payTimeError: false,
      rentLastError: false,
      priceError: false,
      depositError: false,
      discountError: false,
      sumPriceError: false,
      actualPayError: false,
    };
    var promiseOrder = $scope.tblDetails.getOrderDetails();
    promiseOrder.then(function(result) {
      if (result) {
        //console.log($scope.queryResult);
        $scope.formResult.startDate = $scope.queryResult.orderStartDate.slice(0, $scope.queryResult.orderStartDate.indexOf(' '));
        $scope.formResult.payTime = $scope.queryResult.orderPayTime;
        // $scope.formResult.rent = $scope.queryResult.orderRent;
        // console.log($scope.formResult.rent);
        $scope.formResult.rentLast = $scope.queryResult.orderRentLast;
        $scope.formResult.deposit = $scope.queryResult.orderDeposit;
        $scope.formResult.actualPay = $scope.queryResult.orderActualPay;
        $scope.formResult.price = $scope.queryResult.unitPrice;
        $scope.formResult.discount = $scope.queryResult.orderDiscount;
        $scope.formResult.sumPrice = 0;
        var fixItem = function(newValBuf, oldValBuf) {
          console.log(arguments);
          if (!$scope.formResult.rentLast) {
            $scope.formResult.rentLast = 0;
          }
          if (!$scope.formResult.price) {
            $scope.formResult.price = 0;
          }
          if (!$scope.formResult.deposit) {
            $scope.formResult.deposit = 0;
          }
          if (!$scope.formResult.discount) {
            $scope.formResult.discount = 0;
          }
        };
        $scope.$watchGroup(['formResult.rentLast', 'formResult.price', 'formResult.deposit', 'formResult.discount'], fixItem, true);
        console.log($scope.formResult);
        var promiseClient = $scope.tblDetails.getClientDetails($scope.queryResult.userID);
        promiseClient.then(function(result) {
          if (result) {
            console.log($scope.queryResult);
            $scope.queryResult.userName = $scope.queryClientResult.name;
          }
        }, function(error) {});
      }
    }, function(error) {});
  }])
  .controller('orderMngDataAnaly_ctrl', ['$scope', '$rootScope', '$http', '$q', '$window', 'orderStateList', 'itemNumList', 'RememberSer', 'TblPagination', 'dateSer', 'timeTypeList', '$timeout', function($scope, $rootScope, $http, $q, $window, orderStateList, itemNumList, RememberSer, TblPagination, dateSer, timeTypeList, $timeout) {
    $rootScope.globalPath.initPath({
      'name': '数据分析',
      'url': '../../..' + window.location.pathname + '#/orderMng_DataAnaly'
    }, 'LV1');
    $scope.pageType = 'REMINDEXPAGE';
    $scope.remCfg = [
      'tblToolbar',
      'cityTblPagination',
      'shopTblPagination',
      'saleTblPagination',
      'tblNormal',
      'tblSortable',
    ];
    // 获取今天的时间
    $scope.getToday = dateSer.getTodayDateStr;
    // 获取过去N天时间
    $scope.getGoneDay = dateSer.getGoneDay;
    console.log($scope.getGoneDay(569354665));
    // 参数数据集合
    $scope.urlParam = {
      cityParam: {
        cityID: '',
        startDate: $scope.getGoneDay(569354665), // 初始化时间是过去七天
        endDate: $scope.getToday(), // 获取今天的时间
        pageSize: 5,
        curPage: 1,
      },
      shopParam: {
        cityID: '',
        startDate: $scope.getGoneDay(569354665), // 初始化时间是过去七天
        endDate: $scope.getToday(),
        pageSize: 5,
        curPage: 1,
        key: '',
      },
      saleParam: {
        cityID: '',
        startDate: $scope.getGoneDay(569354665), // 初始化时间是过去七天
        endDate: $scope.getToday(),
        pageSize: 5,
        curPage: 1,
        key: '',
      }
    };
    // 排序
    $scope.tblSortable = {
      cityTheadConfig: {
        curSortItem: {
          sortName: 'income'
        },
        sortStr: 'incomeDESC',
        sortBuffer: {
          name: {
            name: '城市名称',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          newOrderNum: {
            name: '新增订单',
            canSort: true,
            sortName: 'newOrderNum',
            sortDir: '',
            sortState: false,
          },
          income: {
            name: '销售收款(元)',
            canSort: true,
            sortName: 'income',
            sortDir: 'down',
            sortType: 1,
            sortState: true,
          },
          salePrice: {
            name: '销售单价(元/m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolume: {
            name: '租出容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          firstVolume: {
            name: '新租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          renewalVolume: {
            name: '续租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolumeMonth: {
            name: '出租m³*月',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          // averageRentTime: {
          //   name: '平均租期',
          //   canSort: false,
          //   sortName: '',
          //   sortDir: '',
          //   sortState: false,
          // },
          rentRate: {
            name: '出租率',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          apartIncome: {
            name: '分摊收入(元)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
        },
      },
      shopTheadConfig: {
        curSortItem: {
          sortName: 'income'
        },
        sortStr: 'incomeDESC',
        sortBuffer: {
          name: {
            name: '门店名称',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          newOrderNum: {
            name: '新增订单',
            canSort: true,
            sortName: 'newOrderNum',
            sortDir: '',
            sortState: false,
          },
          income: {
            name: '销售收款(元)',
            canSort: true,
            sortName: 'income',
            sortDir: 'down',
            sortType: 1,
            sortState: true,
          },
          salePrice: {
            name: '销售单价(元/m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolume: {
            name: '租出容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          firstVolume: {
            name: '新租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          renewalVolume: {
            name: '续租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolumeMonth: {
            name: '出租m³*月',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentRate: {
            name: '出租率',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          apartIncome: {
            name: '分摊收入(元)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
        },
      },
      saleTheadConfig: {
        curSortItem: {
          sortName: 'income'
        },
        sortStr: 'incomeDESC',
        sortBuffer: {
          name: {
            name: '销售人员',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          newOrderNum: {
            name: '新增订单',
            canSort: true,
            sortName: 'newOrderNum',
            sortDir: '',
            sortState: false,
          },
          income: {
            name: '销售收款(元)',
            canSort: true,
            sortName: 'income',
            sortDir: 'down',
            sortType: 1,
            sortState: true,
          },
          salePrice: {
            name: '销售单价(元/m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolume: {
            name: '租出容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          firstVolume: {
            name: '新租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          renewalVolume: {
            name: '续租容积(m³)',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          rentVolumeMonth: {
            name: '出租m³*月',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
        },
      },
      cityLaunchSort: function(objName, item) {
        var self = this;
        var buffer = self.cityTheadConfig.sortBuffer;
        // 如果点击的不是已经排序项，则将排序向复位
        if (objName !== self.cityTheadConfig.curSortItem.sortName) {
          var sortName = self.cityTheadConfig.curSortItem.sortName;
          self.cityTheadConfig.sortBuffer[sortName].sortState = false;
          self.cityTheadConfig.sortBuffer[sortName].sortDir = '';
          self.cityTheadConfig.curSortItem = self.cityTheadConfig.sortBuffer[objName];
        }
        if (!item.sortState) {
          item.sortState = true;
          item.sortDir = 'down';
          item.sortType = 1;
          self.cityTheadConfig.sortStr = self.cityTheadConfig.curSortItem.sortName + 'DESC';
        } else if (item.sortDir === 'down') {
          item.sortDir = 'up';
          item.sortType = 0;
          self.cityTheadConfig.sortStr = self.cityTheadConfig.curSortItem.sortName + 'ASC';
          console.log(self.cityTheadConfig.sortStr);
        } else if (item.sortDir === 'up') {
          item.sortDir = 'down';
          item.sortType = 1;
          self.cityTheadConfig.sortStr = self.cityTheadConfig.curSortItem.sortName + 'DESC';
          console.log(self.cityTheadConfig.sortStr);
        }

        self.cityTheadConfig.curSortItem = self.cityTheadConfig.sortBuffer[objName];
        $scope.getAllData();
      },
      shopLaunchSort: function(objName, item) {
        var self = this;
        var buffer = self.shopTheadConfig.sortBuffer;
        // 如果点击的不是已经排序项，则将排序向复位
        if (objName !== self.shopTheadConfig.curSortItem.sortName) {
          var sortName = self.shopTheadConfig.curSortItem.sortName;
          self.shopTheadConfig.sortBuffer[sortName].sortState = false;
          self.shopTheadConfig.sortBuffer[sortName].sortDir = '';
          self.shopTheadConfig.curSortItem = self.shopTheadConfig.sortBuffer[objName];
        }
        if (!item.sortState) {
          item.sortState = true;
          item.sortDir = 'down';
          item.sortType = 1;
          self.shopTheadConfig.sortStr = self.shopTheadConfig.curSortItem.sortName + 'DESC';
        } else if (item.sortDir === 'down') {
          item.sortDir = 'up';
          item.sortType = 0;
          self.shopTheadConfig.sortStr = item.sortName + 'ASC';
          console.log(self.shopTheadConfig);
        } else if (item.sortDir === 'up') {
          item.sortDir = 'down';
          item.sortType = 1;
          self.shopTheadConfig.sortStr = item.sortName + 'DESC';
          console.log(self.shopTheadConfig);
        }
        self.shopTheadConfig.curSortItem = self.shopTheadConfig.sortBuffer[objName];
        // var tblToolbar = $scope.tblToolbar;
        $scope.getAllData();
      },
      saleLaunchSort: function(objName, item) {
        var self = this;
        var buffer = self.saleTheadConfig.sortBuffer;
        // 如果点击的不是已经排序项，则将排序向复位
        if (objName !== self.saleTheadConfig.curSortItem.sortName) {
          var sortName = self.saleTheadConfig.curSortItem.sortName;
          self.saleTheadConfig.sortBuffer[sortName].sortState = false;
          self.saleTheadConfig.sortBuffer[sortName].sortDir = '';
          self.saleTheadConfig.curSortItem = self.saleTheadConfig.sortBuffer[objName];
        }
        if (!item.sortState) {
          item.sortState = true;
          item.sortDir = 'down';
          item.sortType = 1;
          self.saleTheadConfig.sortStr = self.saleTheadConfig.curSortItem.sortName + 'DESC';
        } else if (item.sortDir === 'down') {
          item.sortDir = 'up';
          item.sortType = 0;
          self.saleTheadConfig.sortStr = item.sortName + 'ASC';
        } else if (item.sortDir === 'up') {
          item.sortDir = 'down';
          item.sortType = 1;
          self.saleTheadConfig.sortStr = item.sortName + 'DESC';
        }
        self.saleTheadConfig.curSortItem = self.saleTheadConfig.sortBuffer[objName];
        $scope.getAllData();
      },
    };
    /* 模态窗引入 */
    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };
    $scope.tblToolbar = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data.data);
              self.shopCity.cityList = ret.data.data;
              self.saleCity.cityList = ret.data.data;
              // window.sessionStorage.setItem('vks-web-shopsCache', JSON.stringify(self.shopCity.cityList));
              // window.sessionStorage.setItem('vks-web-shopsCache', JSON.stringify(self.saleCity.cityList));
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
        return promise;
      },
      // 选择城市
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.searchVal = '';
        var cityCityValId = self.cityVal.id;
        // var cityParam = $scope.urlParam.cityParam;
        // $scope.tblNormal.getCityOrderList(cityParam.startDate, cityParam.endDate, cityParam.pageSize,cityParam.curPage,self.searchVal);
        $scope.getAllData();
      },
      shopCityValChanged: function() {
        var self = this;
        if (!self.shopCity.cityVal) {
          self.shopCity.cityVal = {
            id: '',
          }
        }
        self.shopSearchVal = '';
        $scope.urlParam.shopParam['cityID'] = self.shopCity.cityVal.id;
        $scope.getAllData()
      },
      saleCityValChanged: function() {
        var self = this;
        if (!self.saleCity.cityVal) {
          self.saleCity.cityVal = {
            id: ''
          };
        }
        self.saleSearchVal = '';
        $scope.urlParam.saleParam['cityID'] = self.saleCity.cityVal.id;
        $scope.getAllData();
      },
      // 选择pageSize
      cityItemNumValChanged: function() {
        var self = this;
        $scope.getAllData();
      },
      shopItemNumValChanged: function() {
        var self = this;
        self.shopSearchVal = '';
        $scope.urlParam.shopParam.pageSize = self.shopItemNum.itemNumVal.id;
        $scope.getAllData();
      },
      saleItemNumValChanged: function() {
        var self = this;
        self.saleSearchVal = '';
        $scope.urlParam.saleParam.pageSize = self.saleItemNum.itemNumVal.id;
        $scope.getAllData();
      },
      // 选择时间
      // 选择框选择时间
      cityTimeTypeValChange: function() {
        var self = this;
        if (!self.cityTimeType.timeTypeVal) {
          self.cityTimeType.timeTypeVal = {
            id: ''
          }
        }
        // 获取今天时间并给参数赋值
        $scope.urlParam.cityParam.endDate = $scope.getToday();
        if (self.cityTimeType.timeTypeVal.id === 'manual') {
          // 选自选时间时，将startDate设置为空。
          $scope.urlParam.cityParam.startDate = '';
        } else {
          $scope.urlParam.cityParam.startDate = $scope.getGoneDay(self.cityTimeType.timeTypeVal.msTime);
        }
        // 定义一个变量储存选择时间类型的id,不知怎么的页面对象中的时间总是'7d'
        self.cityTimeTypeVal = self.cityTimeType.timeTypeVal.id;

        // var cityParam = $scope.urlParam.cityParam;
        // $scope.tblNormal.getCityOrderList(cityParam.startDate, cityParam.endDate, cityParam.pageSize,cityParam.curPage,self.searchVal);
        $scope.getAllData();
      },
      shopTimeTypeValChange: function() {
        var self = this;
        if (!self.shopTimeType.timeTypeVal) {
          self.shopTimeType.timeTypeVal = {
            id: ''
          }
        }
        // 获取今天时间并给参数赋值
        $scope.urlParam.shopParam.endDate = $scope.getToday();
        if (self.shopTimeType.timeTypeVal.id === 'manual') {
          $scope.urlParam.shopParam.startDate = '';
        } else {
          $scope.urlParam.shopParam.startDate = $scope.getGoneDay(self.shopTimeType.timeTypeVal.msTime)
        }
        // 定义一个变量储存选择时间类型的id,不知怎么的页面对象中的时间总是'7d'
        self.shopTimeTypeVal = self.shopTimeType.timeTypeVal.id;
        $scope.getAllData();
      },
      saleTimeTypeValChange: function() {
        var self = this;
        if (!self.shopTimeType.timeTypeVal) {
          self.shopTimeType.timeTypeVal = {
            id: ''
          }
        }
        // 获取今天时间并给参数赋值
        $scope.urlParam.saleParam.endDate = $scope.getToday();
        if (self.saleTimeType.timeTypeVal.id === 'manual') {
          $scope.urlParam.saleParam.startDate = '';
        } else {
          $scope.urlParam.saleParam.startDate = $scope.getGoneDay(self.saleTimeType.timeTypeVal.msTime);
        }
        // 定义一个变量储存选择时间类型的id,不知怎么的页面对象中的时间总是'7d'
        self.saleTimeTypeVal = self.saleTimeType.timeTypeVal.id;
        $scope.getAllData();
      },
      // 搜索
      shopLaunchSearch: function() {
        var self = this;
        $scope.urlParam.shopParam.key = self.shopSearchVal;
        // var shopParam = $scope.urlParam.shopParam;
        // $scope.tblNormal.getShopOrderList(shopParam.cityID,shopParam.startDate, shopParam.endDate, shopParam.pageSize,shopParam.curPage,self.shopSearchVal);
        $scope.getAllData();
      },
      saleLaunchSearch: function() {
        var self = this;
        $scope.urlParam.saleParam.key = self.saleSearchVal;
        // var saleParam = $scope.urlParam.saleParam;
        // $scope.tblNormal.getSaleOrderList(saleParam.cityID,saleParam.startDate, saleParam.endDate, saleParam.pageSize,saleParam.curPage,self.saleSearchVal);
        $scope.getAllData();
      },
      //导出列表
      cityPerListExport: function() {
        var cityParam = $scope.urlParam.cityParam;
        var type = 'exportCityOrderSaleListBKMgr';
        var data = $scope.tblNormal.CityDataList;
        var param = 'startDate=' + cityParam.startDate + '&endDate=' + cityParam.endDate;
        $scope.tblNormal.itemListExport(type, param, data);
      },
      cityPerListDetailsExport: function() {
        var cityParam = $scope.urlParam.cityParam;
        var type = 'exportCityOrderSaleDetailListBKMgr';
        var data = $scope.tblNormal.CityDataList;
        var param = 'startDate=' + cityParam.startDate + '&endDate=' + cityParam.endDate;
        $scope.tblNormal.itemListExport(type, param, data);
      },
      shopPerListExport: function() {
        console.log();
        var shopParam = $scope.urlParam.shopParam;
        var type = 'exportShopOrderSaleListBKMgr';
        var data = $scope.tblNormal.shopDataList;
        var param = 'cityID=' + shopParam.cityID + '&startDate=' + shopParam.startDate + '&endDate=' + shopParam.endDate;
        $scope.tblNormal.itemListExport(type, param, data);
      },
      salePerListExport: function() {
        var saleParam = $scope.urlParam.saleParam;
        var type = 'exportMgrOrderSaleListBKMgr';
        var data = $scope.tblNormal.saleDataList;
        var param = 'cityID=' + saleParam.cityID + '&startDate=' + saleParam.startDate + '&endDate=' + saleParam.endDate;
        $scope.tblNormal.itemListExport(type, param, data);
      },
      // 三个pageSize选择分别定义
      cityItemNum: {
        itemNumList: itemNumList,
        itemNumVal: '',
      },
      shopItemNum: {
        itemNumList: itemNumList,
        itemNumVal: '',
      },
      saleItemNum: {
        itemNumList: itemNumList,
        itemNumVal: '',
      },
      shopCity: {
        cityVal: {
          id: '',
          name: '全部'
        }
      },
      saleCity: {
        cityVal: {
          id: '',
          name: '全部'
        }
      },
      cityTimeType: {
        timeTypeList: timeTypeList,
        timeTypeVal: timeTypeList[0],
      },
      shopTimeType: {
        timeTypeList: timeTypeList,
        timeTypeVal: timeTypeList[0],
      },
      saleTimeType: {
        timeTypeList: timeTypeList,
        timeTypeVal: timeTypeList[0],
      },
      shopSearchVal: "",
      saleSearchVal: "",
      //autoSel: false,
      // 定义一个变量储存选择时间类型的id,不知怎么的页面对象中的时间总是'7d'
      cityTimeTypeVal: '',
      shopTimeTypeVal: '',
      saleTimeTypeVal: '',
    };
    // 初始化pageSize
    $scope.tblToolbar.cityItemNum.itemNumVal = $scope.tblToolbar.cityItemNum.itemNumList[1];
    $scope.tblToolbar.shopItemNum.itemNumVal = $scope.tblToolbar.shopItemNum.itemNumList[0];
    $scope.tblToolbar.saleItemNum.itemNumVal = $scope.tblToolbar.saleItemNum.itemNumList[0];

    $scope.tblNormal = {
      // 获取城市销售业绩
      getCityOrderList: function(startDate, endDate, pageSize, curPage, orderType) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getCityOrderSaleListBKMgr?&startDate=' + startDate + '&endDate=' + endDate + '&pageSize=' + pageSize + '&curPage=' + curPage + '&orderType=' + orderType;
        console.log('城市销售业绩地址' + url);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCityOrderSaleListBKMgr?&startDate=' + startDate + '&endDate=' + endDate + '&pageSize=' + pageSize + '&curPage=' + curPage + '&orderType=' + orderType)
          .success(function(cityRet) {
            console.log(cityRet);
            if (cityRet.success) {
              $scope.tblNormal.CityDataList = cityRet.data.list.data;
              $scope.tblNormal.CityStat = cityRet.data.all[0];
              // 重组数据结构
              var retData = {};
              retData.data = cityRet.data.list;
              console.log(retData);
              $scope.cityTblPagination.initPagination(retData);
              // console.log('我来初始化城市页面啦！！！！！！！！！！！！');
              // console.log($scope.tblNormal.CityDataList);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      // 获取门店销售业绩
      getShopOrderList: function(cityID, startDate, endDate, pageSize, curPage, key, orderType) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getShopOrderSaleListBKMgr?cityID=' + cityID +
          '&startDate=' + startDate + '&endDate=' + endDate +
          '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&orderType=' + orderType;
        console.log('门店销售业绩' + url);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopOrderSaleListBKMgr?cityID=' + cityID +
            '&startDate=' + startDate + '&endDate=' + endDate +
            '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&orderType=' + orderType)
          .success(function(shopRet) {
            console.log(shopRet);
            if (shopRet.success) {
              $scope.tblNormal.shopDataList = shopRet.data.list.data;
              $scope.tblNormal.shopStat = shopRet.data.all[0];
              var retData = {};
              retData.data = shopRet.data.list;
              console.log(retData);
              $scope.shopTblPagination.initPagination(retData);
              console.log('我来初始化门店页面啦！！！！！！！！！！！！');
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      // 获取销售人员业绩
      getSaleOrderList: function(cityID, startDate, endDate, pageSize, curPage, key, orderType) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getMgrOrderSaleListBKMgr?cityID=' + cityID +
          '&startDate=' + startDate + '&endDate=' + endDate +
          '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&orderType=' + orderType;
        console.log('获取销售人员业绩' + url);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getMgrOrderSaleListBKMgr?cityID=' + cityID +
            '&startDate=' + startDate + '&endDate=' + endDate +
            '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&orderType=' + orderType)
          .success(function(saleRet) {
            console.log(saleRet);
            if (saleRet.success) {
              $scope.tblNormal.saleDataList = saleRet.data.list.data;
              $scope.tblNormal.saleStat = saleRet.data.all[0];
              var retData = {};
              retData.data = saleRet.data.list;
              $scope.saleTblPagination.initPagination(retData);
              // console.log('我来初始化销售业绩页面啦！！！！！！！！！！！！');
              // console.log($scope.tblNormal.saleDataList);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      // 导出数据的方法
      itemListExport: function(type, param, data) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/' + type + '?' + param;
        if(data && data.length > 0) {
          $window.location.href = url;
        } else {
          console.log('导出数据为空');
          $scope.modalBasic.header.content = '导出数据为空';
          $scope.modalBasic.body.content = '请重新选择导出条件';
          $scope.modalBasic.footer.btn = [{
              "name": '确定',
              "styleList": ['btn', 'btn-confirm'],
              'func': function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              }
            }];
          $timeout(function() {
            $("#myModal").modal({
              show: true,
              backdrop: 'static' //点击周围区域时不会隐藏模态框
            });
          }, 0);
        }
      },
      // 选择时间
      showDatepickerStart: function(evt) {
        var self = this;
        var targetID = evt.target.parentNode.children[0].id;
        // console.log(targetID);
        laydate({
          elem: '#' + targetID,
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            if (targetID.slice(0, 4) === 'city') {
              self.cityStartDate = data;
              $scope.urlParam.cityParam['startDate'] = data;
              $scope.tblToolbar.cityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'shop') {
              self.shopStartDate = data;
              $scope.urlParam.shopParam['startDate'] = data;
              $scope.tblToolbar.shopCityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'sale') {
              self.saleStartDate = data;
              $scope.urlParam.saleParam['startDate'] = data;
              $scope.tblToolbar.saleCityValChanged();
              // $scope.getAllData();
            }
          },
          clear: function() {
            if (targetID.slice(0, 4) === 'city') {
              self.cityStartDate = '';
              $scope.urlParam.cityParam['startDate'] = '';
              $scope.tblToolbar.cityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'shop') {
              self.shopStartDate = '';
              $scope.urlParam.shopParam['startDate'] = '';
              $scope.tblToolbar.shopCityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'sale') {
              self.saleStartDate = '';
              $scope.urlParam.saleParam['startDate'] = '';
              $scope.tblToolbar.saleCityValChanged();
              // $scope.getAllData();
            }
          }
        });
        laydate.reset();
      },
      showDatepickerEnd: function(evt) {
        var self = this;
        var targetID = evt.target.parentNode.children[0].id;
        // console.log(targetID);
        laydate({
          elem: '#' + targetID,
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            if (targetID.slice(0, 4) === 'city') {
              self.cityEndDate = data;
              $scope.urlParam.cityParam['endDate'] = data;
              $scope.tblToolbar.cityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'shop') {
              self.shopEndDate = data;
              $scope.urlParam.shopParam['endDate'] = data;
              $scope.tblToolbar.shopCityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'sale') {
              self.saleEndDate = data;
              $scope.urlParam.saleParam['endDate'] = data;
              $scope.tblToolbar.saleCityValChanged();
              // $scope.getAllData();
            }
          },
          clear: function() {
            if (targetID.slice(0, 4) === 'city') {
              self.cityEndDate = '';
              $scope.urlParam.cityParam['endDate'] = '';
              $scope.tblToolbar.cityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'shop') {
              self.shopEndDate = '';
              $scope.urlParam.shopParam['endDate'] = '';
              $scope.tblToolbar.shopCityValChanged();
              // $scope.getAllData();
            } else if (targetID.slice(0, 4) === 'sale') {
              self.saleEndDate = '';
              $scope.urlParam.saleParam['endDate'] = '';
              $scope.tblToolbar.saleCityValChanged();
              // $scope.getAllData();
            }
          }
        });
        laydate.reset();
      },
      cityStartDate: '',
      cityEndDate: $scope.getToday(),
      shopStartDate: '',
      shopEndDate: $scope.getToday(),
      saleStartDate: '',
      saleEndDate: $scope.getToday(),
    };

    // 获取所有数据
    $scope.getAllData = function(remCfg) {
      // 这里是拿的变量中的内容
      var tblToolbar = $scope.tblToolbar;
      var shopCityID = tblToolbar.shopCity.cityVal.id;
      var saleCityID = tblToolbar.saleCity.cityVal.id;
      var cityTimeType = tblToolbar.cityTimeType;
      var shopTimeType = tblToolbar.shopTimeType;
      var saleTimeType = tblToolbar.saleTimeType;
      var cityItemNum = tblToolbar.cityItemNum;
      var shopItemNum = tblToolbar.shopItemNum;
      var saleItemNum = tblToolbar.saleItemNum;
      var tblNormal = $scope.tblNormal;
      var cityStartDate = tblNormal.cityStartDate;
      var cityEndDate = tblNormal.cityEndDate;
      var shopStartDate = tblNormal.shopStartDate;
      var shopEndDate = tblNormal.shopEndDate;
      var saleStartDate = tblNormal.saleStartDate;
      var saleEndDate = tblNormal.saleEndDate;
      var cityTheadConfig = $scope.tblSortable.cityTheadConfig;
      var shopTheadConfig = $scope.tblSortable.shopTheadConfig;
      var saleTheadConfig = $scope.tblSortable.saleTheadConfig;
      var cityParam = $scope.urlParam.cityParam,
        shopParam = $scope.urlParam.shopParam,
        saleParam = $scope.urlParam.saleParam;
      if (!remCfg) {
        console.log('没有缓存');
        if ($scope.tblToolbar.cityTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getCityOrderList($scope.tblNormal.cityStartDate, $scope.tblNormal.cityEndDate, $scope.tblToolbar.cityItemNum.itemNumVal.id, 1, $scope.tblSortable.cityTheadConfig.sortStr);
        } else {
          $scope.tblNormal.getCityOrderList($scope.getGoneDay($scope.tblToolbar.cityTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.cityItemNum.itemNumVal.id, 1, $scope.tblSortable.cityTheadConfig.sortStr);
        }
        if ($scope.tblToolbar.shopTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getShopOrderList($scope.tblToolbar.shopCity.cityVal.id, $scope.tblNormal.shopStartDate, $scope.tblNormal.shopEndDate, $scope.tblToolbar.shopItemNum.itemNumVal.id, 1, $scope.tblToolbar.shopSearchVal, $scope.tblSortable.shopTheadConfig.sortStr);
        } else {
          $scope.tblNormal.getShopOrderList($scope.tblToolbar.shopCity.cityVal.id, $scope.getGoneDay($scope.tblToolbar.shopTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.shopItemNum.itemNumVal.id, 1, $scope.tblToolbar.shopSearchVal, $scope.tblSortable.shopTheadConfig.sortStr);
        }
        if ($scope.tblToolbar.saleTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getSaleOrderList($scope.tblToolbar.saleCity.cityVal.id, $scope.tblNormal.saleStartDate, $scope.tblNormal.saleEndDate, $scope.tblToolbar.saleItemNum.itemNumVal.id, 1, $scope.tblToolbar.saleSearchVal, $scope.tblSortable.saleTheadConfig.sortStr);
        } else {
          $scope.tblNormal.getSaleOrderList($scope.tblToolbar.saleCity.cityVal.id, $scope.getGoneDay($scope.tblToolbar.saleTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.saleItemNum.itemNumVal.id, 1, $scope.tblToolbar.saleSearchVal, $scope.tblSortable.saleTheadConfig.sortStr);
        }
      } else {
        console.log('有缓存');
        if ($scope.tblToolbar.cityTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getCityOrderList(cityStartDate, cityEndDate, $scope.tblToolbar.cityItemNum.itemNumVal.id, $scope.cityTblPagination.curPage, cityTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.cityParam.startDate = cityStartDate;
          $scope.urlParam.cityParam.endDate = cityEndDate;
        } else {
          $scope.tblNormal.getCityOrderList($scope.getGoneDay(cityTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.cityItemNum.itemNumVal.id, $scope.cityTblPagination.curPage, cityTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.cityParam.startDate = $scope.getGoneDay(cityTimeType.timeTypeVal.msTime);
          $scope.urlParam.cityParam.endDate = $scope.getToday();
        }
        if ($scope.tblToolbar.shopTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getShopOrderList(shopCityID, shopStartDate, shopEndDate, $scope.tblToolbar.shopItemNum.itemNumVal.id, $scope.shopTblPagination.curPage, $scope.tblToolbar.shopSearchVal, shopTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.shopParam.startDate = shopStartDate;
          $scope.urlParam.shopParam.endDate = shopEndDate;
        } else {
          $scope.tblNormal.getShopOrderList(shopCityID, $scope.getGoneDay(shopTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.shopItemNum.itemNumVal.id, $scope.shopTblPagination.curPage, $scope.tblToolbar.shopSearchVal, shopTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.shopParam.startDate = $scope.getGoneDay(shopTimeType.timeTypeVal.msTime);
          $scope.urlParam.shopParam.endDate = $scope.getToday();
        }
        if ($scope.tblToolbar.saleTimeType.timeTypeVal.id == 'manual') {
          $scope.tblNormal.getSaleOrderList(saleCityID, saleStartDate, saleEndDate, $scope.tblToolbar.saleItemNum.itemNumVal.id, $scope.saleTblPagination.curPage, $scope.tblToolbar.saleSearchVal, saleTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.saleParam.startDate = saleStartDate;
          $scope.urlParam.saleParam.endDate = saleEndDate;
        } else {
          $scope.tblNormal.getSaleOrderList(saleCityID, $scope.getGoneDay(saleTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.saleItemNum.itemNumVal.id, $scope.saleTblPagination.curPage, $scope.tblToolbar.saleSearchVal, saleTheadConfig.sortStr);
          // 将缓存中的时间赋值给$scope.urlParam中的数据，页面跳转需要。
          $scope.urlParam.saleParam.startDate = $scope.getGoneDay(saleTimeType.timeTypeVal.msTime);
          $scope.urlParam.saleParam.endDate = $scope.getToday();
        }
      }
    }

    // 初始化页面,创建城市业绩页面的数据列
    $scope.cityTblPagination = new TblPagination();
    $scope.cityTblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      if ($scope.tblToolbar.cityTimeTypeVal == 'manual') {
        $scope.tblNormal.getCityOrderList($scope.tblNormal.cityStartDate, $scope.tblNormal.cityEndDate, $scope.tblToolbar.cityItemNum.itemNumVal.id, pageNum, $scope.tblSortable.cityTheadConfig.sortStr);
      } else {
        $scope.tblNormal.getCityOrderList($scope.getGoneDay($scope.tblToolbar.cityTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.cityItemNum.itemNumVal.id, pageNum, $scope.tblSortable.cityTheadConfig.sortStr);
      }
    };

    // 初始化页面,创建门店业绩页面的数据列
    $scope.shopTblPagination = new TblPagination();
    $scope.shopTblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      if ($scope.tblToolbar.shopTimeTypeVal == 'manual') {
        $scope.tblNormal.getShopOrderList($scope.tblToolbar.shopCity.cityVal.id, $scope.tblNormal.shopStartDate, $scope.tblNormal.shopEndDate, $scope.tblToolbar.shopItemNum.itemNumVal.id, pageNum, $scope.tblToolbar.shopSearchVal, $scope.tblSortable.shopTheadConfig.sortStr);
      } else {
        $scope.tblNormal.getShopOrderList($scope.tblToolbar.shopCity.cityVal.id, $scope.getGoneDay($scope.tblToolbar.shopTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.shopItemNum.itemNumVal.id, pageNum, $scope.tblToolbar.shopSearchVal, $scope.tblSortable.shopTheadConfig.sortStr);
      }
    };

    // 初始化页面,创建门店业绩页面的数据列
    $scope.saleTblPagination = new TblPagination();
    $scope.saleTblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      if ($scope.tblToolbar.saleTimeTypeVal == 'manual') {
        $scope.tblNormal.getSaleOrderList($scope.tblToolbar.saleCity.cityVal.id, $scope.tblNormal.saleStartDate, $scope.tblNormal.saleEndDate, $scope.tblToolbar.saleItemNum.itemNumVal.id, pageNum, $scope.tblToolbar.saleSearchVal, $scope.tblSortable.saleTheadConfig.sortStr);
      } else {
        $scope.tblNormal.getSaleOrderList($scope.tblToolbar.saleCity.cityVal.id, $scope.getGoneDay($scope.tblToolbar.saleTimeType.timeTypeVal.msTime), $scope.getToday(), $scope.tblToolbar.saleItemNum.itemNumVal.id, pageNum, $scope.tblToolbar.saleSearchVal, $scope.tblSortable.saleTheadConfig.sortStr);
      }
    };

    $q.all([$scope.tblToolbar.getCityList()])
      .then(function(flagBuf) {
        // console.log('啦啦啦');
        // console.log($scope.tblToolbar.cityTimeType);
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            // 恢复页面
            console.log('有缓存===========================');
            $scope.getAllData(true);
          } else {
            console.log('没缓存===========================');
            $scope.getAllData();
          }
        }
      });
  }])
  .controller('orderMngExportList_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'refundStateList', 'itemNumList', function($scope, $rootScope, $http, $timeout, refundStateList, itemNumList) {
    $scope.globalPath.initPath({
      'name': '导出订单',
      'url': '../../..' + window.location.pathname + '#/orderMng_exportList/'
    }, 'LV1');

    $scope.formResult = {
      cityID: '',
      shopID: '',
      startDate: '',
      endDate: '',
    };

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $scope.tblNormal = {
      getCityList: function(keyword) {
        var self = this;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id&key=' + (keyword || ''))
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getShopList: function(keyword) {
        var self = this;
        // Get shops list
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + (self.cityVal ? self.cityVal.id : '') +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate' + (keyword ? '&key=' + keyword : ''))
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: '',
            name: '- 请选择 -'
          };
        }
        self.getShopList();
      },
      shopValChanged: function() {
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: '',
            name: '- 请选择 -'
          };
        }
      },
      exportOrderList: function() {
        var self = this;
        $scope.formResult.cityID = self.cityVal.id || '';
        $scope.formResult.shopID = self.shopVal.id || '';
        console.log('导出订单');
        $scope.modalBasic.header.content = '导出提示';
        var cityName = (self.cityVal.name.indexOf('请选择') !== -1) ? '全部' : self.cityVal.name;
        var shopName = (self.shopVal.name.indexOf('请选择') !== -1) ? '全部' : self.shopVal.name;
        $scope.modalBasic.body.content = '确定要导出：' + cityName + '城市 - ' + shopName + (shopName.indexOf('店') === -1 ? '门店' : '') + ' 在指定日期内的订单吗？';
        $scope.modalBasic.footer.btn = [{
          "name": '取消',
          "styleList": ['btn', 'btn-cancel'],
          'func': function() {
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
          }
        }, {
          "name": '导出',
          "styleList": ['btn', 'btn-confirm'],
          'func': function() {
            var data = $.param($scope.formResult);
            console.log(data);
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/exportFinanceOrdersFromBKMgr?' + data)
              .success(function(ret) {
                console.log(ret);
              })
              .error(function(err) {});
            window.location.href = 'http://' + $rootScope.globalURL.hostURL + '/api/exportFinanceOrdersFromBKMgr?' + data;
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
          }
        }];
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      showDatepickerStart: function(evt) {
        console.log($('#startDate').get(0));
        console.log($('#startDate').get(0).getBoundingClientRect());
        laydate({
          elem: '#startDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            $scope.formResult.startDate = data;
          },
          clear: function() {
            $scope.formResult.startDate = '';
          }
        });
        laydate.reset();
      },
      showDatepickerEnd: function() {
        laydate({
          elem: '#endDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            $scope.formResult.endDate = data;
          }
        });
        laydate.reset();
      },
      cityVal: {
        id: '',
        name: '全部'
      },
      shopVal: {
        id: '',
        name: '全部'
      },
    };

    $scope.tblNormal.getCityList();
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    // 获取当前的时间作为参数
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/orderMng_index', {
        templateUrl: 'orderMng_v2_index.html?t=' + getTimeStamp(),
        controller: 'orderMngIndex_ctrl'
      })
      .when('/orderMng_index/:cityID?/:startDate/:endDate/:managerID?/:shopID?', {
        templateUrl: 'orderMng_v2_index.html?t=' + getTimeStamp(),
        controller: 'orderMngIndex_ctrl'
      })
      .when('/orderMng_exportList', {
        templateUrl: 'orderMng_exportList.html?t=' + getTimeStamp(),
        controller: 'orderMngExportList_ctrl'
      })
      .when('/orderMng_other', {
        templateUrl: 'orderMng_other.html?t=' + getTimeStamp(),
        controller: 'orderMngOther_ctrl'
      })
      .when('/orderMng_DataAnaly', {
        templateUrl: 'orderMng_DataAnaly.html?t=' + getTimeStamp(),
        controller: 'orderMngDataAnaly_ctrl'
      })
      .when('/orderMng_indexLimited/:param/:cityID/:shopID', {
        templateUrl: 'orderMng_indexLimited.html?t=' + getTimeStamp(),
        controller: 'orderMngIndexLimited_ctrl'
      })
      .when('/orderMng_queryOtherOrder/:param', {
        templateUrl: 'orderMng_queryOtherOrder.html?t=' + getTimeStamp(),
        controller: 'orderMngQueryOtherOrder_ctrl'
      })
      .when('/orderMng_queryOrder/:param', {
        templateUrl: 'orderMng_queryOrder.html?t=' + getTimeStamp(),
        controller: 'orderMngQueryOrder_ctrl'
      })
      .when('/orderMng_editOrder/:param', {
        templateUrl: 'orderMng_addOrder.html?t=' + getTimeStamp(),
        controller: 'orderMngEditOrder_ctrl'
      })
      .otherwise({
        redirectTo: '/orderMng_index'
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
