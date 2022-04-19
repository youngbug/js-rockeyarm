# js-rockeyarm

English | [中文](./README.zh-CN.md)

## Intruduction

js-rockeyarm, it provides a simplistic Object Oriented interface for interacting with Feitian ROCKEY-ARM dongle.


|Hardware|Firmware|OS|Architecture|
|-|-|-|-|
|ROCKEY-ARM Standard|2.23|Windows 10|x64|
|ROCKEY-ARM Time|2.23|Windows 10|x64|

## Preparation

You need to install Node.js locally.

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

ret = dongle.Close()
console.log('Close ret:',ret)
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

//6 is length of seed bytes,'123456' is seed bytes.
ret = dongle.GenUniqueKey(6, '123456')
console.log('GenUniqueKey ret:',ret)
// you must remember the seed bytes. you will get a new admin PIN and a new product ID.
ret = dongle.Close()
console.log('Close ret:',ret)
```

### Example 3

Write and read user data zone.

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

//Offset:1  Length:8
ret = dongle.ReadData(1, 8)
console.log('ReadData ret:',ret)

//Offset:0 Bytes to write:'0102030405060708' Length of bytes to write:8
ret = dongle.WriteData(0, '0102030405060708', 8)
console.log('WriteData ret:',ret)

// you must remember the seed bytes. you will get a new admin PIN and a new product ID.
ret = dongle.Close()
console.log('Close ret:',ret)
```

Example 4

Get time from real time clock in ROCKEY-ARM dongle,and set time license.

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

//get UTC time from real time clock in dongle
ret = dongle.GetUTCTime()
console.log('GetUTCTime ret:',ret)

//var deadline = {type: 'hours', time: 3} //set reamain hours
//var deadline = {type: 'nolimit', time: 0} //do not limit time
var deadline = {type: 'timestamp', time: new Date(2024,0,1,0,0,0,0).getTime().toString(10)} //set expired time: 2024.1.1 0:0:0
ret = dongle.SetDeadline(deadline)
console.log(ret)

ret = dongle.GetDeadline()
console.log(ret)

ret = dongle.Close()
console.log('Close ret:',ret)
```

Example 5

Run internal executable file.You should download a execuable file to dongle.

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

//fileId: 0x0002  input data buffer:'000102', length of input data:32
//real length of input data buffer is less than length passed into，js-rockeyarm will pad zero.
ret = dongle.RunExeFile(2, '000102', 32)
console.log('RunExeFile ret:',ret)

ret = dongle.Close()
console.log('Close ret:',ret)
```

### Example 6

Generate RSA key pairs.Use RSA private key encrypt data,and user RSA public key decrypt cipher data.

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

ret = dongle.VerifyPIN(1, '0102030405060708')
console.log('VerifyPIN ret:',ret)

//RSA private key file ID:0x0003
ret = dongle.RsaGenPubPriKey(0x0003)
console.log('RsaGenPubPriKey ret:', ret)
var privateKey = ret.param.privateKey
var publicKey = ret.param.publicKey //Public key vendor should save as common data file.
console.log(publicKey, privateKey)

//RSA private key file ID: 0x0003, flag:0 - encrypt, plain text: '010203040506', length of plain text: 6
ret = dongle.RsaPri(3, 0, '010203040506', 6)
console.log('RsaPri ret:', ret)
var cipher = ret.param.result
var cipherLen = ret.param.len

//flag:1 - decrypt, public key data: publickey, cipher text: cipher, length of cipher text: cipherLen
ret = dongle.RsaPub(1, publicKey, cipher, cipherLen)
console.log('RsaPub ret:', ret)

ret = dongle.Close()
console.log('Close ret:',ret)
```