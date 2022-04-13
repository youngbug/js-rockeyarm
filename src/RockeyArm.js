import { Library as ffi_Library } from 'ffi-napi'
import {rockeyInterface, ptrDongleInfo, ptrInt, ptrByte, ptrHandle, ptrVoid, dataFileAttr} from './functions.js'

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

function stringToByte(str) {
    var bytes = new Array()
    var len, c
    len = str.length
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0)
            bytes.push(((c >> 12) & 0x3F) | 0x80)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0)
            bytes.push(((c >> 6) & 0x3F) | 0x80)
            bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0)
            bytes.push((c & 0x3F) | 0x80)
        } else {
            bytes.push(c & 0xFF)
        }
    }
    return bytes
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
    for(i=0; i<buffer.length; i++){
        str = str + buffer[i].toString(16).toUpperCase()
    }
    return str
}

function getByteArrayFromString(str){
    var i = 0
    var byte = stringToByte(str)
    var byteArray = new ptrByte(byte.length)
    for(i = 0;  i < byte.length; i++){
        byteArray[i] = byte[i]
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

    RockeyArm.prototype.LEDControl=function(){
        return 1
    }

    RockeyArm.prototype.SwitchProtocol = function(flag){
        return flag
    }

    RockeyArm.prototype.RFS = function(){
        return 1
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

    RockeyArm.prototype.VerifyPIN = function(flag, Pin){
        var arrayPin = getByteArrayFromString(Pin)
        var remainCount = new ptrInt(1)
        ret = this.libRockey.Dongle_VerifyPIN(this.handle, flag, arrayPin, remainCount)
        if (ret !== 0) {
            return  genResult(ret, 'failed','Verify PIN.', {retryTimes: remainCount[0]})
        }
        return  genResult(ret, 'success','Verify PIN.', {retryTimes: remainCount[0]})
    }

    return RockeyArm

}()) //-class end

export {RockeyArm}