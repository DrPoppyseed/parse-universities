function stateFIPSToJap(value) {
  const fipsMap = new Map([
    [1, "アラバマ州"],
    [2, "アラスカ州"],
    [4, "アリゾナ州"],
    [5, "アーカンソー州"],
    [6, "カリフォルニア州"],
    [8, "コロラド州"],
    [9, "コネチケット州"],
    [10, "デラウェア州"],
    [11, "ワシントンDC"],
    [12, "フロリダ州"],
    [13, "ジョージア州"],
    [15, "ハワイ州"],
    [16, "アイダホ州"],
    [17, "イリノイ州"],
    [18, "インディアナ州"],
    [19, "アイオワ州"],
    [20, "カンザス州"],
    [21, "ケンタッキー州"],
    [22, "ルイジアナ州"],
    [23, "メイン州"],
    [24, "メリーランド州"],
    [25, "マサチューセッツ州"],
    [26, "ミシガン州"],
    [27, "ミネソタ州"],
    [28, "ミシシッピ州"],
    [29, "ミズーリ州"],
    [30, "モンタナ州"],
    [31, "ネブラスカ州"],
    [32, "ネバダ州"],
    [33, "ニューハンプシャー州"],
    [34, "ニュージャージー州"],
    [35, "ニューメキシコ州"],
    [36, "ニューヨーク州"],
    [37, "ノースキャロライナ州"],
    [38, "ノースダコタ州"],
    [39, "オハイオ州"],
    [40, "オクラホマ州"],
    [41, "オレゴン州"],
    [42, "ペンシルベニア州"],
    [44, "ロードアイランド州"],
    [45, "サウスキャロライナ州"],
    [46, "サウスダコタ州"],
    [47, "テネシー州"],
    [48, "テキサス州"],
    [49, "ユタ州"],
    [50, "バーモント州"],
    [51, "バージニア州"],
    [53, "ワシントン州"],
    [54, "ウェストバージニア州"],
    [55, "ウィスコンシン州"],
    [56, "ワイオミング州"],
    [60, "アメリカ領サモア"],
    [64, "ミクロネシア連邦"],
    [66, "グアム"],
    [69, "北マリアナ諸島"],
    [70, "パラオ"],
    [72, "プエルトリコ"],
    [78, "アメリカ領ヴァージン諸島"],
  ]);
  if (value) {
    return fipsMap.get(~~value);
  } else {
    return "-";
  }
}

function stateFIPSToEng(value) {
  const fipsMap = new Map([
    [1, "Alabama"],
    [2, "Alaska"],
    [4, "Arizona"],
    [5, "Arkansas"],
    [6, "California"],
    [8, "Colorado"],
    [9, "Connecticut"],
    [10, "Delaware"],
    [11, "District of Columbia"],
    [12, "Florida"],
    [13, "Georgia"],
    [15, "Hawaii"],
    [16, "Idaho"],
    [17, "Illinois"],
    [18, "Indiana"],
    [19, "Iowa"],
    [20, "Kansas"],
    [21, "Kentucky"],
    [22, "Louisiana"],
    [23, "Maine"],
    [24, "Maryland"],
    [25, "Massachusetts"],
    [26, "Michigan"],
    [27, "Minnesota"],
    [28, "Mississippi"],
    [29, "Missouri"],
    [30, "Montana"],
    [31, "Nebraska"],
    [32, "Nevada"],
    [33, "New Hampshire"],
    [34, "New Jersey"],
    [35, "New Mexico"],
    [36, "New York"],
    [37, "North Carolina"],
    [38, "North Dakota"],
    [39, "Ohio"],
    [40, "Oklahoma"],
    [41, "Oregon"],
    [42, "Pennsylvania"],
    [44, "Rhode Island"],
    [45, "South Carolina"],
    [46, "South Dakota"],
    [47, "Tennessee"],
    [48, "Texas"],
    [49, "Utah"],
    [50, "Vermont"],
    [51, "Virginia"],
    [53, "Washington"],
    [54, "West Virginia"],
    [55, "Wisconsin"],
    [56, "Wyoming"],
    [60, "American Samoa"],
    [64, "Federated States of Micronesia"],
    [66, "Guam"],
    [69, "Northern Mariana Islands"],
    [70, "Palau"],
    [72, "Puerto Rico"],
    [78, "Virgin Islands"],
  ]);
  if (value) {
    return fipsMap.get(~~value);
  } else {
    return "-";
  }
}

function schoolNameToUrl(name) {
  let res = name
    .toLowerCase()
    .replace(/[^a-z0-9 -&\(\)]+/g, "")
    .split(" ")
    .join("-");
  return res;
}

function yearType(value) {
  switch (~~value) {
    case 0:
      return "指定なし";
    case 1:
      return "専門学校";
    case 2:
      return "２年制";
    case 3:
      return "４年制";
    case 4:
      return "大学院";
    default:
      return "-";
  }
}

function schoolType(value) {
  switch (~~value) {
    case 1:
      return "公立";
    case 2:
      return "私立";
    case 3:
      return "私立";
    case 4:
      return "-";
  }
}

function schoolTypeFlag(flagArr) {
  return flagArr.filter((flag) => {
    if (flag === 1) {
    }
  });
}

function calcStudentDemoOther(demoArr) {
  const accum = demoArr.reduce(
    (prev, cur) =>
      Number(parseFloat(cur).toFixed(3)) + Number(parseFloat(prev).toFixed(3)),
    0
  );
  return toPercent(1 - Number(accum.toFixed(3)));
}

function toPercent(float) {
  const num = (parseFloat(float) * 100).toFixed(1);
  return Number(num);
}

function toDollars(float) {
  return new Intl.NumberFormat().format(float);
}

module.exports.stateFIPSToJap = stateFIPSToJap;
module.exports.stateFIPSToEng = stateFIPSToEng;
module.exports.schoolNameToUrl = schoolNameToUrl;
module.exports.yearType = yearType;
module.exports.schoolType = schoolType;
module.exports.schoolTypeFlag = schoolTypeFlag;
module.exports.calcStudentDemoOther = calcStudentDemoOther;
module.exports.toPercent = toPercent;
module.exports.toDollars = toDollars;
