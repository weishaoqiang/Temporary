/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule','mngApp.addTempHum','mngApp.editTempHum','mngApp.addSmoke','mngApp.editSmoke','mngApp.detailsSmoke','mngApp.detailsTempHum'])
  .controller('mngCtrl', ['$scope', '$rootScope', '$q', '$http', function($scope, $rootScope, $q, $http) {
    // Put sth belongs to the specific mng-module here
    /* 共享服务 */
    $scope.cmService = {
      // 获取门店详情
      getShopDetails: function(shopID) {
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShop?shopID=' + shopID)
          .success(function(ret) {
            if (ret.success) {
              deferred.resolve({
                success: true,
                shopType: ret.data.shopType,
              });
            } else {
              deferred.resolve({
                success: false,
              });
            }
          })
          .error(function(msg) {
            console.log("Fail! " + msg);
          });
        return promise;
      },
    };
  }])
  .controller('shopMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', '$window', 'itemNumList', 'RememberSer', 'TblPagination', 'shopTypeList', function($scope, $rootScope, $http, $timeout, $q, $window, itemNumList, RememberSer, TblPagination, shopTypeList) {
    $rootScope.globalPath.initPath({
      'name': '门店管理',
      'url': '../../..' + window.location.pathname + '#/shopMng_index'
    }, 'LV1');
    // 定义缓存类型
    $scope.pageType = 'REMPAGE';
    // 定义导出的参数对象
    $scope.exportParam = {
      exportCityID: '',
      exportshopType: '',
      exportKey: ''
    };

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
              self.cityListPure = ret.data.data.slice(0);
              console.log(self.cityListPure);
              self.cityList = ret.data.data;
              self.cityList.unshift({
                id: 0,
                name: '添加城市'
              });
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
        if (self.cityVal.id === 0) {
          $scope.aboutCity.addCity();
          return;
        }
        $scope.exportParam.exportCityID = self.cityVal.id;
        self.searchVal = ''; //clear the searchVal
        var theadConfig = $scope.tblSortable.theadConfig;
        $scope.tblSortable.getShopList(self.cityVal.id, self.itemNumVal.id, 1,
          theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, '', self.shopTypeVal.id);
      },
      shopTypeValChanged: function() {
        var self = this;
        if (!self.shopTypeVal) {
          self.shopTypeVal = {
            id: ''
          };
        }
        $scope.exportParam.exportshopType = self.shopTypeVal.id;
        self.searchVal = ''; //clear the searchVal
        var theadConfig = $scope.tblSortable.theadConfig;
        $scope.tblSortable.getShopList(self.cityVal.id, self.itemNumVal.id, 1,
          theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, '', self.shopTypeVal.id);
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
        var theadConfig = $scope.tblSortable.theadConfig;
        $scope.tblSortable.getShopList(self.cityVal.id, self.itemNumVal.id, 1,
          theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, self.searchVal, self.shopTypeVal.id);
      },
      launchSearch: function() {
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
        $scope.exportParam.exportKey = self.searchVal;
        var theadConfig = $scope.tblSortable.theadConfig;
        $scope.tblSortable.getShopList(self.cityVal.id, self.itemNumVal.id, 1,
          theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, self.searchVal, self.shopTypeVal.id);
      },
      exportTblList: function() {
        $scope.tblNormal.itemListExport($scope.exportParam.exportCityID, $scope.exportParam.exportshopType, $scope.exportParam.exportKey);
      },
      itemNumList: itemNumList,
      shopTypeList: shopTypeList,
      itemNumVal: '',
      cityVal: {
        id: ''
      },
      shopTypeVal: {
        id: ''
      },
      searchVal: '',
    };
    // 定义导出列表的函数
    $scope.tblNormal = {
      itemListExport: function(cityID, shopType, key) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportShopsByCityBKMgr?cityID=' + cityID + '&sortType=1&orderColumn=openDate&shopType=' + shopType + '&key=' + key;
        $window.location.href = url;
      }
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var theadConfig = $scope.tblSortable.theadConfig;
      var tblToolbar = $scope.tblToolbar;
      var self = this;
      $scope.tblSortable.getShopList(tblToolbar.cityVal.id, self.pageSize, pageNum,
        theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, tblToolbar.searchVal, tblToolbar.shopTypeVal.id);
    };

    $scope.aboutCity = {
      valiform: function() {
        var self = this;
        var reg = /[\u4e00-\u9fa5]{2,}/;
        var canContinue = true;
        //1.验证省份
        if (!reg.test(self.formResult.province)) {
          canContinue = false;
          self.formError.provinceNameError = true;
        } else {
          canContinue &= true;
          self.formError.provinceNameError = false;
        }
        //2.验证简称
        if (!reg.test(self.formResult.name)) {
          canContinue = false;
          if ((self.btnName === '修改') && ($('.label.marked').length === 0)) {
            self.formError.shortNameEmptyError = true;
          } else {
            self.formError.shortNameError = true;
          }
        } else {
          for (var i in $scope.tblToolbar.cityListPure) {
            if ($scope.tblToolbar.cityListPure[i].name === self.formResult.name) {
              canContinue = false;
              self.formError.shortNameExistedError = true;
              break;
            } else {
              self.formError.shortNameExistedError = false;
            }
          }
          canContinue &= true;
          self.formError.shortNameError = false;
          self.formError.shortNameEmptyError = false;
        }
        //3.验证全称
        if (!reg.test(self.formResult.fullName)) {
          canContinue = false;
          self.formError.fullNameError = true;
        } else {
          canContinue &= true;
          self.formError.fullNameError = false;
        }
        var cntr = $timeout(function() {
          for (var key in self.formError) {
            self.formError[key] = false;
          }
          $timeout.cancel(cntr);
        }, 2000);
        return canContinue;
      },
      addCity: function() {
        // $('#myModal .citiesContainer .label').off('click');
        var self = this;
        self.init();
        $scope.modalBasic.init();
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      editCity: function() {
        var self = this;
        self.btnName = '修改';
        self.formResult = {
          province: '',
          name: '',
          fullName: '',
          id: ''
        };
      },
      getCityInfo: function(evt) {
        var self = this;
        var target = evt.target;
        console.log(target);
        $('#myModal .citiesContainer .label').removeClass('marked');
        $(target).addClass('marked');
        self.formResult.name = $(target).html();
        self.formResult.id = $(target).attr('data-city-id');
      },
      saveAdding: function() {
        var self = this;
        var ret = self.valiform();
        if (ret) {
          console.log('可以添加了');
        } else {
          console.log('还不能添加');
        }
        var result = $.param(self.formResult);
        console.log(result);
        if (ret) {
          var result = $.param(self.formResult);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addCity', result)
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.formError.addSuccess = true;
                var prom = $timeout(function() {
                  self.formError.addSuccess = false;
                  $timeout.cancel(prom);
                }, 2000);
                $scope.tblToolbar.getCityList();
              } else {
                self.formError.addError = true;
                var prom = $timeout(function() {
                  self.formError.addError = false;
                  $timeout.cancel(prom);
                }, 2000);
              }
            }).error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      saveEditing: function() {
        var self = this;
        var ret = self.valiform();
        if (ret) {
          console.log('可以添加了');
        } else {
          console.log('还不能添加');
        }
        var result = $.param(self.formResult);
        console.log(result);
        if (ret) {
          var result = $.param(self.formResult);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateCity', result)
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.formError.addSuccess = true;
                var prom = $timeout(function() {
                  self.formError.addSuccess = false;
                  $timeout.cancel(prom);
                }, 2000);
                $scope.tblToolbar.getCityList();
                self.editCity();
              } else {
                self.formError.addError = true;
                var prom = $timeout(function() {
                  self.formError.addError = false;
                  $timeout.cancel(prom);
                }, 2000);
              }
            }).error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      init: function() {
        var self = this;
        self.btnName = '添加';
        self.formError = {
          provinceNameError: false,
          shortNameError: false,
          shortNameEmptyError: false,
          shortNameExistedError: false,
          fullNameError: false,
          addSuccess: false,
          addError: false,
        };
        self.formResult = {
          province: '',
          name: '',
          fullName: '',
        };
      },
      btnName: '',
      formError: {},
      formResult: {},
    };

    $scope.modalBasic = {
      init: function() {
        var self = this;
        self.header = {
          content: '添加城市',
          hasLink: true,
          linkFunc: function() {
            var self = this;
            self.content = '编辑城市';
            self.hasLink = false;
            $scope.aboutCity.editCity();
          }
        };
      },
      header: {},
      footer: {
        finishFunc: function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $scope.tblToolbar.getCityList();
          });
        },
        returnFunc: function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $scope.tblToolbar.getCityList();
          });
        },
      }
    };

    $scope.tblSortable = {
      theadConfig: {
        curSortItem: {},
        sortBuffer: {
          name: {
            name: '门店名称',
            canSort: true,
            sortName: 'name',
            sortDir: '',
            sortState: false,
          },
          shopType: {
            name: '门店类型',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          unitCount: {
            name: '仓位数量(个)',
            canSort: true,
            sortName: 'unitCount',
            sortDir: '',
            sortState: false,
          },
          volume: {
            name: '仓位容积(m³)',
            canSort: true,
            sortName: 'volume',
            sortDir: '',
            sortState: false,
          },
          volumeRentRate: {
            name: '容积出租率',
            canSort: true,
            sortName: 'volumeRentRate',
            sortDir: '',
            sortState: false,
          },
          openDate: {
            name: '开业时间',
            canSort: true,
            sortName: 'openDate',
            sortDir: 'down',
            sortType: 1,
            sortState: true,
          },
          shopManagers: {
            name: '门店管理员',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
          more: {
            name: '更多',
            canSort: false,
            sortName: '',
            sortDir: '',
            sortState: false,
          },
        },
      },
      getShopList: function(cityID, pageSize, curPage, sortType, orderColumn, key, shopType) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopsByCity?cityID=' + cityID +
            '&pageSize=' + pageSize +
            '&curPage=' + curPage +
            '&sortType=' + sortType +
            '&orderColumn=' + orderColumn +
            '&key=' + key +
            '&shopType=' + (shopType || ''))
          .success(function(ret) {
            if (ret.success) {
              $scope.tblSortable.dataList = ret.data.data;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      launchSort: function(objName, item) {
        var self = this;
        console.log(item.sortName);
        var buffer = self.theadConfig.sortBuffer;
        // 如果点击的不是已经排序项，则将排序向复位
        if (objName !== self.theadConfig.curSortItem.sortName) {
          var sortName = self.theadConfig.curSortItem.sortName;
          self.theadConfig.sortBuffer[sortName].sortState = false;
          self.theadConfig.sortBuffer[sortName].sortDir = '';
        }
        if (!item.sortState) {
          item.sortState = true;
          item.sortDir = 'down';
          item.sortType = 1;
        } else if (item.sortDir === 'down') {
          item.sortDir = 'up';
          item.sortType = 0;
        } else if (item.sortDir === 'up') {
          item.sortDir = 'down';
          item.sortType = 1;
        }
        self.theadConfig.curSortItem = self.theadConfig.sortBuffer[objName];
        var tblToolbar = $scope.tblToolbar;
        self.getShopList(tblToolbar.cityVal.id, tblToolbar.itemNumVal.id, 1, item.sortType, item.sortName, tblToolbar.searchVal);
      },
    };

    $q.all([$scope.tblToolbar.getCityList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            var theadConfig = $scope.tblSortable.theadConfig;
            $scope.tblSortable.getShopList($scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName,
              $scope.tblToolbar.searchVal, $scope.tblToolbar.shopTypeVal.id);
            console.log("排序类型" + theadConfig.curSortItem.sortType);
          } else {
            var theadConfig = $scope.tblSortable.theadConfig;
            theadConfig.curSortItem = theadConfig.sortBuffer.openDate;
            $scope.tblSortable.getShopList('', 10, 1, theadConfig.curSortItem.sortType, theadConfig.curSortItem.sortName, '');
          }
        }
      });
  }])
  .controller('shopMngQueryShop_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', '$window', 'itemNumList', 'unitStateList', 'TblPagination', 'shopTypeList', 'unitTypeList', 'wjlDeviceStateList', function($scope, $rootScope, $routeParams, $http, $timeout, $q, $window, itemNumList, unitStateList, TblPagination, shopTypeList, unitTypeList, wjlDeviceStateList) {
    $scope.param = $routeParams.param;
    $scope.shopDetails = {};

    $rootScope.globalPath.initPath({
      'name': '查询门店',
      'url': '../../..' + window.location.pathname + '#/shopMng_queryShop/' + $scope.param
    }, 'LV2');
    $scope.queryResult = {};
    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ]
      }
    };
    $scope.tblDetails = {
      getShopDetails: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShop?shopID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              console.log('这是请求')
              console.log(ret);
              $scope.queryResult = ret.data;
              // 只有"智能柜"门店才需要remarks
              if ($scope.queryResult.shopType === 2) {
                var lockerPrice = JSON.parse(ret.data.remarks.replace(/'/g, '"'));
                $scope.queryResult.smDayPrice = lockerPrice.small.day;
                $scope.queryResult.sm1WeekPrice = lockerPrice.small.week;
                $scope.queryResult.sm1MonthPrice = lockerPrice.small.month;
                $scope.queryResult.sm3MonthPrice = lockerPrice.small.threeMonth;
                $scope.queryResult.lgDayPrice = lockerPrice.large.day;
                $scope.queryResult.lg1WeekPrice = lockerPrice.large.week;
                $scope.queryResult.lg1MonthPrice = lockerPrice.large.month;
                $scope.queryResult.lg3MonthPrice = lockerPrice.large.threeMonth;
              }
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
    };
    $scope.exportParam = {
      shopID: '',
      exportUnitState: '',
      exportRegionID: ''
    };
    $scope.aboutRegion = {
      getRegionList: function(shopID) {
        var self = this;
        $scope.exportParam.shopID = shopID;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getRegionsByShopID?shopID=' + shopID)
          .success(function(ret) {
            if (ret.success) {
              self.regionList = ret.data;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      regionList: [],
    };
    $scope.aboutSmoke = {
      getSmokeList: function(shopID){
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getSmokeListBKMgr?shopID=' + shopID + '&pageSize=100&curPage=1')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.smokeList = ret.data.data;
            console.log(self.smokeList);
          }
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
      },
      delete: function(id){
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.content = '您确定要删除这个设备吗？';
        $scope.modalBasic.footer.btn[1].name = '确定';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteSmokeBKMgr?id='+id)
            .success(function(ret){
              window.history.go(0);
            })
          });
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            'show': true,
            'backdrop': 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      smokeList: [],
    }
    $scope.aboutTempHum = {
      getTempHumList: function(shopID){
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getTemperatureHumidityListBKMgr?shopID=' + shopID + '&pageSize=100&curPage=1')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.TempHumList = ret.data.data;
            console.log(self.TempHumList);
          }
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
      },
      delete: function(id){
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.content = '您确定要删除这个设备吗？';
        $scope.modalBasic.footer.btn[1].name = '确定';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteTemperatureHumidityBKMgr?id='+id)
            .success(function(ret){
              window.history.go(0);
            })
          });
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            'show': true,
            'backdrop': 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      TempHumList: [],
    }

    $scope.aboutRegion.getRegionList($scope.param);
    $scope.aboutSmoke.getSmokeList($scope.param);
    $scope.aboutTempHum.getTempHumList($scope.param);

    $scope.tblToolbar = {
      itemNumValChanged: function() {
        var self = this;
        if (!self.unitStateVal) {
          self.unitStateVal = {
            id: ''
          }
        }
        if (!$scope.aboutRegion.exportRegionID) {
          $scope.aboutRegion.exportRegionID = '';
        }
        $scope.tblNormal.getUnitsList(self.itemNumVal.id, 1, self.unitStateVal.id, $scope.exportParam.exportRegionID);
      },
      unitStateValChanged: function() {
        var self = this;
        if (!self.unitStateVal) {
          self.unitStateVal = {
            id: ''
          }
        }
        $scope.exportParam.exportUnitState = self.unitStateVal.id;
        //   console.log(self.unitStateVal.id);
        $scope.tblNormal.getUnitsList(self.itemNumVal.id, 1, self.unitStateVal.id, $scope.exportParam.exportRegionID);

      },
      regionValChange: function(id) {
        var self = this;
        if (!id) {
          id = ''
        }

        $scope.exportParam.exportRegionID = id;
        $scope.tblNormal.getUnitsList(self.itemNumVal.id, 1, self.unitStateVal.id, $scope.exportParam.exportRegionID);

      },
      exportUnitTblList: function() {
        $scope.tblNormal.itemUnitListExport($scope.exportParam.shopID, $scope.exportParam.exportUnitState, $scope.exportParam.exportRegionID);
      },
      itemNumList: itemNumList,
      itemNumVal: {
        id: ''
      },
      unitStateList: unitStateList,
      unitStateVal: {
        id: '',
        name: '全部'
      },
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getUnitsList: function(pageSize, curPage, unitState, regionID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUnitsByShopID?shopID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage + '&unitState=' + unitState + '&regionID=' + regionID + '&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
              $scope.tblUnitPagination.initPagination(ret);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      // 导出仓位数据
      itemUnitListExport: function(shopID, unitState, regionID) {
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/exportUnitsByShopIDBKMgr?unitState=' + unitState + '&shopID=' + shopID + '&regionID=' + regionID;
        $window.location.href = url;
      },
      qrcode: null,
      qrcodeName: '',
      qrShowState: false,
      dataList: [],
    };
    $scope.tblNormal.getUnitsList($scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.unitStateVal.id, $scope.exportParam.exportRegionID);

    // 仓位列表的页码组件
    $scope.tblUnitPagination = new TblPagination();
    $scope.tblUnitPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getUnitsList(self.pageSize, pageNum, $scope.tblToolbar.unitStateVal.id, $scope.exportParam.exportRegionID);
    };

    ($scope.tblDetails.getShopDetails()).then(function(success) {
      if (success) {
        if ($scope.queryResult.shopType === 1) {
          // 门禁
          $scope.aboutLock = {
            getLockerList: function() {
              var self = this;
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopDevicesBKMgr?shopID=' + $scope.param + '&pageSize=100&curPage=1')
                .success(function(ret) {
                  if (ret.success) {
                    self.dataList = ret.data.data;
                    console.log(self.dataList);
                  }
                })
                .error(function(msg) {});
            },
            dataList: [],
          };
          $scope.aboutLock.getLockerList();
          // 门禁卡
          $scope.aboutUnLock = {
            getUnlockerList: function(pageSize, curPage) {
              var self = this;
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopCardsBKMgr?shopID=' + $scope.param + '&pageSize=' + pageSize + '&curPage=' + curPage)
                .success(function(ret) {
                  console.log(ret);
                  if (ret.success) {
                    self.dataList = ret.data.data;
                    $scope.tblCardPagination.initPagination(ret);
                  }
                })
                .error(function(msg) {});
            },
            skipToModify: function() {
              window.sessionStorage.setItem('skipSource', 'shopMngQueryShop_ctrl');
            },
            dataList: [],
          };
          $scope.aboutUnLock.getUnlockerList(10, 1);
          // 门禁卡列表的页码组件
          $scope.tblCardPagination = new TblPagination();
          $scope.tblCardPagination.hookAfterChangePage = function(pageNum) {
            var self = this;
            $scope.aboutUnLock.getUnlockerList(self.pageSize, pageNum);
          };
        }
      } else {}
    });


  }])
  .controller('shopMngAddShop_ctrl', ['$q', '$scope', '$rootScope', '$http', '$timeout', 'minRentPeriodList', 'shopTypeList', 'shopLockTypeList', 'isVankeList', function($q, $scope, $rootScope, $http, $timeout, minRentPeriodList, shopTypeList, shopLockTypeList, isVankeList) {
    $scope.title = "新增门店";
    $rootScope.globalPath.initPath({
      'name': '新增门店',
      'url': '../../..' + window.location.pathname + '#/shopMng_addShop'
    }, 'LV2');
    $scope.newShopId = 0;
    $scope.viewTag = 'addShop';
    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ]
      }
    };
    $scope.formResult = {};
    $scope.lockerPrice = {
      smDayPrice: '',
      sm1WeekPrice: '',
      sm1MonthPrice: '',
      sm3MonthPrice: '',

      lgDayPrice: '',
      lg1WeekPrice: '',
      lg1MonthPrice: '',
      lg3MonthPrice: '',
    };
    $scope.gaLockerPrice = {
      ga1MonPrice: '',
      ga1YearPrice: '',
    };
    $scope.valiResult = {
      shopTypeValError: false,
      nameError: false,
      cityValError: false,
      isVankeValError: false, //项目类型错误
      addressError: false,
      coordinateError: false,
      picUrlError: false,
      // 新增数据
      buildingAreaError: false, // 建筑面积
      availableAreaError: false, // 实际可使用面积
      rentableAreaError: false, // 可租出面积
      incomeRatioError: false, // 合作比例
      projectTotalFreeError: false, // 工程费用
      remarksError: false, // 备注

      standPriceError: false,
      minRentPeriodError: false,
      openDateError: false,
      shopLockTypeValError: false,
      deviceSNError: false,
      smallRentPriceError: false,
      largeRentPriceError: false,
      gaRentPriceError: false,
    };
    $scope.openDatepicker = {
      opt: {
        elem: '#openDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01',
        max: '2099-06-16 23:59:59', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.openDate = datas;
          console.log($scope.formResult.openDate);
        },
        clear: function() {
          $scope.formResult.openDate = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        laydate(self.opt);
      },
    };
    // 关于仓位
    $scope.aboutRegion = {
      valiForm: function() {
        var self = this;
        var reg = /^[A-Z]区域$/;
        var canSave = false;
        if (!reg.test(self.regionName)) {
          canSave = false;
          self.msgTip = (self.regionName.split('')).length === 0 ? '区域名称不能为空!' : '区域名称格式不符!';
          self.msgTipShow = true;
          $timeout(function() {
            self.msgTipShow = false;
          }, 1500);
        } else {
          canSave = true;
          self.msgTipShow = false;
        }
        return canSave;
      },
      addRegion: function() {
        var self = this;
        $scope.modalBasic.header.content = '添加区域';
        $scope.modalBasic.body.contentType = 'dom';
        var backFunc = function() {
          $("#myModal").off();
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            window.history.go(-1);
          });
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = backFunc;
        $scope.modalBasic.footer.btn[1].name = '完成';
        $scope.modalBasic.footer.btn[1].func = backFunc;
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          if ($scope.modalBasic.header.content === '添加区域') {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addRegion?shopID=' + $scope.newShopID +
                '&name=' + self.regionName)
              .success(function(ret) {
                if (ret.success) {
                  self.msgTip = '区域添加成功!';
                  $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getRegionsByShopID?shopID=' + $scope.newShopID)
                    .success(function(ret) {
                      if (ret.success) {
                        self.regionList = ret.data;
                      }
                    })
                    .error(function() {});
                } else {
                  self.msgTip = '区域添加失败!  ' + ret.message;
                }
                self.msgTipShow = true;
                $timeout(function() {
                  self.msgTipShow = false;
                }, 1500);
              })
              .error(function() {});
          } else if ($scope.modalBasic.header.content.indexOf('编辑区域') !== -1) {}
        }
      },
      regionName: '',
      msgTipShow: false,
      regionList: null,
    };
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
      getGDMap: function(mapUrl) {
        var self = this;
        window.initGDMap = function() {
          var map = new AMap.Map("mapContainer", {
            resizeEnable: true
          });
          AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
              pageSize: 10,
              pageIndex: 1,
              city: "全国", //城市
              map: map
            });
            self.getCoordinate = function(address) {
              var resultObj = null;
              //关键字查询
              placeSearch.search(address, function(status, result) {
                resultObj = result.poiList.pois;
              });
              $("#mapContainer").undelegate('div.amap-marker', 'click').delegate('div.amap-marker', 'click', function() {
                var index = $(this).children("div.amap-marker-content").children("div").html();
                $timeout(function() {
                  $scope.formResult.longitude = resultObj[index - 1].location.lng + '';
                  $scope.formResult.latitude = resultObj[index - 1].location.lat + '';
                }, 0);
                console.log($scope.formResult);
              });
            };
          });
        };
        //官方文档上的异步加载方式
        jQuery.getScript(mapUrl + '&callback=initGDMap', function() {});
      },
      trigChsnFile: function() {
        var self = this;
        $('#shopPhotoUL').trigger('click');
      },
      uploadFile: function() {
        var self = this;
        lrz(this.files[0], {
          "fieldName": 'files'
        }).then(function(rst) {
          var file = '';
          console.log(rst);
          //选择了之后立即上传
          $.ajax({
            url: 'http://' + $rootScope.globalURL.hostURL + '/api/fileUpload',
            data: rst.formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data) {
              console.log(data);
              $.each(data.data, function(index, file) {
                //将图片显示到视图上
                $timeout(function() {
                  file = "http://" + file;
                  $scope.tblDetails.uploadSuccess = true;
                  $scope.tblDetails.picUrl = file;
                  $scope.tblDetails.picName = rst.origin.name;
                  $scope.formResult.photoUrl = file;
                }, 0);
              });
            },
            error: function(data) {
              console.log(data);
              $scope.tblDetails.uploadSuccess = false;
              $scope.tblDetails.picName = rst.origin.name;
              $scope.tblDetails.picUrl = $scope.tblDetails.PICHOLDURL;
              $scope.formResult.photoUrl = '';
            }
          });
          rst.formData.append('fileLen', rst.fileLen);
        })
      },
      valiForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){2,}$/;
        var regRealNum = /^[0-9]+(.[0-9]{1,})?$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/; //简单验证日期的正则
        //验证门店类型
        if (!$scope.tblDetails.shopTypeVal.id) {
          $scope.valiResult.shopTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopTypeValError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店名称
        if (!reg.test($scope.formResult.name) || (typeof($scope.formResult.name) === 'undefined')) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        //验证城市选择项
        if (!$scope.tblDetails.cityVal.id) {
          $scope.valiResult.cityValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.cityValError = false;
          canSubmit = canSubmit && true;
        }
        // 验证项目类型选项
        if (!$scope.tblDetails.isVankeVal.id) {
          $scope.valiResult.isVankeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.isVankeError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店地址
        if (!reg.test($scope.formResult.address) || (typeof($scope.formResult.address) === 'undefined')) {
          $scope.valiResult.addressError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.addressError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店的经纬度
        if ((!regRealNum.test($scope.formResult.longitude)) || (typeof($scope.formResult.longitude) === 'undefined') ||
          (!regRealNum.test($scope.formResult.latitude)) || (typeof($scope.formResult.latitude) === 'undefined')) {
          $scope.valiResult.coordinateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.coordinateError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店图片是否上传
        console.log($scope.formResult.photoUrl);
        if (!$scope.formResult.photoUrl) {
          $scope.valiResult.photoUrlError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.photoUrlError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店单价
        if (!regRealNum.test($scope.formResult.standPrice) || (typeof($scope.formResult.standPrice) === 'undefined')) {
          $scope.valiResult.standPriceError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.standPriceError = false;
          canSubmit = canSubmit && true;
        }
        if (self.shopTypeVal.id == 1 || self.shopTypeVal.id == 5) {
          //验证建筑面积,只有社区仓和中心仓有
          if (!regRealNum.test($scope.formResult.buildingArea) || (typeof($scope.formResult.buildingArea) === 'undefined')) {
            $scope.valiResult.buildingAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.buildingAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证实际可使用面积
          if (!regRealNum.test($scope.formResult.availableArea) || (typeof($scope.formResult.availableArea) === 'undefined')) {
            $scope.valiResult.availableAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.availableAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证实际可租出面积
          if (!regRealNum.test($scope.formResult.rentableArea) || (typeof($scope.formResult.rentableArea) === 'undefined')) {
            $scope.valiResult.rentableAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.rentableAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证合作方收入分成比例
          if (!regRealNum.test($scope.formResult.incomeRatio) || (typeof($scope.formResult.incomeRatio) === 'undefined')) {
            $scope.valiResult.incomeRatioError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.incomeRatioError = false;
            canSubmit = canSubmit && true;
          }
          //验证工程总费用
          if (!regRealNum.test($scope.formResult.projectTotalFree) || (typeof($scope.formResult.projectTotalFree) === 'undefined')) {
            $scope.valiResult.projectTotalFreeError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.projectTotalFreeError = false;
            canSubmit = canSubmit && true;
          }
        }
        //若为"智能柜"类型门店，则验证大、小柜的租金
        if ($scope.tblDetails.shopTypeVal.id === 2) {
          //  验证小柜租金
          if ((!regRealNum.test($scope.lockerPrice.smDayPrice) || (typeof($scope.lockerPrice.smDayPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm1WeekPrice) || (typeof($scope.lockerPrice.sm1WeekPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm1MonthPrice) || (typeof($scope.lockerPrice.sm1MonthPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm3MonthPrice) || (typeof($scope.lockerPrice.sm3MonthPrice) === 'undefined'))) {
            $scope.valiResult.smallRentPriceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.smallRentPriceError = false;
            canSubmit = canSubmit && true;
          }
          //  验证大柜租金
          if ((!regRealNum.test($scope.lockerPrice.lgDayPrice) || (typeof($scope.lockerPrice.lgDayPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg1WeekPrice) || (typeof($scope.lockerPrice.lg1WeekPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg1MonthPrice) || (typeof($scope.lockerPrice.lg1MonthPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg3MonthPrice) || (typeof($scope.lockerPrice.lg3MonthPrice) === 'undefined'))) {
            $scope.valiResult.largeRentPriceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.largeRentPriceError = false;
            canSubmit = canSubmit && true;
          }
        }
        //暂时写死金额了
        //若为"车库智能仓"类型门店，则验证对应租金
        // if( $scope.tblDetails.shopTypeVal.id===3 ){
        //   //  验证柜子租金
        //   if((!regRealNum.test($scope.gaLockerPrice.ga1MonPrice) || (typeof($scope.gaLockerPrice.ga1MonPrice) === 'undefined'))
        //   || (!regRealNum.test($scope.gaLockerPrice.ga1YearPrice) || (typeof($scope.gaLockerPrice.ga1YearPrice) === 'undefined'))){
        //     $scope.valiResult.gaRentPriceError = true;
        //     canSubmit = false;
        //   }else{
        //     $scope.valiResult.gaRentPriceError = false;
        //     canSubmit = canSubmit && true;
        //   }
        // }

        //验证开业时间
        if (!regDate.test($scope.formResult.openDate)) {
          $scope.valiResult.openDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.openDateError = false;
          canSubmit = canSubmit && true;
        }
        //当不为车库智能柜时，验证最短租期选择项
        if ($scope.tblDetails.shopTypeVal.id !== 3) {
          if (!$scope.tblDetails.minRentPeriodVal.id) {
            $scope.valiResult.minRentPeriodValError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.minRentPeriodValError = false;
            canSubmit = canSubmit && true;
          }
        }
        //验证进仓方式选择项
        if (!$scope.tblDetails.shopLockTypeVal.id) {
          $scope.valiResult.shopLockTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopLockTypeValError = false;
          canSubmit = canSubmit && true;
        }
        //验证设备SNCode
        if (($scope.tblDetails.shopTypeVal.id === 2) && (!reg.test($scope.formResult.deviceSN) || (typeof($scope.formResult.deviceSN) === 'undefined'))) {
          $scope.valiResult.deviceSNError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceSNError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          // if(1){
          $scope.formResult.shopType = $scope.tblDetails.shopTypeVal.id;
          if ($scope.formResult.shopType !== 2) {
            delete $scope.formResult.deviceSN;
          } else {
            var remarksObj = {
              small: {
                day: $scope.lockerPrice.smDayPrice,
                week: $scope.lockerPrice.sm1WeekPrice,
                month: $scope.lockerPrice.sm1MonthPrice,
                threeMonth: $scope.lockerPrice.sm3MonthPrice,
              },
              large: {
                day: $scope.lockerPrice.lgDayPrice,
                week: $scope.lockerPrice.lg1WeekPrice,
                month: $scope.lockerPrice.lg1MonthPrice,
                threeMonth: $scope.lockerPrice.lg3MonthPrice,
              },
            };
            $scope.formResult.remarks = JSON.stringify(remarksObj).replace(/"/g, "'");
          }

          if ($scope.formResult.shopType !== 3) {
            $scope.formResult.minRentPeriod = $scope.tblDetails.minRentPeriodVal.id;
          } else {
            $scope.formResult.minRentPeriod = 1;
          }
          $scope.formResult.cityID = $scope.tblDetails.cityVal.id;
          $scope.formResult.isVanke = $scope.tblDetails.isVankeVal.id
          $scope.formResult.lockType = $scope.tblDetails.shopLockTypeVal.id;

          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addShop', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '添加结果';
              if (ret.success) {
                $scope.newShopID = ret.data;
                $scope.modalBasic.body.contentType = 'text';
                $scope.modalBasic.body.content = '添加门店成功!';
                $scope.modalBasic.footer.btn[0].name = '稍后添加区域、仓位及门禁';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '前往添加区域、仓位及门禁';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.setTimeout(function() {
                      // $scope.aboutRegion.addRegion();
                      window.sessionStorage.setItem('skipSource', 'shopMngAddShop_ctrl');
                      window.location.href = '../../..' + window.location.pathname + '#/shopMng_editShop/' + $scope.newShopID;
                    }, 500);
                  });
                };
              } else {
                $scope.newShopID = 0;
                $scope.modalBasic.body.contentType = 'text';
                $scope.modalBasic.body.content = '添加门店失败! ' + ret.message;
                $scope.modalBasic.footer.btn[0].name = '取消';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新添加门店';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                };
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function() {});
        } else {
          console.log('失败');
          console.log($scope.valiResult);
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
      },
      isVankeValChanged: function() {
        var self = this;
        // $scope.formResult.proType = id;
        if (!self.isVankeVal) {
          self.isVankeVal = {
            id: ''
          };
        }
        //   console.log(self.isVankeVal.id);
        //   $scope.formResult.proType = self.isVankeVal.id;
      },
      minRentPeriodValChanged: function() {
        var self = this;
        if (!self.minRentPeriodVal) {
          self.minRentPeriodVal = {
            id: ''
          };
        }
      },
      shopTypeValChanged: function() {
        var self = this;
        if (!self.shopTypeVal) {
          self.shopTypeVal = {
            id: ''
          };
        } else if ((self.shopTypeVal.id === 2) || (self.shopTypeVal.id === 3)) {
          // 当门店类型为 智能柜 或 车库智能柜 时
          self.shopLockTypeList = shopLockTypeList.slice(-1);
        }
      },
      shopLockTypeValChanged: function() {
        var self = this;
        if (!self.shopLockTypeVal) {
          self.shopLockTypeVal = {
            id: ''
          };
        }
      },
      picUrl: '../../img/picholder.png',
      PICHOLDURL: '../../img/picholder.png',
      picName: '',
      uploadSuccess: false,
      cityList: [],
      minRentPeriodList: minRentPeriodList,
      shopTypeList: shopTypeList,
      shopLockTypeList: shopLockTypeList,
      cityVal: {
        id: ''
      },
      minRentPeriodVal: {
        id: ''
      },
      shopTypeVal: {
        id: ''
      },
      shopLockTypeVal: {
        id: ''
      },
      // 门店类型选项
      isVankeList: isVankeList,
      isVankeVal: {
        id: '',
        // name: '-请选择-'
      }
    };
    $('#shopPhotoUL').on('change', $scope.tblDetails.uploadFile);
    $scope.tblDetails.getCityList();
    $scope.tblDetails.getGDMap('http://webapi.amap.com/maps?v=1.3&key=0f78dd4fa2c67160a4d40f22c52e9233');
  }])
  .controller('shopMngEditShop_ctrl', ['$scope', '$rootScope', '$filter', '$routeParams', '$http', '$timeout', '$q', 'minRentPeriodList', 'shopTypeList', 'shopLockTypeList', 'itemNumList', 'TblPagination', 'isVankeList', function($scope, $rootScope, $filter, $routeParams, $http, $timeout, $q, minRentPeriodList, shopTypeList, shopLockTypeList, itemNumList, TblPagination, isVankeList) {
    if ((window.sessionStorage.getItem('skipSource') === 'shopMngAddShop_ctrl') ||
      (window.sessionStorage.getItem('skipSource') === 'facilityMngGuard_ctrl')) {
      window.sessionStorage.removeItem('skipSource');
      $timeout(function() {
        $('body').animate({
          scrollTop: $('.ipage-footer').offset().top
        }, 1000);
      }, 100);
    }

    $scope.title = "编辑门店";
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '编辑门店',
      'url': '../../..' + window.location.pathname + '#/shopMng_editShop/' + $scope.param
    }, 'LV2');
    $scope.viewTag = 'editShop';
    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ]
      }
    };
    $scope.aboutTempHum = {
      getTempHumList: function(shopID){
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getTemperatureHumidityListBKMgr?shopID=' + shopID + '&pageSize=100&curPage=1')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.TempHumList = ret.data.data;
            console.log(self.TempHumList);
          }
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
      },
      delete: function(id){
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.contentType = 'text';
        $scope.modalBasic.body.content = '您确定要删除这个设备吗？';
        $scope.modalBasic.footer.btn[1].name = '确定';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteTemperatureHumidityBKMgr?id='+id)
            .success(function(ret){
              window.history.go(0);
            })
          });
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            'show': true,
            'backdrop': 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      TempHumList: [],
    }
    $scope.aboutSmoke = {
      getSmokeList: function(shopID){
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getSmokeListBKMgr?shopID=' + shopID + '&pageSize=100&curPage=1')
        .success(function(ret) {
          console.log(ret);
          if (ret.success) {
            self.smokeList = ret.data.data;
            console.log(self.smokeList);
          }
        })
        .error(function(msg) {
          console.log('Fail! ' + msg);
        });
      },
      delete: function(id){
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.contentType = 'text';
        $scope.modalBasic.body.content = '您确定要删除这个设备吗？';
        $scope.modalBasic.footer.btn[1].name = '确定';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteSmokeBKMgr?id='+id)
            .success(function(ret){
              window.history.go(0);
            })
          });
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            'show': true,
            'backdrop': 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      smokeList: [],
    }
    $scope.tblToolbar = {
      itemNumValChanged: function() {
        var self = this;
        $scope.tblNormal.getUnitsList(self.itemNumVal.id, 1);
      },
      itemNumList: itemNumList,
      itemNumVal: {
        id: ''
      },
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
    $scope.tblNormal = {
      getUnitsList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUnitsByShopID?shopID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage + '&sortType=0&orderColumn=id')
          .success(function(ret) {

            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
              $scope.tblPagination.initPagination(ret);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      dataList: [],
    };
    $scope.tblNormal.getUnitsList($scope.tblToolbar.itemNumVal.id, 1);

    // 仓位列表的页码组件
    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getUnitsList(self.pageSize, pageNum);
    };
    // 门禁卡列表的页码组件
    $scope.tblCardPagination = new TblPagination();
    $scope.tblCardPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.aboutUnLock.getUnlockerList(self.pageSize, pageNum);
    };

    $scope.formResult = {};
    //智能柜单价
    $scope.lockerPrice = {};
    $scope.queryResult = {};
    $scope.valiResult = {
      shopTypeValError: false,
      nameError: false,
      cityValError: false,
      isVankeValError: false, //项目类型错误
      addressError: false,
      coordinateError: false,
      picUrlError: false,

      buildingAreaError: false, // 建筑面积
      availableAreaError: false, // 实际可使用面积
      rentableAreaError: false, // 可租出面积
      incomeRatioError: false, // 合作比例
      projectTotalFreeError: false, // 工程费用
      remarksError: false, // 备注

      standPriceError: false,
      minRentPeriodError: false,
      openDateError: false,
      shopLockTypeValError: false,
      deviceSNError: false,
      smallRentPriceError: false,
      largeRentPriceError: false,
      gaRentPriceError: false,
    };
    $scope.openDatepicker = {
      opt: {
        elem: '#openDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01',
        max: '2099-06-16 23:59:59', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.openDate = datas;
        },
        clear: function() {
          $scope.formResult.openDate = '';
        }
      },
      showOpenDate: function() {
        var self = this;
        laydate(self.opt);
      },
    };
    $scope.aboutRegion = {
      valiForm: function() {
        var self = this;
        var reg = /^[A-Z]区域$/;
        var canSave = false;
        if (!reg.test(self.regionName)) {
          canSave = false;
          self.msgTip = (self.regionName.split('')).length === 0 ? '区域名称不能为空!' : '区域名称格式不符!';
          self.msgTipShow = true;
          $timeout(function() {
            self.msgTipShow = false;
          }, 1500);
        } else {
          canSave = true;
          self.msgTipShow = false;
        }
        return canSave;
      },
      addRegion: function() {
        var self = this;
        var backFunc = function() {
          $("#myModal").off();
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        $scope.modalBasic.header.content = '添加区域';
        $scope.modalBasic.body.contentType = 'dom';
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = backFunc;
        $scope.modalBasic.footer.btn[1].name = '完成';
        $scope.modalBasic.footer.btn[1].func = backFunc;
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
        var backFunc = function() {
          $("#myModal").off();
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
      },
      editRegion: function(regionItem) {
        var self = this;
        self.editRegionItem = regionItem;
        $scope.modalBasic.header.content = '编辑区域: ' + regionItem.name;
        $scope.modalBasic.body.contentType = 'dom';
        var backFunc = function() {
          $("#myModal").off();
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = backFunc;
        $scope.modalBasic.footer.btn[1].name = '完成';
        $scope.modalBasic.footer.btn[1].func = backFunc;
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      delRegion: function(regionItem) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.contentType = 'text';
        $scope.modalBasic.body.content = '确认删除：' + '"' + regionItem.name + '"' + ' 吗？';
        var backFunc = function() {
          $("#myModal").off();
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        var confirmFunc = function() {
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteRegion?regionID=' + regionItem.id)
            .success(function(ret) {
              if (ret.success) {
                $scope.modalBasic.body.content = '删除成功！';
                self.getRegionList($scope.param);
                $("#myModal").off();
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              } else {
                $scope.modalBasic.body.content = '删除失败！' + ret.message;
                $scope.modalBasic.footer.btn[0].name = '取消';
                $scope.modalBasic.footer.btn[0].func = backFunc;
                $scope.modalBasic.footer.btn[1].name = '返回';
                $scope.modalBasic.footer.btn[1].func = backFunc;
              }
            })
            .error(function() {});
        };
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = backFunc;
        $scope.modalBasic.footer.btn[1].name = '确认';
        $scope.modalBasic.footer.btn[1].func = confirmFunc;
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          if ($scope.modalBasic.header.content === '添加区域') {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/addRegion?shopID=' + $scope.param +
                '&name=' + self.regionName)
              .success(function(ret) {
                if (ret.success) {
                  self.msgTip = '区域添加成功!';
                  self.getRegionList($scope.param);
                } else {
                  self.msgTip = '区域添加失败!  ' + ret.message;
                }
                self.msgTipShow = true;
                $timeout(function() {
                  self.msgTipShow = false;
                }, 1500);
              })
              .error(function() {});
          } else if ($scope.modalBasic.header.content.indexOf('编辑区域') !== -1) {
            console.log('编辑');
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/updateRegion?shopID=' + $scope.param +
                '&name=' + self.regionName + '&id=' + self.editRegionItem.id)
              .success(function(ret) {
                if (ret.success) {
                  self.msgTip = '区域修改成功!';
                  self.getRegionList($scope.param);
                } else {
                  self.msgTip = '区域修改失败!  ' + ret.message;
                }
                self.msgTipShow = true;
                $timeout(function() {
                  self.msgTipShow = false;
                }, 1500);
              })
              .error(function() {});
          }
        }
      },
      getRegionList: function(shopID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getRegionsByShopID?shopID=' + shopID)
          .success(function(ret) {
            if (ret.success) {
              self.regionList = ret.data;
            }
          })
          .error(function() {});
      },
      regionName: '',
      msgTipShow: false,
      regionList: null,
    };
    $scope.aboutLock = {
      getLockerList: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopDevicesBKMgr?shopID=' + $scope.param + '&pageSize=100&curPage=1')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
            }
          })
          .error(function(msg) {});
      },
      delLock: function(deviceCode) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.contentType = 'text';
        $scope.modalBasic.body.content = '确认删除该门禁设备？';
        $scope.modalBasic.footer.btn = [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ];
        $scope.modalBasic.footer.btn[0].name = '取消';
        $scope.modalBasic.footer.btn[0].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
        };
        $scope.modalBasic.footer.btn[1].name = '确认';
        $scope.modalBasic.footer.btn[1].func = function() {
          $("#myModal").off(); //先解绑所有事件
          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delLLDeviceBKMgr?deviceCode=' + deviceCode)
              .success(function(ret) {
                $scope.modalBasic.header.content = '删除结果';
                $scope.modalBasic.body.contentType = 'text';
                $scope.modalBasic.footer.btn = [{
                    styleList: ['btn', 'btn-cancel'],
                  },
                  {
                    styleList: ['btn', 'btn-confirm'],
                  }
                ];
                if (ret.success) {
                  $scope.modalBasic.body.content = '删除指定门禁 成功!';
                  $scope.modalBasic.footer.btn[0].name = '完成';
                  $scope.modalBasic.footer.btn[0].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                  $scope.modalBasic.footer.btn[1].name = '继续删除';
                  $scope.modalBasic.footer.btn[1].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                  self.getLockerList();
                } else {
                  $scope.modalBasic.body.content = '删除指定门禁 失败! ' + ret.message;
                  $scope.modalBasic.footer.btn[0].name = '取消';
                  $scope.modalBasic.footer.btn[0].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                  $scope.modalBasic.footer.btn[1].name = '重新删除';
                  $scope.modalBasic.footer.btn[1].func = function() {
                    $("#myModal").off(); //先解绑所有事件
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                  };
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 10);
              })
              .error(function(msg) {});
          });
        };
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 10);
      },
      dataList: [],
    };
    $scope.aboutUnLock = {
      getUnlockerList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopCardsBKMgr?shopID=' + $scope.param + '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
              $scope.tblCardPagination.initPagination(ret);
            }
          })
          .error(function(msg) {});
      },
      delUnlocker: function(uid) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delCardBKMgr?uid=' + uid)
          .success(function(ret) {
            $scope.modalBasic.header.content = '删除提示';
            $scope.modalBasic.body.contentType = 'text';
            if (ret.success) {
              $scope.modalBasic.body.content = '删除指定门禁卡 成功！';
              $scope.modalBasic.footer.btn = [{
                "name": '完成',
                "styleList": ['btn', 'btn-confirm'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                }
              }];
              self.getUnlockerList(10, 1);
            } else {
              $scope.modalBasic.body.content = '删除指定门禁卡 失败！' + ret.message;
              $scope.modalBasic.footer.btn = [{
                "name": '返回',
                "styleList": ['btn', 'btn-cancel'],
                'func': function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
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
          .error(function(msg) {});
      },
      dataList: [],
    };
    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log("cityList");
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
      getShopDetails: function() {
        console.log("edit");
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShop?shopID=' + $scope.param)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult = ret.data;
              $scope.formResult = ret.data;
              $scope.formResult.openDate = (ret.data.openDate.split(' '))[0];
              $scope.tblDetails.picUrl = ret.data.photoUrl;
              // $scope.formResult = {
              //   name: ret.data.name,
              //   address: ret.data.address,
              //   longitude: ret.data.longitude,
              //   latitude: ret.data.latitude,
              //   photoUrl: ret.data.photoUrl,
              //   standPrice: ret.data.standPrice,
              //   openDate: ret.data.openDate,
              //   entryWay: ret.data.entryWay,
              // };
              // 若门店类型为"智能柜"
              if ($scope.formResult.shopType === 2) {
                var lockerPrice = JSON.parse(ret.data.remarks.replace(/'/g, '"'));
                $scope.lockerPrice.smDayPrice = lockerPrice.small.day;
                $scope.lockerPrice.sm1WeekPrice = lockerPrice.small.week;
                $scope.lockerPrice.sm1MonthPrice = lockerPrice.small.month;
                $scope.lockerPrice.sm3MonthPrice = lockerPrice.small.threeMonth;
                $scope.lockerPrice.lgDayPrice = lockerPrice.large.day;
                $scope.lockerPrice.lg1WeekPrice = lockerPrice.large.week;
                $scope.lockerPrice.lg1MonthPrice = lockerPrice.large.month;
                $scope.lockerPrice.lg3MonthPrice = lockerPrice.large.threeMonth;
              }
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function() {});
        return promise;
      },
      getGDMap: function(mapUrl) {
        var self = this;
        window.initGDMap = function() {
          var map = new AMap.Map("mapContainer", {
            resizeEnable: true
          });
          AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
              pageSize: 10,
              pageIndex: 1,
              city: "全国", //城市
              map: map
            });
            self.getCoordinate = function(address) {
              var resultObj = null;
              //关键字查询
              placeSearch.search(address, function(status, result) {
                resultObj = result.poiList.pois;
              });
              $("#mapContainer").undelegate('div.amap-marker', 'click').delegate('div.amap-marker', 'click', function() {
                var index = $(this).children("div.amap-marker-content").children("div").html();
                $timeout(function() {
                  $scope.formResult.longitude = resultObj[index - 1].location.lng + '';
                  $scope.formResult.latitude = resultObj[index - 1].location.lat + '';
                }, 0);
                console.log($scope.formResult);
              });
            };
          });
        };
        //官方文档上的异步加载方式
        jQuery.getScript(mapUrl + '&callback=initGDMap', function() {});
      },
      trigChsnFile: function() {
        var self = this;
        $('#shopPhotoUL').trigger('click');
      },
      uploadFile: function() {
        var self = this;
        lrz(this.files[0], {
          "fieldName": 'files'
        }).then(function(rst) {
          var file = '';
          //选择了之后立即上传
          $.ajax({
            url: 'http://' + $rootScope.globalURL.hostURL + '/api/fileUpload',
            data: rst.formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data) {
              console.log(data);
              $.each(data.data, function(index, file) {
                //将图片显示到视图上
                $timeout(function() {
                  file = "http://" + file;
                  $scope.tblDetails.uploadSuccess = true;
                  $scope.tblDetails.picUrl = file;
                  $scope.tblDetails.picName = rst.origin.name;
                  $scope.formResult.photoUrl = file;
                }, 0);
              });
            },
            error: function(data) {
              console.log(data);
              $scope.tblDetails.uploadSuccess = false;
              $scope.tblDetails.picName = rst.origin.name;
              $scope.tblDetails.picUrl = $scope.tblDetails.PICHOLDURL;
              $scope.formResult.photoUrl = '';
            }
          });
          rst.formData.append('fileLen', rst.fileLen);
        })
      },
      valiForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]){2,}$/;
        var regRealNum = /^[0-9]+(.[0-9]{1,})?$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/; //简单验证日期的正则
        //验证门店类型
        if (!$scope.tblDetails.shopTypeVal.id) {
          $scope.valiResult.shopTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopTypeValError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店名称
        if (!reg.test($scope.formResult.name) || (typeof($scope.formResult.name) === 'undefined')) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        //验证城市选择项
        if (!$scope.tblDetails.cityVal.id) {
          $scope.valiResult.cityValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.cityValError = false;
          canSubmit = canSubmit && true;
        }
        // 验证项目类型选项
        if (!$scope.tblDetails.isVankeVal.id) {
          $scope.valiResult.isVankeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.isVankeError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店地址
        if (!reg.test($scope.formResult.address) || (typeof($scope.formResult.address) === 'undefined')) {
          $scope.valiResult.addressError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.addressError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店的经纬度
        if ((!regRealNum.test($scope.formResult.longitude)) ||
          (!regRealNum.test($scope.formResult.latitude))) {
          $scope.valiResult.coordinateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.coordinateError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店图片是否上传
        console.log($scope.formResult.photoUrl);
        if (!$scope.formResult.photoUrl) {
          $scope.valiResult.photoUrlError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.photoUrlError = false;
          canSubmit = canSubmit && true;
        }
        //验证门店单价
        if (!regRealNum.test($scope.formResult.standPrice) || (typeof($scope.formResult.standPrice) === 'undefined')) {
          $scope.valiResult.standPriceError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.standPriceError = false;
          canSubmit = canSubmit && true;
        }

        if (self.shopTypeVal.id == 1 || self.shopTypeVal.id == 5) {
          //验证建筑面积,只有社区仓和中心仓有
          if (!regRealNum.test($scope.formResult.buildingArea) || (typeof($scope.formResult.buildingArea) === 'undefined')) {
            $scope.valiResult.buildingAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.buildingAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证实际可使用面积
          if (!regRealNum.test($scope.formResult.availableArea) || (typeof($scope.formResult.availableArea) === 'undefined')) {
            $scope.valiResult.availableAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.availableAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证实际可租出面积
          if (!regRealNum.test($scope.formResult.rentableArea) || (typeof($scope.formResult.rentableArea) === 'undefined')) {
            $scope.valiResult.rentableAreaError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.rentableAreaError = false;
            canSubmit = canSubmit && true;
          }
          //验证合作方收入分成比例
          if (!regRealNum.test($scope.formResult.incomeRatio) || (typeof($scope.formResult.incomeRatio) === 'undefined')) {
            $scope.valiResult.incomeRatioError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.incomeRatioError = false;
            canSubmit = canSubmit && true;
          }
          //验证工程总费用
          if (!regRealNum.test($scope.formResult.projectTotalFree) || (typeof($scope.formResult.projectTotalFree) === 'undefined')) {
            $scope.valiResult.projectTotalFreeError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.projectTotalFreeError = false;
            canSubmit = canSubmit && true;
          }
        }

        //若为"智能仓"类型门店，则验证大、小柜的租金
        if ($scope.tblDetails.shopTypeVal.id === 2) {
          //  验证小柜租金
          if ((!regRealNum.test($scope.lockerPrice.smDayPrice) || (typeof($scope.lockerPrice.smDayPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm1WeekPrice) || (typeof($scope.lockerPrice.sm1WeekPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm1MonthPrice) || (typeof($scope.lockerPrice.sm1MonthPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.sm3MonthPrice) || (typeof($scope.lockerPrice.sm3MonthPrice) === 'undefined'))) {
            $scope.valiResult.smallRentPriceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.smallRentPriceError = false;
            canSubmit = canSubmit && true;
          }
          //  验证大柜租金
          if ((!regRealNum.test($scope.lockerPrice.lgDayPrice) || (typeof($scope.lockerPrice.lgDayPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg1WeekPrice) || (typeof($scope.lockerPrice.lg1WeekPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg1MonthPrice) || (typeof($scope.lockerPrice.lg1MonthPrice) === 'undefined')) ||
            (!regRealNum.test($scope.lockerPrice.lg3MonthPrice) || (typeof($scope.lockerPrice.lg3MonthPrice) === 'undefined'))) {
            $scope.valiResult.largeRentPriceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.largeRentPriceError = false;
            canSubmit = canSubmit && true;
          }
        }

        //验证开业时间
        if (!regDate.test($scope.formResult.openDate)) {
          $scope.valiResult.openDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.openDateError = false;
          canSubmit = canSubmit && true;
        }
        //验证最短租期选择项
        if (!$scope.tblDetails.minRentPeriodVal.id) {
          $scope.valiResult.minRentPeriodValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.minRentPeriodValError = false;
          canSubmit = canSubmit && true;
        }
        //验证进仓方式选择项
        if (!$scope.tblDetails.shopLockTypeVal.id) {
          $scope.valiResult.shopLockTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.shopLockTypeValError = false;
          canSubmit = canSubmit && true;
        }
        //验证设备SNCode
        if (($scope.tblDetails.shopTypeVal.id === 2) && (!reg.test($scope.formResult.deviceSN) || (typeof($scope.formResult.deviceSN) === 'undefined'))) {
          $scope.valiResult.deviceSNError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceSNError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          console.log('成功');
          $scope.formResult.shopType = $scope.tblDetails.shopTypeVal.id;
          if ($scope.formResult.shopType !== 2) {
            delete $scope.formResult.deviceSN;
          } else {
            var remarksObj = {
              small: {
                day: $scope.lockerPrice.smDayPrice,
                week: $scope.lockerPrice.sm1WeekPrice,
                month: $scope.lockerPrice.sm1MonthPrice,
                threeMonth: $scope.lockerPrice.sm3MonthPrice,
              },
              large: {
                day: $scope.lockerPrice.lgDayPrice,
                week: $scope.lockerPrice.lg1WeekPrice,
                month: $scope.lockerPrice.lg1MonthPrice,
                threeMonth: $scope.lockerPrice.lg3MonthPrice,
              },
            };
            $scope.formResult.remarks = JSON.stringify(remarksObj).replace(/"/g, "'");
          }
          $scope.formResult.cityID = $scope.tblDetails.cityVal.id;
          $scope.formResult.minRentPeriod = $scope.tblDetails.minRentPeriodVal.id;
          $scope.formResult.lockType = $scope.tblDetails.shopLockTypeVal.id;

          if ($scope.formResult.shopType !== 3) {
            $scope.formResult.minRentPeriod = $scope.tblDetails.minRentPeriodVal.id;
          } else {
            $scope.formResult.minRentPeriod = 1;
          }
          $scope.formResult.isVanke = $scope.tblDetails.isVankeVal.id;

          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateShop', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '编辑结果';
              $scope.modalBasic.body.contentType = 'text';
              $scope.modalBasic.footer.btn = [{
                  styleList: ['btn', 'btn-cancel'],
                },
                {
                  styleList: ['btn', 'btn-confirm'],
                }
              ];
              if (ret.success) {
                $scope.newShopID = ret.data.id;
                $scope.modalBasic.body.content = '更新门店信息成功!';
                $scope.modalBasic.footer.btn[0].name = '返回';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '完成';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    // window.history.go(0);
                  });
                };
              } else {
                $scope.modalBasic.body.content = '更新门店信息失败! ' + ret.message;
                $scope.modalBasic.footer.btn = [{
                    name: '取消',
                    func: function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    },
                    styleList: ['btn', 'btn-cancel'],
                  },
                  {
                    name: '重新编辑门店',
                    func: function() {
                      $("#myModal").off(); //先解绑所有事件
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    },
                    styleList: ['btn', 'btn-confirm'],
                  },
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function() {});
        } else {
          console.log('失败');
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
      },
      isVankeValChanged: function() {
        var self = this;
        if (!self.isVankeVal) {
          self.isVankeVal = {
            id: ''
          };
        }
      },
      minRentPeriodValChanged: function() {
        var self = this;
        if (!self.minRentPeriodVal) {
          self.minRentPeriodVal = {
            id: ''
          };
        }
      },
      shopTypeValChanged: function() {
        var self = this;
        if (!self.shopTypeVal) {
          self.shopTypeVal = {
            id: ''
          };
        } else if ((self.shopTypeVal.id === 2) || (self.shopTypeVal.id === 3)) {
          // 当门店类型为 智能柜 或 车库智能柜 时
          self.shopLockTypeList = shopLockTypeList.slice(-1);
        }
      },
      shopLockTypeValChanged: function() {
        var self = this;
        if (!self.shopLockTypeVal) {
          self.shopLockTypeVal = {
            id: ''
          };
        }
      },
      picUrl: '../../img/picholder.png',
      PICHOLDURL: '../../img/picholder.png',
      picName: '',
      uploadSuccess: false,
      cityList: [],
      minRentPeriodList: minRentPeriodList,
      shopTypeList: shopTypeList,
      shopLockTypeList: shopLockTypeList,
      cityVal: {
        id: ''
      },
      minRentPeriodVal: {
        id: ''
      },
      shopTypeVal: {
        id: ''
      },
      shopLockTypeVal: {
        id: ''
      },
      shopTypeVal: {
        id: ''
      },
      // 门店类型选项
      isVankeList: isVankeList,
      isVankeVal: {
        id: '',
        // name: '-请选择-'
      }
    };

    $('#shopPhotoUL').on('change', $scope.tblDetails.uploadFile);
    var shopPromise = $scope.tblDetails.getShopDetails();
    var cityPromise = $scope.tblDetails.getCityList();
    shopPromise.then(function() {
      if ($scope.queryResult.shopType == 2) {
        $scope.tblDetails.shopLockTypeList = shopLockTypeList.slice(-1);
      }
      cityPromise.then(function() {
        for (var i in $scope.tblDetails.cityList) {
          if ($scope.tblDetails.cityList[i].id === $scope.formResult.cityID) {
            $scope.tblDetails.cityVal = $scope.tblDetails.cityList[i];
            break;
          }
        }
      }, function() {});
      for (var i in $scope.tblDetails.minRentPeriodList) {
        if ($scope.tblDetails.minRentPeriodList[i].id === $scope.formResult.minRentPeriod) {
          $scope.tblDetails.minRentPeriodVal = $scope.tblDetails.minRentPeriodList[i];
          break;
        }
      }
      for (var i in $scope.tblDetails.shopLockTypeList) {
        if ($scope.tblDetails.shopLockTypeList[i].id === $scope.formResult.lockType) {
          $scope.tblDetails.shopLockTypeVal = $scope.tblDetails.shopLockTypeList[i];
          break;
        }
      }
      for (var i in $scope.tblDetails.shopTypeList) {
        if ($scope.tblDetails.shopTypeList[i].id === $scope.formResult.shopType) {
          $scope.tblDetails.shopTypeVal = $scope.tblDetails.shopTypeList[i];
          break;
        }
      }
      for (var i in $scope.tblDetails.isVankeList) {
        if ($scope.tblDetails.isVankeList[i].id === $scope.formResult.isVanke) {
          $scope.tblDetails.isVankeVal = $scope.tblDetails.isVankeList[i];
          break;
        }
      }
    }, function() {});
    $scope.aboutRegion.getRegionList($scope.param);
    $scope.tblDetails.getGDMap('http://webapi.amap.com/maps?v=1.3&key=0f78dd4fa2c67160a4d40f22c52e9233');
    $scope.aboutLock.getLockerList();
    $scope.aboutUnLock.getUnlockerList(10, 1);
    $scope.aboutTempHum.getTempHumList($scope.param);
    $scope.aboutSmoke.getSmokeList($scope.param);
  }])
  .controller('shopMngQueryUnit_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'TblPagination', 'unitStoreStateList', 'unitLockStateList', function($scope, $rootScope, $routeParams, $http, $timeout, $q, TblPagination, unitStoreStateList, unitLockStateList) {
    $scope.param = $routeParams.param;
    $scope.shopID = $routeParams.shopID;

    $rootScope.globalPath.initPath({
      'name': '仓位详情',
      'url': '../../..' + window.location.pathname + '#/shopMng_queryUnit/' + $scope.param + '/shop/' + $scope.shopID
    }, 'LV3');

    $scope.queryResult = {};
    $scope.tblDetails = {
      getUnitDetails: function(unitID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUnit?unitID=' + unitID)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult = ret.data;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getShopDetails: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShop?shopID=' + $scope.shopID)
          .success(function(ret) {
            if (ret.success) {
              console.log(ret);
              self.shopType = ret.data.shopType;
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
      togglePanel: function(linkID, collapseID) {
        if ($(collapseID).hasClass('in')) {
          $(linkID + '>span.fa').addClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-down');
        } else {
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').addClass('fa-chevron-circle-down');
        }
        $(collapseID).collapse('toggle');
      },
      shopType: undefined,
    };

    $scope.tblNormal = {
      getUnitOrderList: function(pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryUnitOrdersFromBKMgr?unitID=' + $scope.param +
            '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            if (ret.success) {
              self.orderList = ret.data.data;
              $scope.tblOrderPagination.initPagination(ret);
              // $scope.tblDetails.getShopDetails();
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getCurrentUnitOrderList: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryCurrentUnitOrdersBKMgr?unitID=' + $scope.param)
          .success(function(ret) {
            if (ret.success) {
              self.currentOrderList = ret.data;
              ret.data.forEach(function(item, index) {
                self.getRentClientDetail(item.userID, index);
              });
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      getRentClientDetail: function(userID, index) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUserFromAdm?id=' + userID)
          .success(function(ret) {
            if (ret.success) {
              self.currentOrderList[index].userType = ret.data.type;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
    };

    $scope.tblOrderPagination = new TblPagination();
    $scope.tblOrderPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      $scope.tblNormal.getUnitOrderList(self.pageSize, pageNum);
    };

    ($scope.tblDetails.getShopDetails()).then(function(success) {
      if (success) {
        $scope.tblDetails.getUnitDetails($scope.param);
        $scope.tblNormal.getUnitOrderList(10, 1);
        $scope.tblNormal.getCurrentUnitOrderList();
      }
    });
  }])
  .controller('shopMngAddUnit_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'unitTypeList', 'unitLockTypeList', function($scope, $rootScope, $routeParams, $http, $timeout, $q, unitTypeList, unitLockTypeList) {
    $scope.shopID = $routeParams.shopID;

    $scope.title = '新增仓位';
    $rootScope.globalPath.initPath({
      'name': '新增仓位',
      'url': '../../..' + window.location.pathname + '#/shopMng_addUnit/shop/' + $scope.shopID
    }, 'LV3');

    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            "styleList": ['btn', 'btn-cancel'],
          },
          {
            "styleList": ['btn', 'btn-confirm'],
          }
        ]
      }
    };

    $scope.formResult = {};
    $scope.valiResult = {
      nameError: false,
      unitSizeError: false,
      volumeError: false,
      priceError: false,
      regionValError: false,
      unitTypeValError: false,
      unitLockTypeValError: false,
      SNCodeError: false,
    };
    $scope.tblDetails = {
      getRegionList: function(shopID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getRegionsByShopID?shopID=' + shopID)
          .success(function(ret) {
            if (ret.success) {
              self.regionList = ret.data;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      regionValChanged: function() {
        var self = this;
        if (!self.regionVal) {
          self.regionVal = {
            id: ''
          };
        }
      },
      unitTypeValChanged: function() {
        var self = this;
        if (!self.unitTypeVal) {
          self.unitTypeVal = {
            id: ''
          };
        }
      },
      unitLockTypeValChanged: function() {
        var self = this;
        if (!self.unitLockTypeVal) {
          self.unitLockTypeVal = {
            id: ''
          };
        }
      },
      validateForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^[A-Z][0-9]{1,}$/;
        var regNotEmpty = /^(.){1,}$/;
        var regRealNum = /^[0-9]+(.[0-9]{1,})?$/;
        //Vali unit's name
        if (!reg.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          console.log($scope.formResult.name);
          console.log(reg.test($scope.formResult.name));
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's size
        if (!regRealNum.test($scope.formResult.length) ||
          !regRealNum.test($scope.formResult.width) ||
          !regRealNum.test($scope.formResult.height)) {
          $scope.valiResult.unitSizeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitSizeError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's volume
        if (!regRealNum.test($scope.formResult.volume)) {
          $scope.valiResult.volumeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.volumeError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's price
        if (self.shopType === 1) {
          if (!regRealNum.test($scope.formResult.price)) {
            $scope.valiResult.priceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.priceError = false;
            canSubmit = canSubmit && true;
          }
        }
        // Vali regionVal
        if (!self.regionVal.id) {
          $scope.valiResult.regionValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.regionValError = false;
          canSubmit = canSubmit && true;
        }
        // Vali unitTypeVal
        if (self.shopType !== 3) {
          if (!self.unitTypeVal.id) {
            $scope.valiResult.unitTypeValError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.unitTypeValError = false;
            canSubmit = canSubmit && true;
          }
        }
        // Vali unitLockTypeVal
        if (!self.unitLockTypeVal.id) {
          $scope.valiResult.unitLockTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitLockTypeValError = false;
          canSubmit = canSubmit && true;
        }
        // Vali SNCode
        if (self.shopType === 3) {
          if (!$scope.formResult.remarks || !regNotEmpty.test($scope.formResult.remarks)) {
            $scope.valiResult.SNCodeError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.SNCodeError = false;
            canSubmit = canSubmit && true;
          }
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          if (self.shopType !== 3) {
            $scope.formResult.type = self.unitTypeVal.id;
          } else {
            $scope.formResult.type = 13; // 车库智能柜
            $scope.formResult.price = 99; // 暂定99元/月
          }
          $scope.formResult.regionID = self.regionVal.id;
          $scope.formResult.lockType = self.unitLockTypeVal.id;
          $scope.formResult.shopID = $scope.shopID;
          $scope.formResult.state = 1; //指示为'空闲'
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addUnit', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '提示';
              if (ret.success) {
                //如果添加仓位成功
                $scope.modalBasic.body.content = '仓位添加成功！';
                $scope.modalBasic.footer.btn[0].name = '完成';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '继续添加';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(0);
                  });
                };
              } else {
                //添加仓位失败
                $scope.modalBasic.body.content = '仓位添加失败！' + ret.message;
                $scope.modalBasic.footer.btn[0].name = '取消';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新添加';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                };
              }
              $timeout(function() {
                $("#myModal").modal({
                  'show': true,
                  'backdrop': 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
        return;
      },
      cancel: function() {
        window.history.go(-1);
      },
      regionList: [],
      unitTypeList: unitTypeList,
      unitLockTypeList: unitLockTypeList,
      regionVal: {
        id: ''
      },
      unitTypeVal: {
        id: ''
      },
      unitLockTypeVal: {
        id: ''
      },
    };
    $scope.tblDetails.getRegionList($scope.shopID);

    ($scope.cmService.getShopDetails($scope.shopID)).then(function(data) {
      if (data.success) {
        $scope.tblDetails.shopType = data.shopType;
        if ($scope.tblDetails.shopType === 2) {
          $scope.tblDetails.unitLockTypeList = unitLockTypeList.slice(2, 3);
        }
      }
    });
  }])
  .controller('shopMngEditUnit_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'unitTypeList', 'unitLockTypeList', function($scope, $rootScope, $routeParams, $http, $timeout, $q, unitTypeList, unitLockTypeList) {
    $scope.param = $routeParams.param;
    $scope.shopID = $routeParams.shopID;

    $scope.title = '编辑仓位';
    $rootScope.globalPath.initPath({
      'name': '编辑仓位',
      'url': '../../..' + window.location.pathname + '#/shopMng_editUnit/' + $scope.param + '/shop/' + $scope.shopID
    }, 'LV3');

    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            "styleList": ['btn', 'btn-cancel'],
          },
          {
            "styleList": ['btn', 'btn-confirm'],
          }
        ]
      }
    };

    $scope.formResult = {};
    $scope.queryResult = {};
    $scope.valiResult = {
      nameError: false,
      unitSizeError: false,
      volumeError: false,
      priceError: false,
      regionValError: false,
      unitTypeValError: false,
      unitLockTypeValError: false,
    };
    $scope.tblDetails = {
      getRegionList: function(shopID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getRegionsByShopID?shopID=' + shopID)
          .success(function(ret) {
            if (ret.success) {
              self.regionList = ret.data;
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
      restoreSelVal: function(selListStr, listValStr, idVal) {
        var self = this;
        var list = self[selListStr];
        console.log(list);
        for (var i in list) {
          if (list[i].id === idVal) {
            self[listValStr] = list[i];
            break;
          }
        }
      },
      queryUnitDetails: function(unitID) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getUnit?unitID=' + unitID)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult = ret.data;
              $scope.formResult = {
                name: ret.data.name,
                length: ret.data.length,
                width: ret.data.width,
                height: ret.data.height,
                price: ret.data.price,
                state: ret.data.unitState,
                shopID: $scope.shopID,
                id: $scope.param,
                remarks: ret.data.remarks,
              };
              var retPromise = $scope.tblDetails.getRegionList($scope.shopID);
              retPromise.then(function(flag) {
                if (flag) {
                  self.restoreSelVal('regionList', 'regionVal', ret.data.regionID);
                }
              }, function() {});
              self.restoreSelVal('unitTypeList', 'unitTypeVal', ret.data.type);
              self.restoreSelVal('unitLockTypeList', 'unitLockTypeVal', ret.data.lockType);
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      regionValChanged: function() {
        var self = this;
        if (!self.regionVal) {
          self.regionVal = {
            id: ''
          };
        }
      },
      unitTypeValChanged: function() {
        var self = this;
        if (!self.unitTypeVal) {
          self.unitTypeVal = {
            id: ''
          };
        }
      },
      unitLockTypeValChanged: function() {
        var self = this;
        if (!self.unitLockTypeVal) {
          self.unitLockTypeVal = {
            id: ''
          };
        }
      },
      validateForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^[A-Z][0-9]{1,}$/;
        var regNotEmpty = /^(.){1,}$/;
        var regRealNum = /^[0-9]+(.[0-9]{1,})?$/;
        //Vali unit's name
        if (!reg.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSubmit = false;
        } else {
          console.log($scope.formResult.name);
          console.log(reg.test($scope.formResult.name));
          $scope.valiResult.nameError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's size
        if (!regRealNum.test($scope.formResult.length) ||
          !regRealNum.test($scope.formResult.width) ||
          !regRealNum.test($scope.formResult.height)) {
          $scope.valiResult.unitSizeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitSizeError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's volume
        if (!regRealNum.test($scope.formResult.volume)) {
          $scope.valiResult.volumeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.volumeError = false;
          canSubmit = canSubmit && true;
        }
        //Vali unit's price
        if (self.shopType === 1) {
          if (!regRealNum.test($scope.formResult.price)) {
            $scope.valiResult.priceError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.priceError = false;
            canSubmit = canSubmit && true;
          }
        }
        // Vali regionVal
        if (!self.regionVal.id) {
          $scope.valiResult.regionValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.regionValError = false;
          canSubmit = canSubmit && true;
        }
        // Vali unitTypeVal
        if (self.shopType !== 3) {
          if (!self.unitTypeVal.id) {
            $scope.valiResult.unitTypeValError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.unitTypeValError = false;
            canSubmit = canSubmit && true;
          }
        }
        // Vali unitLockTypeVal
        if (!self.unitLockTypeVal.id) {
          $scope.valiResult.unitLockTypeValError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.unitLockTypeValError = false;
          canSubmit = canSubmit && true;
        }
        // Vali SNCode
        if (self.shopType === 3) {
          if (!$scope.formResult.remarks || !regNotEmpty.test($scope.formResult.remarks)) {
            $scope.valiResult.SNCodeError = true;
            canSubmit = false;
          } else {
            $scope.valiResult.SNCodeError = false;
            canSubmit = canSubmit && true;
          }
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          if (self.shopType !== 3) {
            $scope.formResult.type = self.unitTypeVal.id;
          }
          $scope.formResult.regionID = self.regionVal.id;
          $scope.formResult.lockType = self.unitLockTypeVal.id;
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateUnit', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '编辑提示';
              if (ret.success) {
                //如果添加仓位成功
                $scope.modalBasic.body.content = '仓位更新成功！';
                $scope.modalBasic.footer.btn[0].name = '完成';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新编辑';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                };
              } else {
                //添加仓位失败
                $scope.modalBasic.body.content = '仓位更新失败！' + ret.message;
                $scope.modalBasic.footer.btn[0].name = '取消';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新编辑';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(0);
                  });
                };
              }
              $timeout(function() {
                $("#myModal").modal({
                  'show': true,
                  'backdrop': 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
        return;
      },
      cancel: function() {
        window.history.go(-1);
      },
      regionList: [],
      unitTypeList: unitTypeList,
      unitLockTypeList: unitLockTypeList,
      regionVal: {
        id: ''
      },
      unitTypeVal: {
        id: ''
      },
      unitLockTypeVal: {
        id: ''
      },
    };

    $scope.tblDetails.queryUnitDetails($scope.param);
    ($scope.cmService.getShopDetails($scope.shopID)).then(function(data) {
      if (data.success) {
        $scope.tblDetails.shopType = data.shopType;
        if ($scope.tblDetails.shopType === 2) {
          $scope.tblDetails.unitLockTypeList = unitLockTypeList.slice(2, 3);
        }
      }
    });
  }])
  .controller('shopMngAddLock_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', function($scope, $rootScope, $routeParams, $http, $timeout) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '新增门禁',
      'url': '../../..' + window.location.pathname + '#/shopMng_addLock/' + $scope.param
    }, 'LV3');
    $scope.title = '新增门禁';
    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ]
      }
    };

    $scope.valiResult = {
      deviceNameError: false,
      deviceCodeError: false,
    };

    $scope.formResult = {
      deviceName: '',
      deviceCode: ''
    }

    $scope.tblDetails = {
      validateForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^[A-Z][0-9]{1,}$/;
        //
        if (!$scope.formResult.deviceName) {
          $scope.valiResult.deviceNameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceNameError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.deviceCode) {
          $scope.valiResult.deviceCodeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceCodeError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.shopID = $scope.param;
          $scope.formResult.type = 1; // 1--门锁；2--仓位锁
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addLLDeviceBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '添加提示';
              if (ret.success) {
                $scope.modalBasic.body.content = '设备门禁 添加成功！';
                $scope.modalBasic.footer.btn[0].name = '完成';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '继续添加';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(0);
                  });
                };
              } else {
                $scope.modalBasic.body.content = '设备门禁 添加失败！' + ret.message;
                $scope.modalBasic.footer.btn[0].name = '返回';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新添加';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                };
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {});
        }
      },
    };
  }])
  .controller('shopMngEditLock_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', function($scope, $rootScope, $routeParams, $http, $timeout) {
    $rootScope.globalPath.initPath({
      'name': '编辑门禁',
      'url': '../../..' + window.location.pathname + '#/shopMng_editLock/' + $routeParams.deviceID + '/shop/' + $routeParams.shopID
    }, 'LV3');
    $scope.title = '编辑门禁';
    $scope.modalBasic = {
      "header": {
        "content": ''
      },
      "body": {
        "content": ''
      },
      "footer": {
        "btn": [{
            styleList: ['btn', 'btn-cancel'],
          },
          {
            styleList: ['btn', 'btn-confirm'],
          }
        ]
      }
    };

    $scope.valiResult = {
      deviceNameError: false,
      deviceCodeError: false,
    };

    $scope.formResult = {};

    $scope.tblDetails = {
      validateForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^[A-Z][0-9]{1,}$/;
        //
        if (!$scope.formResult.deviceName) {
          $scope.valiResult.deviceNameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceNameError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.deviceCode) {
          $scope.valiResult.deviceCodeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceCodeError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      getDetails: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryDeviceBKMgr?deviceID=' + $routeParams.deviceID)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.formResult.deviceName = ret.data.deviceName;
              $scope.formResult.deviceCode = ret.data.deviceCode;
              $scope.formResult.type = ret.data.type;
              $scope.formResult.id = ret.data.id;
            }
          })
          .error(function(msg) {});
      },
      save: function() {
        var self = this;
        var data = $.param($scope.formResult);
        if (self.validateForm()) {
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateLLDeviceBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = '更新提示';
              if (ret.success) {
                $scope.modalBasic.body.content = '门禁信息 更新成功！';
                $scope.modalBasic.footer.btn[0].name = '完成';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新编辑';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                };
              } else {
                $scope.modalBasic.body.content = '门禁信息 更新失败！';
                $scope.modalBasic.footer.btn[0].name = '返回';
                $scope.modalBasic.footer.btn[0].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(-1);
                  });
                };
                $scope.modalBasic.footer.btn[1].name = '重新编辑';
                $scope.modalBasic.footer.btn[1].func = function() {
                  $("#myModal").off(); //先解绑所有事件
                  $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                    window.history.go(0);
                  });
                };
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {});
        }
      },
      validateForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^[A-Z][0-9]{1,}$/;
        //
        if (!$scope.formResult.deviceName) {
          $scope.valiResult.deviceNameError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceNameError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.deviceCode) {
          $scope.valiResult.deviceCodeError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.deviceCodeError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
    };

    $scope.tblDetails.getDetails();
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/shopMng_index', {
        templateUrl: 'shopMng_index.html?t=' + getTimeStamp(), //门店管理首页--门店列表
        controller: 'shopMngIndex_ctrl',
      })
      .when('/shopMng_queryShop/:param', { //查询门店详情
        templateUrl: 'shopMng_queryShop.html?t=' + getTimeStamp(),
        controller: 'shopMngQueryShop_ctrl',
      })
      .when('/shopMng_addShop', { //新增门店
        templateUrl: 'shopMng_addShop.html?t=' + getTimeStamp(),
        controller: 'shopMngAddShop_ctrl'
      })
      .when('/shopMng_editShop/:param', { //编辑门店
        templateUrl: 'shopMng_addShop.html?t=' + getTimeStamp(),
        controller: 'shopMngEditShop_ctrl'
      })
      .when('/shopMng_queryUnit/:param/shop/:shopID', { //查询仓位详情
        templateUrl: 'shopMng_queryUnit.html?t=' + getTimeStamp(),
        controller: 'shopMngQueryUnit_ctrl'
      })
      .when('/shopMng_addUnit/shop/:shopID', { //新增仓位
        templateUrl: 'shopMng_addUnit.html?t=' + getTimeStamp(),
        controller: 'shopMngAddUnit_ctrl'
      })
      .when('/shopMng_editUnit/:param/shop/:shopID', { //编辑仓位
        templateUrl: 'shopMng_addUnit.html?t=' + getTimeStamp(),
        controller: 'shopMngEditUnit_ctrl'
      })
      .when('/shopMng_addLock/:param', {
        templateUrl: 'shopMng_addLock.html?t=' + getTimeStamp(),
        controller: 'shopMngAddLock_ctrl'
      })
      .when('/shopMng_editLock/:deviceID/shop/:shopID', {
        templateUrl: 'shopMng_addLock.html?t=' + getTimeStamp(),
        controller: 'shopMngEditLock_ctrl'
      })
      .when('/shopMng_addTempHum/:shopID', {
        templateUrl: 'shopMng_addTempHum.html?t=' + getTimeStamp(),
        controller: 'shopMngAddTempHum_ctrl'
      })
      .when('/shopMng_editTempHum/:id/:shopID', {
        templateUrl: 'shopMng_addTempHum.html?t=' + getTimeStamp(),
        controller: 'shopMngEditTempHum_ctrl'
      })
      .when('/shopMng_addSmoke/:shopID', {
        templateUrl: 'shopMng_addSmoke.html?t=' + getTimeStamp(),
        controller: 'shopMngAddSmoke_ctrl'
      })
      .when('/shopMng_editSmoke/:id/:shopID', {
        templateUrl: 'shopMng_addSmoke.html?t=' + getTimeStamp(),
        controller: 'shopMngEditSmoke_ctrl'
      })
      .when('/shopMng_detailsTempHum/:id', {
        templateUrl: 'shopMng_detailsTempHum.html?t=' + getTimeStamp(),
        controller: 'shopMngDetailsTempHum_ctrl'
      })
      .when('/shopMng_detailsSmoke/:id', {
        templateUrl: 'shopMng_detailsSmoke.html?t=' + getTimeStamp(),
        controller: 'shopMngDetailsSmoke_ctrl'
      })
      .otherwise({
        redirectTo: '/shopMng_index'
      });
    $httpProvider.interceptors.push('myInterceptor');
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    // 为了清除缓存
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
