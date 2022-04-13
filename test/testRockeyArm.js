import  RockeyArm  from  '../src/index.js'

var dongle = new RockeyArm()
var ret
var i = 0
var item
var index = null
var pid = 'FFFFFFFF'
console.log('ROCKEY-ARM node.js api test')
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
console.log('Open ret:',ret)

ret = dongle.VerifyPIN(1, 'FFFFFFFFFFFFFFFF')
console.log('VerifyPIN ret:',ret)

var fileAttr = {size: 100, readPriv: 1, writePriv: 1}

ret = dongle.CreateFile(1, 1, fileAttr)
console.log('CreateFile ret:',ret)

//ret = dongle.ListFile(1,12)
//console.log('ListFile ret:',ret)

ret = dongle.DeleteFile(1, 1)
console.log('DeleteFile ret:',ret)

ret = dongle.RunExeFile(2, '0001020', 32)
console.log('RunExeFile ret:',ret)

ret = dongle.GenRandom(8)
console.log('GenRandom ret:',ret)

ret = dongle.ResetState()
console.log('ResetState ret:',ret)

ret = dongle.Close()
console.log('Close ret:',ret)


 