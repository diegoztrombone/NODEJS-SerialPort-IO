const { SerialPort } = require('serialport')
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')
const printer = require('printer');

const prompt = require('prompt-sync')();

const { chartToHex, hexToBuffer, LRCgenerator } = require('./helpers')


const port = new SerialPort({ path: 'COM11', baudRate: 19200 })
const parser = port.pipe(new InterByteTimeoutParser({ interval: 20 }))

const STX = '02'
const ETX = '03'

const EOT = Buffer.from('04', 'hex')
const ENQ = Buffer.from('05', 'hex')
const ACK = Buffer.from('06', 'hex')
const NACK = Buffer.from('15', 'hex')
const SEPARATOR = '90'
const quantity = process.argv[2]


const TPV_RESPONSE_OK = Buffer.from('023938363390900307', 'hex')
const SALE_CONFIRMATION = Buffer.from('02393837339090300336', 'hex')


let interval = -1
let timeout3 = -1
let isSellComplete = false

const T3 = 60000 * 5

const write = (msg) => {
  port.write(msg, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log(">> TX SEND", msg)
  })
}

const sendPrint = (info) => {
  console.log(">>>>>>>>>>>> ENTRA IMPRESORA")
  printer.printDirect({
    data: info,
    type: 'RAW',
    success: (jobID) => {
        
    },
    error: (err) => {
      console.log('printer module error: ', err);
    }
  });
}

parser.on('data', (data) => {
  console.log(">>>>>>>>>>>>>>>>>>> RX", data)
  

  const checkACK = Buffer.compare(data, ACK)
  const checkTPV_RESPONSE_OK = Buffer.compare(data, TPV_RESPONSE_OK)
  const checkEOT = Buffer.compare(data, EOT)
  const checkNACK = Buffer.compare(data, NACK)

  if (checkACK === 0 && !isSellComplete) {
    console.log(">>>> RECIBIDO ACK, ENVIANDO ENQ")
    interval = setInterval(() => {
      write(ENQ)
    }, 500)

    timeout = setTimeout(() => {
      console.log(">>>>>>>>>>>>ENVIA EOT FIN")
      write(EOT)
      clearInterval(interval)
    }, T3)

    return
  }

  if (checkTPV_RESPONSE_OK === 0) {
    console.log(">>> ENTRA IF CHECK TPV_RESPONSE_OK")
    write(EOT)
    return
  }


  if(checkNACK === 0) {
    console.log(">>>>>>>>>>>ERRROR")
    write(EOT)
    return
  }
  if (checkEOT === 0 && isSellComplete) {
    console.log(">>>>> FIN DEL PROCESO")
    clearInterval(interval)
    process.exit(1)

  }

 


  isSellComplete = true
  console.log(">>>>>>>>>> ENTRA TICKET")
  const buff = Buffer.from(data)
  console.log(buff.toString('utf-8'))
  sendPrint(data)
  write(EOT)
  //write(SALE_CONFIRMATION)
  write(hexToBuffer(saleConfirmationGenerator("31")))


})

const saleRequestGenerator = () => {
  const separatorArr = Array.from({ length: 11 }, (e) => SEPARATOR).join("")
  const transformedQuantity = chartToHex(quantity)
  const saleDataWithoutLRC = "31" + "30" + "30" + "31" + SEPARATOR + transformedQuantity + separatorArr
  console.log("LRC", LRCgenerator(saleDataWithoutLRC))
  return STX + saleDataWithoutLRC + ETX + LRCgenerator(saleDataWithoutLRC)
}

const saleConfirmationGenerator = (code) => {
  const saleConfirmationCode = "383733"
  const saleConfirmationWithoutLRC = "39" + saleConfirmationCode + SEPARATOR + SEPARATOR + code  
  return STX + saleConfirmationWithoutLRC + ETX + LRCgenerator(saleConfirmationWithoutLRC)
 
}



const init = () => {
  if (!quantity) {
    console.log("DATOS INCORRECTOS")
    return process.exit(1)
  }

  write(hexToBuffer(saleRequestGenerator()))
}



init()









