/**
 * Created by heh12 on 2016/3/22.
 */

angular.module('mngApp', ['ng', 'ngRoute', 'ngCMModule'])
  .controller('mngCtrl', ['$scope', '$rootScope', '$q', '$http', function($scope, $rootScope, $q, $http) {
    // Put sth belongs to the specific mng-module here
    $scope.getRolesList = function() {
      var self = this;
      var deferred = $q.defer();
      var promise = deferred.promise;
      $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRolesBKMgr')
        .success(function(ret) {
          if (ret.success) {
            console.log(ret.data);
            self.roleTypeList = ret.data.map(function(item) {
              item.id = item.roleID;
              item.name = item.roleName;
              return item;
            });
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
        .error(function(msg) {
          console.log('Error! %s', msg);
        });
      return promise;
    };
  }])
  .controller('authorizeMngIndex_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'itemNumList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, itemNumList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '授权管理',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_index'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      itemNumValChanged: function() {
        var self = this;
        //Get intentClientList
        $scope.tblNormal.getManagerList(self.itemNumVal.id, 1, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        //Get intentClientList
        $scope.tblNormal.getManagerList(self.itemNumVal.id, 1, self.searchVal);
      },
      itemNumList: itemNumList,
      refundStateVal: {
        id: ''
      },
      itemNumVal: "",
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getManagerList: function(pageSize, curPage, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getManagers?' +
            '&pageSize=' + pageSize + '&curPage=' + curPage +
            '&sortType=1&orderColumn=id&key=' + key)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              $scope.tblNormal.dataList = data;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      delManager: function(id, adminName) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确定删除管理员 "' + adminName + '"  吗？';
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
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteManager?managerID=' + id)
                .success(function(ret) {
                  if (ret.success) {
                    self.getManagerList($scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.searchVal);
                  }
                }).error(function(msg) {
                  console.log("Fail");
                  console.log(msg);
                });
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
      $scope.tblNormal.getManagerList(self.pageSize, pageNum, tblToolbar.searchVal);
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

    if (RememberSer.restore($scope)) {
      $scope.tblNormal.getManagerList($scope.tblToolbar.itemNumVal.id,
        $scope.tblPagination.curPage,
        $scope.tblToolbar.searchVal);
    } else {
      $scope.tblNormal.getManagerList($scope.tblToolbar.itemNumVal.id, 1, '');
    }
  }])
  .controller('authorizeMngAddAdmin_ctrl', ['$scope', '$rootScope', '$http', '$timeout', 'CheckSer', function($scope, $rootScope, $http, $timeout, CheckSer) {
    $scope.title = '新增管理员';
    $rootScope.globalPath.initPath({
      'name': '新增管理员',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_addAdmin'
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
      manageShops: [],
    };
    $scope.valiResult = {
      nameError: false,
      phoneError: false,
      shopsError: false,
      cityIDError: false,
      roleIDError: false,
    };

    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getRolesList: $scope.getRolesList,
      getShopList: function() {
        var self = this;
        // Get shops list
        if (!self.cityVal) {
          self.cityVal.id = '';
        }
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + self.cityVal.id +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
            ret.data.data.unshift({
              name: '全选',
              id: 'selall'
            });
            $scope.dropdownSel.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cityValChanged: function() {
        if (!this.cityVal) {
          this.cityVal = {
            id: ''
          };
        }
        $scope.formResult.cityID = this.cityVal.id;
        this.getShopList();
      },
      roleTypeValChanged: function() {
        if (!this.roleTypeVal) {
          this.roleTypeVal = {
            id: ''
          };
        }
        $scope.formResult.roleID = this.roleTypeVal.id;
      },
      valiForm: function() {
        var chkUtil = new CheckSer.CheckUtil();
        chkUtil
          .init({ /* 载入公共配置 */
            valiResult: $scope.valiResult, // 存储各项校验结果的对象
          })
          .chkName($scope.formResult.name, {
            errorName: 'nameError'
          })
          .chkPhone($scope.formResult.phone, {
            errorName: 'phoneError'
          })
          .chkNotEmpty($scope.formResult.cityID, {
            errorName: 'cityIDError'
          })
          .chkNotEmpty($scope.formResult.roleID, {
            errorName: 'roleIDError'
          });
        return chkUtil.result;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          var result = {
            name: $scope.formResult.name,
            phone: $scope.formResult.phone,
            cityID: $scope.formResult.cityID,
            roleID: $scope.formResult.roleID,
            manageShops: (function() {
              return ($scope.formResult.manageShops.join(','));
            })()
          };
          var data = $.param(result);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addManager', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.newManagerID = ret.data;
                $scope.modalBasic.body.content = "新增成功！";
                $scope.modalBasic.footer.btn = [{
                    "name": '稍后添加管理员门禁卡',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  },
                  {
                    "name": '立即添加管理员门禁卡',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.location.href = '#/authorizeMng_addCard/' + $scope.newManagerID;
                      });
                    }
                  }
                ];
              } else {
                $scope.modalBasic.body.content = "新增失败！" + ret.message;
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
                    "name": '重新添加',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail");
              console.log(msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityVal: {
        id: ''
      },
    };
    $scope.tblDetails.getCityList();
    $scope.tblDetails.getRolesList();

    $scope.dropdownSel = {
      keyword: '',
      chsnList: [],
      searchShops: function(cityID, key) {
        var self = this;
        console.log(cityID, key);
        if (1) {
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopsByCity?cityID=' + cityID.id +
              '&pageSize=100&curPage=1&sortType=0&orderColumn=id&key=' + key)
            .success(function(ret) {
              console.log(ret.data.data);
              //如果一个数据都没有
              if (ret.success) {
                if (ret.data.data.length === 0) {
                  self.shopList = [];
                } else {
                  ret.data.data.unshift({
                    id: 'selall',
                    name: '全选'
                  })
                  self.shopList = ret.data.data;
                  console.log(self.shopList);
                }
              }
            }).error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      addShops: function(shopID, shopName) {
        var self = this;
        var canAdd = true;
        var canAddAll = true;
        for (var i in self.chsnList) {
          if (self.chsnList[i].shopID == shopID) {
            canAdd = false;
            break;
          }
        }
        // console.log(self.chsnList);
        if (shopID === 'selall') {
          canAdd = false;
          var temp = self.shopList.slice(1);
          // console.log(temp);
          // console.log(temp);
          for (var k in temp) {
            for (var j in self.chsnList) {
              if (self.chsnList[j].shopID == temp[k].id) {
                canAddAll = false;
                break;
              } else {
                canAddAll = true;
              }
            }
            if (canAddAll) {
              self.chsnList.push({
                shopID: temp[k].id,
                shopName: temp[k].name,
              });
              $scope.formResult.manageShops.push(temp[k].id);
            }
          }
        }

        if (canAdd) {
          self.chsnList.push({
            shopID: shopID,
            shopName: shopName,
          });
          $scope.formResult.manageShops.push(shopID);
        }
      },
      removeItem: function(shopID) {
        var self = this;
        for (var i in self.chsnList) {
          if (self.chsnList[i].shopID == shopID) {
            self.chsnList.splice(i, 1);
            $scope.formResult.manageShops.splice(i, 1);
            break;
          }
        }
      },
    };
  }])
  .controller('authorizeMngEditAdmin_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', 'TblPagination', 'defaultOptFilterFilter', 'CheckSer',
    function($scope, $rootScope, $routeParams, $http, $timeout, $q, TblPagination, defaultOptFilterFilter, CheckSer) {
      $scope.param = $routeParams.param;
      $scope.viewTag = 'EDIT';
      $scope.title = '编辑管理员';
      $rootScope.globalPath.initPath({
        'name': '编辑管理员',
        'url': '../../..' + window.location.pathname + '#/authorizeMng_editAdmin/' + $scope.param,
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

      $scope.queryResult = {};
      $scope.formResult = {
        manageShops: [],
      };
      $scope.valiResult = {
        nameError: false,
        phoneError: false,
        shopsError: false,
      };

      $scope.dropdownSel = {
        keyword: '',
        chsnList: [],
        shopIDList: [],
        searchShops: function(cityVal, key) {
          var self = this;
          if (1) {
            $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopsByCity?cityID=' + cityVal.id +
                '&pageSize=100&curPage=1&sortType=0&orderColumn=id&key=' + key)
              .success(function(ret) {
                //如果一个数据都没有
                console.log(ret.data.data);
                if (ret.success) {
                  if (ret.data.data.length === 0) {
                    self.shopList = [];
                  } else {
                    ret.data.data.unshift({
                      name: '全选',
                      id: 'selall'
                    });
                    self.shopList = ret.data.data;
                  }
                }
              }).error(function(msg) {
                console.log("Fail! " + msg);
              });
          }
        },
        addShops: function(shopID, shopName) {
          var self = this;
          var canAdd = true;
          var canAddAll = true;
          for (var i in self.chsnList) {
            if (self.chsnList[i].shopID == shopID || shopID == 'selall') {
              canAdd = false;
              break;
            }
          }
          if (shopID === 'selall') {
            var temp = self.shopList.slice(1);
            // console.log(temp);
            for (var k in temp) {
              for (var j in self.chsnList) {
                if (self.chsnList[j].shopID == temp[k].id) {
                  canAddAll = false;
                  break;
                } else {
                  canAddAll = true;
                }
              }
              if (canAddAll) {
                self.chsnList.push({
                  shopID: temp[k].id,
                  shopName: temp[k].name,
                });
                $scope.formResult.manageShops.push(temp[k].id);
              }
            }
            // console.log($scope.formResult);
            // console.log(self.chsnList);
          }
          if (canAdd) {
            self.chsnList.push({
              shopID: shopID,
              shopName: shopName,
            });
            $scope.formResult.manageShops.push(shopID);
          }
        },
        removeItem: function(shopID) {
          var self = this;
          for (var i in self.chsnList) {
            if (self.chsnList[i].shopID == shopID) {
              self.chsnList.splice(i, 1);
              $scope.formResult.manageShops.splice(i, 1);
              break;
            }
          }
        },
      };

      $scope.tblNormal = {
        togglePanel: function(linkID, collapseID) {
          // $('.collapse.in:not('+ collapseID +')').removeClass('in');
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
        getManagerCardsList: function(pageSize, curPage) {
          var self = this;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryMgrCardsBKMgr?managerID=' + $scope.param)
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.cardsList = ret.data;
                console.log(self.cardsList);
              }
            })
            .error(function(msg) {
              console.log('Fail! ' + msg);
            });
        },
        delCard: function(uid) {
          var self = this;
          $scope.modalBasic.header.content = '删除提示';
          $scope.modalBasic.body.content = '确认删除指定门禁卡吗？';
          $scope.modalBasic.footer.btn = [{
              styleList: ['btn', 'btn-cancel'],
            },
            {
              styleList: ['btn', 'btn-confirm'],
            }
          ];
          $scope.modalBasic.footer.btn[0].name = '取消';
          $scope.modalBasic.footer.btn[0].func = function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
          };
          $scope.modalBasic.footer.btn[1].name = '确认';
          $scope.modalBasic.footer.btn[1].func = function() {
            $("#myModal").off(); //先解绑所有事件
            $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/delCardBKMgr?uid=' + uid)
                .success(function(ret) {
                  $scope.modalBasic.header.content = '删除结果';
                  if (ret.success) {
                    $scope.modalBasic.body.content = '删除指定门禁卡 成功！';
                    $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }];
                    self.getManagerCardsList(10, 1);
                  } else {
                    $scope.modalBasic.body.content = '删除指定门禁卡 失败！' + ret.message;
                    $scope.modalBasic.footer.btn = [{
                      "name": '返回',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }];
                  }
                  $timeout(function() {
                    $("#myModal").modal({
                      show: true,
                      backdrop: 'static' //点击周围区域时不会隐藏模态框
                    });
                  }, 100);
                })
                .error(function(msg) {});
            });
          };
          $timeout(function() {
            $("#myModal").modal({
              show: true,
              backdrop: 'static' //点击周围区域时不会隐藏模态框
            });
          }, 1);
        },
        cardsList: []
      };

      $scope.tblDetails = {
        getCityList: function() {
          var self = this;
          var deferred = $q.defer();
          var promise = deferred.promise;
          // Get cities list
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.cityList = ret.data.data;
                deferred.resolve(true);
              }
            }).error(function(msg) {
              console.log("Fail! Messgae is: " + msg);
            });
          return promise;
        },
        getShopList: function() {
          var self = this;
          var deferred = $q.defer();
          var promise = deferred.promise;
          // Get shops list
          if (!self.cityVal) {
            self.cityVal.id = '';
          }
          $http.get('http://' + $rootScope.globalURL.hostURL +
              '/api/getShopsByCity?cityID=' + self.cityVal.id +
              '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
            .success(function(ret) {
              console.log(ret);
              if (ret.success) {
                self.shopList = ret.data.data;
                ret.data.data.unshift({
                  name: '全选',
                  id: 'selall'
                });
                $scope.dropdownSel.shopList = ret.data.data;
                deferred.resolve(true);
              }
            }).error(function(msg) {
              console.log("Fail! Messgae is: " + msg);
            });
          return promise;
        },
        getRolesList: $scope.getRolesList,
        getManagerDetails: function() {
          var self = this;
          var deferred = $q.defer();
          var promise = deferred.promise;
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getMgrShopsFromAdmin?managerID=' + $scope.param)
            .success(function(ret) {
              if (ret.success) {
                $scope.queryResult = ret.data;
                $scope.formResult = {
                  name: ret.data.managerName,
                  phone: ret.data.managerPhone,
                  cityID: ret.data.cityID,
                  roleID: ret.data.roleID,
                  manageShops: [],
                };
                self.cityVal = defaultOptFilterFilter(ret.data.cityID, self.cityList);
                self.roleTypeVal = defaultOptFilterFilter(ret.data.roleID, self.roleTypeList);
                for (var i in ret.data.managerShops) {
                  $scope.formResult.manageShops.push(ret.data.managerShops[i].shopID);
                }
                $scope.dropdownSel.chsnList = ret.data.managerShops;
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
        cityValChanged: function() {
          if (!this.cityVal) {
            this.cityVal = {
              id: ''
            };
          }
          $scope.formResult.cityID = this.cityVal.id;
          this.getShopList();
        },
        roleTypeValChanged: function() {
          if (!this.roleTypeVal) {
            this.roleTypeVal = {
              id: ''
            };
          }
          $scope.formResult.roleID = this.roleTypeVal.id;
        },
        valiForm: function() {
          var chkUtil = new CheckSer.CheckUtil();
          chkUtil
            .init({ /* 载入公共配置 */
              valiResult: $scope.valiResult, // 存储各项校验结果的对象
            })
            .chkName($scope.formResult.name, {
              errorName: 'nameError'
            })
            .chkPhone($scope.formResult.phone, {
              errorName: 'phoneError'
            })
            .chkNotEmpty($scope.formResult.cityID, {
              errorName: 'cityIDError'
            })
            .chkNotEmpty($scope.formResult.roleID, {
              errorName: 'roleIDError'
            });
          return chkUtil.result;
        },
        save: function() {
          var self = this;
          if (self.valiForm()) {
            var result = {
              managerID: $scope.param,
              name: $scope.formResult.name,
              phone: $scope.formResult.phone,
              cityID: $scope.formResult.cityID,
              roleID: $scope.formResult.roleID,
              manageShops: (function() {
                return ($scope.formResult.manageShops.join(','));
              })()
            };
            var data = $.param(result);
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateManager', data)
              .success(function(ret) {
                console.log(ret);
                $scope.modalBasic.header.content = "结果提示";
                if (ret.success) {
                  $scope.modalBasic.body.content = "修改成功！";
                  $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }];
                } else {
                  $scope.modalBasic.body.content = "修改失败！" + ret.message;
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
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {
                console.log("Fail! " + msg);
              });
          }
        },
        cancel: function() {
          window.history.go(-1);
        },
        cityVal: {
          id: ''
        },
      };
      console.log($scope.tblDetails.cityVal);
      $q.all([$scope.tblDetails.getCityList(), $scope.tblDetails.getRolesList()])
        .then(function(retBuff) {
          var result = true;
          for (var i = 0; i < retBuff.length; i++) {
            result = result && retBuff[i];
          }
          if (result) {
            ($scope.tblDetails.getManagerDetails()).then(function(res) {
              if (res) {
                console.log($scope.tblDetails);
                $scope.dropdownSel.searchShops($scope.tblDetails.cityVal, '');
              }
            });
          }
        });
      $scope.tblNormal.getManagerCardsList(10, 1);
    }
  ])
  .controller('authorizeMngShopPwd_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', 'itemNumList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $q, itemNumList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '门店密码',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_shopPwd'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      getCityList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
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
      cityValChanged: function() {
        var self = this;
        //Get intentClientList
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        $scope.tblNormal.getShopPwdList(self.itemNumVal.id, 1, self.cityVal.id, '');
      },
      itemNumValChanged: function() {
        var self = this;
        //Get intentClientList
        $scope.tblNormal.getShopPwdList(self.itemNumVal.id, 1, self.cityVal.id, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        //Get intentClientList
        $scope.tblNormal.getShopPwdList(self.itemNumVal.id, 1, self.cityVal.id, self.searchVal);
      },
      itemNumList: itemNumList,
      cityVal: {
        id: ''
      },
      itemNumVal: "",
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];

    $scope.tblNormal = {
      getShopPwdList: function(pageSize, curPage, cityID, key) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryShopPwds?' +
            'pageSize=' + pageSize + '&curPage=' + curPage +
            '&cityID=' + cityID + '&shopName=' + key)
          .success(function(ret) {
            if (ret.success) {
              var data = ret.data.data;
              $scope.tblNormal.dataList = data;
              $scope.tblPagination.initPagination(ret);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      delShopPwd: function(id, shopName) {
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确定删除："' + shopName + '"  的门禁密码吗？';
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
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteShopPwd?shopID=' + id)
                .success(function(ret) {
                  if (ret.success) {
                    self.getShopPwdList($scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.cityVal.id, $scope.tblToolbar.searchVal);
                  }
                }).error(function(msg) {
                  console.log("Fail");
                  console.log(msg);
                });
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
      $scope.tblNormal.getShopPwdList(self.pageSize, pageNum, tblToolbar.cityVal.id, tblToolbar.searchVal);
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

    $q.all([$scope.tblToolbar.getCityList()])
      .then(function(flagBuf) {
        var flag = true;
        for (var i in flagBuf) {
          flag &= flagBuf[i];
        }
        if (flag) {
          if (RememberSer.restore($scope)) {
            $scope.tblNormal.getShopPwdList($scope.tblToolbar.itemNumVal.id,
              $scope.tblPagination.curPage, $scope.tblToolbar.cityVal.id, $scope.tblToolbar.searchVal);
          } else {
            $scope.tblNormal.getShopPwdList($scope.tblToolbar.itemNumVal.id, 1, '', '');
          }
        }
      });
  }])
  .controller('authorizeMngAddShopPwd_ctrl', ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    $scope.title = {
      id: 'addShopPwd',
      name: '新增门店密码'
    };
    $rootScope.globalPath.initPath({
      'name': '新增门店密码',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_addShopPwd'
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

    $scope.formResult = {};
    $scope.valiResult = {
      shopIDError: false,
      pwdError: false,
    };

    $scope.tblDetails = {
      getCityList: function() {
        var self = this;
        // Get cities list
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getCities?pageSize=100&curPage=1&sortType=0&orderColumn=id')
          .success(function(ret) {
            console.log(ret);
            self.cityList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      getShopList: function() {
        var self = this;
        // Get shops list
        if (!self.cityVal) {
          self.cityVal.id = '';
        }
        $http.get('http://' + $rootScope.globalURL.hostURL +
            '/api/getShopsByCity?cityID=' + self.cityVal.id +
            '&pageSize=100&curPage=1&sortType=1&orderColumn=openDate')
          .success(function(ret) {
            console.log(ret);
            self.shopList = ret.data.data;
            $scope.dropdownSel.shopList = ret.data.data;
          }).error(function(msg) {
            console.log("Fail! Messgae is: " + msg);
          });
      },
      cityValChanged: function() {
        var self = this;
        //Get shopList
        //Get intentClientList
        if (!self.cityVal) {
          self.cityVal = {
            id: ''
          };
        }
        self.getShopList();
      },
      valiForm: function() {
        var self = this;
        var regPwd = /^[0-9]{6}$/;
        var canSave = true;
        if (!$scope.formResult.shopID) {
          $scope.valiResult.shopIDError = true;
          canSave = false;
        } else {
          $scope.valiResult.shopIDError = false;
          canSave &= true;
        }
        if (!regPwd.test($scope.formResult.password)) {
          $scope.valiResult.pwdError = true;
          canSave = false;
        } else {
          $scope.valiResult.pwdError = false;
          canSave &= true;
        }
        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addShopPwd', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "新增成功！";
                $scope.modalBasic.footer.btn = [{
                  "name": '完成',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.history.go(-1);
                    });
                  }
                }];
              } else {
                $scope.modalBasic.body.content = "新增失败！" + ret.message;
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
                    "name": '重新添加',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail");
              console.log(msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityVal: {
        id: ''
      },
    };
    $scope.tblDetails.getCityList();

    $scope.dropdownSel = {
      keyword: '',
      chsnList: [],
      searchShops: function(cityID, key) {
        var self = this;
        console.log(cityID, key);
        if (1) {
          $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopsByCity?cityID=' + cityID.id +
              '&pageSize=100&curPage=1&sortType=0&orderColumn=id&key=' + key)
            .success(function(ret) {
              //如果一个数据都没有
              console.log(ret.data);
              if (ret.success) {
                if (ret.data.data.length === 0) {
                  self.shopList = [];
                } else {
                  self.shopList = ret.data.data;
                }
              }
            }).error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      addShops: function(shopID, shopName) {
        var self = this;
        if (self.chsnList.length < 1) {
          self.chsnList.push({
            shopID: shopID,
            shopName: shopName,
          });
          $scope.formResult.shopID = shopID;
        }
      },
      removeItem: function(shopID) {
        var self = this;
        if (self.chsnList[0].id == shopID) {
          self.chsnList = [];
        }
      },
    };
  }])
  .controller('authorizeMngEditShopPwd_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', function($scope, $rootScope, $routeParams, $http, $timeout) {
    $scope.param = $routeParams.param;
    $scope.title = {
      id: 'editShopPwd',
      name: '编辑门店密码'
    };
    $rootScope.globalPath.initPath({
      'name': '编辑门店密码',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_editShopPwd/' + $scope.param
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

    $scope.formResult = {};
    $scope.queryResult = {};
    $scope.valiResult = {
      shopIDError: false,
      pwdError: false,
    };

    $scope.tblDetails = {
      getShopPwdDetails: function() {
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/getShopPwd?shopID=' + $scope.param)
          .success(function(ret) {
            $scope.queryResult = ret.data;
            $scope.formResult = {
              shopID: ret.data.id,
              password: ret.data.password,
            };
          })
          .error(function(msg) {
            console.log("Fail! " + msg);
          });
      },
      valiForm: function() {
        var self = this;
        var regPwd = /^[0-9]{6}$/;
        var canSave = true;
        if (!regPwd.test($scope.formResult.password)) {
          $scope.valiResult.pwdError = true;
          canSave = false;
        } else {
          $scope.valiResult.pwdError = false;
          canSave &= true;
        }
        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          var data = $.param($scope.formResult);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateShopPwd', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "修改成功！";
                $scope.modalBasic.footer.btn = [{
                  "name": '完成',
                  "styleList": ['btn', 'btn-confirm'],
                  'func': function() {
                    $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                      window.history.go(-1);
                    });
                  }
                }];
              } else {
                $scope.modalBasic.body.content = "修改失败！" + ret.message;
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
                    "name": '重新编辑',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityVal: {
        id: ''
      },
    };
    $scope.tblDetails.getShopPwdDetails();
  }])
  .controller('authorizeMngAddCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function($scope, $rootScope, $http, $timeout, $routeParams) {
    $scope.title = "新增门禁卡";
    $scope.viewTag = 'ADD';
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '新增门禁卡',
      'url': '../../..' + window.location.pathname + '#/clientMng_addCard/' + $scope.param
    }, 'LV2');
    $scope.tblDetails = {
      showDatepickerEnd: function() {
        laydate({
          elem: '#endDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          isclear: false,
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
            $scope.formResult.overDueDate = datas;
          },
        });
      },
      validateForm: function() {
        var canSubmit = true;
        var regID = /^([0-9]|[a-zA-Z]){1,}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        //
        if (!$scope.formResult.uid || !regID.test($scope.formResult.uid)) {
          $scope.valiResult.uidError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.uidError = false;
          canSubmit = canSubmit && true;
        }
        //
        if (!regDate.test($scope.formResult.overDueDate)) {
          $scope.valiResult.overDueDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.overDueDateError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.managerID = $scope.param;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '新增门禁卡提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/permMgrLockBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '为管理员新增门禁卡 成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '继续新增',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(0);
                        });
                      }
                    }
                  ];
                } else {
                  var errorMsg = (ret.message.indexOf('empty') !== -1) ? '该管理员未授权门店或门店无门禁设备' : ret.message;
                  $scope.modalBasic.body.content = '为管理员新增门禁卡 失败！' + errorMsg;
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
                      "name": '重新添加',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {
                console.log('Fail! ' + msg);
              });

          }
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cityVal: {
        name: '-请选择-',
        id: ''
      },
      shopVal: {
        name: '-请选择-',
        id: ''
      },
      deviceVal: {
        name: '-请选择-',
        id: ''
      },
    };
    $scope.formResult = {};
    $scope.modalBasic = {
      header: {
        content: ''
      },
      body: {
        content: ''
      },
      footer: {
        btn: []
      }
    };
    $scope.valiResult = {
      cityError: false,
      shopError: false,
      cardIDError: false,
      overDueDateError: false,
    };
  }])
  .controller('authorizeMngEditCard_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$routeParams', function($scope, $rootScope, $http, $timeout, $routeParams) {
    $scope.title = "编辑门禁卡";
    $scope.viewTag = 'EDIT';
    $scope.param = $routeParams.param;
    $rootScope.globalPath.initPath({
      'name': '编辑门禁卡',
      'url': '../../..' + window.location.pathname + '#/clientMng_addCard/' + $scope.param
    }, 'LV2');
    $scope.tblDetails = {
      getCardDetails: function(id) {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryCardDetailBKMgr?cdID=' + id + '&userType=2') //1--客户；2--管理员
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              $scope.queryResult.uid = ret.data.uid;
              $scope.formResult.overDueDate = ret.data.overDueDate;
            }
          })
          .error(function(msg) {
            console.log('Fail! ' + msg);
          });
      },
      showDatepickerEnd: function() {
        laydate({
          elem: '#endDate',
          format: 'YYYY-MM-DD', // 分隔符可以任意定义，该例子表示只显示年月
          isclear: false,
          istime: false,
          istoday: true,
          choose: function(datas) { //选择日期完毕的回调
            $scope.formResult.overDueDate = datas;
          },
        });
      },
      validateForm: function() {
        var canSubmit = true;
        var regID = /^([0-9]|[a-zA-Z]){1,}$/;
        var regDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        //
        if (!regDate.test($scope.formResult.overDueDate)) {
          $scope.valiResult.overDueDateError = true;
          canSubmit = false;
        } else {
          $scope.valiResult.overDueDateError = false;
          canSubmit = canSubmit && true;
        }
        return canSubmit;
      },
      save: function() {
        var self = this;
        if (self.validateForm()) {
          $scope.formResult.id = $scope.param;
          var data = $.param($scope.formResult);
          console.log(data);
          $scope.modalBasic.header.content = '更新门禁卡提示';
          if (1) {
            $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateCardByIDBKMgr', data)
              .success(function(ret) {
                console.log(ret);
                if (ret.success) {
                  $scope.modalBasic.body.content = '更新门禁卡 成功！';
                  $scope.modalBasic.footer.btn = [{
                      "name": '完成',
                      "styleList": ['btn', 'btn-cancel'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                          window.history.go(-1);
                        });
                      }
                    },
                    {
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                } else {
                  $scope.modalBasic.body.content = '更新门禁卡 失败！' + ret.message;
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
                      "name": '重新编辑',
                      "styleList": ['btn', 'btn-confirm'],
                      'func': function() {
                        $("#myModal").off(); //先解绑所有事件
                        $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                      }
                    }
                  ];
                }
                $timeout(function() {
                  $("#myModal").modal({
                    show: true,
                    backdrop: 'static' //点击周围区域时不会隐藏模态框
                  });
                }, 0);
              })
              .error(function(msg) {
                console.log('Fail! ' + msg);
              });

          }
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      cardsList: [],
    };
    $scope.formResult = {};
    $scope.queryResult = {};
    $scope.modalBasic = {
      header: {
        content: ''
      },
      body: {
        content: ''
      },
      footer: {
        btn: []
      }
    };
    $scope.valiResult = {
      cityError: false,
      shopError: false,
      cardIDError: false,
      overDueDateError: false,
    };

    $scope.tblDetails.getCardDetails($scope.param);
  }])
  .controller('authorizeMngAdmins_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', 'itemNumList', 'RememberSer', 'TblPagination', function($scope, $rootScope, $http, $timeout, $q, itemNumList, RememberSer, TblPagination) {
    $rootScope.globalPath.initPath({
      'name': '后台管理员',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_admins'
    }, 'LV1');
    $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {
      getRolesList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRolesBKMgr')
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data);
              self.roleTypeList = ret.data.map(function(item) {
                item.id = item.roleID;
                item.name = item.roleName;
                return item;
              });
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Error! %s', msg);
          });
        return promise;
      },
      roleValChanged: function() {
        var self = this;
        if (!self.roleVal || !self.roleVal.id) {
          self.roleVal = {
            id: ''
          };
        }
        console.log(self);
        $scope.tblNormal.getAdminsList(self.itemNumVal.id, 1, self.roleVal.id, self.searchVal);
      },
      itemNumValChanged: function() {
        var self = this;
        $scope.tblNormal.getAdminsList(self.itemNumVal.id, 1, self.roleVal.id, self.searchVal);
      },
      launchSearch: function() {
        var self = this;
        $scope.tblNormal.getAdminsList(self.itemNumVal.id, 1, self.roleVal.id, self.searchVal);
      },
      itemNumList: itemNumList,
      roleTypeList: [],
      roleVal: {
        id: ''
      },
      itemNumVal: "",
      searchVal: "",
    };
    $scope.tblToolbar.itemNumVal = $scope.tblToolbar.itemNumList[1];
    $scope.tblToolbar.roleVal = {
      id: ''
    };

    $scope.tblNormal = {
      /* 删除管理员 */
      delAdmin: function(id, name) {
        console.log(id, name);
        /* ------------------------模拟数据-------------------------- *
        Mock.mock(/^(.*)?(deleteShopPwd)(.*)?$/, {
          data:{
          },
          message: '请求成功',
          success: true,
        });
        /*------------------------------------------------------------------*/
        var self = this;
        $scope.modalBasic.header.content = '删除提示';
        $scope.modalBasic.body.content = '确定删除管理员： ' + name + ' 吗？';
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
              $http.get('http://' + $rootScope.globalURL.hostURL + '/api/deleteAdminBKMgr?adminID=' + id)
                .success(function(ret) {
                  if (ret.success) {
                    self.getAdminsList($scope.tblToolbar.itemNumVal.id, 1, $scope.tblToolbar.roleVal.id, $scope.tblToolbar.searchVal);
                  }
                }).error(function(msg) {
                  console.log("Fail");
                  console.log(msg);
                });
              $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
            }
          }
        ];
        $("#myModal").modal({
          show: true,
          backdrop: 'static' //点击周围区域时不会隐藏模态框
        });
      },
      /* 获取后台管理员列表 */
      getAdminsList: function(pageSize, curPage, roleID, key) {
        var self = this;
        /* ------------------------模拟数据-------------------------- *
        Mock.Random.extend({
          role: function(arg){
            var roles = ['BD', '销售', '财务', 'IT', '营销', '工程'];
            return this.pick(roles);
          }
        });
        Mock.Random.role();
        Mock.mock(/^.*(queryAdminBKMgr).*$/, {
          data:{
            curPage: curPage,
            pageSize: pageSize,
            totalPage: 5,
            'data|10': [{
              'id|+1': 1,
              'name': '@cname',
              'pwd': /([0-9]|[a-z]|[A-Z]){6}/,
              'role': '@role'
            }]
          },
          message: '请求成功',
          success: true,
        });
        /*------------------------------------------------------------------*/

        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryAdminBKMgr?' +
            'pageSize=' + pageSize + '&curPage=' + curPage +
            '&roleID=' + roleID + '&key=' + (key ? key : ''))
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var data = ret.data.data;
              $scope.tblNormal.dataList = data;
              $scope.tblPagination.initPagination(ret);
              // console.log($scope.tblNormal.dataList);
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      /* 保存管理员信息，以备跳转编辑时使用 */
      recordItem: function(item) {
        window.sessionStorage.setItem('authorizeMngAdmins_ctrl', JSON.stringify(item));
        console.log(window.sessionStorage.getItem('authorizeMngAdmins_ctrl'));
      },
    };
    $scope.tblNormal.getAdminsList(10, 1, '', '');

    $scope.tblPagination = new TblPagination();
    $scope.tblPagination.hookAfterChangePage = function(pageNum) {
      var self = this;
      var tblToolbar = $scope.tblToolbar;
      $scope.tblNormal.getAdminsList(self.pageSize, pageNum, tblToolbar.roleVal.id, tblToolbar.searchVal);
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

    ($scope.tblToolbar.getRolesList()).then(function(success) {
      if (success) {
        var toolbar = $scope.tblToolbar;
        if (RememberSer.restore($scope)) {
          $scope.tblNormal.getAdminsList(toolbar.itemNumVal.id, $scope.tblPagination.curPage, toolbar.roleVal.id, toolbar.searchVal);
        } else {
          $scope.tblNormal.getAdminsList(10, 1, '', '');
        }
      }
    });
  }])
  .controller('authorizeMngAdminsAdd_ctrl', ['$scope', '$rootScope', '$routeParams', '$q', '$http', '$timeout', function($scope, $rootScope, $routeParams, $q, $http, $timeout) {
    $rootScope.globalPath.initPath({
      'name': '添加后台管理员',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_adminsAdd'
    }, 'LV2');

    $scope.title = '添加后台管理员';

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
      remarks: '',
      name: '',
      password: '',
    };
    $scope.valiResult = {
      remarksError: false,
      nameError: false,
      pwdError: false,
    };

    $scope.tblDetails = {
      getRolesList: $scope.getRolesList,
      valiForm: function() {
        var self = this;
        // 开头和结尾不能有空字符，中间字符任意，这样一来字符个数要求>=2
        var regRemarks = /^(\S)+$/;
        var regName = /^(\S)+.*(\S)+$/;
        var regPwd = /^(\S)+.*(\S)+$/;
        var canSave = true;
        // 验证名字
        if (!$scope.formResult.remarks && !regName.test($scope.formResult.remarks)) {
          $scope.valiResult.remarksError = true;
          canSave = false;
        } else {
          $scope.valiResult.remarksError = false;
          canSave &= true;
        }
        // 验证名称
        if (!$scope.formResult.name && !regName.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSave = false;
        } else {
          $scope.valiResult.nameError = false;
          canSave &= true;
        }
        // 验证密码
        if (!$scope.formResult.password && !regPwd.test($scope.formResult.password)) {
          $scope.valiResult.pwdError = true;
          canSave = false;
        } else {
          $scope.valiResult.pwdError = false;
          canSave &= true;
        }
        // 验证角色 - 正式环境 正式运行时 才进行验证
        // if(!$scope.tblDetails.roleTypeVal || !$scope.tblDetails.roleTypeVal.id){
        //   $scope.valiResult.roleTypeError = true;
        //   canSave = false;
        // }else{
        //   $scope.valiResult.roleTypeError = false;
        //   canSave &= true;
        // }

        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          /* 配置模拟数据 *
          if(1){
            // 成功
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateMyPwd', {
              data: 'Modified Successfully!',
              message: '请求成功',
              success: true,
            });
          }else{
            // 失败
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateMyPwd', {
              data: 'Modified Failed!',
              message: '请求失败',
              success: false,
            });
          }
          /************************************************************************/

          $scope.formResult.roleID = this.roleTypeVal.id;
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addAdminBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "添加成功！";
                $scope.modalBasic.footer.btn = [{
                    "name": '继续添加',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  },
                  {
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }
                ];
              } else {
                $scope.modalBasic.body.content = "添加失败！" + ret.message;
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
                    "name": '重新添加',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      roleTypeVal: {
        id: ''
      },
      roleTypeList: [],
    };

    $scope.tblDetails.getRolesList();
  }])
  .controller('authorizeMngAdminsEdit_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', '$q', function($scope, $rootScope, $routeParams, $http, $timeout, $q) {
    $rootScope.globalPath.initPath({
      'name': '编辑后台管理员',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_adminsAdd/' + $routeParams.id
    }, 'LV2');

    $scope.title = '编辑后台管理员';

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
      remarks: '',
      name: '',
      adminID: $routeParams.id,
    };
    $scope.valiResult = {
      remarksError: false,
      nameError: false,
      pwdError: false,
    };

    $scope.tblDetails = {
      getRolesList: function() {
        var self = this;
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRolesBKMgr')
          .success(function(ret) {
            if (ret.success) {
              console.log(ret.data);
              self.roleTypeList = ret.data.map(function(item) {
                item.id = item.roleID;
                item.name = item.roleName;
                return item;
              });
              deferred.resolve(true);
            } else {
              deferred.resolve(false);
            }
          })
          .error(function(msg) {
            console.log('Error! %s', msg);
          });
        return promise;
      },
      valiForm: function() {
        var self = this;
        // 开头和结尾不能有空字符，中间字符任意，这样一来字符个数要求>=2
        var regRemarks = /^(\S)+$/;
        var regName = /^(\S)+.*(\S)+$/;
        var regPwd = /^(\S)+.*(\S)+$/;
        var canSave = true;
        if (!$scope.formResult.remarks && !regName.test($scope.formResult.remarks)) {
          $scope.valiResult.remarksError = true;
          canSave = false;
        } else {
          $scope.valiResult.remarksError = false;
          canSave &= true;
        }
        // 验证名称
        if (!$scope.formResult.name && !regName.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSave = false;
        } else {
          $scope.valiResult.nameError = false;
          canSave &= true;
        }

        // 因为这里不能修改密码，所以此处不再验证密码
        // if(!$scope.formResult.pwd && !regPwd.test($scope.formResult.pwd)){
        //   $scope.valiResult.pwdError = true;
        //   canSave = false;
        // }else{
        //   $scope.valiResult.pwdError = false;
        //   canSave &= true;
        // }

        // 验证角色
        if (!$scope.tblDetails.roleTypeVal || !$scope.tblDetails.roleTypeVal.id) {
          $scope.valiResult.roleTypeError = true;
          canSave = false;
        } else {
          $scope.valiResult.roleTypeError = false;
          canSave &= true;
        }

        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          /* 配置模拟数据 *
          if(1){
            // 成功
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateAdminBKMgr', {
              data: 'Modified Successfully!',
              message: '请求成功',
              success: true,
            });
          }else{
            // 失败
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateAdminBKMgr', {
              data: 'Modified Failed!',
              message: '请求失败',
              success: false,
            });
          }
          /***********************************************************************/

          $scope.formResult.roleID = this.roleTypeVal.id;
          var data = $.param($scope.formResult);
          console.log(data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateAdminBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "编辑成功！";
                $scope.modalBasic.footer.btn = [{
                    "name": '继续编辑',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  },
                  {
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  }
                ];
              } else {
                $scope.modalBasic.body.content = "编辑失败！" + ret.message;
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
                    "name": '重新编辑',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      roleTypeVal: {
        id: ''
      },
      roleTypeList: [],
    };

    var adminObj = JSON.parse(window.sessionStorage.getItem('authorizeMngAdmins_ctrl'));
    $scope.formResult.name = adminObj.name;
    $scope.formResult.remarks = adminObj.remarks;
    console.log(adminObj);

    ($scope.tblDetails.getRolesList()).then(function(success) {
      if (success) {
        for (var i in $scope.tblDetails.roleTypeList)
          if ($scope.tblDetails.roleTypeList[i].id === adminObj.roleID) {
            $scope.tblDetails.roleTypeVal = $scope.tblDetails.roleTypeList[i];
            break;
          }
      }
    });
  }])
  .controller('authorizeMngRoles_ctrl', ['$scope', '$rootScope', '$http', '$timeout', '$q', 'itemNumList', 'RememberSer', 'TblPagination', 'roleTypeList', function($scope, $rootScope, $http, $timeout, $q, itemNumList, RememberSer, TblPagination, roleTypeList) {
    $rootScope.globalPath.initPath({
      'name': '角色管理',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_roles'
    }, 'LV1');
    /* 没有分页，自然也就不用保存页面状态了 */
    // $scope.pageType = 'REMPAGE';
    $scope.tblToolbar = {};

    $scope.tblNormal = {
      /* 获取角色列表 */
      getRolesList: function() {
        var self = this;
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRolesBKMgr')
          .success(function(ret) {
            console.log(ret);
            if (ret.success) {
              var data = ret.data;
              console.log(data);
              // console.log(data[6].modules[0].type);
              /* 根据返回的数据的type属性判断权限 */
              for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].modules.length; j++) {
                  if ((data[i].modules[j].type == 1) || (data[i].modules[j].type == null)) {
                    data[i].modules.splice(j, 1);
                    j--;
                  }
                }
              }
              $scope.tblNormal.dataList = data;
            }
          }).error(function(msg) {
            console.log("Fail");
            console.log(msg);
          });
      },
      /* 保存角色信息，以备跳转编辑时使用 */
      recordItem: function(item) {
        window.sessionStorage.setItem('authorizeMngRoles_ctrl', JSON.stringify(item));
      },
    };
    // $scope.tblNormal.getRolesList(10, 1, 1);
    $scope.tblNormal.getRolesList();

    $scope.modalBasic = {
      "header": {},
      "body": {
        "content": ''
      },
      "footer": {
        "btn": []
      }
    };

  }])
  .controller('authorizeMngRolesAdd_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'roleTypeList', 'bkgModuleList', function($scope, $rootScope, $routeParams, $http, $timeout, roleTypeList, bkgModuleList) {
    $rootScope.globalPath.initPath({
      'name': '添加角色',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_rolesAdd'
    }, 'LV2');
    $scope.title = '添加角色';

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
      name: '',
    };
    $scope.valiResult = {
      nameError: false,
      modulesError: false,
    };

    $scope.tblDetails = {
      valiForm: function() {
        var self = this;
        // 开头和结尾不能有空字符，中间字符任意，这样一来字符个数要求>=2
        var regName = /^(\S)+.*(\S)+$/;
        var canSave = true;
        // 验证角色名称
        if (!$scope.formResult.name && !regName.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSave = false;
        } else {
          $scope.valiResult.nameError = false;
          canSave &= true;
        }
        // 验证角色权限
        if ((self.getCheckedModules()).length === 0) {
          $scope.valiResult.modulesError = true;
          canSave = false;
        } else {
          $scope.valiResult.modulesError = false;
          canSave &= true;
        }

        return canSave;
      },
      save: function() {
        // console.log(this.getCheckedModules());
        var self = this;
        if (self.valiForm()) {
          /* 配置模拟数据
          if(1){
            // 成功
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/addRoleBKMgr', {
              data: 'Modified Successfully!',
              message: '请求成功',
              success: true,
            });
          }else{
            // 失败
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/addRoleBKMgr', {
              data: 'Modified Failed!',
              message: '请求失败',
              success: false,
            });
          }*/
          $scope.formResult.modules = (self.getCheckedModules()).join(',');
          var data = $.param($scope.formResult);
          console.log("data: %s", data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/addRoleBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                console.log(ret.success);
                $scope.modalBasic.body.content = "添加成功！";
                $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  },
                  {
                    "name": '继续添加',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  }
                ];
              } else {
                $scope.modalBasic.body.content = "添加失败！" + ret.message;
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
                    "name": '重新添加',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      bkgModuleList: (function() {
        return bkgModuleList.map(function(item) {
          item.checked = false;
          if (item.limit && item.limit.length > 0) {
            // 定义读写权限,默认值是false,表示没有读写权限
            item.limit.read = false;
            item.limit.write = false;
          }
          return item;
        })
      })(),
      checkModule: function(id) {
        console.log(this.bkgModuleList);
        for (var i in this.bkgModuleList) {
          if (!this.bkgModuleList[i].limit && this.bkgModuleList[i].id === id) {
            this.bkgModuleList[i].checked = !this.bkgModuleList[i].checked;
            // console.log(this.bkgModuleList[i]);
            return;
          }
        }
      },
      // 该方法针对存在可选读写操作项
      checkSubModule: function(item, id) {
        if (id === 1) {
          item.limit.read = !item.limit.read;
        } else if (id === 2) {
          item.limit.write = !item.limit.write;
        }

        if (item.limit.write || item.limit.read) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      },
      getCheckedModules: function() {
        var checkedArr = [];
        this.bkgModuleList.map(function(item) {
          var prama = '';
          if (item.checked) {
            if (!item.limit) {
              prama = item.id + '' + '2';
            } else {
              if (item.limit.read && !item.limit.write) {
                prama = item.id + '' + '2';
              } else if (!item.limit.read && item.limit.write) {
                prama = item.id + '' + '3';
              } else if (item.limit.read && item.limit.write) {
                prama = item.id + '' + '4';
              } else {
                prama = item.id + '' + '1';
              }
            }
          } else {
            prama = item.id + '' + '1';
          }
          checkedArr.push(prama);
        });
        console.log(checkedArr);
        return checkedArr;
      },
    };
  }])
  .controller('authorizeMngRolesEdit_ctrl', ['$scope', '$rootScope', '$routeParams', '$http', '$timeout', 'roleTypeList', 'bkgModuleList', function($scope, $rootScope, $routeParams, $http, $timeout, roleTypeList, bkgModuleList) {
    $rootScope.globalPath.initPath({
      'name': '编辑角色',
      'url': '../../..' + window.location.pathname + '#/authorizeMng_rolesEdit'
    }, 'LV2');
    $scope.title = '编辑角色';

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
      roleID: $routeParams.id,
      name: '',
    };
    $scope.valiResult = {
      nameError: false,
      modulesError: false,
    };

    $scope.tblDetails = {
      getRoleDetails: function() {
        var self = this;
        var roleItem = JSON.parse(window.sessionStorage.getItem('authorizeMngRoles_ctrl'));
        /* 不能删除记录，防止用户刷新 */
        // window.sessionStorage.removeItem('authorizeMngRoles_ctrl');
        $scope.formResult.name = roleItem.roleName;
        console.log($scope.formResult.roleID, $scope.formResult.name);
        /* 获取角色权限列表 - 正确版本 */
        $http.get('http://' + $rootScope.globalURL.hostURL + '/api/queryRoleModulesBKMgr?roleID=' + $scope.formResult.roleID)
          .success(function(ret) {
            // console.log(ret);
            if (ret.success) {
              console.log(ret.data);
              console.log(self.bkgModuleList);
              for (var i in ret.data) {
                for (var j in self.bkgModuleList) {
                  if (ret.data[i].moduleID === self.bkgModuleList[j].id) {
                    if (ret.data[i].type != 1) {
                      self.bkgModuleList[j].checked = true;
                      if (self.bkgModuleList[j].limit && (self.bkgModuleList[j].limit.length > 0)) {
                        if (ret.data[i].type == 2) {
                          self.bkgModuleList[j].limit.read = true;
                          self.bkgModuleList[j].limit.write = false;
                        } else if (ret.data[i].type == 3) {
                          self.bkgModuleList[j].limit.read = false;
                          self.bkgModuleList[j].limit.write = true;
                        } else {
                          self.bkgModuleList[j].limit.read = true;
                          self.bkgModuleList[j].limit.write = true;
                        }
                      }
                    } else {
                      self.bkgModuleList[j].checked = false;
                    }
                    // self.bkgModuleList[j].checked = !!(ret.data[i].isHave);
                    break;
                  }
                }
              }
            }
          })
          .error(function(msg) {
            console.log('Error! %s', msg);
          });
        /* 获取角色权限列表 - 错误版本 *
        for(var i in roleItem.modules){
          this.bkgModuleList = this.bkgModuleList.map(function(item){
            if(roleItem.modules[i].moduleID === item.id){
              item.checked = true;
            }
            return item;
          });
        }
        /*--------------------------------------------------------*/
      },
      valiForm: function() {
        var self = this;
        // 开头和结尾不能有空字符，中间字符任意，这样一来字符个数要求>=2
        var regName = /^(\S)+.*(\S)+$/;
        var canSave = true;
        // 验证角色名称
        if (!$scope.formResult.name && !regName.test($scope.formResult.name)) {
          $scope.valiResult.nameError = true;
          canSave = false;
        } else {
          $scope.valiResult.nameError = false;
          canSave &= true;
        }
        // 验证角色权限
        if ((self.getCheckedModules()).length === 0) {
          $scope.valiResult.modulesError = true;
          canSave = false;
        } else {
          $scope.valiResult.modulesError = false;
          canSave &= true;
        }

        return canSave;
      },
      save: function() {
        var self = this;
        if (self.valiForm()) {
          /* 配置模拟数据
          if(0){
            // 成功
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateRoleBKMgr', {
              data: 'Modified Successfully!',
              message: '请求成功',
              success: true,
            });
          }else{
            // 失败
            Mock.mock('http://'+$rootScope.globalURL.hostURL+'/api/updateRoleBKMgr', {
              data: 'Modified Failed!',
              message: '请求失败',
              success: false,
            });
          }*/

          $scope.formResult.modules = (self.getCheckedModules()).join(',');
          var data = $.param($scope.formResult);
          console.log("data: %s", data);
          $http.post('http://' + $rootScope.globalURL.hostURL + '/api/updateRoleBKMgr', data)
            .success(function(ret) {
              console.log(ret);
              $scope.modalBasic.header.content = "结果提示";
              if (ret.success) {
                $scope.modalBasic.body.content = "编辑成功！";
                $scope.modalBasic.footer.btn = [{
                    "name": '完成',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(-1);
                      });
                    }
                  },
                  {
                    "name": '继续编辑',
                    "styleList": ['btn', 'btn-cancel'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {
                        window.history.go(0);
                      });
                    }
                  }
                ];
              } else {
                $scope.modalBasic.body.content = "编辑失败！" + ret.message;
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
                    "name": '重新编辑',
                    "styleList": ['btn', 'btn-confirm'],
                    'func': function() {
                      $("#myModal").modal('hide').on('hidden.bs.modal', function(e) {});
                    }
                  }
                ];
              }
              $timeout(function() {
                $("#myModal").modal({
                  show: true,
                  backdrop: 'static' //点击周围区域时不会隐藏模态框
                });
              }, 0);
            })
            .error(function(msg) {
              console.log("Fail! " + msg);
            });
        }
      },
      cancel: function() {
        window.history.go(-1);
      },
      bkgModuleList: (function() {
        return bkgModuleList.map(function(item) {
          item.checked = false;
          // console.log(item);
          if (item.limit && item.limit.length > 0) {
            // 定义读写权限,默认值是false,表示没有读写权限
            item.limit.read = false;
            item.limit.write = false;
          }
          return item;
        })
      })(),
      // 权限筛选的方法
      // checkModule: function(id){
      //   for(var i in this.bkgModuleList){
      //     if(this.bkgModuleList[i].id === id){
      //       this.bkgModuleList[i].checked = !this.bkgModuleList[i].checked;
      //       console.log(this.bkgModuleList[i]);
      //       return ;
      //     }
      //   }
      // },
      checkModule: function(id) {
        console.log(this.bkgModuleList);
        for (var i in this.bkgModuleList) {
          if (!this.bkgModuleList[i].limit && this.bkgModuleList[i].id === id) {
            this.bkgModuleList[i].checked = !this.bkgModuleList[i].checked;
            // console.log(this.bkgModuleList[i]);
            return;
          }
        }
      },
      // 该方法针对存在可选读写操作项
      checkSubModule: function(item, id) {
        if (id === 1) {
          item.limit.read = !item.limit.read;
        } else if (id === 2) {
          item.limit.write = !item.limit.write;
        }

        if (item.limit.write || item.limit.read) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      },
      // 未添加权限筛选时存储权限的方法
      // getCheckedModules: function(){
      //   var checkedArr = [];
      //   this.bkgModuleList.map(function(item){
      //     if(item.checked){
      //       checkedArr.push(item.id);
      //     }
      //   });
      //   return checkedArr;
      // },
      getCheckedModules: function() {
        var checkedArr = [];
        this.bkgModuleList.map(function(item) {
          var prama = '';
          if (item.checked) {
            if (!item.limit) {
              prama = item.id + '' + '2';
            } else {
              if (item.limit.read && !item.limit.write) {
                prama = item.id + '' + '2';
              } else if (!item.limit.read && item.limit.write) {
                prama = item.id + '' + '3';
              } else if (item.limit.read && item.limit.write) {
                prama = item.id + '' + '4';
              } else {
                prama = item.id + '' + '1';
              }
            }
          } else {
            prama = item.id + '' + '1';
          }
          checkedArr.push(prama);
        });
        console.log(checkedArr);
        return checkedArr;
      },
    };

    $scope.tblDetails.getRoleDetails();
  }])
  .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    var getTimeStamp = function() {
      return Math.floor(Date.now() / 1000);
    };
    $routeProvider
      .when('/authorizeMng_index', {
        templateUrl: 'authorizeMng_index.html?t=' + getTimeStamp(),
        controller: 'authorizeMngIndex_ctrl'
      })
      .when('/authorizeMng_addAdmin', {
        templateUrl: 'authorizeMng_addAdmin.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAddAdmin_ctrl'
      })
      .when('/authorizeMng_editAdmin/:param', {
        templateUrl: 'authorizeMng_addAdmin.html?t=' + getTimeStamp(),
        controller: 'authorizeMngEditAdmin_ctrl'
      })
      .when('/authorizeMng_shopPwd', {
        templateUrl: 'authorizeMng_shopPwd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngShopPwd_ctrl'
      })
      .when('/authorizeMng_addShopPwd', {
        templateUrl: 'authorizeMng_addShopPwd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAddShopPwd_ctrl'
      })
      .when('/authorizeMng_editShopPwd/:param', {
        templateUrl: 'authorizeMng_addShopPwd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngEditShopPwd_ctrl'
      })
      .when('/authorizeMng_addCard/:param', {
        templateUrl: 'authorizeMng_addCard.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAddCard_ctrl'
      })
      .when('/authorizeMng_editCard/:param', {
        templateUrl: 'authorizeMng_addCard.html?t=' + getTimeStamp(),
        controller: 'authorizeMngEditCard_ctrl'
      })
      .when('/authorizeMng_admins', {
        templateUrl: 'authorizeMng_admins.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAdmins_ctrl'
      })
      .when('/authorizeMng_adminsAdd', {
        templateUrl: 'authorizeMng_adminsAdd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAdminsAdd_ctrl'
      })
      .when('/authorizeMng_adminsEdit/:id', {
        templateUrl: 'authorizeMng_adminsAdd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngAdminsEdit_ctrl'
      })
      .when('/authorizeMng_roles', {
        templateUrl: 'authorizeMng_roles.html?t=' + getTimeStamp(),
        controller: 'authorizeMngRoles_ctrl'
      })
      .when('/authorizeMng_rolesAdd', {
        templateUrl: 'authorizeMng_rolesAdd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngRolesAdd_ctrl'
      })
      .when('/authorizeMng_rolesEdit/:id', {
        templateUrl: 'authorizeMng_rolesAdd.html?t=' + getTimeStamp(),
        controller: 'authorizeMngRolesEdit_ctrl'
      })
      .otherwise({
        redirectTo: '/authorizeMng_index'
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
