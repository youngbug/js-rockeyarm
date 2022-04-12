
import { version } from 'ffi-napi'
import { Library as ffi_Library } from 'ffi-napi'
import {rockeyInterface, dongleInfo, ptrDongleInfo, ptrInt} from './functions.js'

//
function genResult(retcode, info, returnParam){
  return { errorCode: retcode, result: info, param: returnParam }
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
        return genResult(ret, 'Found 0 ROCKEY-ARM dongle.', null)
      }
      
      var DongleList = new ptrDongleInfo(piCount[0])
      ret = this.libRockey.Dongle_Enum(DongleList, piCount)
      if (ret !== 0) {
        return genResult(ret, 'Found 0 ROCKEY-ARM dongle.', null)
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
      return genResult(ret, 'Success', list)
    }

    RockeyArm.prototype.Open = function(index){
      var pHandle = new ptrInt(1)
      ret = this.libRockey.Dongle_Open(pHandle, index)
      if (ret !== 0) {
        return genResult(ret, 'Open ROCKEY-ARM dongle failed.', null)
      }
      return genResult(ret, 'Success', null)
    }

    RockeyArm.prototype.Close = function(){
      
    }

    return RockeyArm

}()) //-class end

export {RockeyArm}