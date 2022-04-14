import { Library as ffi_Library } from 'ffi-napi'
import {stringToByte, bytesToString} from './convert.js'
import {rockeyInterface, ptrDongleInfo, ptrInt, ptrByte, ptrHandle, ptrUint, dataFileAttr} from './functions.js'

//
function genResult(retcode, info, msg, returnParam){
    return { errorCode: retcode, result: info, message: msg, param: returnParam }
}

function genDongleInfoItem(versionL, versionR, type, userId, hardwareIdL, hardwareIdR, productId, isMother, devType){
    var typeList = {0 : '标准时钟锁', 2 : '标准U盘锁', 255 : '标准版'} 
    var motherTypeList = {0 : '空锁', 1 : '母锁', 2 : '子锁'}
    var devTypeList = {0 : '人体学输入设备', 1 : '智能卡设备'}
    return {
        version: versionR.toString()+'.'+versionL.toString(),
        type: typeList[type],
        birthday: '',
        userId: userId.toString(16).toUpperCase(),
        hardwareId: hardwareIdR.toString(16).toUpperCase() + hardwareIdL.toString(16).toUpperCase(),
        productId: productId.toString(16).toUpperCase(),
        isMother: motherTypeList[isMother],
        devType: devTypeList[devType]
    }
}


function structToByteArray(struct){
    var i = 0
    var buffer = struct.ref()
    var byteArray = new ptrByte(buffer.length)
    for (i=0; i<buffer.length; i++){
        byteArray[i] = buffer[i]
    }
    return byteArray
}

function getByteFromByteArray(buffer){
    var i = 0
    var str = ''
    var s = ''
    for(i=0; i<buffer.length; i++){
        s = buffer[i].toString(16).toUpperCase()
        if (s.length === 1) { //转成16进制后补零
            s = '0' + s
        }
        str = str + s
    }
    return str
}

function getByteArrayFromString(str, flag){
    var i = 0
    var len
    var byte = stringToByte(str)
    if (flag === undefined) {
        len = byte.length
    } else {
        len = byte.length + 1
    }
    var byteArray = new ptrByte(len)
    byteArray[len-1] = 0
    for(i = 0;  i < len; i++){
        byteArray[i] = byte[i]
    }
    return byteArray
}

function getByteArrayFromBytes(bytes){
    var byteArray = new ptrByte(bytes.length)
    for(var i=0; i<bytes.length; i++){
        byteArray[i] = bytes[i]
    }
    return byteArray
}

function getFileAttr(fileType, fileAttr){
    var dataAttr = new dataFileAttr(1)
    if (fileType === 1) {
        dataAttr.m_Size = fileAttr.size
        dataAttr.m_Read_Priv = fileAttr.readPriv
        dataAttr.m_Write_Priv = fileAttr.writePriv
        return dataAttr
    }
}

var RockeyArm = /** @class */ (function(){  //-class start
    var ret = 0
    function RockeyArm(){
        this.productId = 'FFFFFFFF'
        this.handle = 0
        this.result = 0
        this.handle = null
        this.libFilePath = 'd:/mywork/youngbug/js-rockeyarm/lib/Dongle_d_x64.dll'
        //this.libFilePath = '/mnt/d/mywork/youngbug/js-rockeyarm/lib/libRockeyARM.so.0.3'
        this.libRockey = new ffi_Library(this.libFilePath, rockeyInterface)
    }

    RockeyArm.prototype.Enum = function(){
        var piCount = new ptrInt(1)
        ret = this.libRockey.Dongle_Enum(null, piCount)
        if(ret !== 0 || piCount[0] < 1){
            return genResult(ret, 'failed','Found 0 ROCKEY-ARM dongle.', null)
        }
      
        var DongleList = new ptrDongleInfo(piCount[0])
        ret = this.libRockey.Dongle_Enum(DongleList, piCount)
        if (ret !== 0) {
            return genResult(ret, 'failed','Found 0 ROCKEY-ARM dongle.', null)
        }
        var i
        var list = []
        var item
        for (i=0; i< piCount[0]; i++) {
            item = genDongleInfoItem(
                DongleList[i].m_VerL, 
                DongleList[i].m_VerR,
                DongleList[i].m_Type,
                DongleList[i].m_UserID,
                DongleList[i].m_HIDL,
                DongleList[i].m_HIDR,
                DongleList[i].m_PID,
                DongleList[i].m_IsMother,
                DongleList[i].m_DevType
            )
            list.push(JSON.stringify(item))
        }
        return genResult(ret, 'success','Enum ROCKEY-ARM.', list)
    }

    RockeyArm.prototype.Open = function(index){
        var pHandle = new ptrHandle(1)
        ret = this.libRockey.Dongle_Open(pHandle, index)
        if (ret !== 0) {
            return genResult(ret, 'failed','Open ROCKEY-ARM dongle.', null)
        }
        this.handle = pHandle[0]
        return genResult(ret, 'success','Open ROCKEY-ARM dongle.', null)
    }

    RockeyArm.prototype.ResetState = function() {
        ret = this.libRockey.Dongle_ResetState(this.handle)
        if(ret !== 0){
            return genResult(ret, 'failed', 'Reset state.', null)
        }
        return genResult(ret, 'success', 'Reset state.', null)
    }

    RockeyArm.prototype.Close = function(){
        ret = this.libRockey.Dongle_Close(this.handle)
        if(ret !== 0) {
            return genResult(ret, 'failed','Close ROCKEY-ARM dongle.', null)
        }
        this.handle = null
        return genResult(ret, 'success','Close ROCKEY-ARM', null)
    }

    RockeyArm.prototype.GenRandom = function(len) {
        var buffer = new ptrByte(len)
        ret = this.libRockey.Dongle_GenRandom(this.handle, len, buffer)
        if(ret !== 0) {
            return genResult(ret, 'failed','Generate random.', null)
        }
        return genResult(ret, 'success','Generate random', {random: getByteFromByteArray(buffer)})
    }

    RockeyArm.prototype.LEDControl = function(flag){
        ret = this.libRockey.Dongle_LEDControl(this.handle, flag)
        if(ret !== 0) {
            return genResult(ret, 'failed', 'Control LED', null)
        }
        return genResult(ret, 'success', 'Control LED', null)
    }

    RockeyArm.prototype.SwitchProtocol = function(flag){
        ret = this.libRockey.Dongle_SwitchProtocol(this.handle, flag)
        if(ret !== 0) {
            return genResult(ret, 'failed', 'Switch device transmit protocol', null)
        }
        return genResult(ret, 'success', 'Switch device transmit protocol', null)
    }

    RockeyArm.prototype.RFS = function(){
        ret = this.libRockey.Dongle_RFS(this.handle)
        if(ret !== 0) {
            return genResult(ret, 'failed', 'Restore factory setting', null)
        }
        return genResult(ret, 'success', 'Restore factory setting', null)
    }

    RockeyArm.prototype.CreateFile = function(fileType, fileId, fileAttr){
        var attr = getFileAttr(fileType, fileAttr)
        var bufAttr = structToByteArray(attr)
        ret = this.libRockey.Dongle_CreateFile(this.handle, fileType, fileId, bufAttr)
        if(ret !== 0) {
            return genResult(ret, 'failed','Create file.', null)
        }
        return genResult(ret, 'success','Create file', null)
    }

    RockeyArm.prototype.WriteFile = function (fileType, fileId, offset, inData, dataLen){
        var buffer = getByteArrayFromString(inData)
        ret = this.libRockey.Dongle_WriteFile(this.handle, fileType, fileId, offset, buffer, dataLen)
        if(ret !== 0) {
            return genResult(ret, 'failed','Write file.', null)
        }
        return genResult(ret, 'success','Write file', null)       
    }

    RockeyArm.prototype.ReadFile = function (fileId, offset, dataLen){
        var buffer = new ptrByte(dataLen)
        ret = this.libRockey.Dongle_ReadFile(this.handle, fileId,  offset, buffer, dataLen)
        if(ret !== 0) {
            return genResult(ret, 'failed','Read file.', null)
        }
        return genResult(ret, 'success','Read file', null)       
    }

    RockeyArm.prototype.DownloadExeFile = function () {
        
    }

    RockeyArm.prototype.RunExeFile = function (fileId, inBuffer, inOutLen) {
        var temp = inBuffer
        if (inOutLen * 2 > inBuffer.length ) {
            for(var i = inBuffer.length; i < inOutLen*2; i++){
                temp = temp + '0'
            } 
        }
        var buffer = getByteArrayFromString(temp)
        var mainRet = new ptrInt(1)
        ret = this.libRockey.Dongle_RunExeFile(this.handle, fileId, buffer, inOutLen, mainRet)
        if(ret !== 0) {
            return genResult(ret, 'failed','Run execute file.', null)
        }
        return genResult(ret, 'success','Run execute file', {retCode: mainRet[0], outBuffer: getByteFromByteArray(buffer)}) 
    }

    RockeyArm.prototype.DeleteFile = function (fileType, fileId) {
        var ret = this.libRockey.Dongle_DeleteFile(this.handle, fileType, fileId)
        if(ret !== 0) {
            return genResult(ret, 'failed','Delete file.', null)
        }
        return genResult(ret, 'success','Delete file', null) 
    }

    RockeyArm.prototype.ListFile = function (fileType, len) {
        //var dataFileListSize = 12
        var dataLen = new ptrInt(1)
        dataLen[0] = 1//小于等于0回报参数错误
        if (len === undefined) {
            ret = this.libRockey.Dongle_ListFile(this.handle, fileType, null, dataLen)
            if(ret !== 0) {
                return genResult(ret, 'failed','Enum file.', null)
            }
            return genResult(ret, 'success','Enum file', {dataLen: dataLen[0]}) 
        }
        dataLen[0] = len
        //var dataList = new ptrDataFileList(1)
        var dataList = new ptrByte(len)
        ret = this.libRockey.Dongle_ListFile(this.handle, fileType, dataList, dataLen)        
        if(ret !== 0) {
            return genResult(ret, 'failed','Enum file.', null)
        }
        return genResult(ret, 'success','Enum file', {dataLen: getByteFromByteArray(dataList)}) //这个地方应该解析一下返回的结构体成json
    }

    RockeyArm.prototype.GenUniqueKey = function (seedLen, seed) {
        var byteSeed = getByteArrayFromBytes(seed)
        var bytePid = new ptrByte(8)
        var byteAdminPin = new ptrByte(16)
        ret = this.libRockey.Dongle_GenUniqueKey(this.handle, seedLen, byteSeed, bytePid, byteAdminPin)
        if(ret !== 0) {
            return genResult(ret, 'failed','Generate unique key.', null)
        }
        return genResult(ret, 'success','Generate unique key', {productId: bytesToString(bytePid.buffer), adminPIN: bytesToString(byteAdminPin.buffer)})
    }

    RockeyArm.prototype.VerifyPIN = function(flag, Pin){
        var arrayPin = getByteArrayFromString(Pin, 'endmark')
        var remainCount = new ptrInt(1)
        ret = this.libRockey.Dongle_VerifyPIN(this.handle, flag, arrayPin, remainCount)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Verify PIN.', {retryTimes: remainCount[0]})
        }
        return  genResult(ret, 'success','Verify PIN.', {retryTimes: remainCount[0]})
    }

    RockeyArm.prototype.ChangePIN = function(flag, oldPin, newPin, tryCount){
        var byteOldPin = getByteArrayFromString(oldPin, 'endmark')
        var byteNewPin = getByteArrayFromString(newPin, 'endmark')
        ret = this.libRockey.Dongle_ChangePIN(this.handle, byteOldPin, byteNewPin, tryCount)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Change PIN.', null)
        }
        return  genResult(ret, 'success','Change PIN.', null)
    }

    RockeyArm.prototype.ResetUserPIN = function(adminPin) {
        var byteAdminPin = getByteArrayFromString(adminPin, 'endmark')
        ret = this.libRockey.Dongle_ResetUserPIN(this.handle, byteAdminPin)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Reset user PIN.', null)
        }
        return  genResult(ret, 'success','Reset user PIN.', null)
    }

    RockeyArm.prototype.SetUserID = function(userId) {
        ret = this.libRockey.Dongle_SetUserID(userId)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Set user ID.', null)
        }
        return  genResult(ret, 'success','Set user ID.', null)
    }

    RockeyArm.prototype.GetDeadline = function() {
        var intTime = new ptrUint(1)
        ret = this.libRockey.Dongle_GetDeadline(this.handle, intTime)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Get deadline.', null)
        }
        var strType = ''
        var strTime = ''
        if (intTime[0] === 0xFFFFFFFF) {
            strType = '不限制'
        } else if ((intTime[0] & 0xFFFF0000) === 0 ) {
            strType = '可用小时数'
            strTime = intTime[0].toString(10)
        } else {
            strType = '到期日期'
            var date = new Date(intTime[0] * 1000) 
            strTime = date.toUTCString()
        }
        return  genResult(ret, 'success','Get deadline.', {type: strType, deadline: strTime, rawTimestamp: intTime[0]})
    }

    RockeyArm.prototype.SetDeadline = function(deadline) {
        var intTime
        if (deadline.type === 'hours') {
            intTime = deadline.time
        } else if (deadline.type === 'timestamp'){
            intTime = deadline.time / 1000
        } else if (deadline.type === 'nolimit') {
            intTime = 0
        }
        ret = this.libRockey.Dongle_SetDeadline(this.handle, intTime)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Get deadline.', null)
        }
        return  genResult(ret, 'success','Get deadline.', null)
    }

    RockeyArm.prototype.GetUTCTime = function() {

    }

    RockeyArm.prototype.ReadData = function(offset, dataLen) {

    }

    RockeyArm.prototype.WriteData = function(offset, data, dataLen) {

    }

    RockeyArm.prototype.ReadShareMemory = function() {

    }

    RockeyArm.prototype.WriteShareMemory = function(data, dataLen) {

    }

    RockeyArm.prototype.RsaGenPubPriKey = function(priFileId) {

    }

    RockeyArm.prototype.RsaPri = function(priFileId, inData, inDataLen, outDataLen) {

    }

    RockeyArm.prototype.RsaPub = function(flag, pubKey, inData, inDataLen, outDataLen) {

    }

    RockeyArm.prototype.EccGenPubPriKey = function(priFileId) {

    }

    RockeyArm.prototype.EccSign = function(priFileId, hashData, hashDataLen) {

    }

    RockeyArm.prototype.EccVerify = function(pubKey, hashData, hashDataLen, sign) {

    }

    RockeyArm.prototype.SM2GenPubPriKey = function(priFileId) {

    }

    RockeyArm.prototype.SM2Sign = function(priFileId, hashData, hashDataLen) {

    }

    RockeyArm.prototype.SM2Verify = function(pubKey, hashData, hashDataLen, sign) {

    }

    RockeyArm.prototype.TDES = function(keyFileId, flag, inData, dataLen) {

    }

    RockeyArm.prototype.SM4 = function(keyFileId, flag, inData, dataLen) {

    }

    RockeyArm.prototype.HASH = function(flag, inData, dataLen) {

    }

    RockeyArm.prototype.Seed = function(seed, seedLen) {

    }

    RockeyArm.prototype.LimitSeedCount = function(count) {

    }

    RockeyArm.prototype.GenMotherKey = function(motherData) {

    }

    RockeyArm.prototype.RequestInit = function() {

    }

    RockeyArm.prototype.GetInitDataFromMother = function(request, dataLen) {

    }

    RockeyArm.prototype.InitSon = function(initData, dataLen) {

    }

    RockeyArm.prototype.SetUpdatePriKey = function(priKey) {

    }

    RockeyArm.prototype.MakeUpdatePacket = function(inData) {

    }

    RockeyArm.prototype.MakeUpdatePacketFromMother = function(inData) {

    }

    RockeyArm.prototype.Update = function(updateData, dataLen) {

    }

    return RockeyArm

}()) //-class end

export {RockeyArm}