const integrateData = async (symbol, callback, checkIfItsFetching) => {
  checkIfItsFetching(true)

  let
    http1  = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=5JSEEXSISXT9VKNO`,
    http2  = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    
    await fetchData(http1, true, async (datum) => {
      await fetchData(http2, false, (data) => {
        let output = packageData(data, datum)
        callback(output)
        checkIfItsFetching(false)
      })
    })
}

const fetchData = (http, isIntraday, callback) => {
  try {
    fetch(http)
    .then(response => {
      return response.json()
    })
    .then(json => {
      let output = ''

      if (isIntraday) {
        output = parseData(json, 1)
      } else {
        let timeScales = [8, 32, 94, 187, 366, 731]
        output = []
        for (let i=0; i<timeScales.length; i++) {
          output.push(parseData(json, timeScales[i]))
        }
      }
      callback(output)
    })
    .catch(err => {
      console.log('Error pulling closeData from API: ', err)
      return null
    })
  }
  catch (err) {
    console.log('error calling api: ', err)
  }
}