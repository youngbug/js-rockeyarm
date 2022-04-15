import  RockeyArm  from  '../src/index.js'

var dongle = new RockeyArm()
var ret
var i = 0
var item
var index = null
var pid = 'A1AEB604'
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

ret = dongle.VerifyPIN(1, '6ABD0831AA9DB0C3')
console.log('VerifyPIN ret:',ret)

ret = dongle.WriteShareMemory('AAAABBBB')
console.log('WriteShareMemory ret:',ret)

ret = dongle.ReadShareMemory()
console.log('ReadShareMemory ret:', ret)

ret = dongle.RsaGenPubPriKey(0x0003)
console.log('RsaGenPubPriKey ret:', ret)

ret = dongle.ReadData(1, 8)
console.log('ReadData ret:',ret)

ret = dongle.WriteData(0, '0102030405060708', 8)
console.log('WriteData ret:',ret)

ret = dongle.GetUTCTime()
console.log(ret)
//var deadline = {type: 'hours', time: 3} //设置可用时间3小时
//var deadline = {type: 'nolimit', time: 0} //不限制使用时间
var deadline = {type: 'timestamp', time: new Date(2024,0,1,0,0,0,0).getTime().toString(10)} //设置2024年1月1日0时0分0秒到期
ret = dongle.SetDeadline(deadline)
console.log(ret)

ret = dongle.GetDeadline()
console.log(ret)

//ret = dongle.GenUniqueKey(6, '123456')
console.log('GenUniqueKey ret:',ret)

var fileAttr = {size: 100, readPriv: 1, writePriv: 1}
ret = dongle.CreateFile(1, 1, fileAttr)
console.log('CreateFile ret:',ret)

ret = dongle.ListFile(1,12)
console.log('ListFile ret:',ret)

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


 