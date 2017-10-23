/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', ['$scope', function($scope) {
    $scope.cacheData = null;
    $scope.previewTpl = '<div style="font-size: 0;position: relative;height: 160px;margin-bottom: 30px;"><div style="display: inline-block;width: 160px;height: 160px;font-size: 16px;position: absolute;top: 0;text-align: right;padding: 0 60px 0 0;"><h4 id="year" style="position: relative;top: 60px;font-size: 28px;">DATE_TPLTEXT</h4><p id="date" style="position: relative;top: 70px;font-size: 16px;">YEAR_TPLTEXT</p><img style="position: absolute;height: 80%;top: 20px;right: 20px;" src="../../img/xiangzhuang.svg" alt="" /><hr style="position: absolute;bottom: -8px;width: 125px;height: 0;border: 0;  border-bottom: 1px solid #f1f1f1;"></div><div style="left:160px;background-color:#ffffff;border:0;display: inline-block;height: 160px;width: 850px;position: absolute;padding: 20px;"><h4 id="title" style="  width: 100%;height: 40px;font-size:26px;">TITLE_TPLTEXT</h4><p id="editer" style="font-size:16px;color:gray;position:absolute;bottom:30px;">发布者：PUBLISHER_TPLTEXT</p></div></div><div id="info-content">CONTENT_TPLTEXT</div>';
  }])
  .controller('infoMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', 'itemNumList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $route, itemNumList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '资讯管理',
      'url': '../../..' + window.location.pathname + '#/infoMng_index'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';

    $scope.tblToolbar = {
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
        $scope.tblNormal.getInfoList(self.itemNumVal.id, 1, self.searchVal);
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
        $scope.tblNormal.getInfoList(self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      searchVal: "",
      itemNumVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };
    $scope.tblNormal = {
      getInfoList: function(pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryArticlesOpen?pageSize=' + pageSize + '&curPage=' + curPage + '&key=' + key)
          .success(function(ret) {
            console.log(ret);
            self.dataList = ret.data.data;
            $scope.tblPagination.initPagination(ret);
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      delete: function(id) {
        var self = this;
        console.log(id);
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确定删除该项资讯吗？';
        $scope.modalBasic.footer.btn = [{
            "name": '取消',
            "styleList": ['btn', 'btn-cancel'],
            'func': function() {
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          },
          {
            "name": '确认',
            "styleList": ['btn', 'btn-confirm'],
            'func': function() {
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteArticleFromBKMgr?id=' + id)
                .success(function(ret) {
                  if (ret.success) {
                    self.getInfoList($scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal);
                  }
                }).error(function(msg) {});
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          }
        ];
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
    };

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getInfoList(self.pageSize, pageNum, tblToolbar.searchVal);
    };

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getInfoList($scope.tblToolbar.itemNumVal.id, $scope.tblPagination.curPage, $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getInfoList($scope.tblToolbar.itemNumVal.id, 1, '');
    }

  }])
  .controller('infoMngAdd_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$q', 'infoStateList', function($scope, $rootScope, $http, $timeout, $route, $q, infoStateList) {
    $rootScope.globalPath.initPath({
      'name': '新增资讯',
      'url': '../../..' + window.location.pathname + '#/infoMng_add'
    }, 'LV2');
    var ue = null;
    $scope.formResult = {};
    $scope.valiResult = {};
    $scope.tblDetails = {
      addMainPic: function() {
        $('#mainPicInput').trigger('click');
      },
      uploadFile: function(selector) {
        var self = this;
        var elem = $(selector).get(0);
        lrz(elem.files[0], {
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
                  // $scope.tblDetails.uploadSuccess = true;
                  $scope.tblDetails.mainPicName = rst.origin.name;
                  $scope.formResult.mainPictureUrl = file;
                  $scope.tblDetails.mainPictureUrl = file,
                    console.log(file);
                }, 0);
              });
            },
            error: function(data) {
              console.log(data);
              // $scope.tblDetails.uploadSuccess = false;
            }
          });
          rst.formData.append('fileLen', rst.fileLen);
        })
      },
      getEditorCtn: function() {
        var self = this;
        // 获取HTML内容
        $scope.formResult.content = ue.getContent();
      },
      valiForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]|.){2,}$/;
        //
        if (!reg.test($scope.formResult.title) || (typeof($scope.formResult.title) === 'undefined')) {
          $scope.valiResult.titleError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.titleError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!reg.test($scope.formResult.articleAbstract) || (typeof($scope.formResult.articleAbstract) === 'undefined')) {
          $scope.valiResult.articleAbstractError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.articleAbstractError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!reg.test($scope.formResult.publisher) || (typeof($scope.formResult.publisher) === 'undefined')) {
          $scope.valiResult.publisherError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.publisherError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.mainPictureUrl) {
          $scope.valiResult.mainPictureUrlError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.mainPictureUrlError = false;
          canSubmit = canSubmit && true;
        }
        $timeout(function() {
          for (var key in $scope.valiResult) {
            ($scope.valiResult)[key] = false;
          }
        }, 2000);
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          self.getEditorCtn();
          $scope.formResult.state = infoStateList[1].id; //发布
          var data = $.param($scope.formResult);
          console.log(data);
          console.log($scope.formResult);
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addArticleFromBKMgr', data)
              .success(function(ret) {
                $scope.modalBasic.header.content = '发布提示';
                if (ret.success) {
                  $scope.modalBasic.body.content = '发布成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续发布',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '发布失败！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '取消',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新发布',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              })
              .error(function() {});
          }
        }
      },
      saveTemp: function() {
        var self = this;
        if (self.valiForm()) {
          self.getEditorCtn();
          $scope.formResult.state = infoStateList[0].id; //保存到草稿箱
          var data = $.param($scope.formResult);
          console.log(data);
          console.log($scope.formResult);
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addArticleFromBKMgr', data)
              .success(function(ret) {
                $scope.modalBasic.header.content = '保存提示';
                if (ret.success) {
                  $scope.modalBasic.body.content = '保存到草稿箱成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '保存失败！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '取消',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              })
              .error(function() {});
          }
        }

      },
      cancel: function() {
        window.history.go(-1);
      },
      preview: function() {
        console.log($scope.formResult);
        $scope.modalBasic.header.content = '预览资讯';
        var now = new Date();
        var previewTpl = $scope.previewTpl;
        previewTpl = previewTpl.replace(/YEAR_TPLTEXT/, now.getFullYear());
        previewTpl = previewTpl.replace(/DATE_TPLTEXT/, (now.getMonth() + 101 + '').slice(-2) + '-' + (now.getDate() + 100 + '').slice(-2));
        previewTpl = previewTpl.replace(/TITLE_TPLTEXT/, $scope.formResult.title || '');
        previewTpl = previewTpl.replace(/PUBLISHER_TPLTEXT/, $scope.formResult.publisher || '');
        previewTpl = previewTpl.replace(/CONTENT_TPLTEXT/, ue.getContent() || '');
        $("#myModal .modal-body").append('<div class="preview-content">' + previewTpl + '</div>');
        $scope.modalBasic.footer.btn = [{
          "name": '关闭',
          "styleList": ['btn', 'btn-cancel'],
          'func': function() {
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
              $("#myModal").removeClass('preview-modal');
              $("#myModal .modal-body .preview-content").remove();
            });
          }
        }];
        $("#myModal").addClass('preview-modal');
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      getUeditorScripts: function() {
        var getConfigScript = function() {
          var deferredA = $q.defer();
          var promiseA = deferredA.promise;
          // jQuery.getScript('../../lib/ueditor.config.js', function(){
          //   deferredA.resolve(true);
          // });
          $.cachedScript('../../lib/ueditor.config.js').done(function() {
            deferredA.resolve(true);
          });
          return promiseA;
        };
        var getSourceScript = function() {
          var deferredB = $q.defer();
          var promiseB = deferredB.promise;
          // jQuery.getScript('../../lib/ueditor.all.js', function(){
          //   deferredB.resolve(true);
          // });
          $.cachedScript('../../lib/ueditor.all.js').done(function() {
            deferredB.resolve(true);
          });
          return promiseB;
        };
        (getConfigScript()).then(function(flagA) {
          console.log(flagA);
          if (flagA) {
            (getSourceScript()).then(function(flagB) {
              console.log(flagB);
              ue = UE.getEditor('ueditor-container');
            }, function() {});
          }
        }, function() {});
      },
      mainPictureUrl: '../../img/addpic.png',
    };
    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $('#mainPicInput').on('change', function() {
      $scope.tblDetails.uploadFile('#mainPicInput');
    });

    $scope.tblDetails.getUeditorScripts();
  }])
  .controller('infoMngEdit_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', '$q', 'infoStateList', function($scope, $rootScope, $http, $timeout, $route, $routeParams, $q, infoStateList) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '编辑资讯',
      'url': '../../..' + window.location.pathname + '#/infoMng_edit/' + $scope.param,
    }, 'LV2');
    $scope.queryResult = {};
    $scope.formResult = {};
    $scope.valiResult = {};
    $scope.tblDetails = {
      getInfoDetails: function(id, ue) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getArticleOpen?id=' + id)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              ue.setContent(ret.data.content);
              $scope.queryResult = ret.data;
              $scope.formResult.title = ret.data.title;
              $scope.formResult.articleAbstract = ret.data.articleAbstract;
              $scope.formResult.publisher = ret.data.publisher;
              $scope.formResult.mainPictureUrl = ret.data.mainPictureUrl;
              $scope.tblDetails.mainPictureUrl = ret.data.mainPictureUrl;
            } else {}
          })
          .error(function(err) {});
      },
      addMainPic: function() {
        $('#mainPicInput').trigger('click');
      },
      uploadFile: function(selector) {
        var self = this;
        var elem = $(selector).get(0);
        lrz(elem.files[0], {
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
                  // $scope.tblDetails.uploadSuccess = true;
                  $scope.tblDetails.mainPicName = rst.origin.name;
                  $scope.formResult.mainPictureUrl = file;
                  $scope.tblDetails.mainPictureUrl = file,
                    console.log(file);
                }, 0);
              });
            },
            error: function(data) {
              console.log(data);
              // $scope.tblDetails.uploadSuccess = false;
            }
          });
          rst.formData.append('fileLen', rst.fileLen);
        })
      },
      getEditorCtn: function() {
        var self = this;
        // 获取HTML内容
        $scope.formResult.content = ue.getContent();
      },
      valiForm: function() {
        var self = this;
        var canSubmit = true;
        var reg = /^([\u4e00-\u9fa5]|[0-9]|[a-zA-Z]|.){2,}$/;
        //
        if (!reg.test($scope.formResult.title) || (typeof($scope.formResult.title) === 'undefined')) {
          $scope.valiResult.titleError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.titleError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!reg.test($scope.formResult.articleAbstract) || (typeof($scope.formResult.articleAbstract) === 'undefined')) {
          $scope.valiResult.articleAbstractError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.articleAbstractError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!reg.test($scope.formResult.publisher) || (typeof($scope.formResult.publisher) === 'undefined')) {
          $scope.valiResult.publisherError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.publisherError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!$scope.formResult.mainPictureUrl) {
          $scope.valiResult.mainPictureUrlError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.mainPictureUrlError = false;
          canSubmit = canSubmit && true;
        }
        $timeout(function() {
          for (var key in $scope.valiResult) {
            ($scope.valiResult)[key] = false;
          }
        }, 2000);
        return canSubmit;
      },
      save: function() {
        var self = this;
        var ret = self.valiForm();
        console.log(ret);
        if (ret) {
          self.getEditorCtn();
          $scope.formResult.id = $scope.param;
          $scope.formResult.state = infoStateList[1].id; //发布
          var data = $.param($scope.formResult);
          console.log($scope.formResult);
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateArticleFromBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                $scope.modalBasic.header.content = '编辑提示';
                if (ret.success) {
                  $scope.modalBasic.body.content = '修改成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '修改失败！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '取消',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              })
              .error(function() {});
          }
        }
      },
      saveTemp: function() {
        var self = this;
        if (self.valiForm()) {
          self.getEditorCtn();
          $scope.formResult.id = $scope.param;
          $scope.formResult.state = infoStateList[0].id; //保存到草稿箱
          var data = $.param($scope.formResult);
          console.log(data);
          console.log($scope.formResult);
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateArticleFromBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                $scope.modalBasic.header.content = '保存提示';
                if (ret.success) {
                  $scope.modalBasic.body.content = '保存到草稿箱成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '保存失败！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '取消',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              })
              .error(function() {});
          }
        }

      },
      cancel: function() {
        window.history.go(-1);
      },
      preview: function() {
        console.log($scope.formResult);
        $scope.modalBasic.header.content = '预览资讯';
        var now = new Date();
        var previewTpl = $scope.previewTpl;
        previewTpl = previewTpl.replace(/YEAR_TPLTEXT/, now.getFullYear());
        previewTpl = previewTpl.replace(/DATE_TPLTEXT/, (now.getMonth() + 101 + '').slice(-2) + '-' + (now.getDate() + 100 + '').slice(-2));
        previewTpl = previewTpl.replace(/TITLE_TPLTEXT/, $scope.formResult.title || '');
        previewTpl = previewTpl.replace(/PUBLISHER_TPLTEXT/, $scope.formResult.publisher || '');
        previewTpl = previewTpl.replace(/CONTENT_TPLTEXT/, ue.getContent() || '');
        $("#myModal .modal-body").append('<div class="preview-content">' + previewTpl + '</div>');
        $scope.modalBasic.footer.btn = [{
          "name": '关闭',
          "styleList": ['btn', 'btn-cancel'],
          'func': function() {
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
              $("#myModal").removeClass('preview-modal');
              $("#myModal .modal-body .preview-content").remove();
            });
          }
        }];
        $("#myModal").addClass('preview-modal');
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      getUeditorScripts: function() {
        var self = this;
        var getConfigScript = function() {
          var deferredA = $q.defer();
          var promiseA = deferredA.promise;
          // jQuery.getScript('../../lib/ueditor.config.js', function(){
          //   deferredA.resolve(true);
          // });
          $.cachedScript('../../lib/ueditor.config.js').done(function() {
            deferredA.resolve(true);
          });
          return promiseA;
        };
        var getSourceScript = function() {
          var deferredB = $q.defer();
          var promiseB = deferredB.promise;
          // jQuery.getScript('../../lib/ueditor.all.js', function(){
          //   deferredB.resolve(true);
          // });
          $.cachedScript('../../lib/ueditor.all.js').done(function() {
            deferredB.resolve(true);
          });
          return promiseB;
        };
        (getConfigScript()).then(function(flagA) {
          console.log(flagA);
          if (flagA) {
            (getSourceScript()).then(function(flagB) {
              console.log(flagB);
              ue = UE.getEditor('ueditor-container');
              ue.ready(function() {
                self.getInfoDetails($scope.param, ue);
              });
            }, function() {});
          }
        }, function() {});
      },
      mainPictureUrl: '../../img/addpic.png',
    };
    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

    $('#mainPicInput').on('change', function() {
      $scope.tblDetails.uploadFile('#mainPicInput');
    });

    $scope.tblDetails.getUeditorScripts();
  }])
  .controller('infoMngQuery_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$route', '$routeParams', function($scope, $rootScope, $http, $timeout, $route, $routeParams) {
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '查看资讯',
      'url': '../../..' + window.location.pathname + '#/infoMng_query/' + $scope.param,
    }, 'LV2');

    $scope.queryResult = {
      createDate: '',
      title: '',
    };
    $scope.tblDetails = {
      getInfoDetails: function(id) {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getArticleOpen?id=' + id)
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult = ret.data;
              $('#info-content').html($scope.queryResult.content);
            }
          })
          .error(function(err) {});
      },
    };
    $scope.tblDetails.getInfoDetails($scope.param);

  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/infoMng_index', {
        templateUrl: 'infoMng_index.html?t=' + getTimeStamp(),
        controller: 'infoMngIndex_ctrl',
      })
      .when('/infoMng_add', {
        templateUrl: 'infoMng_add.html?t=' + getTimeStamp(),
        controller: 'infoMngAdd_ctrl',
      })
      .when('/infoMng_edit/:param', {
        templateUrl: 'infoMng_add.html?t=' + getTimeStamp(),
        controller: 'infoMngEdit_ctrl',
      })
      .when('/infoMng_query/:param', {
        templateUrl: 'infoMng_query.html?t=' + getTimeStamp(),
        controller: 'infoMngQuery_ctrl',
      })
      .otherwise({
        redirectTo: '/infoMng_index'
      });
    $httpProvider.interceptors.push('myInterceptor'); //拦截器
  }])
  .run(['$rootScope', '$templateCache', function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (typeof(current) !== 'undefined') {
        $templateCache.remove(current.templateUrl);
      }
    });
  }]);
