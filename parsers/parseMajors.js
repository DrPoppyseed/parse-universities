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

async function parseMajorsByUnitid(fileName, schoolNameCamel, unitid) {
    return await csv()
        .fromFile(fileName)
        .then((csvData) => {
            return csvData
                .filter((item) => {
                    let localUnitid;
                    for (const key in item) {
                        if (key.match("UNITID")) {
                            localUnitid = item[key];
                            break;
                        }
                    }
                    if (localUnitid == unitid) return true;
                    else return false;
                })
                .map((item) => {
                    // console.log(item)
                    let localUnitid;
                    for (const key in item) {
                        if (key.match("UNITID")) {
                            localUnitid = item[key];
                            break;
                        }
                    }
                    return {
                        unitid: localUnitid,
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

async function createSchoolObjUnitid(
    fromFileNum,
    toFileNum,
    files,
    schoolNameCamel,
    unitid
) {
    const FILE_NAME_BASE = "./csv/majorsAndMinors/majorsAndMinorsCsv";
    let accum = [];
    let fileNum;

    for (let i = 0; i < files.length; i++) {
        fileNum = files[i];
        const fileName = `${FILE_NAME_BASE}${fileNum}.csv`;
        const result = await parseMajorsByUnitid(
            fileName,
            schoolNameCamel,
            unitid
        );
        accum = [...accum, ...result];

        console.log(schoolNameCamel, accum);

        if (fileNum === toFileNum) _nestMajorsUnitid(schoolNameCamel, accum);
        // else fileNum = files[i];
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

function createJsonFileUnitid(fileName, data) {
    const jsonData = JSON.stringify(data);
    const filePath = `./output/majorsJsonUnitid/${fileName}`;
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) console.log(err);
        console.log(`${fileName} -ver unitid created!`);
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

async function _nestMajorsUnitid(schoolNameCamel, majors) {
    const result = majors.map((major) => _parsedMajor(major));
    // console.trace(majors)
    const obj = {
        unitid: majors[0].unitid,
        schoolName: majors[0].schoolName,
        majors: [...result],
    };
    createJsonFileUnitid(`${schoolNameCamel}.json`, obj);
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

async function parseMajorsWithMapUnitid(filePath) {
    const data = fs.readFileSync(filePath);
    const parsedData = JSON.parse(data);

    // for (let i = 0; i < parsedData.length; i++) {
    //     const unitid = ~~parsedData[i][0];
    //     const fileNums = parsedData[i][1];
    //     const sortedFiles = _insertionSort(fileNums);
    //     // if (unitid === 236948) {
    //     //     for (let i = 0; i < 4; i++) {
    //     //         console.log("I found it!");
    //     //         console.log(unitid);
    //     //         console.log(fileNums);
    //     //         console.log(
    //     //             Math.min(...fileNums),
    //     //             Math.max(...fileNums),
    //     //             sortedFiles,
    //     //             unitid,
    //     //             unitid
    //     //         );
    //     //     }
    //     //     createSchoolObjUnitid(
    //     //         Math.min(...fileNums),
    //     //         Math.max(...fileNums),
    //     //         sortedFiles,
    //     //         unitid,
    //     //         unitid
    //     //     );
    //     // }
    //     // await createSchoolObjUnitid(
    //     //     Math.min(...fileNums),
    //     //     Math.max(...fileNums),
    //     //     sortedFiles,
    //     //     unitid,
    //     //     unitid
    //     // );
    // }
    for (const item of parsedData) {
        const unitid = ~~item[0];
        const fileNums = item[1];
        const sortedFiles = _insertionSort(fileNums);
        // if (unitid === 236948) {
        //     for (let i = 0; i < 4; i++) {
        //         console.log("I found it!");
        //         console.log(unitid);
        //         console.log(fileNums);
        //         console.log(
        //             Math.min(...fileNums),
        //             Math.max(...fileNums),
        //             sortedFiles,
        //             unitid,
        //             unitid
        //         );
        //     }
        //     createSchoolObjUnitid(
        //         Math.min(...fileNums),
        //         Math.max(...fileNums),
        //         sortedFiles,
        //         unitid,
        //         unitid
        //     );
        // }
        await createSchoolObjUnitid(
            Math.min(...fileNums),
            Math.max(...fileNums),
            sortedFiles, 
            unitid,
            unitid
        );
    }
}

module.exports.createSchoolObj = createSchoolObj;
module.exports.parseMajorsWithMap = parseMajorsWithMap;
module.exports.parseMajorsWithMapUnitid = parseMajorsWithMapUnitid;
