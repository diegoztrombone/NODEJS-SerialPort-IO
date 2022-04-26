const chartToHex = (string) => {
    return string
        .split("")
        .map(e => (e.charCodeAt(0).toString(16)))
        .join("")


}

const chunkStr = (str, n, acc) => {
    if (str.length === 0) {
        return acc
    } else {
        acc.push(str.substring(0, n));
        return chunkStr(str.substring(n), n, acc);
    }
}

const LRCgenerator = (data) => {
    const chunk = chunkStr(data, 2, [])
    const LRC = [...chunk].map(a => a.charCodeAt(1)).reduce((a, b) => a ^ b);
    return ('00' + ((LRC ^ "0x03").toString(16))).slice(-2)
}

const hexToBuffer = (data) => {
    return Buffer.from(data, 'hex')
}
module.exports = {
    chartToHex,
    LRCgenerator,
    hexToBuffer

}