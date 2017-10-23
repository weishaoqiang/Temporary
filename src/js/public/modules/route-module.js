
// Router configuration

window.SETTINGS = {
  appState: window.localStorage.getItem('globalFlag'),
  admin: {
    name: window.localStorage.getItem("adminName")
  },
};
var HOSTURL = window.location.hostname+":"+window.location.port;
var BASEDIR = window.location.hostname==='localhost'?'src':'admin';

var routeModule = angular.module('ngRouteModule', ['ng']);
routeModule.run(['$rootScope', 'GLOBAL_CONFIG', function($rootScope, GLOBAL_CONFIG){
  // 阻断非正常登陆途径访问
  if(!window.SETTINGS.appState || !window.SETTINGS.admin.name){
    window.location.href = window.location.protocol+"//"+HOSTURL+"/"+BASEDIR+"/index.html";
    return ;
  }
  $rootScope.globalFlag = {
    appState: GLOBAL_CONFIG.appState,
  };
  $rootScope.globalURL = GLOBAL_CONFIG.url;
  $rootScope.globalAdmin = GLOBAL_CONFIG.admin;
  $rootScope.localLink = GLOBAL_CONFIG.linkAddrs;
}]);

routeModule.constant('GLOBAL_CONFIG', {
  appState: window.SETTINGS.appState,
  admin: window.SETTINGS.admin,
  url: {
    // 接口API主机地址
    'hostURL': (function(){
      // return (HOSTURL.indexOf('localhost:')!==-1?'114.55.66.232:80':HOSTURL);
      var ret = '';
      switch(window.location.hostname){
        case '120.27.157.191':
        case 'www.youminfo.com':
        case 'youminfo.com':
          ret = HOSTURL;
          break;
        case 'localhost':
        case '114.55.66.232':
        default:
          // ret = '114.55.66.232:80';
          ret = '114.55.66.232:8666';
          break;
      }
      return ret;
    })(),
    'loginURL': (function() {
      var url = '';
      switch(SETTINGS.appState){
        case 'DEBUGTEST':
        case 'DEBUGRUN':
          url = window.location.protocol+"//"+HOSTURL+"/src/index.html";
          break;
        case 'RUNTEST':
        case 'RUNRUN':
        default:
          url = window.location.protocol+"//"+HOSTURL+"/"+BASEDIR+"/index.html";
          break;
      }
      return url;
    })(),
    'errorURL': (function() {
      var url = '';
      switch(SETTINGS.appState){
        case 'DEBUGTEST':
        case 'DEBUGRUN':
          url = window.location.protocol+"//"+HOSTURL+"/src/view/pageError/index.html";
          break;
        case 'RUNTEST':
        case 'RUNRUN':
        default:
          url = window.location.protocol+"//"+HOSTURL+"/"+BASEDIR+"/view/pageError/index.html";
          break;
      }
      return url;
    })(),
  },
  linkAddrs: {
    ipageFrameUrl: "../../template/ipageFrame.html",
    ipageFrameJsUrl: "../../template/iLayout.js",
    homeUrl: "../home/index.html#/home_index",
    testMngUrl: "../testMng/index.html#/testMng_index",
    shopMngUrl: "../shopMng/index.html#/shopMng_index",
    orderMngUrl: "../orderMng/index.html#/orderMng_index",
    orderAnalysisUrl: "../orderMng/index.html#/orderMng_DataAnaly",
    orderOtherUrl: "../orderMng/index.html#/orderMng_other",
    orderLimitedMngUrl: "../orderMng/index.html#/orderMng_indexLimited",
    orderExportUrl: "../orderMng/index.html#/orderMng_exportList",
    newOrderListUrl: "../orderMng/index.html#/orderMng_indexLimited/new",
    willExpireOrderListUrl: "../orderMng/index.html#/orderMng_indexLimited/soonExpire",
    expiredOrderListUrl: "../orderMng/index.html#/orderMng_indexLimited/expired",
    // marketStorageCostUrl: "../marketMng/index.html#/marketMng_storageCostQuery",
    marketMiniUnitUrl: "../marketMng/index.html#/marketMng_index",
    marketupDoorUrl: "../marketMng/index.html#/marketMng_upDoorService",
    marketStorageCostAddUrl: "../marketMng/index.html#/marketMng_storageCostAdd",
    // marketPriceFixUrl:"../marketMng/index.html#/marketMng_priceFixIndex",
    marketVoucherUrl:"../marketMng/index.html#/marketMng_voucher",
    authorizeMngrUrl: "../authorizeMng/index.html#/authorizeMng_index",
    authorizePwdUrl: "../authorizeMng/index.html#/authorizeMng_shopPwd",
    authorizeAdminsUrl: "../authorizeMng/index.html#/authorizeMng_admins",
    authorizeRolesUrl: "../authorizeMng/index.html#/authorizeMng_roles",
    clientMngUrl: "../clientMng/index.html#/clientMng_index",
    clientIntentMngUrl: "../clientMng/index.html#/clientMng_intent/all/0/0",
    clientNewIntentMngUrl: "../clientMng/index.html#/clientMng_intent/new",
    threadMngUrl: "../threadMng/index.html#/threadMng_index",
    threadMngAnalysisUrl: "../threadMng/index.html#/threadMng_analysis",
    salesUrl: "javascript:;",
    financeRefundUrl: "../financeMng/index.html#/financeMng_refundList",
    financeReceiptUrl: "../financeMng/index.html#/financeMng_receiptList",
    financeExpensesUrl:"../financeMng/index.html#/financeMng_expensesList",
    financeExpensesDataUrl:"../financeMng/index.html#/financeMng_expensesData",
    financeTradeUrl: "javascript:;",
    salesMngUrl: "../salesMng/index.html#/salesMng_index",
    qrcodeMngUrl: "../qrcodeMng/index.html#/qrcodeMng_product",
    qrcodeMngDetailUrl: "../qrcodeMng/index.html#/qrcodeMng_detail",
    bookMngUrl: "../bookMng/index.html#/bookMng_index",
    infoMngUrl: "../infoMng/index.html#/infoMng_index",
    facilityGuardUrl: "../facilityMng/index.html#/facilityMng_guard",
    facilityTempHumUrl: "../facilityMng/index.html#/facilityMng_tempHum",
    facilitySmokeUrl: "../facilityMng/index.html#/facilityMng_smoke",
    facilityCardUrl: "../facilityMng/index.html#/facilityMng_card",
    facilityLockerUrl: "../facilityMng/index.html#/facilityMng_locker",
    facilityGarageUrl: "../facilityMng/index.html#/facilityMng_garage",
    facilityAddSpecialCardUrl: "../facilityMng/index.html#/facilityMng_addSpecialCard",
    editMyPwdUrl: "../me/index.html#/editMyPwd",
    wanwucangUrl: "http://www.v-selfstorage.com/",
  }
});
