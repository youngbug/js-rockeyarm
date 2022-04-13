import  RockeyArm  from  '../src/index.js'

var dongle = new RockeyArm()
var ret
var i = 0
var item
var index = null
var pid = 'FFFFFFFF'
ret = dongle.Enum()
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

ret = dongle.VerifyPIN(1, 'FFFFFFFFFFFFFFFF')

var fileAttr = {size: 100, readPriv: 1, writePriv: 1}

ret = dongle.CreateFile(1, 1, fileAttr)

ret = dongle.GenRandom(8)

ret = dongle.ResetState()

ret = dongle.Close()



 