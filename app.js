const { SerialPort } = require('serialport')
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout')


const port = new SerialPort({ path: 'COM4', baudRate: 19200 })
const parser = port.pipe(new InterByteTimeoutParser({ interval: 20 }))

const enq = Buffer.from('05', 'hex')
const eot = Buffer.from('04', 'hex')
const ack = Buffer.from('06', 'hex')

const saleACK = Buffer.from('023938363390900307', 'hex')
const sale = Buffer.from('0231303031903590909090909090909090900336', 'hex')
const finishSale = Buffer.from('02393837339090300336', 'hex')

let interval = -1
let isSellComplete = false
let timeout

const write = (msg) => {
  port.write(msg, function (err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }

    console.log(">> TX SEND", msg)

  })

}

parser.on('data', (data) => {
  console.log("RX", data)
  console.log("RX LENGTH", data.length)
  
  const checkACK = Buffer.compare(data, ack)
  const checkSaleACK = Buffer.compare(data, saleACK)
  const checkEOT = Buffer.compare(data, eot)

  if (checkACK === 0 && !isSellComplete) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    interval = setInterval(() => {
      write(enq)
    }, 500)
    return
  }

  if(checkSaleACK === 0) {
    write(eot)
  }

  if(data.length > 100) {
    isSellComplete = true
    console.log("ENTRA")
    console.log(data.toString())
    write(eot)
    write(finishSale)
  }

  if(checkEOT === 0 && isSellComplete) {
    console.log(">>>>> FIN DEL PROCESO")
    clearInterval(interval)
  }

  

})

write(sale)





