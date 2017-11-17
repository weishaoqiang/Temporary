/*
  Found sth that will make u suprise. You can make those option as a global configuration
  - constant
  - value
  - factory
  - service
  - filter
  - run
*/

// 总体模块配置文件夹

var cmModule = angular.module('ngCMModule', ['ng', 'ngRouteModule', 'ngHttpModule', 'ngInitPageModule', 'ngFilterModule', 'ngComponentsModule']);
cmModule.run(['$rootScope',  '$cacheFactory', 'GLOBAL_PATH', function($rootScope, $cacheFactory, GLOBAL_PATH) {
  jQuery.ajaxSetup({
      cache: true, //缓存jquery封装的ajax请求
      crossDomain: true, //允许跨域请求
    });

  jQuery.extend({
    scriptsArray: [],
    cachedScript: function(url, options) {
      var self = this;
      for (var s in self.scriptsArray) {
        //如果某个数组已经下载到了本地
        if (self.scriptsArray[s] == url) {
          return {
            done: function(method) {
              if (typeof method == 'function') { //如果传入参数为一个方法
                method();
              }
            }
          };
        }
      }
      options = $.extend(options || {}, {
        dataType: "script",
        url: url,
        cache: true
      });
      self.scriptsArray.push(url);
      return jQuery.ajax(options);
    },
  });

  $rootScope.pathObj = {
    pathBuf: [],
    skipToHome: function() {
      window.sessionStorage.removeItem('viewLocation');
      $("li.nav-item").removeClass('open').removeClass('active').removeClass('start');
      $("li#viewHomeItem").addClass('open active start');
    }
  };

  $rootScope.globalPath = GLOBAL_PATH;

  $rootScope.$on('$locationChangeStart', function(evt, toUrl, fromUrl) {
  });
  $rootScope.$on('$locationChangeSuccess', function(evt, toUrl, fromUrl) {
    // console.log('123================================123');
  });
  $rootScope.$on('$routeChangeStart', function(evt, toUrl, fromUrl) {
    if(!window.sessionStorage.getItem('adminModules')){
      window.location.href = $rootScope.globalURL.loginURL;
    }
  });
  $rootScope.$on('$routeChangeSuccess', function(evt, toUrl, fromUrl) {
    $rootScope.fromUrl = fromUrl;
    if(!fromUrl){
      $rootScope.adminModules = JSON.parse(window.sessionStorage.getItem('adminModules'));
    }
    if (fromUrl && fromUrl.scope) {
      if (fromUrl.scope.pageType === 'REMPAGE') {
        var attrBuf = ['cityVal', 'shopVal', 'stateVal', 'userTypeVal', 'orderStateVal',
        'refundStateVal', 'itemNumVal', 'searchVal', 'shopTypeVal', 'roleVal', 'clientStateVal', 'promotionStateVal',
        'threadBusinessTypeVal', 'threadStateVal', 'timeVal', 'otherIncomeTypeVal','isVankeVal','overDueDateVal','startDate','endDate','managerID','timeTypeVal'];
        var scopeObj = {};
        for (var i in attrBuf) {
          var attr = attrBuf[i];
          if((!!fromUrl.scope.tblToolbar) && (typeof (fromUrl.scope.tblToolbar)[attr] !== 'undefined')){
            scopeObj[attr] = (fromUrl.scope.tblToolbar)[attr];
          }
        }
        scopeObj['curPage'] = (fromUrl.scope.tblPagination)['curPage'];
        if (fromUrl.scope.tblSortable) {
          scopeObj['theadConfig'] = (fromUrl.scope.tblSortable)['theadConfig'];
        }
        var dataStr = JSON.stringify(scopeObj);
        var key = fromUrl.loadedTemplateUrl;
        window.sessionStorage.setItem(key, dataStr);
      }else if(fromUrl.scope.pageType === 'REMINDEXPAGE'){
        var remCfg = fromUrl.scope.remCfg;
        var tempScopeObj = {};
        var scopeObj = {};
        remCfg.map(function(item, index, originArr){
          tempScopeObj = Object.create(fromUrl.scope[item]);
          scopeObj[item] = Object.getPrototypeOf(tempScopeObj);
        });
        console.log(scopeObj);
        var dataStr = JSON.stringify(scopeObj);
        window.sessionStorage.setItem(fromUrl.loadedTemplateUrl, dataStr);
      }
    } else {
      var flagFormer = (!fromUrl && window.sessionStorage.getItem('pathBuf') && (window.sessionStorage.getItem('pathBuf')).split('/').length < 2);
      var flagLater = (window.sessionStorage.getItem('pathBuf') &&
        ((window.sessionStorage.getItem('pathBuf')).split('/').length === 2) &&
        (window.sessionStorage.getItem('pathBuf')).split('/')[0] === '仪表盘');
      if (flagFormer || flagLater) {
        window.sessionStorage.removeItem(toUrl.loadedTemplateUrl);
      }
    }
  });
}]);

// Breadcrumb service
cmModule.service('GLOBAL_PATH', ['$rootScope', function($rootScope) {
  return {
    initPath: function(pathObj, level) {
      var self = this;
      //如果是要后退
      if (window.sessionStorage.getItem('backFlag') === 'true') {
        window.sessionStorage.setItem('backFlag', 'false');
        //恢复路径
        self.restorePath();
      } else {
        //区分是一级还是二/三级页面
        switch (level) {
          case 'LV1':
            console.log('LV1');
            $rootScope.pathObj.pathBuf = []; //清除数据
            break;
          case 'LV2':
            //恢复路径到缓冲区
            self.restorePath();
            break;
          case 'LV3':
            //恢复路径
            self.restorePath();
            break;
        }
        if ($rootScope.pathObj.pathBuf.length > 0) {
          console.log(pathObj.name);
          console.log($rootScope.pathObj.pathBuf);
          //如果倒数第二个与当前的一致，则弹出最后一个，且不保存当前的
          if (($rootScope.pathObj.pathBuf.slice(-2)[0]) && (pathObj.name === $rootScope.pathObj.pathBuf.slice(-2)[0].name)) {
            self.popOthers($rootScope.pathObj.pathBuf.length - 2);
          }
          //如果当前所跳到的页面与上一级不同
          else if (pathObj.name !== $rootScope.pathObj.pathBuf.slice(-1)[0].name) {
            $rootScope.pathObj.pathBuf.push(pathObj); //压入数据以显示
          }
        } else {
          $rootScope.pathObj.pathBuf.push(pathObj); //压入数据以显示
        }
        //保存面包屑，以防刷新后消失
        self.savePath();
      }
    },
    popOthers: function(index) {
      var self = this;
      var len = $rootScope.pathObj.pathBuf.length;
      console.log(index);
      console.log(len);
      if (len > 1) {
        //如果点击的不是最后一个，才标志为后退
        if (len !== index + 1) {
          if (window.event.target.nodeName === 'A') {
            window.sessionStorage.setItem('backFlag', 'true');
          }
        }
        var buf = $rootScope.pathObj.pathBuf.splice(index + 1, len - index - 1);
        //保存面包屑，以防刷新后消失
        self.savePath();
      }
    },
    savePath: function() {
      //保存面包屑，以防刷新后消失
      //实际上就是写到sessionStorage
      var tempPathName = '';
      var tempPathUrl = '';
      var nameDivider = '';
      var urlDivider = '';
      for (var i in $rootScope.pathObj.pathBuf) {
        if (i >= 1) {
          nameDivider = '/';
          urlDivider = ' ';
        } else {
          nameDivider = '';
          urlDivider = '';
        }
        tempPathName += nameDivider + $rootScope.pathObj.pathBuf[i].name;
        tempPathUrl += urlDivider + $rootScope.pathObj.pathBuf[i].url;
      }
      window.sessionStorage.setItem('pathBuf', tempPathName);
      window.sessionStorage.setItem('pathUrl', tempPathUrl);
    },
    restorePath: function() {
      var pathNameBuf = window.sessionStorage.getItem('pathBuf').split('/');
      var pathUrlBuf = window.sessionStorage.getItem('pathUrl').split(' ');
      $rootScope.pathObj.pathBuf = [];
      for (var i in pathNameBuf) {
        $rootScope.pathObj.pathBuf.push({
          "name": pathNameBuf[i],
          "url": pathUrlBuf[i]
        });
      }
    }
  };
}]);
// Record view state serv
cmModule.service('RememberSer', ['$route', 'TblPagination', function($route, TblPagination) {
  return {
    restore: function($scope) {
      var tplUrl = $route.current.loadedTemplateUrl; // 获取当前已经加载过的路由路径
        var canRestore = window.sessionStorage.getItem(tplUrl) && true;
      if (canRestore && ($scope.pageType=="REMINDEXPAGE")) {
        var obj = JSON.parse(window.sessionStorage.getItem(tplUrl));
        console.log('REMINDEXPAGE');
        var tempObj;
        for(var key in obj){
          var temp = {};
          tempObj = Object.create(obj[key]);
          // tblPagination比较特殊，需要用原来的配置对象，对象地址不能改变
          if($scope[key] instanceof TblPagination){
            jQuery.extend(true, $scope[key], Object.getPrototypeOf(tempObj));
          }else{
            jQuery.extend(true, temp, $scope[key], Object.getPrototypeOf(tempObj));
            $scope[key] = temp;
          }
        }
      }
      else if (canRestore && ($scope.pageType=="REMPAGE")) {
        var obj = JSON.parse(window.sessionStorage.getItem(tplUrl));
        console.log('REMPAGE');
        for (var attr in obj) {
          if (attr === 'theadConfig') {
            ($scope.tblSortable)[attr] = obj[attr];
          } else if (attr === 'curPage') {
            //页码组件
            ($scope.tblPagination)[attr] = obj[attr];
          } else {
            ($scope.tblToolbar)[attr] = obj[attr];
            //部分数据需要重载
            switch (attr) {
              case 'cityVal':
                var cityList = $scope.tblToolbar.cityList;
                for (var i in cityList) {
                  if (cityList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = cityList[i];
                    break;
                  }
                }
                break;
              case 'shopVal':
                var shopList = $scope.tblToolbar.shopList;
                for (var i in shopList) {
                  if (shopList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = shopList[i];
                    break;
                  }
                }
                break;
              case 'itemNumVal':
                var itemNumList = $scope.tblToolbar.itemNumList;
                for (var i in itemNumList) {
                  if (itemNumList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = itemNumList[i];
                    break;
                  }
                }
                break;
              case 'stateVal':
                var stateList = ($scope.tblToolbar.guardDeviceStateList || $scope.tblToolbar.lockerStateList);
                for (var i in stateList) {
                  if (stateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = stateList[i];
                    break;
                  }
                }
                break;
              case 'userTypeVal':
                var stateList = $scope.tblToolbar.userTypeList;
                for (var i in stateList) {
                  if (stateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = stateList[i];
                    break;
                  }
                }
                break;
              case 'orderStateVal':
                var orderStateList = $scope.tblToolbar.orderStateList;
                for (var i in orderStateList) {
                  if (orderStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = orderStateList[i];
                    break;
                  }
                }
                break;
              case 'refundStateVal':
                var refundStateList = $scope.tblToolbar.refundStateList;
                for (var i in refundStateList) {
                  if (refundStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = refundStateList[i];
                    break;
                  }
                }
                break;
              case 'shopTypeVal':
                var shopTypeList = $scope.tblToolbar.shopTypeList;
                for (var i in shopTypeList) {
                  if (shopTypeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = shopTypeList[i];
                    break;
                  }
                }
                break;
              case 'roleVal':
                var roleTypeList = $scope.tblToolbar.roleTypeList;
                for (var i in roleTypeList) {
                  if (roleTypeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = roleTypeList[i];
                    break;
                  }
                }
                break;
              case 'clientStateVal':
                var clientStateList = $scope.tblToolbar.clientStateList;
                for (var i in clientStateList) {
                  if (clientStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = clientStateList[i];
                    break;
                  }
                }
                break;
              case 'threadBusinessTypeVal':
                var threadBusinessTypeList = $scope.tblToolbar.threadBusinessTypeList;
                for (var i in threadBusinessTypeList) {
                  if (threadBusinessTypeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = threadBusinessTypeList[i];
                    break;
                  }
                }
                break;
              case 'threadStateVal':
                var threadStateList = $scope.tblToolbar.threadBusinessTypeList;
                for (var i in threadStateList) {
                  if (threadStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = threadStateList[i];
                    break;
                  }
                }
                break;
              case 'timeVal':
                var timeList = $scope.tblToolbar.timeList;
                for (var i in timeList) {
                  if (timeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = timeList[i];
                    break;
                  }
                }
                break;
              case 'otherIncomeTypeVal':
                var list = $scope.tblToolbar.otherIncomeTypeList;
                for (var i in list) {
                  if (list[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = list[i];
                    break;
                  }
                }
                break;
              case 'isVankeVal':
                var isVankeList = $scope.tblToolbar.isVankeList;
                for (var i in isVankeList) {
                  if (isVankeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = isVankeList[i];
                    break;
                  }
                }
                break;
              case 'overDueDateVal':
                var overDueDateList = $scope.tblToolbar.overDueDateList;
                for (var i in overDueDateList) {
                  if (overDueDateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = overDueDateList[i];
                    break;
                  }
                }
                break;
              case 'timeTypeVal':
                var timeTypeList = $scope.tblToolbar.timeTypeList;
                for (var i in timeTypeList) {
                  if (timeTypeList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = timeTypeList[i];
                    break;
                  }
                }
                break;
              case 'promotionStateVal':
                var promotionStateList = $scope.tblToolbar.promotionStateList;
                for (var i in promotionStateList) {
                  if (promotionStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = promotionStateList[i];
                    break;
                  }
                }
                break;
              case 'contractStateVal':
                var promotionStateList = $scope.tblToolbar.contractStateList;
                for (var i in contractStateList) {
                  if (contractStateList[i].id === obj[attr].id) {
                    ($scope.tblToolbar)[attr] = contractStateList[i];
                    break;
                  }
                }
                break;
              case 'startDate':
                var startDate = $scope.tblToolbar.startDate;
                ($scope.tblToolbar)['startDate'] = obj['startDate'];
                break;
              case 'endDate':
                var endDate = $scope.tblToolbar.endDate;
                ($scope.tblToolbar)['endDate'] = obj['endDate'];
                break;
              case 'managerID':
                var managerID = $scope.tblToolbar.managerID;
                ($scope.tblToolbar)['managerID'] = obj['managerID'];
                break;
            }
          }
        }
      } else {}
      return canRestore;
    },
  };
}]);

/*
  定义验证服务
*/
cmModule.service('CheckSer', [function() {
  function CheckUtil(){
    /* 定义私有属性 */
    // 最终结果
    //   false - 校验不通过
    //   true - 检验通过
    this.result = true;
    // 公共配置
    this.cmCfgObj = {};
  }
  // 添加覆盖原有公共配置函数
  CheckUtil.config = function(cfgObj){
    // 将自定义的配置覆盖掉公共配置中的
    var proto = this.prototype;
    var cmCfgKeys = proto.cmCfgKeys;
    var cmCfgObj = proto.cmCfgObj;
    if(cfgObj instanceof Object){
      var cmCfgKeysLen = cmCfgKeys.length;
      for(var i=0;i<cmCfgKeysLen;i++){
        var attr = cmCfgKeys[i];
        if((typeof cfgObj[attr] !== 'undefined') && (cfgObj[attr] !== null)){
          cmCfgObj[attr] = cfgObj[attr];
        }
      }
    }
  };
  CheckUtil.prototype = (function(){
    /* 私有变量 */
    var defaultChkMethodObj = {
      chkNotEmpty: { //校验非空
        ruleName: 'notEmptyRule'
      },
      chkName: { //校验名字
        ruleName: 'nameRule'
      },
      chkAddress: { // 校验地址
        ruleName: 'addressRule'
      },
      chkPhone: { // 校验手机号和
        ruleName: 'phoneRule'
      },
      chkDate: { // 校验日期
        ruleName: 'dateRule'
      },
      chkDateTime: { // 校验带时分秒的日期
        ruleName: 'dateTimeRule'
      },
      // 校验订单号位数
      chkOrderBits: {
        ruleName: 'orderNumBitsRule'
      }
    };

    /* 私有函数 */
    // 定义私有子校验函数
    function chkCMFn(obj, value, oRuleName, cfgObj){
      var rule = obj[oRuleName];
      var cmCfgObj = obj.cmCfgObj;

      if(cfgObj.newRule instanceof RegExp){
        rule = cfgObj.newRule;
      }
      // !rule是为了避免遇到没有对应规则的情况
      if((value !== null) && (typeof value !== "undefined") && (!rule || rule.test(value))){
        obj.result = obj.result && true;
        if(cmCfgObj.valiResult && cfgObj.errorName){
          cmCfgObj.valiResult[cfgObj.errorName] = false; //复位指定错误项
        }
      }else{
        obj.result = false;
        if(cmCfgObj.valiResult && cfgObj.errorName){
          cmCfgObj.valiResult[cfgObj.errorName] = true; //置位指定错误项
        }
      }
    };
    /*
      @ cfgObj = {
          newRule: //自定义校验规则
          valiResult: //收集错误的对象
          errorName: //该错误项的名字
          <公共配置字段名>: //此处的公共配置将覆盖掉内置的公共配置
        }
    */
    // 定义私有子自动生成校验方法的函数
    function generateChkMethod(proto, obj){
      for(var key in obj){
        proto[key] = (function(ruleName){
          return function(value, cfgObj){
            if(this instanceof CheckUtil){
              chkCMFn(this, value, ruleName, cfgObj);
            }else{
              console.error('The context of validate should be "CheckUtil"!');
            }
            return this;
          }
        })(obj[key]['ruleName']);
      }
    }

    var proto = {
      // 指向回构造函数
      constructor: CheckUtil,
      // 定义配置项中的公共配置项
      cmCfgKeys: [
        'valiResult',
      ],

      /* 定义共有校验规则 */
      notEmptyRule: /^(.){1,}$/,
      nameRule: /^(.){1,}$/,
      addressRule: /^(.){1,}$/,
      // phoneRule: /^1[0-9]{10}$/,
      phoneRule: /(^1[0-9]{10}$)|(^([0,4,8][0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/, // 验证固话和手机号码
      // fixedLineRlue: /^([0,4,8][0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
      dateRule: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
      dateTimeRule: /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/,
      numRule: /^[0-9]{1,}$/,
      // 订单号位数校验规则
      orderNumBitsRule: /^(.){8,9}$/,

      /* 定义共有函数 */
      // 添加校验函数
      addChkFn: function(){

        return this;
      },

      // 初始化校验，并载入公共配置
      init: function(cmCfgObj){
        // 复位result
        this.result = true;
        // 载入共同配置
        this.cmCfgObj = cmCfgObj?cmCfgObj:{};
        return this;
      },

    };
    generateChkMethod(proto, defaultChkMethodObj);
    return proto;
  })();

  return {
    CheckUtil: CheckUtil,
  };
}]);
