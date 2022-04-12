import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ref = require('ref-napi')
const refArray = require('ref-array-napi')
const StructType = require ('ref-struct-napi')
//define ROCKEY-ARM sturcts

var dongleInfo = StructType({
  m_Ver:      ref.types.ushort,
  m_Type:     ref.types.ushort,
  m_BirthdayL:ref.types.uint32,  //c里定义的是一个8字节数组，本来用一个uint64就可以了，但是没找到如何解决在js里按字节对齐的问题，所以把所有的8字节结构拆成左右两个4字节结构
  m_BirthdayR:ref.types.uint32,
  m_Agent:    ref.types.uint32,
  m_PID:      ref.types.uint32,
  m_UserID:   ref.types.uint32,
  m_HIDL:     ref.types.uint32,
  m_HIDR:     ref.types.uint32,
  m_IsMother: ref.types.uint32,
  m_DevType:  ref.types.uint32
})

var ptrInt = refArray(ref.types.int)
var ptrDongleInfo = refArray(dongleInfo)

const rockeyInterface = {
  'Dongle_Enum' : ['int', [ptrDongleInfo, ptrInt]]
}

export {rockeyInterface, dongleInfo, ptrDongleInfo, ptrInt}