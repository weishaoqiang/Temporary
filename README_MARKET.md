---
title: 万物仓后台管理系统 - 活动定价模块
date: 2017-07-07 00:03:37
categories:
- Website Backstage Management System
tags:
---

## 前言
组织好活动定价模块布局修改的思路

## 定价管理
### 自存仓定价
1. 将出租率浮动定价模块和优惠活动定价模块的列表整合到一起,思路如下：
  + 同一个控制器
  + 所有状态和状态数据头分别定义，避免混淆。
```
  城市数据:
  浮动定价->
  priceFexCityList（城市列表）、priceFexStateList（状态列表）、priceFexPagination（页码对象）
  优惠活动->
  miniCityList（城市列表）、
  miniStateList（状态列表）、
  miniPagination（页码对象）
```
2. 上门搬存定价
  +标准展示单价列表和上门搬存列表放到一起，放在同一个控制器内。
3. 添加数据分析项,可以根据时间段，业务类型，城市来筛选活动
  + 合计：统计新增订单和销售收入
