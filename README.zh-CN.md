
# js-rockeyarm

[English](./README.md) | 中文]

## 简介

js-rockeyarm 实现了一个和飞天诚信ROCKEY-ARM加密锁通信的Node.js接口。

你可以通过js-rockeyarm提供的接口在你的Node.js项目里使用ROCKEY-ARM。

js-rockeyarm经过测试：

|硬件|固件|OS|架构|
|-|-|-|-|
|ROCKEY-ARM标准版|2.23|Windows 10|x64|
|ROCKEY-ARM时钟锁|2.23|Windows 10|x64|

## 准备工作

你需要有Node.js的开发环境。

你还需要从[飞天诚信](https://www.ftsafe.com.cn/)购买获得[ROCKEY-ARM](http://www.ftsafe.com.cn/products/rockey/ROCKEY-ARM)硬件和对应的SDK包。

js-rockeyarm依赖ROCKEY-ARM SDK包中的动态链接库。

|文件名|平台|架构|
|-|-|-|
|Dongle_d.dll|Windows|x64|
|libRockeyARM.so.0.3|Linux|x64|

## 安装

```shell
npm install js-rockeyarm
```

把ROCKEY-ARM SDK包中对应的动态链接库复制到**js-rockey/lib/x64**目录下。

## 文档

您可以从飞天诚信获得ROCKEY-ARM的用户手册。

## 示例



