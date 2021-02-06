const fs = require("fs");
/** CONSTANTS */


const CRED_DESC_JAP_MAP = new Map([["1", "学士認定"], ["2", "准学士"], ["3", "学士"], ["4", "ポストバカロレア認定"], ["5", "修士"], ["6", "博士"], ["7", "第一次専門職学位"], ["8", "大学院/専門職認定"]]);
const TRACKER_INTIAL = {
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
  "6": 0,
  "7": 0,
  "8": 0
};
const DEPT_INITIAL = {
  majorCIP: "",
  majorTitle: "",
  majorDesc: "",
  majorTitleJap: "",
  majorDescJap: "",
  programsPerCredLevInDept: { ...TRACKER_INTIAL
  },
  programs: []
};

const prettifyParsedMajors = filepath => {
  const parsedData = _parsedJsonData(filepath);

  const parsedCIPData = _parsedJsonData("./output/cip/ciplookup.json");
  /** Initializing variables... */


  let obj = { ...parsedData,
    programsPerCredLev: { ...TRACKER_INTIAL
    },
    majors: []
  };
  let deptCode = parsedData.majors[0].cipCode;
  let counter = 0;
  let deptDiscValueHolder = { ...DEPT_INITIAL
  };
  let tracker = { ...TRACKER_INTIAL
  };
  let localTracker = { ...TRACKER_INTIAL
  };
  /** when number of majors in school is less than 1 */

  if (parsedData.majors.length === 1) {
    obj.majors.push({ ..._hasOnlyOneMajor(parsedData.majors[0], parsedCIPData, deptCode)
    });
  } else {
    for (const program of parsedData.majors) {
      const localDeptCode = _getLocalDeptCode(program.cipCode);

      const localProgramCode = _getLocalProgramCode(program.cipCode);

      tracker[`${program.credLev}`] = tracker[`${program.credLev}`] + 1;
      counter++;

      if (localDeptCode === deptCode) {
        // when the current dept code is the same with the previous one
        localTracker[`${program.credLev}`] = localTracker[`${program.credLev}`] + 1;
        deptDiscValueHolder.programs.push({ ..._extractUsefulData(localProgramCode, program, CRED_DESC_JAP_MAP)
        });
      } else {
        // if the dept code is different than the previous one
        // before updating anything with the new one, first push the existing code.
        if (counter > 1) {
          // push starts
          obj.majors.push({ ...deptDiscValueHolder,
            programs: [...deptDiscValueHolder.programs],
            programsPerCredLevInDept: { ...localTracker
            }
          });
        } // after pushing the code, then, initialize for current deptcode
        // initialization starts


        localTracker = { ...TRACKER_INTIAL,
          [`${~~program.credLev}`]: 1
        }; // cleanup and initialize localTracker

        deptCode = localDeptCode;
        deptDiscValueHolder = { ..._getMajorCIPData(parsedCIPData, deptCode, deptCode),
          majorDescJap: "",
          programsPerCredLevInDept: { ...localTracker
          },
          programs: [{ ..._extractUsefulData(localProgramCode, program, CRED_DESC_JAP_MAP)
          }]
        };
      }
    }
    /** FOR THE LAST ELEMENT (not captured by the for loop) */


    obj.majors.push({ ..._getMajorCIPData(parsedCIPData, deptCode, deptCode),
      programsPerCredLevInDept: { ...localTracker
      },
      programs: [...deptDiscValueHolder.programs]
    });
  }

  const outputFilepath = `./output/majorsJsonUnitidClean/${obj.unitid}.json`;

  _createJsonFile(outputFilepath, { ...obj,
    programsPerCredLev: tracker
  });
};
/** HELPER METHODS */


const _hasOnlyOneMajor = (major, parsedCIPData, deptCode) => {
  const {
    cipCode,
    credLev
  } = major;
  return { ..._getMajorCIPData(parsedCIPData, cipCode, deptCode),
    programsPerCredLevInDept: { ...TRACKER_INTIAL,
      [`${~~credLev}`]: 1
    },
    programs: [...DEPT_INITIAL.programs]
  };
};

const _getMajorCIPData = (parsedCIPData, cipCode, deptCode) => {
  const localDeptCode = _getLocalDeptCode(cipCode);

  const {
    major,
    description,
    majorTitleJap
  } = _parseAndLookupCIP(parsedCIPData, localDeptCode);

  return {
    majorCIP: deptCode,
    majorTitle: major,
    majorDesc: description,
    majorTitleJap: majorTitleJap
  };
};

const _getLocalDeptCode = code => {
  if (code.length >= 2) {
    return code.split("").slice(0, 2).join("");
  } else {
    return "";
  }
};

const _getLocalProgramCode = code => {
  if (code.length >= 2) {
    return code.split("").slice(2, 4).join("");
  } else {
    return "";
  }
};

function _extractUsefulData(localProgramCode, program, credDescJapMap) {
  let {
    cipCode,
    cipDesc,
    credLev,
    credDesc,
    graduates,
    medianIncome1,
    medianIncome2
  } = program;

  if (credLev === "3" && credDesc !== "Bachelor's Degree") {
    credDesc = "Bachelor's Degree";
  }

  if (graduates === "NULL") {
    graduates = "未測定";
  }

  if (medianIncome1 === "empty") {
    medianIncome1 = "未測定";
  } else {
    medianIncome1 = new Intl.NumberFormat().format(~~medianIncome1);
  }

  if (medianIncome2 === "empty") {
    medianIncome2 = "未測定";
  } else {
    medianIncome2 = new Intl.NumberFormat().format(~~medianIncome2);
  }

  return {
    code: localProgramCode,
    codeFull: cipCode,
    name: cipDesc,
    credLev: credLev,
    credDesc: credDesc,
    credDescJap: credDescJapMap.get(credLev),
    graduates: graduates,
    medianIncome1: medianIncome1,
    medianIncome2: medianIncome2,
    nameJap: "",
    descJap: ""
  };
}
/** UTILITY METHODS */


function _parsedJsonData(filepath) {
  const data = fs.readFileSync(`${filepath}`);
  return JSON.parse(data);
}

function _parseAndLookupCIP(data, target) {
  const formattedTarget = _formatCIP(target);

  for (const program of data) {
    if (program.cipcode === formattedTarget) {
      return program;
    }
  }

  return {
    major: "Other",
    description: "",
    majorTitleJap: "その他"
  };
}

function _formatCIP(target) {
  if (target.length > 3) {
    let temp = target.split("");
    temp.splice(2, 0, ".");
    return temp.join("");
  }

  return target;
}

function _createJsonFile(outputFilepath, jsObj) {
  fs.writeFile(outputFilepath, JSON.stringify(jsObj), err => {
    if (err) console.log(err);
    console.log(`${outputFilepath} file successfully created!`);
  });
}

module.exports.prettifyParsedMajors = prettifyParsedMajors;