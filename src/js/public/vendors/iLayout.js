$(function() {
  $('html').css('display', 'none');
  console.log('全局布局设置');
  const MAX_WIDTH = 1400;
  if($('.ipage-header').length && $('.ipage-footer').length){
    var iPageHeaderHeight = Number(($('.ipage-header').css('height')).slice(0, -2));
    var iPageFooterHeight = Number(($('.ipage-footer').css('height')).slice(0, -2));
    var documentHeight = $(document).height();
    var htmlHeight = $('html').height();
    $(window).on('resize', function() {
      // 调整显示区域高度
      // var visualHeight = window.innerHeight; //可视化区域高
      var visualHeight = document.documentElement.clientHeight; //可视化区域高
      // new
      $(".ipage-sidebar-wrapper").css('height', (visualHeight-56) + 'px');
      // console.log('visualHeight: ' + visualHeight);
      // console.log('wrapperHeight: ' + $(".ipage-sidebar-wrapper").height());
      // $(".ipage-sidebar-wrapper").css('min-height', htmlHeight - iPageHeaderHeight + 'px');
      if(htmlHeight <= visualHeight) //若文档高 < 可视化区域高
      {
        var iPageContentHeight = visualHeight - iPageHeaderHeight - iPageFooterHeight;
        var iPageContainerHeight = visualHeight - iPageHeaderHeight;
        $(".ipage-content-wrapper").css('min-height', iPageContentHeight + 'px');
        // new
        // $(".ipage-sidebar-wrapper").css('height', (visualHeight-56) + 'px');
        // $(".ipage-sidebar-wrapper").css('min-height', iPageContainerHeight + 'px');
      }
    }).trigger('resize');
  }
  $('html').css('display', 'block');

  // $(window).on('scroll', function(evt){
  //   console.log(evt.preventDefault);
  //   evt.preventDefault();
  //   $('.ipage-sidebar-wrapper').offset({
  //     top: 56
  //   });
  // });

  $('.ipage-sidebar').scroll(function(){
    console.log('滚动了');
  });

});
