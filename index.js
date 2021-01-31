const cipLookup = require('./parsers/parseCIPLookup.js')
const parseMajors = require('./parsers/parseMajors.js')
const parseSchools = require('./parsers/parseSchools.js')
const parseInstitutionData = require('./parsers/parseInstitutionData.js')

const START = 1;
const END = 2194;
/**
  1. set opeid for the first element in the fileName
  2. parser through file until the opeid changes
  3. if the opeid6 doesn't change, move to next file.

  GOAL: all i want is the name, beginning file number, ending file number, and opeid

  files: 1 ~ 2194
*/

// parseSchools.parseForSchools(START, 300, 1)
// parseSchools.parseForSchools(301, 600, 2)
// parseSchools.parseForSchools(601, 900, 3)
// parseSchools.parseForSchools(901, 1200, 4)
// parseSchools.parseForSchools(1201, 1500, 5)
// parseSchools.parseForSchools(1501, 1800, 6)
// parseSchools.parseForSchools(1801, 2193, 7)

// parseMajors.parseMajorsWithMap('./output/majors/schoolsInFile7.json')

parseInstitutionData.parseInstitutions(1, 2)