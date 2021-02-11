const fs = require("fs");
const csv = require("csvtojson");
const miscHelper = require("./helpers/miscHelper");

function parseInstitutions(from, to) {
  for (let i = from; i <= to; i++) {
    console.log(i);
    const filePath = `./csv/institutionAllData/institution${i}.csv`;
    csv()
      .fromFile(filePath)
      .then(async (res) => {
        return await res.map((school, index) => _extractInfoFromCsv(school));
      })
      .then((item) => {
        const filename = `./output/institution/institutionData${i}.json`;
        fs.writeFile(filename, JSON.stringify(item), (err) => {
          if (err) console.log(err);
          else console.log(`${filename}`);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function parseInstitutionAndJoin(from, to) {
  for (let i = from; i <= to; i++) {
    console.log(i);
    const filePath = `./csv/institutionAllData/institution${i}.csv`;
    csv()
      .fromFile(filePath)
      .then(async (res) => {
        return await res.map((school, index) => {
          return _extractInfoFromCsv(school);
        });
      })
      .then((item) => {
        const filename = `./output/institutionJoined/institutionData${from}-${to}.json`;
        fr.appendFile(filename, JSON.stringify);
      });
  }
}

function parseJoinedAndOutputPerFile(filepath) {
  const parsedData = _parsedJsonData(filepath);
  parsedData.map((school) => {
    _createJsonFile(`./output/institutionUnitid/${school.unitid}.json`, school);
  });
}

function _parsedJsonData(filepath: string): Object {
  const data: Object = fs.readFileSync(`${filepath}`);
  return JSON.parse(data);
}

function _createJsonFile(outputFilepath, jsObj) {
  fs.writeFile(outputFilepath, JSON.stringify(jsObj), (err) => {
    if (err) console.log(err);
    console.log(`${outputFilepath} file successfully created!`);
  });
}

/** TODO: refactor, extract verification and formatting logic to helper function */
function _extractInfoFromCsv(obj) {
  const url = miscHelper.schoolNameToUrl(obj.INSTNM);
  const state_jp = miscHelper.stateFIPSToJap(obj.ST_FIPS);
  const state_en = miscHelper.stateFIPSToEng(obj.ST_FIPS);
  const year_type = miscHelper.yearType(obj.PREDDEG);
  const ownership = miscHelper.schoolType(obj.CONTROL);
  const academic_year_avg = miscHelper.toDollars(obj.COSTT4_A);
  const in_state_tuition = miscHelper.toDollars(obj.TUITIONFEE_IN);
  const out_of_state_tuition = miscHelper.toDollars(obj.TUITIONFEE_OUT);
  const admission_rate = Math.floor(obj.ADM_RATE * 100);
  const size = miscHelper.toDollars(obj.UGDS);
  const men = miscHelper.toPercent(obj.UGDS_MEN);
  const women = miscHelper.toPercent(obj.UGDS_WOMEN);
  const age = parseFloat(obj.AGE_ENTRY).toFixed(1);
  const white = miscHelper.toPercent(obj.UGDS_WHITE);
  const black = miscHelper.toPercent(obj.UGDS_BLACK);
  const hispanic = miscHelper.toPercent(obj.UGDS_HISP);
  const asian = miscHelper.toPercent(obj.UGDS_ASIAN);
  const international = miscHelper.toPercent(obj.UGDS_NRA);
  const unique_flags = miscHelper.schoolTypeFlag([
    ["HBCU・歴史的黒人大学", obj.HBCU],
    ["PBI・", obj.PBI],
    ["ANNHI・", obj.ANNHI],
    ["TRIBAL", obj.TRIBAL],
    ["AANAPII", obj.AANAPII],
    ["HSI", obj.HSI],
    ["NANTI", obj.NANTI],
    ["男子校", obj.MENONLY],
    ["女子校", obj.WOMENONLY],
  ]);
  const other = miscHelper.calcStudentDemoOther([
    obj.UGDS_WHITE,
    obj.UGDS_BLACK,
    obj.UGDS_HISP,
    obj.UGDS_ASIAN,
    obj.UGDS_NRA,
  ]);

  return {
    unitid: obj.UNITID,
    opeid: obj.OPEID,
    opeid6: obj.OPEID6,
    name_en: obj.INSTNM,
    name_jp: obj.INSTNM,
    institutionData: {
      unitid: obj.UNITID,
      name_en: obj.INSTNM,
      name_jp: obj.INSTNM,
      card_img_src: "https://dummyimage.com/140x200/e6e6e6/000000",
      card_img_alt: `image placeholder for ${obj.INSTNM}'s card`,
      page_img_src: "https://dummyimage.com/700x300/e6e6e6/000000",
      page_img_alt: `image placeholder for ${obj.INSTNM}'s school profile page`,
      url: url,
      school_homepage_url: obj.INSTURL,
      price_calculator_url: obj.NPCURL,
      state_jp: state_jp,
      state_en: state_en,
      state_postcode: obj.STABBR,
      city: obj.CITY,
      campus_address_short: `${obj.CITY}, ${state_en}`,
      year_type: year_type,
      school_type: ownership,
      rating_score: 0,
      ratings: 0,
      summary: "",
      location: {
        lat: obj.LATITUDE,
        lon: obj.LONGITUDE,
      },
      unique_flags: unique_flags,
      admission_rate: !!admission_rate ? admission_rate : "-",
      sat: {
        low: obj.SATVR25 !== "NULL" ? ~~obj.SATVR25 + ~~obj.SATMT25 : "-",
        average:
          obj.SAT_AVG !== "NULL" || obj.SAT_AVG === 0 ? ~~obj.SAT_AVG : "-",
        high:
          obj.SATVR75 !== "NULL" || obj.SATVR75 === 0
            ? ~~obj.SATVR75 + ~~obj.SATMT75
            : "-",
      },
      cost: {
        academic_year_avg:
          academic_year_avg === "NaN" ? "-" : academic_year_avg,
        in_state_tuition: in_state_tuition === "NaN" ? "-" : in_state_tuition,
        out_of_state_tuition:
          out_of_state_tuition === "NaN" ? "-" : out_of_state_tuition,
      },
      students: {
        size: size === "NaN" ? "-" : size,
        men: !!men ? men : "-",
        women: !!women ? women : "-",
        entry_age_avg: age === "NaN" ? "-" : age,
        demographics: {
          white: !!white || white === 0 ? white : "-",
          black: !!black || black === 0 ? black : "-",
          hispanic: !!hispanic || hispanic === 0 ? hispanic : "-",
          asian: !!asian || asian === 0 ? asian : "-",
          international:
            !!international || international === 0 ? international : "-",
          other: !!other || other === 0 ? other : "-",
        },
      },
    },
  };
}

module.exports.parseInstitutions = parseInstitutions;
module.exports.parseJoinedAndOutputPerFile = parseJoinedAndOutputPerFile;
