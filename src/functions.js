import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const ref = require('ref-napi')
const refArray = require('ref-array-napi')
const StructType = require ('ref-struct-napi')
//define ROCKEY-ARM sturcts

var dongleInfo = StructType({
    m_VerL:     ref.types.uchar,
    m_VerR:     ref.types.uchar,
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

var dataFileAttr = StructType({
    m_Size   :     ref.types.uint32,
    m_Read_Priv  : ref.types.ushort,
    m_Write_Priv : ref.types.ushort
})

var ptrInt = refArray(ref.types.int)
var ryHandle = refArray(ref.types.uint)//ROCKEY的句柄是void*，但是ref-array-napi不能创建void类型的数组
var ptrHandle = refArray(ryHandle) //如果是32位系统，句柄用uint应该也是ok的。
var ptrDongleInfo = refArray(dongleInfo)
var ptrByte = refArray(ref.types.uchar)
var ptrVoid = refArray(ref.types.uint)

const rockeyInterface = {
    'Dongle_Enum' :             ['int', [ptrDongleInfo, ptrInt]],
    'Dongle_Open' :             ['int', [ptrHandle, 'int']],
    'Dongle_ResetState' :       ['int', [ryHandle]],
    'Dongle_Close':             ['int', [ryHandle]],
    'Dongle_GenRandom' :        ['int', [ryHandle, 'int', ptrByte]],
    'Dongle_LEDControl':        ['int', [ryHandle, 'int']],
    'Dongle_SwitchProtocol' :   ['int', [ryHandle, 'int']],
    'Dongle_RFS' :              ['int', [ryHandle]],
    'Dongle_CreateFile' :       ['int', [ryHandle, 'int', 'ushort', ptrByte]],
    'Dongle_VerifyPIN' :        ['int', [ryHandle, 'int', ptrByte, ptrInt]]
}

export {rockeyInterface, dongleInfo, ptrDongleInfo, ptrInt, ptrByte, ptrHandle, ryHandle, ptrVoid, dataFileAttr}