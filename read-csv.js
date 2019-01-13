const fs = require('fs')
const csv = require('csv')
const util = require('util')
const readdir = util.promisify(fs.readdir)

const lngExtent = [115.9, 116.8]
const latExtent = [39.5, 40.6]
const lngGridSize = (lngExtent[1] - lngExtent[0]) / 100
const latGridSize = (latExtent[1] - latExtent[0]) / 100


const ret = []

for (let h = 0; h < 24; h++) {
  ret[h] = []
  for (let i = 0; i < 100; i++) {
    ret[h][i] = []
    for (let j = 0; j < 100; j++) {
      ret[h][i][j] = 0
    }
  }
}


readdir(__dirname+'/data').then(async (files) => {
  for (const file of files) {
    await handleCsvFile(file)
  }
  console.log(ret.length)
})


function handleCsvFile(fileName) {
  return new Promise(resolve => {
    const stream = fs.createReadStream('./data/'+fileName, {encoding: 'utf8'})
    const parser = csv.parse()
    parser.on('readable', function () {
      let record
      while (true) {
        record = parser.read()
        if (!record) break
        const [md5, content, phone, conntime, recitime, lng, lat] = record
        const hour = (new Date(parseInt(recitime))).getHours()
        if (md5 === 'md5') continue
        const [x, y] = calPosition(parseFloat(lng), parseFloat(lat))
        if (x < 0 || x >= 100 || y < 0 || y >= 100) continue
        ret[hour][x][y]++
      }
    })
    parser.on('end', function(){
      resolve()
    })
    stream.pipe(parser)
  })
}


function calPosition(lng, lat) {
  const x = Math.floor((lng - lngExtent[0]) / lngGridSize)
  const y = Math.floor((lat - latExtent[0]) / latGridSize)
  return [x, y]
}
