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

ret = dongle.EccGenPubPriKey(0x0004)
console.log('EccGenPubPriKey ret:', ret)
var eccPrivateKey = ret.param.privateKey
var eccPublicKey = ret.param.publicKey



ret = dongle.RsaGenPubPriKey(0x0003)
console.log('RsaGenPubPriKey ret:', ret)
var privateKey = ret.param.privateKey
var publicKey = ret.param.publicKey
//var privateKey =   '0004000001000100D3EABD92AB582984AADFE924162BD3D20C8666CCEAB77939852F3271285340545C2D04B1196DB96A94F5E6B4D25AB70C7AD5569CDCFEBE7A145D60629AC3A75E0B5DFCD724D70C1E4F264E9D22854DFC6122F333CC53361523664456AC44DEDD7F570E7680BDCF634976ADC99C55592E97168C0DC00BC9D9DBC13DD0A27852EB00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006C1677F8DE424A72EB80E7764B84B1369AC2D69E403DB2AC1EFD52BA1ABA53BE738156BA49E108488F8FD8CB73DB67300B5AD321912AB1D6AC9A6FF5FB403E15B00A2C249EB1490BEBF634C8A7830B3CD1FA420798E0DA66B4766E42812303A9ACF70DA57ED0B6E615843BB7B5C190390BEE35627B280B078FFCA93132D0D3290000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
//var publicKey =   '0004000001000100D3EABD92AB582984AADFE924162BD3D20C8666CCEAB77939852F3271285340545C2D04B1196DB96A94F5E6B4D25AB70C7AD5569CDCFEBE7A145D60629AC3A75E0B5DFCD724D70C1E4F264E9D22854DFC6122F333CC53361523664456AC44DEDD7F570E7680BDCF634976ADC99C55592E97168C0DC00BC9D9DBC13DD0A27852EB0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
console.log(publicKey, privateKey)

ret = dongle.RsaPri(3, 0, '010203040506', 6)
console.log('RsaPri ret:', ret)
var cipher = ret.param.result
var cipherLen = ret.param.len
//var cipher = '5FC025F6D22068B40A1E2C4D889583A3474651957009FACEE4FEC7E160972FE3BF26A3FC1591AF1EB249BC650B4C62C3872BF490F46F615D55EBACA5C92822687C14B9E1802001B0C12A1B5DBC4C2406F71F6A3239BFB632A3E91ED2F6531A751DDD357180A39B64EA64A2C4167C8BAB8E48C0646A2BB337B5687D1A545240A40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
//var cipherLen = 128

ret = dongle.RsaPub(1, publicKey, cipher, cipherLen)
console.log('RsaPub ret:', ret)

ret = dongle.WriteShareMemory('AAAABBBB')
console.log('WriteShareMemory ret:',ret)

ret = dongle.ReadShareMemory()
console.log('ReadShareMemory ret:', ret)

ret = dongle.ReadData(1, 8)
console.log('ReadData ret:',ret)

ret = dongle.WriteData(0, '0102030405060708', 8)
console.log('WriteData ret:',ret)

ret = dongle.GetUTCTime()
console.log('GetUTCTime ret:',ret)
//var deadline = {type: 'hours', time: 3} //??????????????????3??????
//var deadline = {type: 'nolimit', time: 0} //?????????????????????
var deadline = {type: 'timestamp', time: new Date(2024,0,1,0,0,0,0).getTime().toString(10)} //??????2024???1???1???0???0???0?????????
ret = dongle.SetDeadline(deadline)
console.log(ret)

ret = dongle.GetDeadline()
console.log(ret)

//ret = dongle.GenUniqueKey(6, '123456')
console.log('GenUniqueKey ret:',ret)

var fileAttr = {size: 100, readPriv: 1, writePriv: 1}
//ret = dongle.CreateFile(1, 1, fileAttr)
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


 