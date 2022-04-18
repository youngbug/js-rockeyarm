# js-rockeyarm

English | [中文](./README.zh-CN.md)

## Intruduction

js-rockeyarm, it provides a simplistic Object Oriented interface for interacting with Feitian ROCKEY-ARM dongle.


|Hardware|Firmware|OS|Architecture|
|-|-|-|-|
|ROCKEY-ARM Standard|2.23|Windows 10|x64|
|ROCKEY-ARM Time|2.23|Windows 10|x64|

## Preparation

You need to install Node.js and git locally.

You also need to buy [ROCKEY-ARM](http://www.ftsafe.com.cn/products/rockey/ROCKEY-ARM) dongle hardware and it's SDK.

js-rockeyarm depends on dynamic link library in ROCKEY-ARM SDK.

|Filename|Platform|Arch|
|-|-|-|
|Dongle_d.dll|Windows|x64|
|libRockeyARM.so.0.3|Linux|x64|

## Installation

```shell
npm install js-rockeyarm
```

Copy the dynamic link library to the path **js-rockeyarm/lib/x64**.

## Documentation

User manual of ROCKEY-ARM,you can get it from Feitian.

## Examples

### Example 1

Enumerate a list of ROCKEY-ARM dongle,and find a dongle which product ID is 'FFFFFFFF'. If the dongle is exits,open the dongle.

``` javascript
import  RockeyArm  from  '../src/index.js'

var dongle = new RockeyArm()
var ret
var i = 0
var item
var index = null
var pid = 'FFFFFFFF'
console.log('ROCKEY-ARM node.js api test')
ret = dongle.Enum()
if(ret.param === null){
    console.log('failed')
}
for (i=0; i<ret.param.length; i++){
    item = JSON.parse(ret.param[i])
    if(item.productId === pid){
        index = i
        break
    }
}
if (index === null){
    console.log('Do not find ROCKEY-ARM Product ID:%s', pid)
}
ret = dongle.Open(index)
console.log('Open ret:',ret)
```

### Example 2

Initialize a new ROCKEY-ARM dongle.

``` javascript
import  RockeyArm  from  '../src/index.js'

var dongle = new RockeyArm()
var ret
var i = 0
var item
var index = null
var pid = 'FFFFFFFF'
console.log('ROCKEY-ARM node.js api test')
ret = dongle.Enum()
if(ret.param === null){
    console.log('failed')
}
for (i=0; i<ret.param.length; i++){
    item = JSON.parse(ret.param[i])
    if(item.productId === pid){
        index = i
        break
    }
}
if (index === null){
    console.log('Do not find ROCKEY-ARM Product ID:%s', pid)
}
ret = dongle.Open(index)
console.log('Open ret:',ret)

ret = dongle.VerifyPIN(1, 'FFFFFFFFFFFFFFFF')
console.log('VerifyPIN ret:',ret)

ret = dongle.GenUniqueKey(6, '123456')
console.log('GenUniqueKey ret:',ret)

```
