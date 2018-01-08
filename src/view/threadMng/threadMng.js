/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', ['$scope', '$q', '$http', '$rootScope', function($scope, $q, $http, $rootScope) {
    /* 定义请求数据函数 */
    // 获取销售管理员列表
    $scope.retGetManagerListFn = function(fn) {
      return function(cityID, pageSize, curPage, key) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        key = key ? key : '';
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getManagersBKMgr?cityID=' + cityID + '&key=' + key +
            '&pageSize=' + pageSize +
            '&curPage=' + curPage)
          .success(function(ret) {
            if (ret.success) {
              self.managerList = ret.data.data;
              console.log(self.managerList);
              if (fn) {
                // 执行载入的函数
                fn(ret);
              }
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          }).error(function() {});
        return promise;
      }
    };
    // 获取客户来源
    $scope.getThreadClientSrcList = function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserSrcListBKMgr')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.threadClientSrcList = ret.data;
            console.log(self.threadClientSrcList);
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
        .error(function() {});
      return promise;
    };
    // 获取城市列表
    $scope.getCityList = function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
        .success(function(ret) {
          if (ret.success) {
            self.cityList = ret.data.data;
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        }).error(function(msg) {});
      return promise;
    };
    /* 定义过滤器函数 */
    // 定义销售管理员列表过滤函数
    $scope.managerListFilter = function(id) {
      var managerList = this.managerList;
      for (var i in managerList) {
        if (managerList[i].managerID === id) {
          return managerList[i].managerName;
        }
      }
    };
  }])
  .controller('threadMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', '$q', '$window', 'dateSer', 'RememberSer', 'itemNumList', 'TblPagination', 'threadBusinessTypeList', 'threadStateList', 'defaultOptFilterFilter', 'AsHtmlFilterFilter', 'timeTypeList', function($scope, $rootScope, $http, $timeout, $route, $routeParams, $q, $window, dateSer, RememberSer, itemNumList, TblPagination, threadBusinessTypeList, threadStateList, defaultOptFilterFilter, AsHtmlFilterFilter, timeTypeList) {
    $scope.timeList = [{
      id: 'today',
      name: '今日新增'
    }];
    // 获取N天前的时间
    $scope.getGoneDay = dateSer.getGoneDay;
    // 获取当期那日期
    $scope.getToday = dateSer.getTodayDateStr;
    $scope.time = $routeParams.param;
    $scope.startDate = ($routeParams.startDate === '0') ? '' : $routeParams.startDate;
    $scope.endDate = ($routeParams.endDate === '0') ? '' : $routeParams.endDate;
    $scope.cityID = Number($routeParams.cityID) ? $routeParams.cityID : '';
    $scope.managerID = Number($routeParams.managerID) ? $routeParams.managerID : '';
    $scope.state = Number($routeParams.state) ? $routeParams.state : '';
    // 参数处理函数
    switch ($scope.time) {
      case 'all':
        var pathName = '线索客户管理';
        $scope.time = 'manual';
        $scope.startDate = '2010-01-01';
        $scope.endDate = $scope.getToday();
        break;
      case 'today':
        var pathName = '今日新增线索客户';
        $scope.time = 'manual';
        $scope.startDate = $scope.getToday();
        $scope.endDate = $scope.getToday();
        break;
      case '7d':
        var pathName = '过去7日新增线索客户';
        $scope.time = '7d';
        $scope.startDate = '';
        $scope.endDate = '';
        break;
      case '30d':
        var pathName = '过去30日新增线索客户';
        $scope.time = '30d';
        $scope.startDate = '';
        $scope.endDate = '';
        break;
      case '90d':
        var pathName = '过去90日新增线索客户';
        $scope.time = '90d';
        $scope.startDate = '';
        $scope.endDate = '';
        break;
      case 'manual':
        var pathName = '自定义时间新增线索客户';
        $scope.time = 'manual';
        break;
    }
    if ($scope.managerID) {
      pathName += '  （指定跟踪负责人）';
    }
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
    $scope.exportParam = {
      cityID: $scope.cityID,
      state: $scope.state,
      businessType: '',
      key: '',
      timeType: $scope.time,
      managerID: $scope.managerID,
      startDate: $scope.startDate || '',
      endDate: $scope.endDate || '',
    };
    $rootScope.globalPath.initPath({
      'name': pathName,
      'url': '../../..' + window.location.pathname + '#/threadMng_index/' + $routeParams.param + '/' + $routeParams.cityID + '/' + $routeParams.state + '/' + $routeParams.startDate + '/' + $routeParams.endDate + '/' + $routeParams.managerID,
    }, 'LV1');
    $scope.dateSer = dateSer;
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
                  break;
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
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.searchVal = "";
        $scope.exportParam.cityID = self.cityVal.id;
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.tblToolbar.managerID,
          $scope.tblToolbar.startDate,
          $scope.tblToolbar.endDate);
      },
      timeTypeValChanged: function() {
        var self = this;
        if (!self.timeTypeVal) {
          self.timeTypeVal = {
            id: ''
          }
        }
        self.searchVal = "";
        if (self.timeTypeVal.id != 'manual') {
          $scope.exportParam.startDate = '';
          $scope.exportParam.endDate = '';
        }
        $scope.exportParam.timeType = self.timeTypeVal.id;
        // var exportParam = $scope.exportParam;
        // 请求数据
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.tblToolbar.managerID,
          $scope.tblToolbar.startDate,
          $scope.tblToolbar.endDate);
      },
      //选择日期的方法
      showDatepickerStart: function(evt) {
        var self = this;
        laydate({
          elem: '#staticDateStart',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          choose: function(data) { //选择日期完毕的回调
            // console.log(data);
            self.minStartTime = data;
            $scope.exportParam.startDate = data;
            self.startDate = $scope.startDate = data;
            //   $scope.exportParam.timeType = '';
            self.searchVal = "";
            // var exportParam = $scope.exportParam;
            // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, self.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              1,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);
          },
          clear: function() {
            $scope.exportParam.startDate = '';
            self.startDate = $scope.startDate = '';
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              1,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);

          }
        });
        laydate.reset();
      },
      showDatepickerEnd: function() {
        var self = this;
        laydate({
          elem: '#staticDateEnd',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          istime: false,
          istoday: true,
          min: self.minStartTime,
          choose: function(data) { //选择日期完毕的回调
            console.log(data);
            $scope.exportParam.endDate = data;
            self.endDate = $scope.endDate = data;
            //   $scope.exportParam.timeType = '';
            self.searchVal = '';
            // var exportParam = $scope.exportParam;
            // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, self.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
            //  console.log($scope.exportParam.endDate);
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              1,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);
          },
          clear: function() {
            $scope.exportParam.endDate = '';
            self.endDate = $scope.endDate = '';
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              1,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);
          }
        });
        laydate.reset();
      },
      itemNumValChanged: function() {
        // var exportParam = $scope.exportParam;
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.tblToolbar.managerID,
          $scope.tblToolbar.startDate,
          $scope.tblToolbar.endDate);
      },
      threadBusinessTypeValChanged: function() {
        if (!this.threadBusinessTypeVal) {
          this.threadBusinessTypeVal = {
            id: ''
          };
        }
        self.searchVal = "";
        // var exportParam = $scope.exportParam;
        $scope.exportParam.businessType = this.threadBusinessTypeVal.id;
        //  $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.tblToolbar.managerID,
          $scope.tblToolbar.startDate,
          $scope.tblToolbar.endDate);
      },
      threadStateValChanged: function() {
        var self = this;
        if (!self.threadStateVal) {
          self.threadStateVal = {
            id: ''
          };
        }
        self.searchVal = "";
        $scope.exportParam.state = self.threadStateVal.id;
        // var exportParam = $scope.exportParam;
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id,
          $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.tblToolbar.managerID,
          $scope.tblToolbar.startDate,
          $scope.tblToolbar.endDate);
      },
      launchSearch: function() {
        $scope.exportParam.key = this.searchVal || '';
        // var exportParam = $scope.exportParam;
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, this.itemNumVal.id, 1, exportParam.key, exportParam.managerID,exportParam.startDate,exportParam.endDate);
        $scope.tblNormal.getThreadUserList(
          $scope.tblToolbar.timeTypeVal.id,
          $scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.threadStateVal.id, $scope.tblToolbar.threadBusinessTypeVal.id,
          $scope.tblToolbar.itemNumVal.id,
          1,
          $scope.tblToolbar.searchVal,
          $scope.managerID,
          $scope.startDate,
          $scope.endDate);
          console.log($scope.managerID);
      },
      // timeValChanged: function(){
      //     if(!this.timeVal){
      //       this.timeVal = {id: ''};
      //     }
      //     $scope.tblNormal.getThreadUserList(this.timeVal.id, this.cityVal.id, this.threadStateVal.id, this.threadBusinessTypeVal.id, this.itemNumVal.id, 1, '');
      //   },
      // 导出追踪列表人员名单
      exportTblList: function() {
        console.log(12345);
        var param = $scope.exportParam;
        $scope.tblNormal.itemListExport(param.cityID, param.state, param.businessType, param.key, param.timeType, param.managerID, param.startDate, param.endDate);
      },
      timeList: $scope.timeList,
      itemNumList: itemNumList,
      threadBusinessTypeList: threadBusinessTypeList,
      threadStateList: threadStateList,
      cityVal: {
        id: ''
      },
      timeVal: (function() {
        if ($scope.time === 'today') {
          return $scope.timeList[0];
        }
        return {
          id: ''
        };
      })(),
      threadBusinessTypeVal: {
        id: ''
      },
      threadStateVal: (function() {
        if (!$scope.state) {
          return {
            id: ''
          };
        }
        return defaultOptFilterFilter($scope.state, threadStateList);
      })(),
      searchVal: "",
      itemNumVal: {
        id: ''
      },
      timeTypeList: timeTypeList,
      timeTypeVal: {
        id: $scope.time,
        name: '全部'
      },
      minStartTime: '',
      startDate: $scope.startDate,
      endDate: $scope.endDate,
      managerID: $scope.managerID,
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
    $scope.tblNormal = {
      showTrackNextTimeDatepicker: function() {
        var self = this;
        laydate({
          elem: '#trackNextTime',
          format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
          istime: true,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
            self.trackNextTime = datas;
          },
          clear: function() {
            $("#startDate").val('');
          }
        });
      },
      /* 线索管理 */
      // 获取线索用户列表
      getThreadUserList: function(timeType, cityID, state, businessType, pageSize, curPage, key, managerID, startDate, endDate) {
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserListBKMgr?timeType=' + timeType +
          '&cityID=' + cityID + '&state=' + state + '&businessType=' + businessType + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&managerID=' + $scope.managerID + '&startDate=' + startDate + '&endDate=' + endDate;
        console.log("url=" + url);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserListBKMgr?cityID=' + cityID +
            '&timeType=' + timeType + '&state=' + state + '&businessType=' + businessType + '&pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key + '&managerID=' + $scope.managerID + '&startDate=' + startDate + '&endDate=' + endDate)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var arr = ret.data.data;
              var buff = [];
              self.dataList = ret.data.data;
              console.log(self.dataList);
              arr.forEach(function(item, index, originArr) {
                buff[index] = defaultOptFilterFilter(arr[index].state, threadStateList);
              });
              self.threadStateValBuff = buff;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function() {});
      },
      // 导出列表函数
      itemListExport: function(cityID, state, businessType, key, timeType, managerID, startDate, endDate) {
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportThreadUserListBKMgr?cityID=' + cityID + '&pageSize=20&curPage=1&state=' + state + '&businessType=' + businessType + '&key=' + key + '&timeType=' + timeType + '&managerID=' + managerID + "&startDate=" + startDate + '&endDate=' + endDate;
        //   console.log(timeType);
        if (self.dataList && self.dataList.length > 0) {
          $window.location.href = url;
        }else {
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

      // 获取跟进负责人候选列表
      getManagerList: $scope.retGetManagerListFn(),
      // 定一个过滤器函数
      managerListFilter: $scope.managerListFilter,
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      //   $scope.tblNormal.getThreadUserList(tblToolbar.timeVal.id,
      //       tblToolbar.cityVal.id,
      //       tblToolbar.threadStateVal.id,
      //       tblToolbar.threadBusinessTypeVal.id,
      //       self.pageSize, pageNum, tblToolbar.searchVal);
      $scope.tblNormal.getThreadUserList(
        $scope.tblToolbar.timeTypeVal.id,
        $scope.tblToolbar.cityVal.id,
        $scope.tblToolbar.threadStateVal.id,
        $scope.tblToolbar.threadBusinessTypeVal.id,
        $scope.tblToolbar.itemNumVal.id,
        pageNum,
        $scope.tblToolbar.searchVal,
        $scope.tblToolbar.managerID,
        $scope.tblToolbar.startDate,
        $scope.tblToolbar.endDate);
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

    $q.all([$scope.tblToolbar.getCityList(), $scope.tblNormal.getManagerList(1, 10000, 1, '')])
      .then(function(flagBuf) {
        var flag = true;
        var canRem = false;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        /* 暂不使用页面缓存功能的代码*/
        // if(flag){
        //   if($scope.cityID){
        //     $scope.tblToolbar.cityVal = defaultOptFilterFilter($scope.cityID, $scope.tblToolbar.cityList);
        //   }
        //   $scope.tblNormal.getThreadUserList($scope.time, $scope.cityID, $scope.state, '', 10, 1, '');
        // var exportParam = $scope.exportParam;
        // console.log(exportParam);
        // $scope.tblNormal.getThreadUserList(exportParam.timeType, exportParam.cityID , exportParam.state, exportParam.businessType, $scope.tblToolbar.itemNumVal.id, 1, '', exportParam.managerID,exportParam.startDate,exportParam.endDate);
        // }
        /* 使用页面缓存功能的代码 */
        if (flag) {
          if (($rootScope.fromUrl instanceof Object) && (!!$rootScope.fromUrl.loadedTemplateUrl)) {
            canRem = ($rootScope.fromUrl.loadedTemplateUrl.indexOf('threadMng_addThread.html') !== -1) ||
              ($rootScope.fromUrl.loadedTemplateUrl.indexOf('threadMng_queryThread.html') !== -1) ||
              ($rootScope.fromUrl.loadedTemplateUrl.indexOf('threadMng_addUpdateRecord.html') !== -1);
          }
          if (canRem && RememberSer.restore($scope)) {
            // 有缓存
            // 恢复页面

            if ($scope.cityID) {
              $scope.tblToolbar.cityVal = defaultOptFilterFilter($scope.cityID, $scope.tblToolbar.cityList);
            }
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id,
              $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);
          } else {
            // 无缓存
            console.log('无缓存======');
            // 重新请求
            if ($scope.cityID) {
              $scope.tblToolbar.cityVal = defaultOptFilterFilter($scope.cityID, $scope.tblToolbar.cityList);
            }
            // $scope.tblNormal.getThreadUserList($scope.time, $scope.cityID, $scope.state, '', 10, 1, '');
            $scope.tblNormal.getThreadUserList(
              $scope.tblToolbar.timeTypeVal.id,
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.threadStateVal.id,
              $scope.tblToolbar.threadBusinessTypeVal.id,
              $scope.tblToolbar.itemNumVal.id,
              1,
              $scope.tblToolbar.searchVal,
              $scope.tblToolbar.managerID,
              $scope.tblToolbar.startDate,
              $scope.tblToolbar.endDate);
          }
        }
      })
  }])
  .controller('threadMngAnalysis_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', '$q', 'dateSer', 'RememberSer', 'itemNumList', 'TblPagination', 'threadBusinessTypeList', 'threadStateList', 'timeTypeList', 'threadSrcFilterFilter', 'threadSrcColorFilterFilter', 'threadSrcColorList', 'dateSer', 'storeItemTypeList', 'storeTypeColorList', 'storeItemTypeFilterFilter', 'storeTypeColorFilterFilter', 'giveUpReasonTypeList', 'giveUpReasonColorList', 'giveUpReasonTypeFilterFilter', 'giveUpReasonColorFilterFilter',
    function($scope, $rootScope, $http, $timeout, $route, $routeParams, $q, dateSer, RememberSer, itemNumList, TblPagination, threadBusinessTypeList, threadStateList, timeTypeList, threadSrcFilterFilter, threadSrcColorFilterFilter, threadSrcColorList, dateSer, storeItemTypeList, storeTypeColorList, storeItemTypeFilterFilter, storeTypeColorFilterFilter, giveUpReasonTypeList, giveUpReasonColorList, giveUpReasonTypeFilterFilter, giveUpReasonColorFilterFilter) {
      $rootScope.globalPath.initPath({
        'name': '数据分析',
        'url': '../../..' + window.location.pathname + '#/threadMng_analysis'
      }, 'LV1');
      $scope.pageSize = 5;
      $scope.threadSrcColorList = threadSrcColorList;

      $scope.pageType = 'REMINDEXPAGE';
      $scope.remCfg = [
        'tblToolbar',
        'staticDatepicker',
        'sales',
        'cs',
        'salesPagination',
        'csPagination',
      ];

      /* 日期选择控件 */
      $scope.staticDatepicker = {
        dateStartOpt: {
          elem: '#staticDateStart',
          // format: 'YYYY/MM/DD hh:mm:ss',
          format: 'YYYY-MM-DD',
          // min: laydate.now(), //设定最小日期为当前日期
          // min: '2011-01-01',
          // max: '2099-06-16 23:59:59', //最大日期
          // max: laydate.now(), //最大日期
          isclear: false,
          istime: false,
          istoday: true,
          choose: function(datas) {
            $scope.staticDatepicker.dateEndOpt.min = datas;
            $scope.staticDatepicker.result.staticDateStart = datas;
            $scope.getAllData();
          }
        },
        dateEndOpt: {
          elem: '#staticDateEnd',
          format: 'YYYY-MM-DD',
          isclear: false,
          istime: false,
          istoday: true,
          choose: function(datas) {
            $scope.staticDatepicker.result.staticDateEnd = datas;
            $scope.getAllData();
          }
        },
        showStart: function() {
          laydate(this.dateStartOpt);
        },
        showEnd: function() {
          laydate(this.dateEndOpt);
        },
        result: {
          staticDateStart: (function() {
            var date = new Date((new Date()).getTime() - 24 * 3600 * 1000 * 7);
            return (date.getFullYear() + '-' + ((date.getMonth() + 101) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
          })(),
          staticDateEnd: (function() {
            var date = new Date();
            return (date.getFullYear() + '-' + ((date.getMonth() + 101) + '').slice(1) + '-' + ((date.getDate() + 100) + '').slice(1));
          })(),
        }
      };

      /* 工具栏 */
      $scope.tblToolbar = {
        /* 方法 */
        getCityList: $scope.getCityList,
        getThreadClientSrcList: $scope.getThreadClientSrcList,
        cityValChanged: function() {
          if (!this.cityVal) {
            this.cityVal = {
              id: ''
            };
          }
          $scope.getAllData();
        },
        timeTypeValChanged: function() {
          if (this.timeTypeVal.id !== 'manual') {
            $scope.getAllData();
          }
        },
        /* 属性 */
        timeTypeList: timeTypeList,
        cityVal: {
          id: ''
        },
        timeTypeVal: timeTypeList[0],
        updateTime: '',
      };

      /* 模块 */
      // 数据统计 - 模块
      $scope.statics = {
        queryThreadQuantity: function(cityID, timeType, startDate, endDate) {
          var self = this;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryThreadQuantityBKMgr?cityID=' + cityID +
              '&timeType=' + timeType +
              '&startDate=' + startDate +
              '&endDate=' + endDate)
            .success(function(ret) {
              if (ret.success) {
                var data = ret.data;
                self.result = data;
                data.totalChangeRateStr = Number((data.totalChangeRate * 100).toFixed(2)) + '%';
                data.signedChangeRateStr = Number((data.signedChangeRate * 100).toFixed(2)) + '%';
                data.conversionChangeRateStr = Number((data.conversionChangeRate * 100).toFixed(2)) + '%';
              }
            })
            .error(function() {});
        },
        linkToIndexList: function() {},
      };
      // 销售人员业绩 - 模块
      $scope.sales = {
        // 方法
        queryStatics: function(cityID, timeType, startDate, endDate, pageSize, curPage, key) {
          var self = this;
          key = key ? key : '';
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/querySalesStaticsBKMgr?cityID=' + cityID +
              '&timeType=' + timeType +
              '&startDate=' + startDate +
              '&endDate=' + endDate +
              '&pageSize=' + pageSize +
              '&curPage=' + curPage +
              '&key=' + key)
            .success(function(ret) {
              if (ret.success) {
                self.result = ret.data.data;
                self.result.forEach(function(item, index, originArr) {
                  item.convertRate = Number(item.convertRate.toFixed(2));
                });
                $scope.salesPagination.initPagination(ret);
              }
            })
            .error(function() {});
        },
        launchSearch: function(key) {
          this.queryStatics($scope.tblToolbar.cityVal.id,
            $scope.tblToolbar.timeTypeVal.id,
            $scope.staticDatepicker.result.staticDateStart,
            $scope.staticDatepicker.result.staticDateEnd, this.pageSize, 1, key);
        },
        // 属性
        result: [],
        searchVal: '',
        pageSize: $scope.pageSize,
      };
      // 客服人员业绩 - 模块
      $scope.cs = {
        // 方法
        queryStatics: function(cityID, timeType, startDate, endDate, pageSize, curPage, key) {
          var self = this;
          key = key ? key : '';
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryAdminStaticsBKMgr?cityID=' + cityID +
              '&timeType=' + timeType +
              '&startDate=' + startDate +
              '&endDate=' + endDate +
              '&pageSize=' + pageSize +
              '&curPage=' + curPage +
              '&key=' + key)
            .success(function(ret) {
              if (ret.success) {
                self.result = ret.data.data;
                self.result.forEach(function(item, index, originArr) {
                  item.convertRate = Number(item.convertRate.toFixed(2));
                });
                $scope.csPagination.initPagination(ret);
              }
            })
            .error(function() {});
        },
        launchSearch: function(key) {
          this.queryStatics($scope.tblToolbar.cityVal.id,
            $scope.tblToolbar.timeTypeVal.id,
            $scope.staticDatepicker.result.staticDateStart,
            $scope.staticDatepicker.result.staticDateEnd, this.pageSize, 1, key);
        },
        // 属性
        result: [],
        searchVal: '',
        pageSize: $scope.pageSize,
      };
      // 图表分析 - 模块
      $scope.diagram = {
        queryThreadChartData: function(cityID, timeType, startDate, endDate) {
          var self = this;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryThreadChartDataBKMgr?cityID=' + cityID +
              '&timeType=' + timeType +
              '&startDate=' + startDate +
              '&endDate=' + endDate)
            .success(function(ret) {
              if (ret.success) {
                var newThreadOption = window.threadMngStaticsChart.newThreadOption;
                var clientSrcOption = window.threadMngStaticsChart.clientSrcOption;
                var selfThreadOption = window.threadMngStaticsChart.selfThreadOption;
                var storeTypeOption = window.threadMngStaticsChart.storeTypeOption;
                var giveUpReasonOption = window.threadMngStaticsChart.giveUpReasonOption;

                var dayThreadCounts = ret.data.dayThreadCounts;
                var srcThreadCounts = ret.data.srcThreadCounts;
                var selfThreadCount = ret.data.selfThreadCount;
                var storageTypeCount = ret.data.storageTypeCount;
                var giveUpReasonCount = ret.data.giveUpReasonCount;

                self.srcThreadCounts = ret.data.srcThreadCounts;
                self.dayThreadCounts = ret.data.dayThreadCounts;
                self.selfThreadCount = ret.data.selfThreadCount;
                self.keywordThreadCounts = ret.data.keywordThreadCounts;
                self.storageTypeCount = ret.data.storageTypeCount;
                self.giveUpReasonCount = ret.data.giveUpReasonCount;

                // 新增线索部分
                if (dayThreadCounts.length === 0) {
                  newThreadOption.xAxis[0].data = [];
                  newThreadOption.series[0].data = [];
                } else {
                  newThreadOption.xAxis[0].data = [];
                  newThreadOption.series[0].data = [];
                  for (var i = 0; i < dayThreadCounts.length; i++) {
                    newThreadOption.xAxis[0].data.push(dayThreadCounts[i].time);
                    newThreadOption.series[0].data.push(dayThreadCounts[i].count);
                  }
                }

                // 客户来源部分
                if (srcThreadCounts.length === 0) {
                  clientSrcOption.legend.data = [];
                  clientSrcOption.series[0].data = [0];
                  self.clientSrcTotal = 0;
                } else {
                  clientSrcOption.legend.data = [];
                  clientSrcOption.series[0].data = [];
                  self.clientSrcTotal = 0;
                  // 所有客户来源列表
                  var srcList = $scope.tblToolbar.threadClientSrcList;
                  // 为每一个线索来源，在色槽中按顺序安装一个色值，然后复制成一个新的带颜色的来源列表
                  $scope.srcListWithColor = srcList.map(function(item, index, originArr) {
                    item.color = threadSrcColorList[index].color;
                    return item;
                  });
                  for (var i = 0; i < srcThreadCounts.length; i++) {
                    self.clientSrcTotal += srcThreadCounts[i].count;
                    var content = threadSrcFilterFilter(srcThreadCounts[i].srcID, $scope.tblToolbar.threadClientSrcList);
                    if (!content) {
                      continue;
                    }
                    // 填充图例
                    clientSrcOption.legend.data.push(content);
                    // 填充实际数据
                    clientSrcOption.series[0].data.push({
                      value: srcThreadCounts[i].count,
                      name: content,
                      itemStyle: {
                        normal: {
                          // 按srcID过滤客户来源色值，为每一个数据匹配一个颜色
                          color: threadSrcColorFilterFilter(srcThreadCounts[i].srcID, $scope.srcListWithColor),
                        }
                      }
                    });
                  }
                }

                // 上门搬存与自存仓比例
                selfThreadOption.series[0].data = [{
                    value: selfThreadCount.self,
                    name: '上门搬运加存储',
                    itemStyle: {
                      normal: {
                        color: '#2490C3',
                      }
                    }
                  },
                  {
                    value: selfThreadCount.selfHelp,
                    name: '自存仓',
                    itemStyle: {
                      normal: {
                        color: '#7CD300',
                      }
                    }
                  },
                ];
                self.selfThreadTotal = selfThreadCount.total;

                // 物品存储类型部分
                if (storageTypeCount.length === 0) {
                  storeTypeOption.legend.data = [];
                  storeTypeOption.series[0].data = [0];
                  self.storeTypeTotal = 0;
                } else {
                  storeTypeOption.legend.data = [];
                  storeTypeOption.series[0].data = [];
                  self.storeTypeTotal = 0;
                  // 所有存储物品类型列表
                  var storeTypeList = storeItemTypeList;
                  // 为每一个存储物品类型，在色槽中按顺序安装一个色值，然后复制成一个新的带颜色的存储物品类型列表
                  $scope.storeTypeListWithColor = storeTypeList.map(function(item, index, originArr) {
                    item.color = storeTypeColorList[index].color;
                    return item;
                  });
                  for (var i = 0; i < storageTypeCount.length; i++) {
                    self.storeTypeTotal += storageTypeCount[i].count;
                    var content = storeItemTypeFilterFilter(storageTypeCount[i].typeID, storeTypeList);
                    if (!content) {
                      continue;
                    }
                    // 填充图例
                    storeTypeOption.legend.data.push(content);
                    // 填充实际数据
                    storeTypeOption.series[0].data.push({
                      value: storageTypeCount[i].count,
                      name: content,
                      itemStyle: {
                        normal: {
                          // 按typeID过滤客户来源色值，为每一个数据匹配一个颜色
                          color: storeTypeColorFilterFilter(storageTypeCount[i].typeID, $scope.storeTypeListWithColor),
                        }
                      }
                    });
                  }
                }

                // 关闭原因部分
                if (giveUpReasonCount.length === 0) {
                  giveUpReasonOption.legend.data = [];
                  giveUpReasonOption.series[0].data = [0];
                  self.giveUpReasonTotal = 0;
                } else {
                  giveUpReasonOption.legend.data = [];
                  giveUpReasonOption.series[0].data = [];
                  self.giveUpReasonTotal = 0;
                  // 为每一个存储物品类型，在色槽中按顺序安装一个色值，然后复制成一个新的带颜色的存储物品类型列表
                  $scope.giveUpReasonListWithColor = giveUpReasonTypeList.map(function(item, index, originArr) {
                    item.color = giveUpReasonColorList[index].color;
                    0
                    return item;
                  });
                  for (var i = 0; i < giveUpReasonCount.length; i++) {
                    self.giveUpReasonTotal += giveUpReasonCount[i].count;
                    var content = giveUpReasonTypeFilterFilter(giveUpReasonCount[i].reasonID, giveUpReasonTypeList);
                    if (!content) {
                      continue;
                    }
                    // 填充图例
                    giveUpReasonOption.legend.data.push(content);
                    // 填充实际数据
                    giveUpReasonOption.series[0].data.push({
                      value: giveUpReasonCount[i].count,
                      name: content,
                      itemStyle: {
                        normal: {
                          // 按typeID过滤客户来源色值，为每一个数据匹配一个颜色
                          color: giveUpReasonColorFilterFilter(giveUpReasonCount[i].reasonID, $scope.giveUpReasonListWithColor),
                        }
                      }
                    });
                  }
                }

                window.threadMngStaticsChart.newThreadChart.clear();
                window.threadMngStaticsChart.newThreadChart.setOption(newThreadOption);

                window.threadMngStaticsChart.clientSrcChart.clear();
                window.threadMngStaticsChart.clientSrcChart.setOption(clientSrcOption);

                window.threadMngStaticsChart.selfThreadChart.clear();
                window.threadMngStaticsChart.selfThreadChart.setOption(selfThreadOption);

                window.threadMngStaticsChart.storeTypeChart.clear();
                window.threadMngStaticsChart.storeTypeChart.setOption(storeTypeOption);

                window.threadMngStaticsChart.giveUpReasonChart.clear();
                window.threadMngStaticsChart.giveUpReasonChart.setOption(giveUpReasonOption);
              }
            })
            .error(function() {});
        },
        result: '',
        clientSrcTotal: 0,
        selfThreadTotal: 0,
        storeTypeTotal: 0,
        giveUpReasonTotal: 0,
        keywordThreadCounts: [],
      };
      // 全部
      $scope.getAllData = function(remFlag) {
        var tblToolbar = $scope.tblToolbar;
        var cityID = tblToolbar.cityVal.id;
        var timeType = tblToolbar.timeTypeVal.id;
        var dateStart = $scope.staticDatepicker.result.staticDateStart;
        var dateEnd = $scope.staticDatepicker.result.staticDateEnd;
        $scope.statics.queryThreadQuantity(cityID, timeType, dateStart, dateEnd);

        if (!remFlag) {
          $scope.sales.queryStatics(cityID, timeType, dateStart, dateEnd, $scope.sales.pageSize, 1, $scope.sales.searchVal);
          $scope.cs.queryStatics(cityID, timeType, dateStart, dateEnd, $scope.cs.pageSize, 1, $scope.cs.searchVal);
        } else {
          $scope.sales.queryStatics(cityID, timeType, dateStart, dateEnd, $scope.sales.pageSize, $scope.salesPagination.curPage, $scope.sales.searchVal);
          $scope.cs.queryStatics(cityID, timeType, dateStart, dateEnd, $scope.cs.pageSize, $scope.csPagination.curPage, $scope.cs.searchVal);
        }
        $scope.diagram.queryThreadChartData(cityID, timeType, dateStart, dateEnd);
        $scope.tblToolbar.updateTime = dateSer.getNowDateStr();
      };

      /* 页码对象 */
      // 销售人员业绩 - 页码对象
      $scope.salesPagination = new TblPagination();
      $scope.salesPagination.hookAfterChangePage = function(pageNum) {
        var self = this;
        $scope.sales.queryStatics($scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.timeTypeVal.id,
          $scope.staticDatepicker.result.staticDateStart,
          $scope.staticDatepicker.result.staticDateEnd, self.pageSize, pageNum, $scope.sales.searchVal);
      };
      // 客服人员业绩 - 页码对象
      $scope.csPagination = new TblPagination();
      $scope.csPagination.hookAfterChangePage = function(pageNum) {
        var self = this;
        $scope.cs.queryStatics($scope.tblToolbar.cityVal.id,
          $scope.tblToolbar.timeTypeVal.id,
          $scope.staticDatepicker.result.staticDateStart,
          $scope.staticDatepicker.result.staticDateEnd, self.pageSize, pageNum, $scope.cs.searchVal);
      };

      // 图表
      jQuery.getScript('../../js/echarts.js', function() {
        require.config({
          paths: {
            echarts: '../../js'
          }
        });
        require(
          [
            'echarts',
            'echarts/chart/bar',
            'echarts/chart/pie',
          ],
          function(ec) {
            // 新增线索
            var newThreadOption = {
              // title : {
              //   text: '某地区蒸发量和降水量',
              //   subtext: '纯属虚构'
              // },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"
              },
              color: ['#FFBA00'],
              // animation: true, animationDuration: 1000,
              noDataLoadingOption: {
                effect: function(params) {
                  params.start = function(h) {};
                  params.stop = function() {};
                  return params;
                },
              },
              legend: {
                x: 'right',
                data: ['线索'],
                selectedMode: false,
                itemWidth: 32,
                itemHeight: 18,
              },
              // calculable : true,
              grid: {
                x: 40,
                y: 30,
                x2: 60,
                y2: 40,
                borderColor: '#DFDFDF',
              },
              xAxis: [{
                type: 'category',
                name: '/  日期',
                nameTextStyle: {
                  fontSize: 12,
                  color: '#333',
                },
                axisLine: {
                  lineStyle: {
                    width: 1,
                    color: '#DFDFDF'
                  }
                },
                axisTick: {
                  show: true,
                  inside: true,
                  interval: 0,
                  lineStyle: {
                    width: 1,
                    color: '#DFDFDF'
                  }
                },
                splitLine: {
                  show: false,
                },
                data: [0]
              }],
              yAxis: [{
                type: 'value',
                name: '/  个',
                nameTextStyle: {
                  fontSize: 12,
                  color: '#333',
                },
                axisLine: {
                  lineStyle: {
                    width: 1,
                    color: '#DFDFDF'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    color: '#DFDFDF'
                  }
                },
              }],
              series: [{
                name: '线索',
                type: 'bar',
                barMaxWidth: 40,
                data: [0],
                // markPoint : {
                //   data : [
                //       {type : 'max', name: '最大值'},
                //       {type : 'min', name: '最小值'}
                //   ]
                // },
                // markLine : {
                //   data : [
                //       {type : 'average', name: '平均值'}
                //   ]
                // }
              }]
            };
            // 客户来源
            var clientSrcOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
              },
              noDataLoadingOption: {
                effectOption: {},
                effect: function(params) {
                  params.start = function(h) {};
                  params.stop = function(h) {};
                  return params;
                },
              },
              legend: {
                show: false,
                selectedMode: false,
                orient: 'vertical',
                x: 'right',
                data: []
              },
              calculable: false,
              series: [{
                name: '访问来源',
                type: 'pie',
                selectedMode: 'single',
                center: ['50%', '50%'],
                radius: ['40%', '60%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'outer',
                      formatter: "{d}%",
                      // formatter: "{b} ({d}%)",
                    },
                    labelLine: {
                      show: true,
                      length: 5
                    }
                  },
                  emphasis: {
                    label: {
                      show: false,
                      // position : 'center',
                      // textStyle : {
                      //   fontSize : '30',
                      //   fontWeight : 'bold'
                      // }
                    }
                  }
                },
                data: [0]
              }]
            };
            // 上门搬存与自存仓比例
            var selfThreadOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                show: false,
                selectedMode: false,
                orient: 'vertical',
                x: 'right',
                data: ['上门搬运加存储', '自存仓']
              },
              calculable: false,
              series: [{
                name: '上门搬存与自存仓比例',
                type: 'pie',
                selectedMode: 'single',
                center: ['50%', '50%'],
                radius: '55%',
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'outer',
                      formatter: "{d}%",
                      // formatter: "{b} ({d}%)",
                    },
                    labelLine: {
                      show: true,
                      length: 5,
                    }
                  },
                  emphasis: {
                    label: {
                      show: false,
                    }
                  }
                },
                data: [{
                    value: 100,
                    name: '上门搬运加存储'
                  },
                  {
                    value: 310,
                    name: '自存仓'
                  },
                ]
              }]
            };
            // 存储物品类型
            var storeTypeOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              noDataLoadingOption: {
                effectOption: {},
                effect: function(params) {
                  params.start = function(h) {};
                  params.stop = function(h) {};
                  return params;
                },
              },
              legend: {
                show: false,
                selectedMode: false,
                orient: 'vertical',
                x: 'right',
                data: [0]
              },
              calculable: false,
              series: [{
                name: '存储物品类型',
                type: 'pie',
                selectedMode: 'single',
                center: ['50%', '50%'],
                radius: ['40%', '60%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'outer',
                      formatter: "{d}%",
                      // formatter: "{b} ({d}%)",
                    },
                    labelLine: {
                      show: true,
                      length: 5
                    }
                  },
                  emphasis: {
                    label: {
                      show: false,
                      position: 'center',
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  }
                },
                data: [0]
              }]
            };
            // 关闭原因
            var giveUpReasonOption = {
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              noDataLoadingOption: {
                effectOption: {},
                effect: function(params) {
                  params.start = function(h) {};
                  params.stop = function(h) {};
                  return params;
                },
              },
              legend: {
                show: false,
                selectedMode: false,
                orient: 'vertical',
                x: 'right',
                data: []
              },
              calculable: false,
              series: [{
                name: '关闭原因',
                type: 'pie',
                selectedMode: 'single',
                center: ['50%', '50%'],
                radius: ['40%', '60%'],
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'outer',
                      formatter: "{d}%",
                      // formatter: "{b} ({d}%)",
                    },
                    labelLine: {
                      show: true,
                      length: 5
                    }
                  },
                  emphasis: {
                    label: {
                      show: false,
                      position: 'center',
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  }
                },
                data: [0]
              }]
            };

            window.threadMngStaticsChart = {
              newThreadChart: ec.init(document.getElementById('newThreadDiagram')),
              newThreadOption: newThreadOption,

              clientSrcChart: ec.init(document.getElementById('clientSrcDiagram')),
              clientSrcOption: clientSrcOption,

              selfThreadChart: ec.init(document.getElementById('selfThreadDiagram')),
              selfThreadOption: selfThreadOption,

              storeTypeChart: ec.init(document.getElementById('storeTypeDiagram')),
              storeTypeOption: storeTypeOption,

              giveUpReasonChart: ec.init(document.getElementById('giveUpReasonDiagram')),
              giveUpReasonOption: giveUpReasonOption,
            };
            $(window).on('resize', function() {
              window.threadMngStaticsChart.newThreadChart.resize();
              window.threadMngStaticsChart.clientSrcChart.resize();
              window.threadMngStaticsChart.selfThreadChart.resize();
              window.threadMngStaticsChart.storeTypeChart.resize();
              window.threadMngStaticsChart.giveUpReasonChart.resize();
            });

            /* 执行部分 */
            if (RememberSer.restore($scope)) {
              // 恢复页面
              $scope.getAllData(true);
            } else {
              // 重新请求
              $scope.tblToolbar.getCityList();
              ($scope.tblToolbar.getThreadClientSrcList()).then(function(success) {
                if (success) {
                  $scope.getAllData();
                }
              });
            }
          });
      });

    }
  ])
  .controller('threadMngAddThread_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'unitTypeList', 'sexList', 'threadStateList', 'threadClientTypeList', 'threadBusinessTypeList', 'TblPagination', 'CheckSer', 'dateSer', 'storeItemTypeList',
    function($scope, $rootScope, $http, $timeout, unitTypeList, sexList, threadStateList, threadClientTypeList, threadBusinessTypeList, TblPagination, CheckSer, dateSer, storeItemTypeList) {
      $scope.title = "新增线索";
      $scope.viewTag = 'add';
      $rootScope.globalPath.initPath({
        'name': $scope.title,
        'url': '../../..' + window.location.pathname + '#/threadMng_addThread'
      }, 'LV2');

      $scope.tblDetails = {
        phoneExist: false,
        getCityList: function() {
          var self = this;
          // Get cities list
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
            .success(function(ret) {
              console.log(ret);
              self.cityList = ret.data.data;
            }).error(function(msg) {
              console.log("Fail! Messgae is: " + msg);
            });
        },
        getManagerList: $scope.retGetManagerListFn(function(ret) {
          $scope.tblPagination.initPagination(ret);
        }),
        getFixedManagerList: function(cityID, pageSize, curPage, key) {
          var self = this;
          var fn = $scope.retGetManagerListFn(function(ret) {
            $scope.tblPagination.initPagination(ret);
          });
          var ret = (fn).call(self, cityID, pageSize, curPage, key);
          ret.then(function() {
            self.fixManagerList();
          });
        },
        fixManagerList: function() {
          this.managerList.forEach(function(item, index, orignArr) {
            item.arg = '<i class="idropdown-item-badge">' + item.trackCount + '</i>';
          });
        },
        searchManagerList: function(key) {
          this.getFixedManagerList(this.cityVal.id, 10, 1, key);
        },
        getThreadClientSrcList: $scope.getThreadClientSrcList,
        cityValChanged: function() {
          if (!this.cityVal) {
            this.cityVal = {
              id: ''
            };
          }
          this.getFixedManagerList(this.cityVal.id, 10, 1, '');
          $scope.formResult.cityID = this.cityVal.id;
        },
        sexValChanged: function() {
          if (!this.sexVal) {
            this.sexVal = {
              id: ''
            };
          }
          $scope.formResult.sex = this.sexVal.id;
        },
        userTypeValChanged: function() {
          if (!this.userTypeVal) {
            this.userTypeVal = {
              id: ''
            };
          }
          $scope.formResult.userType = this.userTypeVal.id;
        },
        businessTypeValChanged: function() {
          if (!this.businessTypeVal) {
            this.businessTypeVal = {
              id: ''
            };
          }
          $scope.formResult.businessType = this.businessTypeVal.id;
        },
        storeTypeValChanged: function() {
          if (!this.storeTypeVal) {
            this.storeTypeVal = {
              id: ''
            };
          }
          $scope.formResult.storeType = this.storeTypeVal.id;
        },
        srcIDValChanged: function() {
          if (!this.srcIDVal) {
            this.srcIDVal = {
              id: ''
            };
          }
          $scope.formResult.srcID = this.srcIDVal.id;
        },
        managerValChanged: function() {
          if (!this.managerVal) {
            this.managerVal = {
              id: ''
            };
          }
          $scope.formResult.managerID = this.managerVal.id;
        },
        stateChanged: function() {
          if (!this.stateVal) {
            this.stateVal = {
              id: ''
            };
          }
          $scope.formResult.state = this.stateVal.id;
        },
        showDatepicker: function() {
          // console.log(laydate.now( (new Date()).getTime(), 'YYYY-MM-DD hh:mm:ss' ));
          laydate({
            elem: '#callTime',
            format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function(datas) { //选择日期完毕的回调
              $scope.formResult.callTime = datas;
            },
            clear: function() {
              $("#startDate").val('');
            }
          });
        },
        validateForm: function() {
          var chkUtil = new CheckSer.CheckUtil();
          chkUtil
            .init({ /* 载入公共配置 */
              valiResult: $scope.valiResult, // 存储各项校验结果的对象
            })
            .chkName($scope.formResult.name, {
              errorName: 'nameError'
            })
            .chkPhone($scope.formResult.phone, {
              errorName: 'phoneError'
            })
            .chkNotEmpty($scope.formResult.sex, {
              errorName: 'sexError'
            })
            .chkNotEmpty($scope.formResult.cityID, {
              errorName: 'cityIDError'
            })
            .chkNotEmpty($scope.formResult.address, {
              errorName: 'addressError'
            })
            .chkNotEmpty($scope.formResult.storeType, {
              errorName: 'storeTypeError'
            })
            .chkNotEmpty($scope.formResult.storeItems, {
              errorName: 'storeItemsError'
            })
            .chkNotEmpty($scope.formResult.userType, {
              errorName: 'userTypeError'
            })
            .chkNotEmpty($scope.formResult.businessType, {
              errorName: 'businessTypeError'
            })
            .chkNotEmpty($scope.formResult.srcID, {
              errorName: 'srcIDError'
            })
            .chkNotEmpty($scope.formResult.managerID, {
              errorName: 'managerIDError'
            })
            .chkDateTime($scope.formResult.callTime, {
              errorName: 'callTimeError'
            });
          if ($scope.formResult.srcID === 1) {
            chkUtil.chkNotEmpty($scope.formResult.keyword, {
              errorName: 'keywordError'
            });
          }
          return chkUtil.result;
        },
        checkPhoneExist: function(phone,data){
            var self = this;
            var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserListBKMgr?timeType=&cityID=&state=&businessType=&pageSize=10&curPage=1&key=' + phone + '&managerID=&startDate=&endDate=';
            console.log("url=" + url);
            $http.get(url)
              .success(function(ret) {
                if (ret.success) {
                  var arr = ret.data.data;
                  console.log(arr);
                  console.log(arr.length);
                  if(arr.length > 0){
                    self.phoneExist = true;
                    return -1;
                  }else{
                    self.phoneExist = false;
                    $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addThreadUserBKMgr', data)
                      .success(function(ret) {
                        console.log(ret);
                        if (ret.success) {
                          $scope.modalBasic.body.content = '添加线索客户成功！';
                          $scope.modalBasic.footer.btn = [{
                              "name": '完成',
                              "styleList": ['btn', 'btn-cancel'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(-1);
                                });
                              }
                            },
                            {
                              "name": '继续添加',
                              "styleList": ['btn', 'btn-confirm'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(0);
                                });
                              }
                            }
                          ];
                        } else {
                          $scope.modalBasic.body.content = '添加线索客户失败！' + ret.message;
                          $scope.modalBasic.footer.btn = [{
                              "name": '返回',
                              "styleList": ['btn', 'btn-cancel'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(-1);
                                });
                              }
                            },
                            {
                              "name": '重新添加',
                              "styleList": ['btn', 'btn-confirm'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(0);
                                });
                              }
                            }
                          ];
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
              }).error(function(msg) {
                console.log('Fail!' + msg);
              });
          },
        save: function() {
          var self = this;
          if (self.validateForm()) {
            var data = $.param($scope.formResult);
            // console.log(data);
            // console.log($scope.formResult);
            $scope.modalBasic.header.content = '添加提示';
            /*$http.post('http://' + $rootScope.globalURL.hostURL + '/api/addThreadUserBKMgr', data)
                .success(function(ret) {
                  console.log(ret);
                  if (ret.success) {
                    $scope.modalBasic.body.content = '添加线索客户成功！';
                    $scope.modalBasic.footer.btn = [{
                        "name": '完成',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      },
                      {
                        "name": '继续添加',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      }
                    ];
                  } else {
                    $scope.modalBasic.body.content = '添加线索客户失败！' + ret.message;
                    $scope.modalBasic.footer.btn = [{
                        "name": '返回',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      },
                      {
                        "name": '重新添加',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      }
                    ];
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
                });*/
            self.checkPhoneExist($scope.formResult.phone,data);
          }
        },
        cancel: function() {
          window.history.go(-1);
        },
        managerList: [],
        unitTypeList: unitTypeList,
        sexList: sexList,
        threadStateList: threadStateList,
        threadClientTypeList: threadClientTypeList,
        threadBusinessTypeList: threadBusinessTypeList,
        storeItemTypeList: storeItemTypeList,
        cityVal: {
          id: ''
        },
      };
      $scope.tblPagination = new TblPagination();
      $scope.tblPagination.hookAfterChangePage = function(pageNum) {
        var self = this;
        var tblDetails = $scope.tblDetails;
        $scope.tblDetails.getFixedManagerList(tblDetails.cityVal.id, self.pageSize, pageNum, '');
      };
      $scope.formResult = {
        callTime: dateSer.getNowDateStr(),
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
        nameError: false,
        phoneError: false,
        sexError: false,
        cityIDError: false,
        addressError: false,
        storeTypeError: false,
        storeItemsError: false,
        userTypeError: false,
        businessTypeError: false,
        srcIDError: false,
        keywordError: false,
        managerIDError: false,
        callTimeError: false,
        stateError: false,
      };
      $scope.tblDetails.getCityList();
      // $scope.tblDetails.getFixedManagerList(1, 10, 1);
      $scope.tblDetails.getThreadClientSrcList();
    }
  ])
  .controller('threadMngEditThread_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'unitTypeList', 'sexList', 'threadStateList', 'threadClientTypeList', 'threadBusinessTypeList', 'TblPagination', 'CheckSer', '$routeParams', '$q', 'defaultOptFilterFilter', 'storeItemTypeList', 'giveUpReasonTypeList',
    function($scope, $rootScope, $http, $timeout, unitTypeList, sexList, threadStateList, threadClientTypeList, threadBusinessTypeList, TblPagination, CheckSer, $routeParams, $q, defaultOptFilterFilter, storeItemTypeList, giveUpReasonTypeList) {
      $scope.param = $routeParams.param;
      $scope.viewTag = 'edit';
      $scope.title = "编辑线索";
      $rootScope.globalPath.initPath({
        'name': $scope.title,
        'url': '../../..' + window.location.pathname + '#/threadMng_addThread'
      }, 'LV2');

      $scope.tblDetails = {
        phoneExist: false,
        getCityList: function() {
          var self = this;
          var deferred = $q.defer();
          var promise = deferred.promise;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
            .success(function(ret) {
              console.log(ret);
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
        getManagerList: $scope.retGetManagerListFn(function(ret) {
          $scope.tblPagination.initPagination(ret);
        }),
        getFixedManagerList: function(cityID, pageSize, curPage, key) {
          var self = this;
          var fn = $scope.retGetManagerListFn(function(ret) {
            $scope.tblPagination.initPagination(ret);
          });
          var ret = (fn).call(self, cityID, pageSize, curPage, key);
          ret.then(function() {
            self.fixManagerList();
          });
        },
        fixManagerList: function() {
          console.log(this.managerList);
          this.managerList.forEach(function(item, index, orignArr) {
            item.arg = '<i class="idropdown-item-badge">' + item.trackCount + '</i>';
          });
        },
        searchManagerList: function(key) {
          this.getFixedManagerList(this.cityVal.id, 10, 1, key);
        },
        getThreadClientSrcList: $scope.getThreadClientSrcList,
        getThreadDetails: function(threadUserID) {
          var self = this;
          var deferred = $q.defer();
          var promise = deferred.promise;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserDetailBKMgr?threadUserID=' + threadUserID)
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                $scope.formResult = ret.data;
                var tblDetails = $scope.tblDetails;
                tblDetails.cityVal = defaultOptFilterFilter($scope.formResult.cityID, tblDetails.cityList);
                tblDetails.sexVal = defaultOptFilterFilter($scope.formResult.sex, tblDetails.sexList);
                tblDetails.userTypeVal = defaultOptFilterFilter($scope.formResult.userType, tblDetails.threadClientTypeList);
                tblDetails.businessTypeVal = defaultOptFilterFilter($scope.formResult.businessType, tblDetails.threadBusinessTypeList);
                tblDetails.srcIDVal = defaultOptFilterFilter($scope.formResult.srcID, tblDetails.threadClientSrcList);
                tblDetails.stateVal = defaultOptFilterFilter($scope.formResult.state, tblDetails.threadStateList);
                tblDetails.storeTypeVal = defaultOptFilterFilter($scope.formResult.storeType, tblDetails.storeItemTypeList);
                tblDetails.giveUpReasonTypeVal = defaultOptFilterFilter($scope.formResult.giveUpReasonType, tblDetails.giveUpReasonTypeList);
                tblDetails.managerVal = {
                  id: $scope.formResult.managerID,
                  name: $scope.formResult.managerName,
                };
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
          if (!this.cityVal) {
            this.cityVal = {
              id: ''
            };
          }
          this.getFixedManagerList(this.cityVal.id, 10, 1, '');
          $scope.formResult.cityID = this.cityVal.id;
        },
        sexValChanged: function() {
          if (!this.sexVal) {
            this.sexVal = {
              id: ''
            };
          }
          $scope.formResult.sex = this.sexVal.id;
        },
        userTypeValChanged: function() {
          if (!this.userTypeVal) {
            this.userTypeVal = {
              id: ''
            };
          }
          $scope.formResult.userType = this.userTypeVal.id;
        },
        businessTypeValChanged: function() {
          if (!this.businessTypeVal) {
            this.businessTypeVal = {
              id: ''
            };
          }
          $scope.formResult.businessType = this.businessTypeVal.id;
        },
        srcIDValChanged: function() {
          if (!this.srcIDVal) {
            this.srcIDVal = {
              id: ''
            };
          }
          $scope.formResult.srcID = this.srcIDVal.id;
        },
        storeTypeValChanged: function() {
          if (!this.storeTypeVal) {
            this.storeTypeVal = {
              id: ''
            };
          }
          $scope.formResult.storeType = this.storeTypeVal.id;
        },
        giveUpReasonTypeValChanged: function() {
          if (!this.giveUpReasonTypeVal) {
            this.giveUpReasonTypeVal = {
              id: ''
            };
          }
          $scope.formResult.giveUpReasonType = this.giveUpReasonTypeVal.id;
        },
        managerValChanged: function() {
          if (!this.managerVal) {
            this.managerVal = {
              id: ''
            };
          }
          $scope.formResult.managerID = this.managerVal.id;
        },
        stateChanged: function() {
          if (!this.stateVal) {
            this.stateVal = {
              id: ''
            };
          }
          $scope.formResult.state = this.stateVal.id;
        },
        showDatepicker: function() {
          // console.log(laydate.now( (new Date()).getTime(), 'YYYY-MM-DD hh:mm:ss' ));
          laydate({
            elem: '#callTime',
            format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function(datas) { //选择日期完毕的回调
              $scope.formResult.callTime = datas;
            },
            clear: function() {
              $("#startDate").val('');
            }
          });
        },
        validateForm: function() {
          var chkUtil = new CheckSer.CheckUtil();
          chkUtil
            .init({ /* 载入公共配置 */
              valiResult: $scope.valiResult, // 存储各项校验结果的对象
            })
            .chkName($scope.formResult.name, {
              errorName: 'nameError'
            })
            .chkPhone($scope.formResult.phone, {
              errorName: 'phoneError'
            })
            .chkNotEmpty($scope.formResult.sex, {
              errorName: 'sexError'
            })
            .chkNotEmpty($scope.formResult.cityID, {
              errorName: 'cityIDError'
            })
            .chkNotEmpty($scope.formResult.address, {
              errorName: 'addressError'
            })
            .chkNotEmpty($scope.formResult.storeType, {
              errorName: 'storeTypeError'
            })
            .chkNotEmpty($scope.formResult.storeItems, {
              errorName: 'storeItemsError'
            })
            .chkNotEmpty($scope.formResult.userType, {
              errorName: 'userTypeError'
            })
            .chkNotEmpty($scope.formResult.businessType, {
              errorName: 'businessTypeError'
            })
            .chkNotEmpty($scope.formResult.srcID, {
              errorName: 'srcIDError'
            })
            .chkNotEmpty($scope.formResult.managerID, {
              errorName: 'managerIDError'
            })
            .chkNotEmpty($scope.formResult.state, {
              errorName: 'stateError'
            })
            .chkDateTime($scope.formResult.callTime, {
              errorName: 'callTimeError'
            });
          if ($scope.formResult.srcID === 1) {
            chkUtil.chkNotEmpty($scope.formResult.keyword, {
              errorName: 'keywordError'
            });
          }
          if ($scope.formResult.state === 4) {
            chkUtil.chkOrderBits($scope.formResult.orderID, {
              errorName: 'orderIDError'
            });
          }
          if ($scope.formResult.state === 5) {
            console.log($scope.formResult.giveUpReasonType);
            chkUtil.chkNotEmpty($scope.formResult.giveUpReasonType, {
              errorName: 'giveUpReasonTypeError'
            }).chkNotEmpty($scope.formResult.giveUpReason, {
              errorName: 'giveUpReasonError'
            });
          }
          console.log(chkUtil.result);
          return chkUtil.result;
        },
        /**
         * [检验用户是否存在，该方法只用于添加，编辑不必检验]
         * @param  {[手机号]} phone [description]
         * @param  {[数据]} data  [description]
         * @return {[type]}       [description]
         */
        /*checkPhoneExist: function(phone,data){
            var self = this;
            var url = 'http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserListBKMgr?timeType=&cityID=&state=&businessType=&pageSize=10&curPage=1&key=' + phone + '&managerID=&startDate=&endDate=';
            console.log("url=" + url);
            $http.get(url)
              .success(function(ret) {
                if (ret.success) {
                  var arr = ret.data.data;
                  console.log(arr);
                  console.log(arr.length);
                  if(arr.length > 0){
                    self.phoneExist = true;
                    return -1;
                  }else{
                    self.phoneExist = false;
                    $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addThreadUserBKMgr', data)
                      .success(function(ret) {
                        console.log(ret);
                        if (ret.success) {
                          $scope.modalBasic.body.content = '添加线索客户成功！';
                          $scope.modalBasic.footer.btn = [{
                              "name": '完成',
                              "styleList": ['btn', 'btn-cancel'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(-1);
                                });
                              }
                            },
                            {
                              "name": '继续添加',
                              "styleList": ['btn', 'btn-confirm'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(0);
                                });
                              }
                            }
                          ];
                        } else {
                          $scope.modalBasic.body.content = '添加线索客户失败！' + ret.message;
                          $scope.modalBasic.footer.btn = [{
                              "name": '返回',
                              "styleList": ['btn', 'btn-cancel'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(-1);
                                });
                              }
                            },
                            {
                              "name": '重新添加',
                              "styleList": ['btn', 'btn-confirm'],
                              'func': function() {
                                $("#myModal").off(); //先解绑所有事件
                                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                                  window.history.go(0);
                                });
                              }
                            }
                          ];
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
              }).error(function(msg) {
                console.log('Fail!' + msg);
              });
          },*/
        save: function() {
          var self = this;
          if (self.validateForm()) {
            var data = $.param($scope.formResult);
            console.log(data);
            console.log($scope.formResult);
            $scope.modalBasic.header.content = '编辑提示';
            // self.checkPhoneExist($scope.formResult.phone,data);
            if (1) {
              $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateThreadUserBKMgr', data)
                .success(function(ret) {
                  console.log(ret);
                  if (ret.success) {
                    $scope.modalBasic.body.content = '更新线索客户成功！';
                    $scope.modalBasic.footer.btn = [{
                        "name": '继续编辑',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      },
                      {
                        "name": '完成',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      }
                    ];
                  } else {
                    $scope.modalBasic.body.content = '更新线索客户失败！' + ret.message;
                    $scope.modalBasic.footer.btn = [{
                        "name": '返回',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      },
                      {
                        "name": '重新编辑',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                        }
                      }
                    ];
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
          console.log(self.validateForm());
        },
        cancel: function() {
          window.history.go(-1);
        },
        managerList: [],
        unitTypeList: unitTypeList,
        sexList: sexList,
        threadStateList: threadStateList,
        threadClientTypeList: threadClientTypeList,
        threadBusinessTypeList: threadBusinessTypeList,
        storeItemTypeList: storeItemTypeList,
        giveUpReasonTypeList: giveUpReasonTypeList,
        cityVal: {
          id: ''
        },
      };
      $scope.tblPagination = new TblPagination();
      $scope.tblPagination.hookAfterChangePage = function(pageNum) {
        var self = this;
        var tblDetails = $scope.tblDetails;
        $scope.tblDetails.getFixedManagerList(tblDetails.cityVal.id, self.pageSize, pageNum, '');
      };
      $scope.formResult = {};
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
        nameError: false,
        phoneError: false,
        sexError: false,
        cityIDError: false,
        addressError: false,
        storeItemsError: false,
        storeTypeError: false,
        userTypeError: false,
        businessTypeError: false,
        giveUpReasonTypeError: false,
        srcIDError: false,
        keywordError: false,
        managerIDError: false,
        callTimeError: false,
        stateError: false,
      };
      $q.all([$scope.tblDetails.getCityList(), $scope.tblDetails.getThreadClientSrcList()])
        .then(function(retBuff) {
          $scope.tblDetails.threadStateList.splice(3,1);
          var result = true;
          for (var i = 0; i < retBuff.length; i++) {
            result = result && retBuff[i];
          }
          if (result) {
            ($scope.tblDetails.getThreadDetails($scope.param)).then(function(result) {
              if (result) {
                $scope.tblDetails.getFixedManagerList($scope.formResult.cityID, 10, 1, '');
              }
            });
          }
        });
    }
  ])
  .controller('threadMngQueryThread_ctrl', ['$scope', '$rootScope', '$http', '$routeParams', '$timeout', function($scope, $rootScope, $http, $routeParams, $timeout) {
    $scope.param = $routeParams.param;
    console.log($scope.param);
    $rootScope.globalPath.initPath({
      'name': '查看线索详情',
      'url': '../../..' + window.location.pathname + '#/threadMng_queryThread/' + $scope.param
    }, 'LV2');
    $scope.queryResult = {};
    $scope.tblDetails = {
      getThreadUserDetail: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getThreadUserDetailBKMgr?threadUserID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              $scope.queryResult = ret.data;
              if (ret.data.orderID) {
                $scope.queryResult.orderIDList = ret.data.orderID.split(',');
              }
              // console.log($scope.queryResult);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getThreadClientSrcList: $scope.getThreadClientSrcList,
      threadClientSrcList: [],
    };
    ($scope.tblDetails.getThreadClientSrcList()).then(function() {
      $scope.tblDetails.getThreadUserDetail();
    });
  }])
  .controller('threadMngUpdateRecord_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', '$q', 'RememberSer', 'TblPagination', 'threadBusinessTypeList', 'threadStateList',
    function($scope, $rootScope, $http, $timeout, $route, $routeParams, $q, RememberSer, TblPagination, threadBusinessTypeList, threadStateList) {
      $scope.param = $routeParams.param;
      $scope.clientName = $routeParams.clientName;
      $scope.managerName = $routeParams.managerName;
      $scope.managerID = $routeParams.managerID;
      $rootScope.globalPath.initPath({
        'name': '跟进记录',
        'url': '../../..' + window.location.pathname + '#/threadMng_updateRecord/' + $scope.param + '/' + $routeParams.managerName + '/' + $routeParams.threadUserName
      }, 'LV2');
      $scope.pageType = 'REMPAGE';

      $scope.tblNormal = {
        // 获取线索用户列表
        getThreadUserTracks: function(userID, pageSize, curPage) {
          var self = this;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserTracksBKMgr?threadUserID=' + userID +
              '&pageSize=' + pageSize +
              '&curPage=' + curPage)
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.dataList = ret.data.data;
                $scope.tblPagination.initPagination(ret);
              }
            }).error(function() {});
        },
      };

      $scope.tblPagination = new TblPagination();
      $scope.tblPagination.hookAfterChangePage = function(pageNum) {
        $scope.tblNormal.getThreadUserTracks($scope.param, this.pageSize, pageNum);
      };

      $scope.tblNormal.getThreadUserTracks($scope.param, 10, 1);

    }
  ])
  .controller('threadMngAddUpdateRecord_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', 'unitTypeList', 'sexList', 'threadStateList', 'threadClientTypeList', 'threadBusinessTypeList', 'TblPagination', 'CheckSer', 'dateSer', 'trackTypeList', 'threadStateList', 'giveUpReasonTypeList',
    function($scope, $rootScope, $http, $timeout, $routeParams, unitTypeList, sexList, threadStateList, threadClientTypeList, threadBusinessTypeList, TblPagination, CheckSer, dateSer, trackTypeList, threadStateList, giveUpReasonTypeList) {
      $scope.title = "新增跟进记录";
      $scope.param = $routeParams.param;
      $scope.managerName = $routeParams.managerName;
      $scope.managerID = $routeParams.managerID;
      $rootScope.globalPath.initPath({
        'name': '新增跟进记录',
        'url': '../../..' + window.location.pathname + '#/threadMng_addUpdateRecord'
      }, 'LV2');

      $scope.tblDetails = {
        getCityList: function() {
          var self = this;
          // Get cities list
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
            .success(function(ret) {
              console.log(ret);
              self.cityList = ret.data.data;
            }).error(function(msg) {
              console.log("Fail! Messgae is: " + msg);
            });
        },
        getManagerList: $scope.retGetManagerListFn(function(ret) {
          $scope.tblPagination.initPagination(ret);
        }),
        getThreadClientSrcList: $scope.getThreadClientSrcList,
        getMList: function(key) {
          this.getManagerList(this.cityVal.id, 10, 1, key);
        },
        cityValChanged: function() {
          if (!this.cityVal) {
            this.cityVal = {
              id: ''
            };
          }
          this.getManagerList(this.cityVal.id, 10, 1, '');
        },
        giveUpReasonTypeValChanged: function() {
          if (!this.giveUpReasonTypeVal) {
            this.giveUpReasonTypeVal = {
              id: ''
            };
          }
          $scope.formResult.giveUpReasonType = this.giveUpReasonTypeVal.id;
        },
        stateChanged: function() {
          if (!this.stateVal) {
            this.stateVal = {
              id: ''
            };
          }
          $scope.formResult.state = this.stateVal.id;
        },
        showTrackTimeDatepicker: function() {
          laydate({
            elem: '#trackTime',
            format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function(datas) { //选择日期完毕的回调
              $scope.formResult.trackTime = datas;
            },
            clear: function() {
              $("#trackTime").val('');
            }
          });
        },
        showTrackNextTimeDatepicker: function() {
          laydate({
            elem: '#trackNextTime',
            format: 'YYYY-MM-DD hh:mm:ss', // 分隔符可以任意定义，该例子表示只显示年月
            istime: true,
            istoday: true,
            choose: function(datas) { //选择日期完毕的回调
              $scope.formResult.trackNextTime = datas;
            },
            clear: function() {
              $("#trackNextTime").val('');
            }
          });
        },
        validateForm: function() {
          var chkUtil = new CheckSer.CheckUtil();
          chkUtil
            .init({
              valiResult: $scope.valiResult,
            })
            .chkNotEmpty($scope.formResult.trackType, {
              errorName: 'trackTypeError'
            })
            .chkDateTime($scope.formResult.trackTime, {
              errorName: 'trackTimeError'
            })
            .chkNotEmpty($scope.formResult.state, {
              errorName: 'stateError'
            });
          if (($scope.formResult.state == 1) || ($scope.formResult.state == 2) || ($scope.formResult.state == 3)) {
            chkUtil
              .chkDateTime($scope.formResult.trackNextTime, {
                errorName: 'trackNextTimeError'
              })
              .chkNotEmpty($scope.formResult.content, {
                errorName: 'contentError'
              });
          } else if ($scope.formResult.state == 4) {
            chkUtil
              .chkOrderBits($scope.formResult.orderID, {
                errorName: 'orderIDError'
              });
          } else if ($scope.formResult.state == 5) {
            chkUtil
              .chkNotEmpty($scope.formResult.giveUpReasonType, {
                errorName: 'giveUpReasonTypeError'
              })
              .chkNotEmpty($scope.formResult.giveUpReason, {
                errorName: 'giveUpReasonError'
              });
          }
          return chkUtil.result;
        },
        save: function() {
          var self = this;
          if (self.validateForm()) {
            var data = $.param($scope.formResult);
            $scope.modalBasic.header.content = '添加提示';
            if (1) {
              $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addUserTrackBKMgr', data)
                .success(function(ret) {
                  console.log(ret);
                  if (ret.success) {
                    $scope.modalBasic.body.content = '添加跟进记录成功！';
                    $scope.modalBasic.footer.btn = [{
                        "name": '继续添加',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      },
                      {
                        "name": '完成',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      }
                    ];
                  } else {
                    $scope.modalBasic.body.content = '添加跟进记录失败！' + ret.message;
                    $scope.modalBasic.footer.btn = [{
                        "name": '返回',
                        "styleList": ['btn', 'btn-cancel'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(-1);
                          });
                        }
                      },
                      {
                        "name": '重新添加',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      }
                    ];
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
        managerList: [],
        unitTypeList: unitTypeList,
        sexList: sexList,
        threadStateList: threadStateList,
        threadClientTypeList: threadClientTypeList,
        threadBusinessTypeList: threadBusinessTypeList,
        trackTypeList: trackTypeList,
        giveUpReasonTypeList: giveUpReasonTypeList,
        cityVal: {
          id: ''
        },
        stateVal: {
          id: ''
        },
      };
      $scope.tblPagination = new TblPagination();
      $scope.tblPagination.hookAfterChangePage = function(pageNum) {
        var self = this;
        var tblDetails = $scope.tblDetails;
        $scope.tblDetails.getManagerList(tblDetails.cityVal.id, self.pageSize, pageNum, '');
      };
      $scope.formResult = {
        managerID: $scope.managerID,
        threadUserID: $scope.param,
        trackTime: dateSer.getNowDateStr(),
      };
      console.log(dateSer.getNowDateStr());
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
        trackTypeError: false,
        trackTimeError: false,
        trackNextTimeError: false,
        contentError: false,
        orderIDError: false,
        stateError: false,
        giveUpReasonError: false,
        giveUpReasonTypeError: false,
      };
      $scope.tblDetails.getCityList();
      ($scope.tblDetails.getManagerList(1, 10, 1)).then(function() {
        $scope.tblDetails.managerList.forEach(function(item, index, orignArr) {
          item.arg = '<i class="idropdown-item-badge">' + item.trackCount + '</i>';
        });
      });
      $scope.tblDetails.getThreadClientSrcList();
    }
  ])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/threadMng_index/:param/:cityID/:state/:startDate/:endDate/:managerID', {
        templateUrl: 'threadMng_index.html?t=' + getTimeStamp(),
        controller: 'threadMngIndex_ctrl',
      })
      .when('/threadMng_analysis', { //数据分析
        templateUrl: 'threadMng_analysis.html?t=' + getTimeStamp(),
        controller: 'threadMngAnalysis_ctrl',
      })
      .when('/threadMng_addThread', { //添加线索
        templateUrl: 'threadMng_addThread.html?t=' + getTimeStamp(),
        controller: 'threadMngAddThread_ctrl'
      })
      .when('/threadMng_editThread/:param', { //编辑线索
        templateUrl: 'threadMng_addThread.html?t=' + getTimeStamp(),
        controller: 'threadMngEditThread_ctrl'
      })
      .when('/threadMng_queryThread/:param', { //查询线索详情
        templateUrl: 'threadMng_queryThread.html?t=' + getTimeStamp(),
        controller: 'threadMngQueryThread_ctrl'
      })
      .when('/threadMng_updateRecord/:param/:clientName/:managerName/:managerID', { //跟进记录
        templateUrl: 'threadMng_updateRecord.html?t=' + getTimeStamp(),
        controller: 'threadMngUpdateRecord_ctrl'
      })
      .when('/threadMng_addUpdateRecord/:param/:managerName/:managerID', { //添加跟进记录
        templateUrl: 'threadMng_addUpdateRecord.html?t=' + getTimeStamp(),
        controller: 'threadMngAddUpdateRecord_ctrl'
      })
      .otherwise({
        redirectTo: '/threadMng_index/all/0/0/0/0/0'
      });
    $httpProvider.interceptors.push('myInterceptor'); //拦截器
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
