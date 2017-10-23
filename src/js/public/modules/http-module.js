
// Http configuration

var httpModule = angular.module('ngHttpModule', ['ng']);
httpModule.run(['$http', function($http){
  // $http.defaults.cache = true;  //http cache
  $http.defaults.headers.post = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  $http.defaults.headers.common.sessionID = window.localStorage.getItem('sessionID');
}]);

httpModule.factory('myInterceptor', ['$rootScope', function($rootScope) {
  return {
    request: function(request){
      if(!request.headers.sessionID){
        request.headers.sessionID = window.localStorage.getItem('sessionID');
      }
      return request;
    },
    response: function(response) {
      if (!response.data.success && response.data.message === "You need login!") {
        window.location.href = $rootScope.globalURL.loginURL;
      }
      return response;
    },
    responseError: function(response) {
      window.sessionStorage.setItem('errorCode', response.status);
      switch (response.status) {
        case 400:
        case 401:
        case 404:
        case 500:
          // window.location.href = $rootScope.globalURL.errorURL;
          break;
        case 666:
        default:
          window.location.href = $rootScope.globalURL.loginURL;
          break;
      }
      return response;
    }
  };
}]);
