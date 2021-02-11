const fs = require("fs");

function parsedJsonData(filepath: string): Object {
  const data: Object = fs.readFileSync(`${filepath}`);
  return JSON.parse(data);
}

function createJsonFile(outputFilepath, jsObj) {
  fs.writeFile(outputFilepath, JSON.stringify(jsObj), (err) => {
    if (err) console.log(err);
    console.log(`${outputFilepath} file successfully created!`);
  });
}

module.exports.parsedJsonData = parsedJsonData;
module.exports.createJsonFile = createJsonFile;
