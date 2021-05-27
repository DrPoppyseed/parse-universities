const fs = require("fs");
const common = require("./helpers/common");

function mergeInstAndMajors(instFilepath, majorsFilepath) {
  const parsedInstData = common.parsedJsonData(instFilepath);
  const parsedMajorsData = common.parsedJsonData(majorsFilepath);

  const result = {
    ...parsedInstData,
    majors: [...parsedMajorsData.majors],
    programsPerCredLev: parsedMajorsData.programsPerCredLev,
  };
  common.createJsonFile(
    `./output/merged/${parsedInstData.unitid}.json`,
    result
  );
}

module.exports.mergeInstAndMajors = mergeInstAndMajors;
