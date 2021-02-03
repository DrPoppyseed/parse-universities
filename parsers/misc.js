const fs = require("fs");

function prettifyParsedMajors(filepath) {
	const parsedData = _parsedJsonData(filepath);
	const parsedCIPData = _parsedJsonData("./output/cip/ciplookup.json");

	let obj = {
		...parsedData,
		majors: {},
	};
	let deptCode = "00";
	let deptDiscValueHolder = {
		majorCIP: "",
		majorTitle: "",
		majorDesc: "",
		programs: [],
	};

	for (const program of parsedData.majors) {
		const localDeptCode = program.cipCode.split("").slice(0, 2).join("");
		const localProgramCode = program.cipCode.split("").slice(2, 4).join("");

		if (localDeptCode === deptCode) {
			deptDiscValueHolder.programs.push({
				..._extractUsefulData(localProgramCode, program),
				nameJap: "",
			});
		} else {
			let majorTitle = "",
				majorDesc = "";
			if (deptCode !== "00") {
				const majorInfo = _parseAndLookupCIP(parsedCIPData, deptCode);
				majorTitle = majorInfo.major;
				majorDesc = majorInfo.description;
				obj = {
					...obj,
					majors: {
						...obj.majors,
						[`${deptCode}`]: { ...deptDiscValueHolder },
					},
				};
			}
			deptCode = localDeptCode;
			deptDiscValueHolder = {
				majorCIP: deptCode,
				majorTitle: majorTitle,
				majorDesc: majorDesc,
				programs: [
					{
						..._extractUsefulData(localProgramCode, program),
						nameJap: "",
					},
				],
			};
		}
	}
	const outputFilepath = `./output/majorsJsonUnitidClean/${obj.unitid}.json`;
	_createJsonFile(outputFilepath, obj);
}

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
}

function _formatCIP(target) {
	if (target.length > 3) {
		let temp = target.split("");
		temp.splice(2, 0, ".");
		return temp.join("");
	}
	return target
}

function _extractUsefulData(localProgramCode, program) {
	return {
		code: localProgramCode,
		codeFull: program.cipCode,
		name: program.cipDesc,
		credLev: program.credLev,
		credDesc: program.credDesc,
		graduates: program.graduates,
		medianIncome1: program.medianIncome1,
		medianIncome2: program.medianIncome2,
	};
}

function _createJsonFile(outputFilepath, jsObj) {
	fs.writeFile(outputFilepath, JSON.stringify(jsObj), (err) => {
		if (err) console.log(err);
		console.log(`${outputFilepath} file successfully created!`);
	});
}

function cipToTxt() {
	const parsedCIPData = _parsedJsonData("./output/cip/ciplookup.json");	
	let arrayHolder = []

	for (const item of parsedCIPData) {
		arrayHolder.push([item.cipcode, item.major, item.description])
	}

	_createJsonFile('./output/cip/ciplookupTxt.txt', arrayHolder)
} 

module.exports.prettifyParsedMajors = prettifyParsedMajors;
module.exports.cipToTxt = cipToTxt;