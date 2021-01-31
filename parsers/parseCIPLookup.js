const csvFilePath = '../../SearchResults.csv'
const csv = require('csvtojson')
const fs = require('fs')

function createCIPLookup() {
  csv().fromFile(csvFilePath).then(csvData => {
    return csvData.map(item => {
      const text = item['Title & Definition']
      const name = text.split('.')[0]
      const description = text.replace(name + '. ', '')
      const cipcode = item['CIP Code'].replace(/("|=)/g, '')
      return {'cipcode': cipcode, 'major': name, 'description': description}
    })
  }).then(res => {
    const json = JSON.stringify(res)

    fs.writeFile('./output/cip/ciplookup.json', json, err => {
      if (err)
        console.log(err)
      console.log('COMPLETE!')
    })
  })
}

module.exports.createCIPLookup = createCIPLookup
