/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule','mngApp.expensesList','mngApp.expensesData','mngApp.expensesAdd','mngApp.expensesEdit','mngApp.expensesDetails'])
  .controller('mngCtrl', [function() {}])
  .controller('financeMngRefundList_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'refundStateList', 'itemNumList', 'RememberSer', function($scope, $rootScope, $http, $timeout, refundStateList, itemNumList, RememberSer) {
    $scope.globalPath.initPath({
      'name': '退款处理',
      'url': '../../..' + window.location.pathname + '#/financeMng_index'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      refundStateValChanged: function() {
        var self = this;
        self.searchVal = "";
        if (!self.refundStateVal) {
          self.refundStateVal = {
            id: ''
          };
        }
        $scope.tblNormal.getRefundList(self.refundStateVal.id, '', self.itemNumVal.id, 1);
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.refundStateVal) {
          self.refundStateVal = {
            id: ''
          };
        }
        //Get intentClientList
        $scope.tblNormal.getRefundList(self.refundStateVal.id, self.searchVal, self.itemNumVal.id, 1);
      },
      launchSearch: function() {
        var self = this;
        // if(!self.refundStateVal){
        //   self.refundStateVal = {id: ''};
        // }
        //Get intentClientList
        $scope.tblNormal.getRefundList(self.refundStateVal.id, self.searchVal, self.itemNumVal.id, 1);
      },
      refundStateList: refundStateList,
      itemNumList: itemNumList,
      refundStateVal: {
        id: ''
      },
      itemNumVal: "",
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getRefundList: function(refundState, orderID, pageSize, curPage) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRefundListByBKAdmin?refundState=' + refundState +
            '&orderID=' + orderID + '&pageSize=' + pageSize + '&curPage=' + curPage)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              self.dataList = data;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      refreshRefundItem: function(evt, index, id) {
        console.log(arguments);
        var self = this;
        var target = evt.target;
        evt.preventDefault();
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRefundDetailByBKAdmin?refundID=' + id)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data[0];
              //更新掉退款金额
              $scope.tblNormal.dataList[index].refundAmount = data.refundAmount;
              //更新掉退款状态
              $scope.tblNormal.dataList[index].refundState = data.refundState;
              //更新掉退款日期
              $scope.tblNormal.dataList[index].refundDate = data.refundDate;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
    };

    $scope.tblPagination = {
      changePage: function(idName, effective) {
        if (!effective) {
          return;
        }
        var self = this;
        //如果是数字页码
        if (idName.indexOf('page') === 0) {
          var pageNum = idName.slice(4);
        } else if (idName.indexOf('lfPage') === 0) {
          var pageNum = self.curPage - 1;
        } else if (idName.indexOf('rtPage') === 0) {
          var pageNum = self.curPage + 1;
        } else if (idName.indexOf('lfGrp') === 0) {
          var pageNum = (self.curGrp - 1) * self.CNTNUM;
        } else if (idName.indexOf('rtGrp') === 0) {
          var pageNum = self.curGrp * self.CNTNUM + 1;
        }
        //触发动作的钩子函数
        var tblToolbar = $scope.tblToolbar;
        $scope.tblNormal.getRefundList(tblToolbar.refundStateVal.id, tblToolbar.searchVal, self.pageSize, pageNum);
      },
      initPagination: function(retData) {
        console.log(retData);
        var self = this;
        var data = retData.data;
        self.curPage = data.curPage;
        self.totalPage = data.totalPage;
        self.pageSize = data.pageSize;
        self.curGrp = parseInt((self.curPage - 1) / self.CNTNUM) + 1;
        self.totalGrp = parseInt((self.totalPage - 1) / self.CNTNUM) + 1;
        self.curMinPage = (self.curGrp - 1) * self.CNTNUM + 1;
        self.curMaxPage = (self.totalPage < self.curGrp * self.CNTNUM) ? self.totalPage : self.curGrp * self.CNTNUM;
        var curPagePos = (self.curPage - (self.curGrp - 1) * self.CNTNUM) - 1;
        //开始设置-----------------------------------------------
        //填充视图页码所对应的数组
        self.pageObj.pages = [];
        // for(var i=1;i<=self.totalPage;i++){
        for (var i = self.curMinPage; i <= self.curMaxPage; i++) {
          self.pageObj.pages.push({
            name: 'page' + i,
            effective: true,
            exist: true,
          });
        }
        console.log(self.pageObj.pages);
        if (!self.pageObj.pages.length) {
          self.pageObj.lfPage.effective = false;
          self.pageObj.rtPage.effective = false;
          self.pageObj.lfGrp.exist = false;
          self.pageObj.rtGrp.exist = false;
          return;
        }
        //当前页不给再点击触发了
        (self.pageObj.pages[curPagePos]).effective = false;
        //判断是否可以左翻页
        self.pageObj.lfPage.effective = !(self.curPage === 1);
        //判断是否可以右翻页
        self.pageObj.rtPage.effective = !(self.curPage === self.totalPage);
        //判断是否存在左翻组
        self.pageObj.lfGrp.exist = (self.curGrp > 1);
        //判断是否存在右翻组
        self.pageObj.rtGrp.exist = (self.curGrp < self.totalGrp);
      },
      CNTNUM: 5,
      curPage: 0,
      pageSize: 0,
      totalPage: 0,
      curMaxPage: 0,
      curMinPage: 0,
      curGrp: 0,
      totalGrp: 0,
      pageObj: {
        'lfPage': {
          effective: false,
          exist: true
        },
        'rtPage': {
          effective: false,
          exist: true
        },
        'lfGrp': { //翻组不一定出现，一旦出现则肯定有效
          effective: true,
          exist: false
        },
        'rtGrp': { //翻组不一定出现，一旦出现则肯定有效
          effective: true,
          exist: false
        },
        'pages': [],
      },
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getRefundList($scope.tblToolbar.refundStateVal.id,
        $scope.tblToolbar.searchVal,
        $scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage);
    } else {
      $scope.tblNormal.getRefundList('', '', 10, 1);
    }
  }])
  .controller('financeMngRefundDetails_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', function($scope, $rootScope, $routeParams, $http, $timeout) {
    $scope.param = $routeParams.param;
    $scope.queryResult = {};

    $scope.globalPath.initPath({
      'name': '退款详情',
      'url': '../../..' + window.location.pathname + '#/financeMng_refundDetails/' + $scope.param
    }, 'LV2');

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
    $scope.tblDetails = {
      getRefundDetails: function(id) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRefundDetailByBKAdmin?refundID=' + id)
          .success(function(ret) {
            console.log(ret);
            $scope.queryResult = ret.data[0];
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      refundNow: function() {
        $scope.modalBasic.header.content = '退款提示';
        $scope.modalBasic.body.content = '确认进行立即退款吗？';
        $scope.modalBasic.footer.btn = [{
            "name": '取消',
            "styleList": ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          },
          {
            "name": '确认',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                var data = 'orderID=' + $scope.queryResult.orderID +
                  '&totalFee=' + $scope.queryResult.orderActualPay +
                  '&operatorID=' + window.localStorage.getItem('vks-web-adminID') +
                  '&refundID=' + $scope.queryResult.refundID;
                $http.post('http://' + $rootScope.globalURL.hostURL + '/api/orderRefund', data)
                  .success(function(ret) {
                    console.log(ret);
                    //初始化并发起模态框
                    $scope.modalBasic.header.content = '退款提示';
                    if (ret.success) {
                      $scope.modalBasic.body.content = '立即退款 成功！';
                    } else {
                      $scope.modalBasic.body.content = '立即退款 失败！' + ret.message;
                    }
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
                        "name": '完成',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      }
                    ];
                    $timeout(function() {
                      $("#myModal").modal({
                        show: true,
                        backdrop: 'static' //点击周围区域时不会隐藏模态框
                      });
                    }, 0);
                  }).error(function(msg) {
                    console.log("Fail! " + msg);
                  });
              });
            }
          }
        ];
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      refundConfirmed: function() {
        $scope.modalBasic.header.content = '退款提示';
        $scope.modalBasic.body.content = '确认已进行人工退款吗？';
        $scope.modalBasic.footer.btn = [{
            "name": '取消',
            "styleList": ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          },
          {
            "name": '确认',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateRefundStateFromAdmin?id=' + $scope.queryResult.refundID +
                    '&operatorID=' + window.localStorage.getItem('vks-web-adminID'))
                  .success(function(ret) {
                    $scope.modalBasic.header.content = '退款提示';
                    if (ret.success) {
                      $scope.modalBasic.body.content = '确认已人工退款 成功！';
                    } else {
                      $scope.modalBasic.body.content = '确认已人工退款 失败！' + ret.message;
                    }
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
                        "name": '完成',
                        "styleList": ['btn', 'btn-confirm'],
                        'func': function() {
                          $("#myModal").off(); //先解绑所有事件
                          $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                            window.history.go(0);
                          });
                        }
                      }
                    ];
                    $timeout(function() {
                      $("#myModal").modal({
                        show: true,
                        backdrop: 'static' //点击周围区域时不会隐藏模态框
                      });
                    }, 0);
                  }).error(function(msg) {
                    console.log("Fail! " + msg);
                  });
              });
            }
          }
        ];
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      togglePanel: function(linkID, collapseID) {
        console.log(arguments);
        // $('.collapse.in').removeClass('in');
        // $('.fa-chevron-circle-down').removeClass('fa-chevron-circle-down')
        //   .addClass('fa-chevron-circle-right');
        if ($(collapseID).hasClass('in')) {
          $(linkID + '>span.fa').addClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-down');
        } else {
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').addClass('fa-chevron-circle-down');
        }
        $(collapseID).collapse('toggle');
      },
    };
    $scope.tblDetails.getRefundDetails($scope.param);
  }])
  .controller('financeMngReceiptList_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'itemNumList', 'contractStateList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $routeParams, $http, $timeout, $q, itemNumList, contractStateList, RememberSer, TblPagination) {
    $scope.globalPath.initPath({
      'name': '收款管理',
      'url': '../../..' + window.location.pathname + '#/financeMng_receiptList'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.getUrlParam = {
      cityID: $routeParams.cityID,
    }
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
      getShopList: function(cityID) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get shops list by cityID
        if ($scope.getUrlParam.cityID) {
          cityID = $scope.getUrlParam.cityID;
        } else {
          cityID = self.cityVal.id || '';
        }
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + cityID +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            if (ret.success) {
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
      // 城市值变化
      cityValChanged: function() {
        var self = this;
        if (!self.cityVal) {
          self.cityVal = {
            id: '',
          }
        }
        self.getShopList(self.cityVal.id);
        // console.log(self.cityVal.id);
        $scope.tblNormal.getReceiptList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, 1, '', self.contractStateVal.id);
      },
      // 门店之变化
      shopValChanged: function() {
        var self = this;
        if (!self.shopVal) {
          self.shopVal = {
            id: '',
          }
        }
        // console.log(self.shopVal.id);
        $scope.tblNormal.getReceiptList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, 1, '', self.contractStateVal.id);
      },
      contractStateValChanged: function() {
        var self = this;
        if (!self.contractStateVal) {
          self.contractStateVal = {
            id: '',
          }
        }
        console.log(self.contractStateVal.id);
        $scope.tblNormal.getReceiptList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, 1, '', self.contractStateVal.id);
      },
      itemNumValChanged: function() {
        var self = this;
        if (!self.itemNumVal) {
          self.itemNumVal = {
            id: '',
          }
        }
        $scope.tblNormal.getReceiptList(self.cityVal.id, self.shopVal.id, self.itemNumVal.id, 1, 1, '', self.contractStateVal.id);
      },
      launchSearch: function() {
        var self = this;
        $scope.tblNormal.getReceiptList('', '', self.itemNumVal.id, 1, 1, self.searchVal, '');
      },
      cityList: '',
      cityVal: {
        id: ''
      },
      shopList: '',
      shopVal: {
        id: '',
      },
      contractStateVal: {
        id: '',
      },
      itemNumList: itemNumList,
      itemNumVal: itemNumList[1],
      contractStateList: contractStateList,
      searchVal: "",
    };
    $scope.tblNormal = {
      // 获取未确认订单
      getReceiptList: function(cityID, shopID, pageSize, curPage, sortType, key, contractState) {
        var self = this;
        var url = 'http://' + $rootScope.globalURL.hostURL + '/api/queryNotReceiptOrderListBKMgr?cityID=' + cityID + '&shopID=' + shopID + '&pageSize=' + pageSize + '&curPage=' + curPage + '&sortType=' + sortType + '&orderColumn=createDate' + '&key=' + key + '&isExistContract=' + contractState;
        // console.log(url);
        $http.post(url)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              self.dataList = ret.data.data;
              $scope.tblPagination.initPagination(ret);
              // $scope.tblPagination.initPagination(ret);
              // console.log(self.dataList);
            }
          }).error(function(msg) {
            console.log("Fail! " + msg);
          });
      },

    };
    /* 创建页面初始化对象 */
    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getReceiptList(tblToolbar.cityVal.id, tblToolbar.shopVal.id, tblToolbar.itemNumVal.id, pageNum, 1, '', $scope.tblToolbar.contractStateVal.id);
    };
    $q.all([$scope.tblToolbar.getCityList(), $scope.tblToolbar.getShopList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            $scope.tblNormal.getReceiptList(
              $scope.tblToolbar.cityVal.id,
              $scope.tblToolbar.shopVal.id,
              $scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage,
              1, '', $scope.tblToolbar.contractStateVal.id);
          } else {
            $scope.tblNormal.getReceiptList('', '', $scope.tblToolbar.itemNumVal.id, 1, 1, '','');
          }
        }
      });
  }])
  .controller('financeMngReceiptDetails_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$q','$timeout', '$location', '$window','payWayList', function($scope, $rootScope, $routeParams, $http, $q, $timeout, $location, $window, payWayList) {
    $scope.param = $routeParams.param;
    $scope.queryResult = {};

    $scope.globalPath.initPath({
      'name': '收款管理详情',
      'url': '../../..' + window.location.pathname + '#/financeMng_receiptDetails/' + $scope.param
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
    $scope.formResult = {
      orderID: $scope.param,
      payDate: '',
      remarks: '',
      orderPayWay: '',
    }
    $scope.valiResult = {
      payDateError: false,
    };
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
    $scope.payDatepicker = {
      opt: {
        elem: '#payDate',
        // format: 'YYYY/MM/DD hh:mm:ss',
        format: 'YYYY-MM-DD',
        // min: laydate.now(), //设定最小日期为当前日期
        min: '2000-01-01 00:00:00',
        max: '2099-06-16 23:59:59', //最大日期
        // max: laydate.now(), //最大日期
        istime: false,
        istoday: true,
        choose: function(datas) {
          $scope.formResult.payDate = datas;
          console.log($scope.formResult.payDate);
        },
        clear: function() {
          $scope.formResult.payDate = '';
        }
      },
      showPayDate: function() {
        var self = this;
        laydate(self.opt);
      },
    }
    $scope.tblDetails = {
      valiForm: function() {
        var self = this;
        var canSubmit = true;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/; //简单验证日期的正则
        if (!regDate.test($scope.formResult.payDate)) {
          $scope.valiResult.payDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.payDateError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      getReceiptDetails: function(id) {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        console.log($scope.param);
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOrderDetailFromBKMgr?orderID=' + id)
          .success(function(ret) {
            if (ret.success) {
              console.log(self.payWayList);
              $scope.queryResult = ret.data;
              $scope.formResult.remarks = $scope.queryResult.remarks;
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
      confirmReceipt: function() {
        var self = this;
        console.log($scope.formResult);
        if (self.valiForm()) {
          $scope.modalBasic.header.content = '提示';
          $scope.modalBasic.body.content = '您已确认收到款项吗？';
          $scope.modalBasic.footer.btn = [{
              "name": '取消',
              "styleList": ['btn', 'btn-cancel'],
              'func': function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
              }
            },
            {
              "name": '确认',
              "styleList": ['btn', 'btn-confirm'],
              'func': function() {
                $("#myModal").off(); //先解绑所有事件
                $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                  var data = 'id=' + $scope.queryResult.orderID +
                    '&payTime=' + $scope.formResult.payDate + ' ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds() +
                    '&remarks=' + $scope.formResult.remarks +
                    '&managerID=' + $scope.queryResult.managerID +
                    '&payWay=' + $scope.formResult.orderPayWay +
                    '&actualPay=' + $scope.queryResult.orderActualPay
                    // +'&shopID='+($scope.queryResult.shopID || '')
                    +
                    '&cityID=' + $scope.queryResult.cityID;
                  console.log(data);
                  $http.post('http://' + $rootScope.globalURL.hostURL + '/api/confirmReceiptBKMgr?' + data)
                    .success(function(ret) {
                      console.log(ret);
                      //初始化并发起模态框
                      $scope.modalBasic.header.content = '提示';
                      if (ret.success) {
                        $scope.modalBasic.body.content = '确认已收款 成功！';
                      } else {
                        $scope.modalBasic.body.content = '确认已收款 失败！' + ret.message;
                      }
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
                          "name": '完成',
                          "styleList": ['btn', 'btn-confirm'],
                          'func': function() {
                            $("#myModal").off(); //先解绑所有事件
                            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                              // console.log(111111);
                              $window.location.href = '../orderMng/index.html#/orderMng_queryOrder/' + $scope.queryResult.orderID;
                            });
                          }
                        }
                      ];
                      $timeout(function() {
                        $("#myModal").modal({
                          show: true,
                          backdrop: 'static' //点击周围区域时不会隐藏模态框
                        });
                      }, 0);
                    }).error(function(msg) {
                      console.log("Fail! " + msg);
                    });
                });
              }
            }
          ];
          $timeout(function() {
            $("#myModal").modal({
              show: true,
              backdrop: 'static' //点击周围区域时不会隐藏模态框
            });
          }, 0);
        }
      },
      cancelReceipt: function() {
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.content = '确认取消订单吗？';
        $scope.modalBasic.footer.btn = [{
            "name": '取消',
            "styleList": ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          },
          {
            "name": '确认',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $("#myModal").off(); //先解绑所有事件
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                var data = 'orderID=' + $scope.queryResult.orderID;
                $http.post('http://' + $rootScope.globalURL.hostURL + '/api/cancalNoPayOrderBKMgr?' + data)
                  .success(function(ret) {
                    $scope.modalBasic.header.content = '提示';
                    if (ret.success) {
                      $scope.modalBasic.body.content = '取消订单 成功！';
                    } else {
                      $scope.modalBasic.body.content = '取消订单 失败！' + ret.message;
                    }
                    $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-confirm'],
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
                  }).error(function(msg) {
                    console.log("Fail! " + msg);
                  });
              });
            }
          }
        ];
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      back: function() {
        window.history.go(-1);
      },
      togglePanel: function(linkID, collapseID) {
        console.log(arguments);
        // $('.collapse.in').removeClass('in');
        // $('.fa-chevron-circle-down').removeClass('fa-chevron-circle-down')
        //   .addClass('fa-chevron-circle-right');
        if ($(collapseID).hasClass('in')) {
          $(linkID + '>span.fa').addClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-down');
        } else {
          $(linkID + '>span.fa').removeClass('fa-chevron-circle-right');
          $(linkID + '>span.fa').addClass('fa-chevron-circle-down');
        }
        $(collapseID).collapse('toggle');
      },
      payWayValChange:function(){
        var self = this;
        $scope.formResult.orderPayWay = self.payWayVal.id;
        console.log($scope.formResult.orderPayWay);
      },
      payWayList: payWayList.slice(-4),
      setPayWayVal: function(id){
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getOrderDetailFromBKMgr?orderID=' + id)
          .success(function(ret) {
            for(var i in self.payWayList){
              if(self.payWayList[i].id == ret.data.orderPayWay){
              self.payWayVal = $scope.tblDetails.payWayList[i];
              // 给$scope.formResult.orderPayWay赋初始值
              $scope.formResult.orderPayWay = self.payWayList[i].id;
              }
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          })
      },
      // payWayVal: setPayWayVal($scope.param),
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
    };
    $scope.tblToolbar = {
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
      // 删除对应的合同图片
      deleteContractImage: function(event, id) {
        var self = this;
        event.stopPropagation();
        $scope.modalBasic.header.content = '提示';
        $scope.modalBasic.body.content = '你确定要删除该合同图片吗？';
        $scope.modalBasic.footer.btn = [{
          "name": '取消',
          "styleList": ['btn', 'btn-cancel'],
          'func': function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {

            })
          }
        }, {
          "name": '确定',
          "styleList": ['btn', 'btn-confirm'],
          'func': function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
              $http.post('http://' + $rootScope.globalURL.hostURL + '/api/deleteOrderContractPictureByIDWXMgr?orderContractPictureID=' + id)
              .success(function(res){
                if(res.success){
                  var promiseContract = $scope.tblDetails.getContractDetails();
                  promiseContract.then(function(result){
                    if(result){
                      console.log($scope.querycontractResult);
                      $scope.queryResult.contractList = $scope.querycontractResult;
                    }
                  })
                }
              })
            })
          }
        }]
        $timeout(function() {
          $("#myModal").modal({
            show: true,
            backdrop: 'static' //点击周围区域时不会隐藏模态框
          });
        }, 0);
      },
      // turnRotate: -90,
      // count: 0,
      // firstImgViewTip: false,
      // lastImgViewTip: false,
    }

    // 设置图片浏览是img-box的行高,使图片上下区中。
    // var setViewBoxLH = function(){
    //   var WindowH = $(window).height();
    //   $(".viewContract-outerbox .img-box").css({"line-height": WindowH+"px"})
    // }
    //
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
    //   }
    // })
    $scope.$on('repeatDone',function(e){
        $scope.tblToolbar.loadImg();
    });
    $scope.tblDetails.setPayWayVal($scope.param);
    $scope.tblDetails.getReceiptDetails($scope.param)
    .then(function(result){
      if(result){
        var promiseContract = $scope.tblDetails.getContractDetails();
        promiseContract.then(function(result){
          if(result){
            console.log($scope.querycontractResult);
            $scope.queryResult.contractList = $scope.querycontractResult;
          }
        })
      }
    })
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/financeMng_refundList', {
        templateUrl: 'financeMng_refundList.html?t=' + getTimeStamp(),
        controller: 'financeMngRefundList_ctrl'
      })
      .when('/financeMng_refundDetails/:param', {
        templateUrl: 'financeMng_refundDetails.html?t=' + getTimeStamp(),
        controller: 'financeMngRefundDetails_ctrl'
      })
      .when('/financeMng_receiptList', {
        templateUrl: 'financeMng_receiptList.html?t=' + getTimeStamp(),
        controller: 'financeMngReceiptList_ctrl'
      })
      .when('/financeMng_receiptDetails/:param', {
        templateUrl: 'financeMng_receiptDetails.html?t=' + getTimeStamp(),
        controller: 'financeMngReceiptDetails_ctrl'
      })
      .when('/financeMng_expensesData',{
        templateUrl: 'financeMng_expensesData.html?t=' + getTimeStamp(),
        controller: 'financeMngExpensesData_ctrl'
      })
      .when('/financeMng_expensesList', {
        templateUrl: 'financeMng_expensesList.html?t=' + getTimeStamp(),
        controller: 'financeMngExpensesList_ctrl'
      })
      .when('/financeMng_expensesAdd',{
        templateUrl: 'financeMng_expensesAdd.html?t=' + getTimeStamp(),
        controller: 'financeMngExpensesAdd_ctrl'
      })
      .when('/financeMng_expensesEdit/:id',{
        templateUrl: 'financeMng_expensesAdd.html?t=' + getTimeStamp(),
        controller: 'financeMngExpensesEdit_ctrl'
      })
      .when('/financeMng_expensesDetails/:id',{
        templateUrl: 'financeMng_expensesDetails.html?t=' + getTimeStamp(),
        controller: 'financeMngExpensesDetails_ctrl'
      })
      .otherwise({
        redirectTo: '/financeMng_refundList'
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
