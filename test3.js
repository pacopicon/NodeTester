const data = require('./data')
// const data = require('./test4')

const log = (prop) => {
  console.log('data = ', data)
  console.log('data[prop] = ', data[prop])
  let resource = data[prop]
  if (resource) {
    console.log(resource)
  }
}

log('MMM')