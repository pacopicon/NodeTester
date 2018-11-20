const fs = require('fs')
const {integrateData} = require('./APIcall')

const objToString = (obj, bool, fn) => {
  for (p in obj) {
    if (typeof obj[p] == 'object') {
      objToString(obj[p], bool, fn)
    } else {
      if (typeof obj[p] != 'function') {
        if (bool && obj[p] == fn.trim() + '.csv') {
          let line = `\n${p}: ${obj[p]}`
          listString += line + listString
        } else if (!bool) {
          let line = `\n${p}: ${obj[p]}`
          listString += line
        }
      }
    }
  }
  if (!bool) {
    listString += `\r\n============`
  }
  return listString
}

const writeData = () => {
  let data = integrateData('MMM', (datum) => {
    let currPrice = datum.datePrice

    fs.appendFile('data.js', currPrice, (err) => {
      if (err) {
        console.log('Did not write log => ', err)
      } else {
        console.log('Log.txt has been updated')
      }
    })
  })
}

writeData()