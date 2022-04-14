// [0x31,0x32,0x33,0x34,0x35,0x36]转'313233343536'
function byteToHexString(arr) {
    if(typeof arr === 'string') {
        return arr
    }
    var str = '',
        _arr = arr
    for(var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/)
        if(v && one.length == 8) {
            var bytesLength = v[0].length
            var store = _arr[i].toString(2).slice(7 - bytesLength)
            for(var st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2)
            }
            str += String.fromCharCode(parseInt(store, 2))
            i += bytesLength - 1
        } else {
            str += String.fromCharCode(_arr[i])
        }
    }
    return str
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

//string表示的16进制转换为byte数组
//'313233343536'转为[0x31,0x32,0x33,0x34,0x35,0x36]
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16))
    return bytes
}

//字符串转换成对应的用string表示的16进制
//'123456'转为'313233343536'
function stringToHex(str) {
    return str.split('').map(function(c) {
        return ('0' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join('')
}

//字符串表示的16进制string转换成字节数组
//'123456'转换为[0x31,0x32,0x33,0x34,0x35,0x36]
function hexStringToBytes(hex){
    var str = stringToHex(hex)
    return hexToBytes(str)
}


function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16))
        hex.push((bytes[i] & 0xF).toString(16))
    }
    return hex.join('')
}

function hexToString(hexStr) {
    var hex = hexStr.toString()//force conversion
    var str = ''
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    return str
}

//[49,50,51,52,53,54]转为'123456'
function bytesToString(bytes){
    var hex = bytesToHex(bytes)
    return hexToString(hex)
}

export {byteToHexString, stringToByte, hexToBytes, stringToHex, hexStringToBytes, bytesToHex, hexToString, bytesToString}