const { SerialPort } = require('serialport')
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const printer = require('printer');

const {chartToHex, hexToBuffer, LRCgenerator} = require('./helpers')


const port = new SerialPort({ path: 'COM9', baudRate: 19200 })
const parser = port.pipe(new InterByteTimeoutParser({ interval: 20 }))

const STX = '02'
const ETX = '03'

const EOT = Buffer.from('04', 'hex')
const ENQ = Buffer.from('05', 'hex')
const ACK = Buffer.from('06', 'hex')
const SEPARATOR = '90'
const quantity = process.argv[2]


const TPV_ACK = Buffer.from('023938363390900307', 'hex')

const SALE_ACK = Buffer.from('02393837339090300336', 'hex')

let interval = -1
let isSellComplete = false

const write = (msg) => {
  port.write(msg, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log(">> TX SEND", msg)
  })
}

const sendPrint = (info) => {
  printer.printDirect({
    data: info,
    type: 'RAW',
    success: (jobID) => {
      console.log("ID: ", jobID);
    },
    error: (err) => {
      console.log('printer module error: ', err);
    }
  });
}

parser.on('data', (data) => {
  console.log("RX", data)
  console.log("RX LENGTH", data.length)
  
  const checkACK = Buffer.compare(data, ACK)
  const checkTPV_ACK = Buffer.compare(data, TPV_ACK)
  const checkEOT = Buffer.compare(data, EOT)

  if (checkACK === 0 && !isSellComplete) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

    interval = setInterval(() => {
      write(ENQ)
    }, 500)

    return
  }

  if(checkTPV_ACK === 0) {
    console.log("ENTRA IF CHECK TPV_ACK")
    write(EOT)
  }

  if(data.length > 100) {
    isSellComplete = true
    console.log("ENTRA IFK")
    /* const buff = Buffer.from(data).subarray(0,450)
    const buff2 = Buffer.from(data).subarray(0,450)
    const buffMargin = Buffer.from([])
    const doc = Buffer.concat([buff, buffMargin])
    console.log(buff.toString())
    console.log(doc.toString()) */
    //sendPrint(data)
    write(EOT)
    write(SALE_ACK)
  }

  if(checkEOT === 0 && isSellComplete) {
    console.log(">>>>> FIN DEL PROCESO")
    clearInterval(interval)
  }
})

const saleGenerator = () => {
  const separatorArr = Array.from({length: 11}, (e) => SEPARATOR).join("")
  const transformedQuantity = chartToHex(quantity)
  console.log("TRANSFOR QUANTITY", transformedQuantity)
  const saleDataWithoutLRC = "31" + "30" + "30" + "31" + SEPARATOR + transformedQuantity + separatorArr
  console.log("LRC", LRCgenerator(saleDataWithoutLRC))
  return STX + saleDataWithoutLRC + ETX + ('00' + LRCgenerator(saleDataWithoutLRC)).slice(-2)
}



const init = () => {
  if(!quantity) {
    console.log("DATOS INCORRECTOS")
    return process.exit(1)
  }
  console.log("sale", saleGenerator())
  write(hexToBuffer(saleGenerator()))
}



init()







