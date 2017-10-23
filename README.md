---
title: 关于万物仓后台管理系统
date: 2016-09-02 11:33:00
categories:
- Website Backstage Management System
tags:
---

## 前言
这是万科万物仓的后台管理系统的说明文档

## 分支管理说明
### master
主分支，时刻可以打包发布并上线的分支，切忌在该分支上直接修改

### develop
开发分支，处于最新的开发状态
*Situation 1*
当需要开发的特性或功能比较少时，单用这个分支进行开发即可；
*Situation 2*
当需要开发的特性或功能比较度时，可以基于该分支创建N个特性/功能分支，例如：
> develop-A
> develop-B
> develop-C

*Situation 3*
aheaddev-b属于提前开发分支，需求提前开发可在当前分支进行开发，在没有确定需求之前，不与其他分支进行合并

当每一个特性/功能分支开发完毕后需要合并回 `develop` 分支


### hotfix
紧急修复分支，基于 `master` 分支
当 `master` 分支出现bug时，需要切换到该分支进行修复，完成后需要合并回 `master` 和 `develop` 分支

## 修改历史
### 2017-01-11
1. 修改登陆时候缓存的`adminID`为`vks-web-adminID`
涉及文件：
```
|-vksMng
|--src
|---index.ejs*
|---view
|----orderMng
|-----orderMng.js*
|----financeMng
|-----financeMng.js*
```

#### 2017-03-22
1. 添加车库智能柜管理需求，正在完成当中
  * 门店管理模块
    + 添加门店
      - 发送post请求时新增的字段后端还没有确定
      - 凡是智能柜门店添加完成后都不需要添加门禁，只需要在添加门店时添加设备SN码
    + 编辑门店
      - 发送post请求时新增的字段后端还没有确定
    + 查看门店
      - get请求回来数据中新增的字段后端还没有确定
