const csv = require("csvtojson");
const fs = require("fs");

async function parseMajorsToJson(fileName, schoolNameCamel, schoolOpeid) {
  // console.log(fileName)
  return await csv()
    .fromFile(fileName)
    .then((csvData) => {
      return csvData
        .filter((item) => {
          if (item.OPEID6 == schoolOpeid) return true;
          else return false;
        })
        .map((item) => {
          return {
            opeid6: item.OPEID6,
            schoolName: item.INSTNM,
            cipCode: item.CIPCODE,
            cipDesc: item.CIPDESC,
            credLev: item.CREDLEV,
            credDesc: item.CREDDESC,
            graduates: item.IPEDSCOUNT1,
            medianIncome1: item.EARN_MDN_HI_1YR,
            medianIncome2: item.EARN_MDN_HI_2YR,
          };
        });
    })
    .catch((err) => {
      console.trace(err);
    });
}

async function createSchoolObj(
  fromFileNum,
  toFileNum,
  files,
  schoolNameCamel,
  schoolOpeid
) {
  const FILE_NAME_BASE = "./csv/majorsAndMinors/majorsAndMinorsCsv";
  let accum = [];
  let fileNum = fromFileNum;

  for (let i = 0; i < files.length; i++) {
    const fileName = `${FILE_NAME_BASE}${fileNum}.csv`;
    const result = await parseMajorsToJson(
      fileName,
      schoolNameCamel,
      schoolOpeid
    );
    accum = [...accum, ...result];

    if (fileNum === toFileNum) _nestMajors(schoolNameCamel, accum);
    else fileNum = files[i];
  }
}

function createJsonFile(fileName, data) {
  const jsonData = JSON.stringify(data);
  const filePath = `./output/majorsJson/${fileName}`;
  fs.writeFile(filePath, jsonData, (err) => {
    if (err) console.log(err);
    console.log(`${fileName} created!`);
  });
}

async function _nestMajors(schoolNameCamel, majors) {
  const result = majors.map((major) => _parsedMajor(major));
  const obj = {
    opeid6: majors[0].opeid6,
    schoolName: majors[0].schoolName,
    majors: [...result],
  };
  createJsonFile(`${schoolNameCamel}.json`, obj);
}

function _parsedMajor(major) {
  const {
    cipCode,
    cipDesc,
    credLev,
    credDesc,
    graduates,
    medianIncome1,
    medianIncome2,
  } = major;
  return {
    cipCode,
    cipDesc,
    credLev,
    credDesc,
    graduates,
    medianIncome1:
      medianIncome1 == "PrivacySuppressed" ? "empty" : medianIncome1,
    medianIncome2:
      medianIncome2 == "PrivacySuppressed" ? "empty" : medianIncome2,
  };
}

function _insertionSort(inputArr) {
  let n = inputArr.length;
  for (let i = 1; i < n; i++) {
    // Choosing the first element in our unsorted subarray
    let current = inputArr[i];
    // The last element of our sorted subarray
    let j = i - 1;
    while (j > -1 && current < inputArr[j]) {
      inputArr[j + 1] = inputArr[j];
      j--;
    }
    inputArr[j + 1] = current;
  }
  return inputArr;
}

async function parseMajorsWithMap(filePath) {
  const data = fs.readFileSync(filePath);
  const parsedData = JSON.parse(data);

  for (let i = 0; i < parsedData.length; i++) {
    const opeid = ~~parsedData[i][0];
    const fileNums = parsedData[i][1];
    const sortedFiles = _insertionSort(fileNums);
    await createSchoolObj(
      Math.min(...fileNums),
      Math.max(...fileNums),
      sortedFiles,
      opeid,
      opeid
    );
  }
}

module.exports.createSchoolObj = createSchoolObj;
module.exports.parseMajorsWithMap = parseMajorsWithMap;