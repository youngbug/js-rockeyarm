
import { Library as ffi_Library } from 'ffi-napi'
import {rockeyInterface, dongleInfo, ptrDongleInfo, ptrInt} from './functions.js'

//
function genResult(retcode, info, returnParam){
  return { errorCode: retcode, result: info, param: returnParam }
}

var RockeyArm = /** @class */ (function(){  //-class start
    var ret = 0
    function RockeyArm(){
      this.productId = 'FFFFFFFF'
      this.handle = 0
      this.result = 0
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
      
      
    }

    RockeyArm.prototype.Open = function(){

    }

    RockeyArm.prototype.Close = function(){
      
    }

    return RockeyArm

}()) //-class end

export {RockeyArm}