  var initPageModule = angular.module('ngInitPageModule', ['ng']);
initPageModule.run(['$rootScope', 'initPageService', function($rootScope, initPageService){
  $rootScope.pageInition = {
    tplHeaderUrl: '../../template/ipageHeader.html',
    tplSidebarUrl: '../../template/ipageSidebar.html',
    tplFooterUrl: '../../template/ipageFooter.html',
  };
  initPageService.init();
}]);
initPageModule.service('initPageService', ['$rootScope', '$timeout', function($rootScope, $timeout){
  return {
    init: function(){
      $rootScope.pageFrame = {
        header: {
          pageLogoClosed: JSON.parse(window.sessionStorage.getItem('pageLogoClosed')),
          sidebarToggle: function(str){
            if(str === 'INIT'){
              $('.ipage-header>.ipage-logo>a').toggle();
            }else{
              $('.ipage-header>.ipage-logo>a').toggle();
            }
            if($('.ipage-logo').hasClass('closed')){
              $('.ipage-logo').removeClass('closed');
              $('.ipage-container').removeClass('closed');
              window.sessionStorage.setItem('pageLogoClosed', false);
            }else{
              $('.ipage-logo').addClass('closed');
              $('.ipage-container').addClass('closed');
              window.sessionStorage.setItem('pageLogoClosed', true);
              if($('.nav-item').hasClass('open')){
                $('.nav-item').removeClass('open');
                $('.nav-item').find('.sub-menu').hide();
              }
            }
          },
        },
        sidebar:{
          navItemToggle: function(evt){
            // alert('x')
            // Change nav-item state of view
            evt.stopPropagation();
            // Mark down the viewLocation
            // 如果是一级菜单
            if($(this).find('.sub-menu').length){
              if(!$(this).hasClass('open')){
                $(this).find('.sub-menu').slideDown('fast');
                $(this).addClass('open');
              }else{
                $(this).find('.sub-menu').slideUp('fast');
                $(this).removeClass('open');
              }
              // $rootScope.pageFrame.sidebar.lightNavItem(false);
            }else{
              var oldViewLoc = window.sessionStorage.getItem('viewLocation');
              if(oldViewLoc !== this.id){
                window.sessionStorage.setItem('viewLocation', this.id);
                $rootScope.pageFrame.sidebar.lightNavItem(true);
              }
            }
          },
          lightNavItem: function(clearAllFlag){
            //一上来先检查sessionStorage中是否已经有模块定位标志
            //若有，则读取设置；若无则设置为首页
            var viewItem = window.sessionStorage.getItem('viewLocation');
            if(viewItem){
              console.log('有view定位');
              if(clearAllFlag){
                //先清除全部
                $("li.nav-item").removeClass('open').removeClass('active').removeClass('start');
                //清除右侧三角
                $("li.nav-item span.selected").remove();
              }
              $("li#"+viewItem).addClass('open').addClass('active').children('a').append('<span class="selected"></span>');
              if(viewItem.indexOf('subView')!==-1){
                //如果点击的是二级菜单
                $("li#"+viewItem).parents('li.nav-item').addClass('open active').children('a').append('<span class="selected"></span>');
                $("li#"+viewItem).parent('ul.sub-menu').css('display', 'block');
                //关闭其他一级菜单
                $('.sub-menu:not(.sub-menu:has(li#'+ viewItem +'))').slideUp('fast');
              }
            }else{
              console.log('没有view定位');
              $(".ipage-sidebar-menu>li.nav-item:first-child").addClass('open active').children('a').append('<span class="selected"></span>');
              window.sessionStorage.setItem('viewLocation', $(".ipage-sidebar-menu>li.nav-item:first-child").attr('id'));
            }
          },
        },
        ddAdmin: {
          ddState: false,
          toggle: function(evt){
            var self = this;
            var target = evt.target;
            self.ddState = !self.ddState;
            if($(target).hasClass('open')){}
          },
          exitSys: function(){
            window.location.replace('../../index.html');
            window.sessionStorage.removeItem('viewLocation');
            window.sessionStorage.removeItem('pageLogoClosed');
          },
        },
      };

      // Click to trig the nav-item
      $(".ipage-sidebar-menu .nav-item").on('click', $rootScope.pageFrame.sidebar.navItemToggle);
      $(".ipage-logo .logo-default").on('click', $rootScope.pageFrame.sidebar.navItemToggle);

      // Dropdown icon toggle
      $(".dropdown-admin").on('show.bs.dropdown', function(){
        $(".dropdown-admin>.dropdown-toggle>.fa").removeClass('fa-angle-down').addClass('fa-angle-up');
      });
      $(".dropdown-admin").on('hide.bs.dropdown', function(){
        $(".dropdown-admin>.dropdown-toggle>.fa").removeClass('fa-angle-up').addClass('fa-angle-down');
      });

      // Init sidebar view
      $rootScope.pageFrame.sidebar.lightNavItem(true);

      // Show or hide the sidebar according to the state saved at last time
      var flag = $rootScope.pageFrame.header.pageLogoClosed;
      if(flag){
        $rootScope.pageFrame.header.sidebarToggle('INIT');
      }
    }
  }
}]);
