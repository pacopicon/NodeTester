const fs = require('fs')
const {integrateData} = require('./APIcall')
const fileContents = require('./data')


const objToString = (obj) => {
  let line = ''
  for (p in obj) {
    if (typeof obj[p] == 'object') {
      objToString(obj[p])
    } else {
      line += `\n${p}: ${obj[p]}`
    }
  }
  console.log(line)
  return line
}

const isEmpty = (obj) => {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return true;
}

const writeData = (datum, symbol) => {

  let writeStream = ''

  if (isEmpty(fileContents)) {
    writeStream += "module.exports = {}\n\n"
  }

  writeStream += `let ${symbol} = ` + JSON.stringify(datum)

  writeStream += `\n\nmodule.exports.${symbol} = ${symbol}\n\n`

  let comm = `let com = "crickey"`

  fs.appendFile('data.js', comm, (err) => {
    if (err) {
      console.log('Did not write log => ', err)
    } else {
      console.log('data.js has been updated')
    }
  })
}
  
  
integrateData('MMM', writeData)