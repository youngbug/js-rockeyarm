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
    'Dongle_WriteFile' :        ['int', [ryHandle, 'int', 'ushort', 'ushort', ptrByte, 'int' ]],
    'Dongle_ReadFile' :         ['int', [ryHandle, 'ushort', 'ushort', ptrByte, 'int']],
    'Dongle_DownloadExeFile' :  ['int', [ryHandle, ptrByte, 'int']],
    'Dongle_RunExeFile' :       ['int', [ryHandle, 'ushort', ptrByte, 'ushort', ptrInt]],
    'Dongle_DeleteFile' :       ['int', [ryHandle, 'int', 'ushort']],
    'Dongle_ListFile' :         ['int', [ryHandle, 'int', ptrByte, ptrInt]],
    'Dongle_GenUniqueKey' :     ['int', [ryHandle, 'int', ptrByte, ptrByte,ptrByte]],
    'Dongle_VerifyPIN' :        ['int', [ryHandle, 'int', ptrByte, ptrInt]],
    'Dongle_ChangePIN' :        ['int', [ryHandle, 'int', ptrByte, ptrByte, 'int']],
    'Dongle_ResetUserPIN' :     ['int', [ryHandle, ptrByte]],
    'Dongle_SetUserID' :        ['int', [ryHandle, 'uint32']],
    'Dongle_GetDeadline' :      ['int', [ryHandle, ptrInt]],
    'Dongle_SetDeadline' :      ['int', [ryHandle, 'uint32']],
    'Dongle_GetUTCTime' :       ['int', [ryHandle, ptrInt]],
    'Dongle_ReadData' :         ['int', [ryHandle, 'int', ptrByte, 'int']],
    'Dongle_WriteData' :        ['int', [ryHandle, 'int', ptrByte, 'int']],
    'Dongle_ReadShareMemory' :  ['int', [ryHandle, ptrByte]],
    'Dongle_WriteShareMemory' : ['int', [ryHandle, ptrByte, 'int']],
    'Dongle_RsaGenPubPriKey' :  ['int', [ryHandle, 'ushort', ptrByte, ptrByte]],
    'Dongle_RsaPri' :           ['int', [ryHandle, 'ushort', 'int', ptrByte, 'int', ptrByte, ptrInt]],
    'Dongle_RsaPub' :           ['int', [ryHandle, 'int', ptrByte, ptrByte, 'int', ptrByte, ptrInt]],
    'Dongle_EccGenPubPriKey' :  ['int', [ryHandle, 'ushort', ptrByte, ptrByte]],
    'Dongle_EccSign' :          ['int', [ryHandle, 'ushort', ptrByte, 'int', ptrByte]],
    'Dongle_EccVerify' :        ['int', [ryHandle, ptrByte, ptrByte, 'int', ptrByte]],
    'Dongle_SM2GenPubPriKey' :  ['int', [ryHandle, 'ushort', ptrByte,ptrByte]],
    'Dongle_SM2Sign' :          ['int', [ryHandle, 'ushort', ptrByte, 'int', ptrByte]],
    'Dongle_SM2Verify' :        ['int', [ryHandle, ptrByte, ptrByte, 'int', ptrByte]],
    'Dongle_TDES' :             ['int', [ryHandle, 'ushort', 'int', ptrByte, ptrByte, 'int']],
    'Dongle_SM4' :              ['int', [ryHandle, 'ushort', 'int', ptrByte, ptrByte, 'int']],
    'Dongle_HASH' :             ['int', [ryHandle, 'int', ptrByte, 'int', ptrByte]],
    'Dongle_Seed' :             ['int', [ryHandle,  ptrByte, 'int', ptrByte]],
    'Dongle_LimitSeedCount' :   ['int', [ryHandle,  'int']],
    'Dongle_GenMotherKey' :     ['int', [ryHandle, ptrByte]],
    'Dongle_RequestInit' :      ['int', [ryHandle, ptrByte]],
    'Dongle_GetInitDataFromMother' : ['int', [ryHandle ,ptrByte, ptrByte, ptrInt]],
    'Dongle_InitSon' :          ['int', [ryHandle, ptrByte, 'int']],
    'Dongle_SetUpdatePriKey' :  ['int', [ryHandle, ptrByte]],
    'Dongle_MakeUpdatePacket' : ['int', [ryHandle, ptrByte, 'int', 'int', 'ushort', 'int', ptrByte, 'int', ptrByte, ptrByte, ptrInt]],
    'Dongle_MakeUpdatePacketFromMother' : ['int', [ryHandle, ptrByte, 'int', 'int', 'ushort', 'int', ptrByte, 'int', ptrByte, ptrInt]],
    'Dongle_Update' :           ['int', [ryHandle, ptrByte, 'int']]
}

export {rockeyInterface, dongleInfo, ptrDongleInfo, ptrInt, ptrByte, ptrHandle, ryHandle, ptrVoid, dataFileAttr}