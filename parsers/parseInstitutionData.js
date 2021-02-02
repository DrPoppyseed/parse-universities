const fs = require("fs");
const csv = require("csvtojson");

function parseInstitutions(from, to) {
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

function _extractInfoFromCsv(obj) {
	return {
		unitid: obj.UNITID,
		opeid: obj.OPEID,
		opeid6: obj.OPEID6,
		name: obj.INSTNM,
	};
}

function searchByUniversityName(name) {
	
}

module.exports.parseInstitutions = parseInstitutions;

