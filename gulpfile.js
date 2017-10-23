// Gulp
var fs = require('fs'), //文件系统
  path = require('path'), //路径插件
  gulp = require('gulp'), //本地安装gulp所用到的地方
  cache = require('gulp-cache'), //缓存工具
  ejs = require('gulp-ejs'), //ejs模板转换
  less = require('gulp-less'), //处理less文件工具
  uglify = require('gulp-uglify'), //压缩js文件工具
  md5 = require('gulp-md5-plus'), //md5
  stripDebug = require('gulp-strip-debug'), //清除源文件中的console、debugger
  concat = require('gulp-concat'), //合并文件工具
  cssmin = require('gulp-clean-css'), //压缩css文件工具
  autoprefixer = require('gulp-autoprefixer'), //自动补全浏览器前缀
  base64 = require('gulp-base64'), //base64工具
  htmlmin = require('gulp-htmlmin'), //压缩Html文件工具
  order = require('gulp-order'), //安排文件顺序工具
  imagemin = require('gulp-imagemin'), //压缩图片工具
  // pngquant = require('imagemin-pngquant'), //gulp-imagemin的插件
  rev = require('gulp-rev'), //对文件名加MD5后缀工具
  revCollector = require('gulp-rev-collector'), //路径替换工具
  clean = require('gulp-clean'), //清除文件工具
  rename = require('gulp-rename'), //重命名工具
  runSq = require('gulp-run-sequence'), //顺序执行
  domSrc = require('gulp-dom-src'), //通过DOM获得文件源
  cheerio = require('gulp-cheerio'), //可通过js操作指定文件
  replace = require('gulp-replace'), //替换
  sourceMaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync');

var ROOT_PATH = path.resolve(__dirname),
  SRC_PATH = path.resolve(ROOT_PATH, 'src'),
  BUILD_PATH = path.resolve(ROOT_PATH, 'build'),
  DIST_PATH = path.resolve(ROOT_PATH, 'admin');
// DIST_PATH = path.resolve(ROOT_PATH, 'dist');

/*--------------------Configure Options----------------------*/
var htmlOpt = {
  removeComments: true, //清除HTML注释
  collapseWhitespace: true, //压缩HTML
  // preserveLineBreaks: true,
  minifyJS: true, //压缩页面JS
  minifyCSS: true //压缩页面CSS
};
var imageminOpt = {
  progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
  optimizationLevel: 6, //类型：Number  默认：3  取值范围：0-7（优化等级）
  interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
  multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
  // use: [pngquant({quality: '65-85'})]
};
var autoprefixerObj = {
  browsers: ['last 5 versions'],
  cascade: true, //是否美化属性值 默认：true 像这样：
  //-webkit-transform: rotate(45deg);
  //        transform: rotate(45deg);
  remove: true //是否去掉不必要的前缀 默认：true
};
var sysRunMode = '';

/*--------------------Publish----------------------*/
/***************************************************
 * gulp task: publish-test  --发布 测试服务器版本
 ***************************************************/
gulp.task('publish-test', ['clean-all'], function() {
  sysRunMode = 'RUNTEST';
  runSq('view-transport', 'index-htmlmin', 'template-htmlmin',
    'css-concat-minify-md5', 'js-concat-uglify-md5', 'view-transform',
    'imageDispose', 'clean-useless');

  // 修改了 '/lib/' 下的文件时，需要重新打包
  // runSq('view-transport', 'index-htmlmin', 'template-htmlmin',
  //   'css-concat-minify-md5', 'js-concat-uglify-md5',  'view-transform',
  //   'imageDispose', 'optimizeLib', 'clean-useless');
});
/***************************************************
 * gulp task: publish-normal  --发布 正式服务器版本
 ***************************************************/
gulp.task('publish-normal', ['clean-all'], function() {
  sysRunMode = 'RUNRUN';
  runSq('view-transport', 'index-htmlmin', 'template-htmlmin',
    'css-concat-minify-md5', 'js-concat-uglify-md5',  'view-transform',
    'imageDispose', 'clean-useless');

  // 修改了 '/lib/' 下的文件时，需要重新打包
  // runSq('view-transport', 'index-htmlmin', 'template-htmlmin',
  //   'css-concat-minify-md5', 'js-concat-uglify-md5', 'view-transform',
  //   'imageDispose', 'optimizeLib', 'clean-useless');
});

/*--------------------Define tasks----------------------*/
/***************************************************
 * clean
 ***************************************************/
gulp.task('clean-all', function() {
  return gulp.src(DIST_PATH)
    .pipe(clean());
});
gulp.task('clean-useless', function() {
  gulp.src(path.resolve(DIST_PATH, 'view/ejs'))
    .pipe(clean());
  return gulp.src(path.resolve(DIST_PATH, 'view/*/*.ejs'))
    .pipe(clean());
});
/***************************************************
 * lib optimize
 ***************************************************/
gulp.task('optimizeLib', function() {
  var optimizeLibAll = true;
  // When normal-pulish
  if (optimizeLibAll) {
  //   gulp.src([path.resolve(SRC_PATH, 'lib/**/*.jpg'),
  //       path.resolve(SRC_PATH, 'lib/**/*.jpeg'),
  //       path.resolve(SRC_PATH, 'lib/**/*.png'),
  //       path.resolve(SRC_PATH, 'lib/**/*.gif'),
  //       path.resolve(SRC_PATH, 'lib/**/*.svg'),
  //       path.resolve(SRC_PATH, 'lib/**/*.map'),
  //       path.resolve(SRC_PATH, 'lib/**/*.swf')
  //     ])
  //     .pipe(imagemin(imageminOpt))
  //     .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  //
  //   gulp.src([path.resolve(SRC_PATH, 'lib/**/*.html')])
  //     .pipe(htmlmin(htmlOpt))
  //     .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  //
  //   gulp.src([path.resolve(SRC_PATH, 'lib/**/*.css')])
  //     .pipe(cssmin())
  //     .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  //
  //   gulp.src([path.resolve(SRC_PATH, 'lib/ueditor.config.js')])
  //     .pipe(stripDebug())
  //     .pipe(uglify())
  //     .pipe(md5(10, path.resolve(DIST_PATH, 'view/infoMng/*.js')))
  //     .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  //
  //   gulp.src([path.resolve(SRC_PATH, 'lib/**/*.js'), '!' + path.resolve(SRC_PATH, 'lib/ueditor.config.js')])
  //     .pipe(stripDebug())
  //     .pipe(uglify())
  //     .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  gulp.src([path.resolve(SRC_PATH, 'lib/**/*.*'), '!' + path.resolve(SRC_PATH, 'lib/ueditor.all.js')])
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  return gulp.src([path.resolve(SRC_PATH, 'lib/ueditor.all.js')])
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  } else {
  // When test-publish
  gulp.src([path.resolve(SRC_PATH, 'lib/**/*.*'), '!' + path.resolve(SRC_PATH, 'lib/ueditor.all.js')])
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
  return gulp.src([path.resolve(SRC_PATH, 'lib/ueditor.all.js')])
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'lib')));
}
});
/***************************************************
 * imagemin
 ***************************************************/
gulp.task('imagemin', function() {
  return gulp.src(path.resolve(SRC_PATH, 'img/*.{png,jpg,gif,ico,svg}'))
    // .pipe(cache(imagemin(imageminOpt))) //后续优化完图片之后再拷贝过来，就可以省略这一步骤了
    .pipe(md5(10, [path.resolve(DIST_PATH, 'index.html'),
      path.resolve(DIST_PATH, 'view/*/*.*'),
      path.resolve(DIST_PATH, 'template/*.*'),
      path.resolve(DIST_PATH, 'css/*.*')
    ]))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'img')));
});
gulp.task('imageDispose', ['imagemin'], function() {
  return gulp.src([path.resolve(DIST_PATH, 'css/*.css')])
    .pipe(base64({
      baseDir: path.resolve(DIST_PATH, 'img'),
      extensions: ['svg', 'png', 'jpg', 'gif'],
      maxImageSize: 20 * 1024,
    }))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'css')));
});
/***************************************************
 * view -html
 ***************************************************/
gulp.task('view-transport', ['view-modify-ejs'], function() {});
gulp.task('view-transform', ['view-htmlmin'], function() {});
// Move all .html & .ejs files to DIST_PATH
gulp.task('view-copy', function() {
  return gulp.src([path.resolve(SRC_PATH, 'view/*/*.html'), path.resolve(SRC_PATH, 'view/*/*.ejs')])
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view')));
});
// Modify .ejs files that act as template for static html files
gulp.task('view-modify-ejs', ['view-copy'], function() {
  gulp.src([path.resolve(DIST_PATH, 'view/ejs/head-links.html')])
    .pipe(cheerio(function($) {
      $('link').eq(-1).after('<link href="../../css/all.bundle.css" rel="stylesheet" type="text/css"/>');
      // 留下icon-font和font-awesome的两个CDN链接
      $('link').slice(2, -1).remove();
    }))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view/ejs')));

  return gulp.src([path.resolve(DIST_PATH, 'view/ejs/body-scripts.html')])
    .pipe(cheerio(function($) {
      $('script').eq(-1).after('<script src="../../js/all.bundle.js"></script>');
      $('script').slice(0, -1).remove();
    }))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view/ejs')));
});
//----------------------------------------------------------------
// Turn .ejs files into .html files
gulp.task('view-ejs-all', ['js-concat-uglify-md5'], function() {
  return gulp.src([path.resolve(DIST_PATH, 'view/*/*.ejs')])
    .pipe(ejs({}, {
      ext: '.html'
    }))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view')));
});
gulp.task('view-htmlmin', ['view-ejs-all'], function() {
  return gulp.src([path.resolve(DIST_PATH, 'view/*/*.html')])
    // .pipe(htmlmin(htmlOpt))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view')));
});
/***************************************************
 * template -html
 ***************************************************/
gulp.task('template-htmlmin', function() {
  return gulp.src([path.resolve(SRC_PATH, 'template/*.html')])
    // .pipe(htmlmin(htmlOpt))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'template')));
});
/***************************************************
 * index -html
 ***************************************************/
gulp.task('index-htmlmin', function() {
  return gulp.src([path.resolve(SRC_PATH, 'index.ejs')])
    .pipe(cheerio({
      run: function($) {
        $('link').slice(1).remove();
        $('link').eq(0).after('<link href="./css/all.bundle.css" rel="stylesheet" type="text/css"/>');
        $('script').slice(0, -1).remove();
        $('script').eq(0).before('<script src="./js/all.bundle.js"></script>');
        var jsTxt = $('script').slice(-1).html();
        jsTxt = jsTxt.replace(/__SYS_RUN_MODE__/, sysRunMode); //修改运行模式
        $('script').slice(-1).html(jsTxt);
      },
      parserOptions: {
        decodeEntities: false,
      }
    }))
    // .pipe(htmlmin(htmlOpt))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(DIST_PATH));
});
/***************************************************
 * css
 ***************************************************/
gulp.task('css-transport', function() {});
gulp.task('css-concat-minify-md5', function() {
  // 当使用本地font的css文件的话，才使用该任务
  // gulp.src([path.resolve(SRC_PATH, 'css/fonts/*.*')])
  //   .pipe(gulp.dest(path.resolve(DIST_PATH, 'css/fonts')));

  gulp.src([path.resolve(SRC_PATH, 'view/*/*.css')])
    .pipe(cssmin())
    .pipe(md5(10, path.resolve(DIST_PATH, 'view/*/*.ejs')))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view')));

  return gulp.src([path.resolve(SRC_PATH, 'css/*.css'), path.resolve(SRC_PATH, 'template/*.css')])
    .pipe(concat('all.bundle.css'))
    .pipe(cssmin())
    .pipe(md5(10, [path.resolve(DIST_PATH, 'view/ejs/head-links.html'), path.resolve(DIST_PATH, 'index.html')]))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'css')));
});

/***************************************************
 * js
 ***************************************************/
gulp.task('js-concat-uglify-md5', function() {
  gulp.src([path.resolve(SRC_PATH, 'view/*/*.js')])
    .pipe(stripDebug())
    .pipe(uglify({
      // mangle: false //类型：Boolean 默认：true 是否修改变量名
    }))
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    })
    .pipe(md5(10, path.resolve(DIST_PATH, 'view/*/*.ejs')))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'view')));
  gulp.src([path.resolve(SRC_PATH, 'js/**/*.js'), '!' + path.resolve(SRC_PATH, 'js/public/**/*.*')])
    .pipe(stripDebug())
    .pipe(uglify({
      // mangle: false //类型：Boolean 默认：true 是否修改变量名
    }))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'js')));
  gulp.src([path.resolve(SRC_PATH, 'js/public/**/*.*'), '!' + path.resolve(SRC_PATH, 'js/public/**/*.js')])
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'js/')));

  return gulp.src([path.resolve(SRC_PATH, 'js/public/vendors/*.js'), path.resolve(SRC_PATH, 'js/public/modules/*.js')])
    .pipe(order([
      'jquery.js',
      'bootstrap.js',
      'iLayout.js',
      'laydate.dev.js',
      'lrz.bundle.js',
      'angular.js',
      'angular-route.js',
      'cm-module.js',
      'initpage-module.js',
      'route-module.js',
      'http-module.js',
      'filter-module.js',
      'components-module.js',
    ]))
    .pipe(concat('all.bundle.js'))
    // .pipe(sourceMaps.init())  // Debug
    .pipe(stripDebug())
    .pipe(uglify({
      // mangle: false //类型：Boolean 默认：true 是否修改变量名
    }))
    // .pipe(sourceMaps.write())  // Debug
    .pipe(md5(10, [path.resolve(DIST_PATH, 'view/ejs/body-scripts.html'), path.resolve(DIST_PATH, 'index.html')]))
    .pipe(gulp.dest(path.resolve(DIST_PATH, 'js')));
});

/*------------------Development--------------------*/
/***************************************************
 * gulp task: default
 ***************************************************/
gulp.task('default', function() {
  runSq('set-sysRunMode', 'watch-all', 'browser-sync');
});
/***************************************************
 * Set sysRunMode
 ***************************************************/
gulp.task('set-sysRunMode', function() {
  sysRunMode = 'DEBUGTEST';
  return gulp.src([path.resolve(SRC_PATH, 'index.ejs')])
    .pipe(cheerio(function($) {
      var jsTxt = $('script').slice(-1).html();
      jsTxt = jsTxt.replace(/__SYS_RUN_MODE__/, sysRunMode); //修改运行模式
      $('script').slice(-1).html(jsTxt);
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(path.resolve(SRC_PATH)));
});
/***************************************************
 * ejs
 ***************************************************/
gulp.task('ejs-all', function() {
  gulp.src([path.resolve(SRC_PATH, '*.ejs')])
    .pipe(ejs({}, {
      ext: '.html'
    }))
    .pipe(gulp.dest(SRC_PATH));

  return gulp.src([path.resolve(SRC_PATH, 'view/*/*.ejs')])
    .pipe(ejs({}, {
      ext: '.html'
    }))
    .pipe(gulp.dest(path.resolve(SRC_PATH, 'view')));
});
/***************************************************
 * auth-process 实现权限控制
 * 手动运行一次即可
 ***************************************************/
gulp.task('auth-process', function() {
  return gulp.src([path.resolve(SRC_PATH, 'view/*/*.html')])
    .pipe(cheerio({
      run: function($, file) {
        var fileRelativeArr = (file.relative).split("\\");
        var dir = fileRelativeArr[0];
        var filename = fileRelativeArr[1];
        // 定义修改链接的函数
        function modifyLink(moduleID) {
          $('a').each(function(index, item) {
            var ngHref = $(item).attr("ng-href") + "";
            if (ngHref != "undefined") {
              $(item).attr({
                "ng-href": ngHref.replace(/"/g, "'")
              });
            }
            if (($(item).html().indexOf('添加') !== -1) ||
              ($(item).html().indexOf('新增') !== -1) ||
              ($(item).html().indexOf('编辑') !== -1) ||
              ($(item).html().indexOf('修改') !== -1) ||
              ($(item).html().indexOf('更改') !== -1) ||
              ($(item).html().indexOf('删除') !== -1)) {
              // console.log($(item).html());
              $(item).attr({
                "ng-if": "(adminModules[" + (moduleID - 1) + "].type == 3) || (adminModules[" + (moduleID - 1) + "].type == 4)"
              });
            }else if(($(item).html().indexOf('查看') !== -1)){
              $(item).attr({
                "ng-if": "(adminModules[" + (moduleID - 1) + "].type == 2) || (adminModules[" + (moduleID - 1) + "].type == 4)"
              })
            }else{}
          })
        }
        // 分流处理
        switch (dir) {
          case 'shopMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(2);
            }
            break;
          case 'clientMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(3);
            }
            break;
          case 'orderMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(4);
            }
            break;
          case 'authorizeMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(5);
            }
            break;
          case 'financeMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(6);
            }
            break;
          case 'infoMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(7);
            }
            break;
          case 'bookMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(8);
            }
            break;
          case 'marketMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(9);
            }
            break;
          case 'qrcodeMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(9);
            }
            break;
          case 'facilityMng':
            if (filename !== 'index.html') {
              // console.log(filename);
              modifyLink(10);
            }
            break;
        }
      },
      parserOptions: {
        decodeEntities: false
      }
    }))
    .pipe(gulp.dest(path.resolve(SRC_PATH, 'view')));
  // .pipe(gulp.dest('./src_debug'));
});
/***************************************************
 * less
 ***************************************************/
gulp.task('less-all', function() {
  return gulp.src([path.resolve(SRC_PATH, '**/*.less'), '!' + path.resolve(SRC_PATH, 'css/define.less'), '!' + path.resolve(SRC_PATH, 'css/basic.less')])
    .pipe(less())
    .pipe(autoprefixer({
      autoprefixerObj
    }))
    .pipe(gulp.dest(SRC_PATH));
});
/***************************************************
 * watch
 ***************************************************/
gulp.task('watch-all', ['ejs-all', 'less-all'], function() {
  gulp.watch(path.resolve(SRC_PATH, 'view/*/*.ejs'), ['ejs-all']);
  gulp.watch(path.resolve(SRC_PATH, 'view/ejs/*.html'), ['ejs-all']);
  gulp.watch(path.resolve(SRC_PATH, '**/*.less'), ['less-all']);
});
/***************************************************
 * browser-sync
 ***************************************************/
gulp.task('browser-sync', function() {
  var files = [
    path.resolve(SRC_PATH, '**/*.html'),
    path.resolve(SRC_PATH, '**/*.css'),
    path.resolve(SRC_PATH, '**/*.js'),
  ];
  browserSync.init(files, {
    server: {
      baseDir: './',
      directory: true,
    }
  });
});
