/*
 ** Filter configuration
 **
 ** Angular 1.x 框架技术下的过滤器模块
 ** 本模块大体分成三块代码内容：
 ** 1. 只定义常量对象，不定义相应过滤器；
 ** 2. 只定义过滤器，不定义相应常量对象；
 ** 3. 既定义常量对象，又定义相应过滤器；
 **
 */

var filterModule = angular.module('ngFilterModule', ['ng']);

/* 只定义常量对象，不定义相应过滤器的 */
const CstList = {
  'itemNum': [{
    id: 5,
    name: '5'
  }, {
    id: 10,
    name: '10'
  }, {
    id: 15,
    name: '15'
  }],
  'roleType': [{
    id: 1,
    name: 'BD'
  }, {
    id: 2,
    name: '销售'
  }, {
    id: 3,
    name: '财务'
  }, {
    id: 4,
    name: 'IT'
  }, {
    id: 5,
    name: '营销'
  }, {
    id: 6,
    name: '工程'
  }],
  'infoState': [{
    id: 1,
    name: '保存到草稿箱',
  }, {
    id: 2,
    name: '发布',
  }, ],
  'trackType': [
    '电话',
    '微信',
    'QQ',
    '拜访',
    '邮件',
    '短信',
    '其他',
  ],
  'minRentPeriod': [{
    "id": 101,
    "name": '1天'
  }, {
    "id": 1,
    "name": '1个月'
  }, {
    "id": 3,
    "name": '3个月'
  }, {
    "id": 6,
    "name": '6个月'
  }, {
    "id": 12,
    "name": '12个月'
  }],
  'timeType': [{
    id: '7d',
    name: '过去7天',
    msTime: 569354665,
  }, {
    id: '30d',
    name: '过去30天',
    msTime: 2592000000,
  }, {
    id: '90d',
    name: '过去90天',
    msTime: 7776000000,
  }, {
    id: 'manual',
    name: '自选时间',
    msTime: '',
  }],
  'overDueDate': [{
    id: '7d',
    name: '7天内'
  }, {
    id: '1m',
    name: '一个月内'
  }, {
    id: '2m',
    name: '两个月内'
  }, {
    id: '3m',
    name: '三个月内'
  }, {
    id: 'overDued',
    name: '已过期'
  }],
  'isVanke': [{
    id: 1,
    name: '万科内'
  }, {
    id: 2,
    name: '万科外'
  }],
  'bkgModule': [{
        id: 1,
        name: '仪表盘'
    }, {
        id: 2,
        name: '门店管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 3,
        name: '客户管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 4,
        name: '订单管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 5,
        name: '授权管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 6,
        name: '财务管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 7,
        name: '资讯管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 8,
        name: '预约管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 9,
        name: '定价管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 10,
        name: '设备管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    }, {
        id: 11,
        name: '线索管理',
        limit:[{
            id: 1,
            name: '查看'
        },{
            id: 2,
            name: '编辑'
        }]
    },{
      id: 12,
      name: '其他',
      limit:[{
          id: 1,
          name: '查看'
      },{
          id: 2,
          name: '编辑'
      }]
    }]
};

/* 既定义常量对象，又定义相应过滤器的 */
const CstFilterList = {
  // 线索-客户来源-匹配色槽
  'threadSrcColor': [{
    // id: 1,
    color: '#FF7800',
  }, {
    // id: 2,
    color: '#FFA656',
  }, {
    // id: 3,
    color: '#EC4646',
  }, {
    // id: 4,
    color: '#FFD967',
  }, {
    // id: 5,
    color: '#FFE400',
  }, {
    // id: 6,
    color: '#F19292',
  }, {
    // id: 7,
    color: '#A691FF',
  }, {
    // id: 8,
    color: '#18ABB8',
  }, {
    // id: 9,
    color: '#6BC026',
  }, {
    // id: 10,
    color: '#1CDF98',
  }, {
    // id: 11,
    color: '#D4ECE3',
  }, {
    // id: 12,
    color: '#9FD4C1',
  }, {
    // id: 13,
    color: '#3567E6',
  }, {
    // id: 14,
    color: '#FF4CBF',
  }, {
    // id: 15,
    color: '#956401',
  }, {
    // id: 16,
    color: '#3A759E',
  }, {
    // id: 17,
    color: '#4D8201',
  }, {
    // id: 18,
    color: '#922BC8',
  }, ],
  // 线索-存储物品类型-匹配色槽
  'storeTypeColor': [{
    color: '#FF7800',
  }, {
    color: '#FFA656',
  }, {
    color: '#EC4646',
  }, {
    color: '#FFD967',
  }, {
    color: '#FFE400',
  }, {
    color: '#F19292',
  }, {
    color: '#A691FF',
  }, {
    color: '#18ABB8',
  }, {
    color: '#6BC026',
  }, {
    color: '#1CDF98',
  }, {
    color: '#D4ECE3',
  }, {
    color: '#9FD4C1',
  }, {
    color: '#3567E6',
  }, {
    color: '#FF4CBF',
  }, {
    color: '#956401',
  }, {
    color: '#3A759E',
  }, {
    color: '#4D8201',
  }, {
    color: '#922BC8',
  }, ],
  // 线索-关闭原因-匹配色槽
  'giveUpReasonColor': [{
    color: '#FF7800',
  }, {
    color: '#FFA656',
  }, {
    color: '#EC4646',
  }, {
    color: '#FFD967',
  }, {
    color: '#6BC026',
  }, {
    color: '#F19292',
  }, {
    color: '#A691FF',
  }, {
    color: '#18ABB8',
  }, {
    color: '#FFE400',
  }, {
    color: '#1CDF98',
  }, {
    color: '#D4ECE3',
  }, {
    color: '#9FD4C1',
  }, {
    color: '#3567E6',
  }, {
    color: '#FF4CBF',
  }, {
    color: '#956401',
  }, {
    color: '#3A759E',
  }, {
    color: '#4D8201',
  }, {
    color: '#922BC8',
  }, ],
  'otherIncomeType': [{
    id: 1,
    name: '搬运费',
  }, {
    id: 2,
    name: '衍生产品',
  }, {
    id: 3,
    name: '其它费用',
  }, ],
  'storeItemType': [{
    id: 1,
    name: '家具家电'
  }, {
    id: 2,
    name: '办公用品'
  }, {
    id: 3,
    name: '微商货物'
  }, {
    id: 4,
    name: '家中杂物'
  }, {
    id: 5,
    name: '书籍'
  }, {
    id: 6,
    name: '衣物'
  }, {
    id: 7,
    name: '红酒'
  }, {
    id: 8,
    name: '运动器材'
  }, {
    id: 9,
    name: '其他物品'
  }],
  'giveUpReasonType': [{
    id: 1,
    name: '价格太贵'
  }, {
    id: 2,
    name: '位置太远'
  }, {
    id: 3,
    name: '需求取消'
  }, {
    id: 4,
    name: '找到其他仓库'
  }, {
    id: 5,
    name: '产品无法满足需求'
  }, {
    id: 6,
    name: '联系不上客户'
  }, {
    id: 7,
    name: '其他原因'
  }, ],
  'unitType': [{
    id: 1,
    name: '小型仓',
    sizeStr: '(2~4m³)'
  }, {
    id: 2,
    name: '中型仓',
    sizeStr: '(4~8m³)'
  }, {
    id: 3,
    name: '大型仓',
    sizeStr: '(>8m³)'
  }, {
    id: 4,
    name: '储物柜',
    sizeStr: '(<2m³)'
  }, {
    id: 11,
    name: '智能柜 - 大柜',
    sizeStr: '(1m³)'
  }, {
    id: 12,
    name: '智能柜 - 小柜',
    sizeStr: '(0.3m³)'
  }],
  'sex': [{
    id: 1,
    name: '男'
  }, {
    id: 2,
    name: '女'
  }],
  'userType': [{
    id: 1,
    name: '用户'
  }, {
    id: 2,
    name: '管理员'
  }],
  'bookSrcType': [{
    id: 1,
    name: '微信'
  }, {
    id: 2,
    name: '官网'
  }],
  'clientState': [{
    id: 1,
    name: '万物仓客户'
  }, {
    id: 2,
    name: '万物柜客户'
  }],
  'certType': [{
    id: 1,
    name: '身份证'
  }, {
    id: 2,
    name: '护照'
  }, {
    id: 3,
    name: '台胞证'
  }, {
    id: 4,
    name: '营业执照'
  }],
  'shopType': [{
    id: 1,
    name: '社区仓'
  }, {
    id: 2,
    name: '智能柜'
  }, {
    id: 3,
    name: '车库智能柜'
  }, {
    id: 4,
    name: '测试仓库'
  }, {
    id: 5,
    name: '中心仓'
  }],
  'unlockType': [{
    id: 1,
    name: '大门'
  }, {
    id: 2,
    name: '仓位/储物柜'
  }],
  'unitLockType': [{
    "id": 1,
    "name": '派宝箱锁'
  }, {
    "id": 2,
    "name": '机械锁'
  }, {
    "id": 3,
    "name": '威金利锁'
  }, {
    "id": 4,
    "name": '令令锁'
  }],
  'wjlDeviceState': [{
    "id": 0,
    "name": '未知'
  }, {
    "id": 1,
    "name": '在线'
  }, {
    "id": 2,
    "name": '离线'
  }],
  'unitStoreState': [{
    "id": 0,
    "name": '空'
  }, {
    "id": 1,
    "name": '有物品'
  }, {
    "id": 2,
    "name": '未知'
  }],
  'unitLockState': [{
    "id": 0,
    "name": '开门状态'
  }, {
    "id": 1,
    "name": '关门状态'
  }, {
    "id": 2,
    "name": '未知'
  }],
  'unitState': [{
    "id": 1,
    "name": '空闲'
  }, {
    "id": 2,
    "name": '已预订'
  }, {
    "id": 3,
    "name": '已入仓'
  }, {
    "id": 4,
    "name": '维护中'
  }, {
    "id": 5,
    "name": '部分入仓'
  }],
  'refundState': [{
    "name": "未退款",
    "id": 0
  }, {
    "name": "退款成功",
    "id": 1
  }, {
    "name": "退款失败",
    "id": 2
  }, {
    "name": "退款中",
    "id": 3
  }],
  'refundType': [{
    "name": '微信退款',
    "id": 1
  }, {
    "name": '银行卡退款',
    "id": 2
  }],
  'refundCauseType': [{
    "name": "取消订单退款",
    "id": 1
  }, {
    "name": "退仓退款",
    "id": 2
  }],
  'payWay': [{
    id: 1,
    name: '客户微信支付'
  }, {
    id: 2,
    name: 'POS机支付'
  }, {
    id: 11,
    name: '刷卡'
  }, {
    id: 12,
    name: '支付宝扫码支付'
  }, {
    id: 13,
    name: '转账到银行卡'
  }, {
    id: 14,
    name: '现金'
  }, {
    id: 15,
    name: '微信扫码支付'
  }, {
    id: 16,
    name: '拉卡拉支付'
  }],
  'shopEntryWay': [{
    "id": 1,
    "name": '微信开锁'
  }, {
    "id": 2,
    "name": '刷卡开锁'
  }, {
    "id": 3,
    "name": '无门禁'
  }],
  'shopLockType': [{
    "id": 1,
    "name": '无门禁'
  }, {
    "id": 2,
    "name": '只能刷卡'
  }, {
    "id": 3,
    "name": '派宝箱开门'
  }, {
    "id": 4,
    "name": '令令开门'
  }, {
    "id": 5,
    "name": '威金利开锁'
  }],
  'orderState': [{
    "id": 1, //未支付
    "orderPayState": "未支付",
    "orderStateName": "未支付",
    "name": "未支付",
    "color": "#ff8366"
  }, {
    "id": 3, //支付成功
    "orderPayState": "支付成功",
    "orderStateName": "支付成功",
    "name": "支付成功",
    "color": "#59c156"
  }, {
    "id": 4, //支付失败
    "orderPayState": "支付失败",
    "orderStateName": "支付失败",
    "name": "支付失败",
    "color": "#ff2020"
  }, {
    "id": 11, //入仓
    "orderPayState": "支付成功",
    "orderStateName": "已入仓",
    "name": "已入仓",
    "color": "#000000"
  }, {
    "id": 12, //出仓未退款
    "orderPayState": "支付成功",
    "orderStateName": "退仓未退款",
    "name": "退仓未退款",
    "color": "#f3b308"
  }, {
    "id": 13, //出仓支付中
    "orderPayState": "支付成功",
    "orderStateName": "退仓成功",
    "name": "退仓成功",
    "color": "#c2c2c2"
  }, {
    "id": 21, //未支付取消
    "orderPayState": "未支付",
    "orderStateName": "取消未退款",
    "name": "取消未退款",
    "color": "#f3b308"
  }, {
    "id": 22, //已支付取消
    "orderPayState": "支付成功",
    "orderStateName": "取消成功",
    "name": "取消成功",
    "color": "#c2c2c2"
  }, {
    "id": 23, //已续租
    "orderPayState": "支付成功",
    "orderStateName": "已续租",
    "name": "已续租",
    "color": "#29b0f5"
  }],
  'payState': [
    {
      "id": 1,
      "name": "已收款"
    },
    {
      "id": 2,
      "name": "待确认收款"
    }
  ],
  'bookState': [{
    id: 1,
    name: '待处理'
  }, {
    id: 2,
    name: '已处理'
  }, {
    id: 3,
    name: '取消'
  }, {
    id: 4,
    name: '废弃'
  }, ],
  'storeType': [{
    id: 1,
    name: '办公文件'
  }, {
    id: 2,
    name: '装修暂存'
  }, {
    id: 3,
    name: '货物及其他'
  }, ],
  'guardDeviceState': [{
    id: 0,
    name: '离线'
  }, {
    id: 1,
    name: '在线'
  }, {
    id: 11,
    name: '废弃'
  }, ],
  'orderRentType': [{
    id: 1,
    name: '独占'
  }, {
    id: 2,
    name: '共享'
  }, ],
  'rentClientType': [{
    id: 1,
    name: '个人'
  }, {
    id: 2,
    name: '恶意用户'
  }, {
    id: 3,
    name: '公司'
  }, ],
  'orderBusinessType': [{
    id: 1,
    name: '自存仓'
  }, {
    id: 2,
    name: '上门搬存'
  }, {
    id: 3,
    name: '智能储物柜'
  },{
    id: 4,
    name: '智能车柜'
  } ],
  'threadClientType': [{
    id: 1,
    name: '个人自存'
  }, {
    id: 2,
    name: '个体商户'
  }, {
    id: 3,
    name: '公司存储'
  }, ],
  'threadBusinessType': [{
    id: 1,
    name: '自存仓'
  }, {
    id: 2,
    name: '上门搬存'
  }, ],
  'threadState': [{
    id: 1,
    name: '持续跟进'
  }, {
    id: 2,
    name: '待上门评估'
  }, {
    id: 3,
    name: '待上门搬运'
  }, {
    id: 4,
    name: '已签约'
  }, {
    id: 5,
    name: '关闭'
  }, ],
  'orderStorageType': [{
    id: 1,
    name: '居家'
  }, {
    id: 2,
    name: '电商'
  }, {
    id: 3,
    name: '文件'
  }, {
    id: 4,
    name: '货运'
  }, ],
  'otherOrderState': [{
    id: 1,
    name: '未支付'
  }, {
    id: 2,
    name: '已支付'
  }],
  'orderProType': [{
    id: 1,
    name: '万科内'
  }, {
    id: 2,
    name: '万科外'
  }],
  'cityList': [
    {
      id: 1,
      name: '深圳'
    },{
      id: 2,
      name: '广州'
    },{
      id: 3,
      name: '上海'
    },{
      id: 4,
      name: '杭州'
    },{
      id: 5,
      name: '北京'
    },{
      id: 6,
      name: '南京'
  }],
  'discountRule': [
    {
      id: 1,
      name: '折扣优惠'
    },{
      id: 2,
      name: '满送优惠'
    },{
      id: 3,
      name: '满减优惠'
    }],
  'promotionState':[{
    id: 1,
    name: '待开始'
  },{
    id: 2,
    name: '进行中'
  },{
    id: '3',
    name: '已结束'
  }],
  'couponsState':[{
    id: 1,
    name: '未使用'
  },{
    id: 2,
    name: '已使用'
  }],
  'contractState':[{
    id: 0,
    name: '未签订'
  }, {
    id: 1,
    name: '已签订(电子)'
  }, {
    id: 2,
    name: '已签订(纸质)'
  }]
};
function FilterFactoryClass() {
  var self = this;
  // 定义底层过滤器函数
  this.filter = function(list) {
    return function(input, arg) {
      for (var i in list) {
        if (list[i].id == input) {
          return list[i].name;
        }
      }
    };
  };
  // 定义注册常量函数
  this.registConstants = function(filtermodule, list) {
    var key = null;
    for (key in list) {
      filtermodule.constant(key + 'List', list[key]);
    }
  };
  // 定义注册过滤器函数
  this.registFilters = function(filtermodule, list) {
    var key = null;
    for (key in list) {
      filtermodule.filter(key + 'Filter', [key + 'List', function(list) {
        return self.filter(list);
      }]);
    }
  };
  // 封装既定义常量对象，又定义过滤器的函数
  this.registConstantsAndFilters = function(filtermodule, list) {
    self.registConstants(filtermodule, list);
    self.registFilters(filtermodule, list);
  };
}

var FilterFactory = new FilterFactoryClass();
FilterFactory.registConstants(filterModule, CstList);
FilterFactory.registConstantsAndFilters(filterModule, CstFilterList);

/* 只定义过滤器，不定义相应常量对象 */
filterModule.filter('cashFilter', function() {
  return function(input, arg) {
    if (!input) {
      return 0;
    }
    return Number(input.toFixed(2));
  }
});
filterModule.filter('stepFilter', function() {
  return function(input, arg) {
    var reuslt = '';
    switch (input) {
      case 1:
        result="下一步";
        break;
      case 2:
        result="下一步";
        break;
      case 3:
        result="提交";
        break;
    }
    return result;
  }
});
filterModule.filter('volumeFilter', function() {
  return function(input, arg) {
    if (!input) {
      return 0;
    }
    return Number(input.toFixed(3));
  };
});
filterModule.filter('rentRateFilter', function() {
  return function(input, arg) {
    if (!input) {
      return 0;
    }
    return Number((input * 100).toFixed(3)) + '%';
  };
});
filterModule.filter('volumeRentRateFilter', function() {
  return function(input, arg) {
    if (!input) {
      return 0;
    }
    return Number((input * 100).toFixed(3)) + '%';
  };
});
filterModule.filter('dateFilter', function() {
  return function(input, arg) {
    var ret = '';
    switch (arg) {
      case 'yyyy-MM-dd':
        ret = input.split(' ')[0];
        break;
      case 'yyyy':
        console.log(input);
        ret = input.slice(0, 4);
        break;
      case 'MM-dd hh:mm':
        console.log(input);
        ret = input.slice(5, 16);
        break;
      case 'MM-dd':
        console.log(input);
        ret = input.slice(5, 10);
        break;
    }
    return ret;
  };
});

filterModule.service('dateSer', function() {
  return {
    // 获取今天当天的日期前
    getTodayDateStr: function() {
      var date = new Date();
      var dateStr = date.getFullYear() + '-' + (date.getMonth() + 101 + '').slice(1) + '-' + (date.getDate() + 100 + '').slice(1);
      return dateStr;
    },
    // 获取现在的时间点
    getNowDateStr: function() {
      var date = new Date();
      var dateStr = date.getFullYear() + '-' + (date.getMonth() + 101 + '').slice(1) + '-' + (date.getDate() + 100 + '').slice(1) +
        ' ' +
        (date.getHours() + 100 + '').slice(1) + ':' + (date.getMinutes() + 100 + '').slice(1) + ':' + (date.getSeconds() + 100 + '').slice(1);
      return dateStr;
    },
    // 获取天之前的时间,传入的参数为毫秒数
    getGoneDay: function(msTime) {
      var ms = (+new Date()) - msTime;
      var time = new Date(ms);
      var dayStr = time.getFullYear() + '-' + (time.getMonth() + 101 + '').slice(1) + '-' + (time.getDate() + 100 + '').slice(1);
      return dayStr;
    }
  };
});

filterModule.filter('orderPayStateFilter', ['orderStateList', function(orderStateList) {
  return function(input, arg) {
    for (var i in orderStateList) {
      if (orderStateList[i].id == input) {
        return orderStateList[i].orderPayState;
      }
    }
  };
}]);

filterModule.filter('otherPayStateFilter', ['otherOrderState', function(otherOrderState) {
  return function(input, arg) {
    for (var i in otherOrderState) {
      if (otherOrderState[i].id == input) {
        return otherOrderState[i].name;
      }
    }
  };
}]);

filterModule.filter('orderColorStateFilter', ['orderStateList', function(orderStateList) {
  return function(input, arg) {
    for (var i in orderStateList) {
      if (orderStateList[i].id == input) {
        return orderStateList[i].color;
      }
    }
  };
}]);

/* 过滤器新写法
   可以不再依赖于静态数组，可以传入动态数组作为arg，再进行过滤
*/
// 根据参数进行定制，返回动态Filter
function retDynamicFilter(keyName, valName) {
  return function() {
    return function(input, arg) {
      if (Array.isArray(arg)) {
        for (var i = 0; i < arg.length; i++) {
          if (arg[i][keyName] == input) {
            return arg[i][valName];
          }
        }
        return '';
      } else {
        return '';
      }
    };
  }
}

function retDynamicOptFilter(keyName, valName) {
  return function() {
    return function(input, arg) {
      var ret = {};
      for (var i = 0; i < arg.length; i++) {
        if (arg[i][keyName] == input) {
          return arg[i];
        }
      }
      ret[keyName] = '';
      ret[valName] = '';
      return ret;
    };
  }
}
// 跟进人员过滤器 - 线索管理
filterModule.filter('threadManagerFilter', [retDynamicFilter('managerID', 'mangaerName')]);
// 线索客户来源过滤器 - 线索管理
filterModule.filter('threadSrcFilter', [retDynamicFilter('id', 'content')]);
filterModule.filter('threadSrcValFilter', [retDynamicFilter('srcID', 'count')]);
filterModule.filter('threadSrcColorFilter', [retDynamicFilter('id', 'color')]);

filterModule.filter('storeTypeValFilter', [retDynamicFilter('typeID', 'count')]);
filterModule.filter('storeTypeColorFilter', [retDynamicFilter('id', 'color')]);

filterModule.filter('giveUpReasonValFilter', [retDynamicFilter('reasonID', 'count')]);
filterModule.filter('giveUpReasonColorFilter', [retDynamicFilter('id', 'color')]);
// 默认值过滤器
filterModule.filter('defaultFilter', [retDynamicFilter('id', 'name')]);
// 默认选项过滤器
filterModule.filter('defaultOptFilter', [retDynamicOptFilter('id', 'name')]);

/*
  定义可以将文本html转换成节点的过滤器函数
*/
filterModule.filter('AsHtmlFilter', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}]);
