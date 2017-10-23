

var componentsModule = angular.module('ngComponentsModule', ['ng']);

/**********************************************************
* 页码组件
**********************************************************/
componentsModule.factory('TblPagination', [function(){
  return function(){
    this.hookAfterChangePage = function(){};
    this.changePage = function(idName, effective){
      if(!effective){ return ; }
      var self = this;
      //如果是数字页码
      if(idName.indexOf('page') === 0){
        var pageNum = idName.slice(4);
      }else if(idName.indexOf('lfPage') === 0){
        var pageNum = self.curPage - 1;
      }else if(idName.indexOf('rtPage') === 0){
        var pageNum = self.curPage + 1;
      }else if(idName.indexOf('lfGrp') === 0){
        var pageNum = (self.curGrp-1)*self.CNTNUM;
      }else if(idName.indexOf('rtGrp') === 0){
        var pageNum = self.curGrp*self.CNTNUM+1;
      }
      //调用触发动作的钩子函数
      self.hookAfterChangePage(pageNum);
    };
    this.initPagination = function(retData){
      console.log('我来初始化页码啦！');
      var self = this;
      var data = retData.data;
      self.curPage = data.curPage;
      self.totalPage = data.totalPage;
      self.pageSize = data.pageSize;
      self.curGrp = parseInt((self.curPage-1)/self.CNTNUM)+1;
      self.totalGrp = parseInt((self.totalPage-1)/self.CNTNUM)+1;
      self.curMinPage = (self.curGrp-1)*self.CNTNUM+1;
      self.curMaxPage = (self.totalPage<self.curGrp*self.CNTNUM)?self.totalPage:self.curGrp*self.CNTNUM;
      var curPagePos = (self.curPage-(self.curGrp-1)*self.CNTNUM)-1;
      //开始设置-----------------------------------------------
      //填充视图页码所对应的数组
      self.pageObj.pages = [];
      for(var i=self.curMinPage;i<=self.curMaxPage;i++){
        self.pageObj.pages.push({
          name: 'page' + i,
          effective: true,
          exist: true,
        });
      }
      console.log(self.pageObj.pages);
      if(!self.pageObj.pages.length){
        self.pageObj.lfPage.effective = false;
        self.pageObj.rtPage.effective = false;
        self.pageObj.lfGrp.exist = false;
        self.pageObj.rtGrp.exist = false;
        return ;
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
    };
    this.CNTNUM = 5;
    this.curPage = 0;
    this.pageSize = 0;
    this.totalPage = 0;
    this.curMaxPage = 0;
    this.curMinPage = 0;
    this.curGrp = 0;
    this.totalGrp = 0;
    this.pageObj = {
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
    };
  }
}]);
componentsModule.directive('expagination', [function() {
  return {
    restrict: 'ECMA',
    scope: true,
    // template: '<div>你好</div>',
    templateUrl: '../../template/tblPagination.html',
    transclude: true,
    compile: function(tEle, tAttr, transFn) {
      console.log(arguments);
      return {
        pre: function(scope) {
          scope.tblPagination = (scope.$parent)[tAttr.configObj];
        },
        post: function(scope) {
        }
      };
    },
    // replace: 'true',
  };
}]);

/**********************************************************
* 模态框组件
**********************************************************/
componentsModule.factory('ModalBasic', [function(){
  return function(){
    this.header = {
      content: ''
    };
    this.body = {
      content: ''
    };
    this.footer = {
      btn: []
    };
  };
}]);
componentsModule.directive('modal-basic', [function() {
  return {
    restrict: 'ECMA',
    scope: true,
    templateUrl: '../../template/modalBasic.html',
    transclude: true,
    compile: function(tEle, tAttr, transFn) {
      console.log(arguments);
      return {
        pre: function(scope) {
          scope.modalBasic = (scope.$parent)[tAttr.configObj];
        },
        post: function(scope) {
        }
      };
    },
    // replace: 'true',
  };
}]);

/**********************************************************
* 下拉框组件
**********************************************************/
componentsModule.service('dropdownSer', ['$timeout', function($timeout){
  return {
    Dropdownsel: function(id){
      //Cal the num of dropdownSel
      if((Object.getPrototypeOf(this)).dropDownSelCnt !== undefined){
        (Object.getPrototypeOf(this)).dropDownSelCnt++;
      }else{
        Object.getPrototypeOf(this).dropDownSelCnt = 1;
      }
      var self = this;
      this.id = id;
      // 列表项是否带参数，默认：否
      this.isWithArg = false;
      // 列表项id默认名为：id
      this.itemIdStr = 'id';
      // 列表项value默认名为：name
      this.itemNameStr = 'name';
      // 是否含有分页条
      this.hasPagination = false;
      // 是否含有分类标题，默认无
      this.hasClassifiedTitle = false;
      this.lfClassifiedTitle = '';
      this.rtClassifiedTitle = '';
      // 当没有数据时的提示
      this.emptyHintMsg = '- 暂无数据 -';
      // 是否有搜索框
      this.hasSearch = false;
      this.parentObj = Object.getPrototypeOf(this);
      this.state = false;
      this.result = {
        id: '',
        name: '- 请选择 -'
      };
      this.keyword = '';
      this.search = function(keyword){
      };
      this.resetResult = function(){
        self.result = {
          id: '',
          name: '- 请选择 -'
        };
      };
      this.resetKeyword = function(){
        self.keyword = "";
        self.search({keyword: ''});
      };
      this.clickSelMenu = function(evt){
        evt.stopPropagation();
      };
      this.showMenu = function(evt){
        evt.stopPropagation();
        self.state = !this.state;
      };
      this.chooseItem = function(data){
        $timeout(function(){
          self.result = data;
          self.state = false;
        }, 0);
      };
      this.hideSelf = function(){
        $timeout(function(){
          self.state && self.resetKeyword();
          self.state = false;
        }, 0);
      };
      document.addEventListener('click', function(evt){
        self.hideSelf();
      }, false);
    },
  };
}]);
componentsModule.directive('idropdown', ['dropdownSer', '$timeout', function(dropdownSer, $timeout){
  return {
    restrict: 'ECMA',
    scope: {
      isWithArg: '=configIswitharg',
      itemNameStr: '=configListItemNamestr',
      itemIdStr: '=configListItemIdstr',
      list: '=configList',
      val: '=configVal',
      valChanged: '&configValChanged',
      search: '&configSearch',
      // 分页条配置对象
      paginationCfg: '=configPaginationCfg',
      // 当数据为空时的提示信息
      emptyHintMsg: '=configEmptyHintmsg',
      // 分类标题
      hasClassifiedTitle: '=configHasClassifiedTitle',
      lfClassifiedTitle: '=configLfClassifiedTitle',
      rtClassifiedTitle: '=configRtClassifiedTitle',
    },
    templateUrl: '../../template/selComponent.html',
    transclude: true,
    compile: function(tEle, tAttr, transFn){
      return {
        pre: function(scope){
          scope.dropdownsel = new dropdownSer.Dropdownsel(tAttr.configId, scope);
          if(scope.itemNameStr){
            scope.dropdownsel.itemNameStr = scope.itemNameStr;
          }
          if(scope.itemIdStr){
            scope.dropdownsel.itemIdStr = scope.itemIdStr;
          }
          if(scope.isWithArg){
            scope.dropdownsel.isWithArg = scope.isWithArg;
          }
          if(scope.hasClassifiedTitle){
            scope.dropdownsel.hasClassifiedTitle = scope.hasClassifiedTitle;
            scope.dropdownsel.lfClassifiedTitle = scope.lfClassifiedTitle;
            scope.dropdownsel.rtClassifiedTitle = scope.rtClassifiedTitle;
          }
          // 根据是否传入了分页配置来决定是否有分页条
          if(scope.paginationCfg instanceof Object){
            scope.dropdownsel.hasPagination = true;
          }
          scope.$watch('paginationCfg', function(){
          });
          // Whether to register the search function and init the search view
          if(tAttr.configSearch){
            scope.dropdownsel.hasSearch = true;
          }
          scope.$watch('emptyHintMsg', function(){
            if(scope.emptyHintMsg){
              scope.dropdownsel.emptyHintMsg = scope.emptyHintMsg;
            }
          }, true);
          scope.$watch('val', function(){
            if(scope.val){
              scope.dropdownsel.result = scope.val;
            }
          }, true);
          // parent -> child
          scope.$watch('list', function(){
            scope.dropdownsel.list = scope.list;
          }, true);
          // parent -> child
          scope.$watch('search', function(){
            scope.dropdownsel.search = function(keyword){
              scope.search(keyword);
            };
          }, true);
          // child -> parent
          scope.$watch('dropdownsel.result', function(){
            scope.val = scope.dropdownsel.result;
            $timeout(function(){
              scope.valChanged();
            }, 0);
          }, true);
          // for the situation that the amount of dropdownsels exceeds 1
          // can't cal the number of those components for now
          var theWatch = scope.$watch('dropdownsel.parentObj.dropDownSelCnt', function(newVal, oldVal){
            if(newVal > 1){
              // Watch the state of show / hide
              scope.$watch('dropdownsel.state', function(){
                if(scope.dropdownsel.state){ //when state turn to 'true'
                  scope.$emit('toParentState', {id: scope.dropdownsel.id, state: scope.dropdownsel.state});
                }
              }, true);
              // child -> parent
              scope.$parent.$on('toParentState', function(evt, data){
                scope.$parent.$broadcast('toChildState', data);
              });
              // parent -> child
              scope.$on('toChildState', function(evt, data){
                if(data.id !== scope.dropdownsel.id){
                  scope.dropdownsel.hideSelf();
                }
              });
              theWatch(); //Destroy the watch
            }
          }, true);
        },
        post: function(scope){
        }
      };
    },
  };
}]);

/**********************************************************
* 水平 带文字 的分割线组件
* 使用例子1：<div hrdivider>区域信息</div>
* 使用例子2：<div hrdivider><span>门禁卡信息&nbsp;<span class="fa fa-angle-down"></span></span></div>
**********************************************************/
componentsModule.directive('hrdivider', [function() {
  return {
    restrict: 'ECMA',
    template: '<div class="hr-divider"><div class="hr-divider-line"></div><div class="hr-divider-text" ng-transclude></div><div class="hr-divider-line"></div></div>',
    transclude: true,
  };
}]);

/**********************************************************
* 水平 带文字 的分割线组件
* 使用例子：<div title-divider>区域信息</div>
**********************************************************/
componentsModule.directive('titleDivider', [function() {
  return {
    restrict: 'EA',
    template: '<div class="title-divider-container"><span class="title-divider"></span><span ng-transclude></span></div>',
    transclude: true,
  };
}]);

/**********************************************************
* 回车键事件指令
**********************************************************/
componentsModule.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
/**********************************************************
* 左键事件指令
**********************************************************/
componentsModule.directive('ngLeftkey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 37) {
              event.preventDefault();
                scope.$apply(function (){
                    scope.$eval(attrs.ngLeftkey);
                });
            }
        });
    };
});
/**********************************************************
* 右键事件指令
**********************************************************/
componentsModule.directive('ngRightkey', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 39) {
              event.preventDefault();
                scope.$apply(function (){
                    scope.$eval(attrs.ngRightkey);
                });
            }
        });
    };
});

/**********************************************************
* ng-repeat执行完成之后再出发时间
**********************************************************/
componentsModule.directive('repeatDone', function () {
    return {
        link: function(scope, element, attrs) {
          if (scope.$last) {
              scope.$emit('repeatDone');
            }
        }
    }
});
