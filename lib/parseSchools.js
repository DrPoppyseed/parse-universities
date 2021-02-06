const fs = require("fs");

const csv = require("csvtojson");

function replacer(key, value) {
  const originalObject = this[key];

  if (originalObject instanceof Map) {
    return Array.from(originalObject.entries()); // or with spread: value: [...originalObject]
  } else {
    return value;
  }
}

function parseForSchoolUnitid(from, to, num) {
  let accum = [];

  for (let i = from; i <= to; i++) {
    const filepath = `./csv/majorsAndMinors/majorsAndMinorsCsv${i}.csv`;
    csv().fromFile(filepath).then(res => {
      let currentUnitid; // = res[0].UNITID

      let currentOpeid = res[0].OPEID6;
      let currentSchoolName = res[0].INSTNM;

      for (const key in res[0]) {
        if (key.match("UNITID")) {
          currentUnitid = res[0][key];
          break;
        }
      }

      let fileObj = {
        fileNum: i,
        unitids: [currentUnitid],
        opeids: [currentOpeid],
        schoolNames: [currentSchoolName]
      };
      res.forEach(item => {
        let localUnitid;

        for (const key in item) {
          if (key.match("UNITID")) {
            // console.log(res[0].key)
            // console.log(res[0][key])
            localUnitid = res[0][key];
            break;
          }
        }

        if (localUnitid !== currentUnitid) {
          currentUnitid = localUnitid;
          currentOpeid = item.OPEID6;
          currentSchoolName = item.INSTNM;
          fileObj.unitids.push(currentUnitid);
          fileObj.opeids.push(currentOpeid);
          fileObj.schoolNames.push(currentSchoolName);
        }
      });
      return fileObj;
    }).then(result => {
      return accum.push(result);
    }).then(result => {
      if (result && i === to) {
        let accumMap = new Map(); // parse through accum to get the info you need

        for (let j = 0; j < accum.length; j++) {
          for (let k = 0; k < accum[j].unitids.length; k++) {
            const Kunitid = accum[j].unitids[k];
            const KfileNum = accum[j].fileNum;
            console.log(KfileNum);

            if (!accumMap.has(Kunitid)) {
              accumMap.set(Kunitid, [KfileNum]);
            } else {
              const previousFileNums = accumMap.get(Kunitid);
              accumMap.set(Kunitid, [...previousFileNums, KfileNum]);
            }
          }
        }

        const jsonData = JSON.stringify(accumMap, replacer);
        const filePath = `./output/majorsUnitid/schoolsInFileUnitid${num}.json`;
        fs.writeFile(filePath, jsonData, err => {
          if (err) console.log(err);
          console.log(`schoolsInFileUnitid created!`);
        });
      }
    }).catch(err => {
      console.trace(err);
    }); // 1. set opeid for first element
  }
}

function parseForSchools(from, to, num) {
  let accum = [];

  for (let i = from; i <= to; i++) {
    const filepath = `./csv/majorsAndMinors/majorsAndMinorsCsv${i}.csv`;
    csv().fromFile(filepath).then(res => {
      let currentOpeid = res[0].OPEID6;
      let currentSchoolName = res[0].INSTNM;
      let fileObj = {
        fileNum: i,
        opeids: [currentOpeid],
        schoolNames: [currentSchoolName]
      };
      res.forEach(item => {
        if (item.OPEID6 !== currentOpeid) {
          currentOpeid = item.OPEID6;
          currentSchoolName = item.INSTNM;
          fileObj.opeids.push(currentOpeid);
          fileObj.schoolNames.push(currentSchoolName);
        }
      });
      return fileObj;
    }).then(result => {
      return accum.push(result);
    }).then(result => {
      if (result && i === to) {
        let accumMap = new Map(); // parse through accum to get the info you need

        for (let j = 0; j < accum.length; j++) {
          for (let k = 0; k < accum[j].opeids.length; k++) {
            const Kopeid = accum[j].opeids[k];
            const KfileNum = accum[j].fileNum;
            console.log(KfileNum);

            if (!accumMap.has(Kopeid)) {
              accumMap.set(Kopeid, [KfileNum]);
            } else {
              const previousFileNums = accumMap.get(Kopeid);
              accumMap.set(Kopeid, [...previousFileNums, KfileNum]);
            }
          }
        }

        const jsonData = JSON.stringify(accumMap, replacer);
        const filePath = `./output/majors/schoolsInFile${num}.json`;
        fs.writeFile(filePath, jsonData, err => {
          if (err) console.log(err);
          console.log(`schoolsInFiles created!`);
        });
      }
    }).catch(err => {
      console.trace(err);
    }); // 1. set opeid for first element
  }
}

module.exports.parseForSchools = parseForSchools;
module.exports.parseForSchoolUnitid = parseForSchoolUnitid;