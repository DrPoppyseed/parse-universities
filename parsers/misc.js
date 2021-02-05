const fs = require("fs");

function prettifyParsedMajors(filepath) {
	const parsedData = _parsedJsonData(filepath);
	const parsedCIPData = _parsedJsonData("./output/cip/ciplookup.json");
	const credDescJapMap = new Map([
		["1", "学士認定"],
		["2", "准学士"],
		["3", "学士"],
		["4", "ポストバカロレア認定"],
		["5", "修士"],
		["6", "博士"],
		["7", "第一次専門職学位"],
		["8", "大学院/専門職認定"],
	]);

	let obj = {
		...parsedData,
		programsPerCredLev: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			7: 0,
			8: 0,
		},
		majors: {},
	};
	let deptCode = "00";
	let deptDiscValueHolder = {
		majorCIP: "",
		majorTitle: "",
		majorDesc: "",
		majorTitleJap: "",
		majorDescJap: "",
		programs: [],
	};

	let tracker = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
	};
	let counter = 0;

	if (parsedData.majors.length <= 1) {
		const localDeptCode = parsedData.majors[0].cipCode.split("").slice(0, 2).join("");
		const localProgramCode = parsedData.majors[0].cipCode.split("").slice(2, 4).join("");
		const majorInfo = _parseAndLookupCIP(parsedCIPData, localDeptCode) || {major: 'Other', description: '', majorTitleJap: 'その他'}
		console.log(parsedData.majors[0].cipCode)
		majorTitle = majorInfo.major;
		majorDesc = majorInfo.description;
		majorTitleJap = majorInfo.majorTitleJap;
		obj = {
			...obj,
			majors: {
				...obj.majors,
				[`${deptCode}`]: {
					...deptDiscValueHolder,
					majorCIP: deptCode,
					majorTitle,
					majorDesc,
					majorTitleJap,
					programs: [...deptDiscValueHolder.programs],
				},
			},
		};
	} else {
		for (const program of parsedData.majors) {
			const localDeptCode = program.cipCode.split("").slice(0, 2).join("");
			const localProgramCode = program.cipCode.split("").slice(2, 4).join("");
			counter++;

			if (localDeptCode === deptCode) {
				tracker[`${program.credLev}`] = tracker[`${program.credLev}`] + 1;
				deptDiscValueHolder.programs.push({
					..._extractUsefulData(localProgramCode, program, credDescJapMap),
					nameJap: "",
					descJap: "",
				});
			} else {
				let majorTitle = "";
				let majorDesc = "";
				let majorTitleJap = "";
				if (deptCode !== "00" || parsedData.majors.length === counter) {
					const majorInfo = _parseAndLookupCIP(parsedCIPData, deptCode) || {major: 'Other', description: '', majorTitleJap: 'その他'}
					majorTitle = majorInfo.major;
					majorDesc = majorInfo.description;
					majorTitleJap = majorInfo.majorTitleJap;
					if (program.credLev)
						tracker[`${program.credLev}`] = tracker[`${program.credLev}`] + 1;
					obj = {
						...obj,
						majors: {
							...obj.majors,
							[`${deptCode}`]: {
								...deptDiscValueHolder,
								majorCIP: deptCode,
								majorTitle,
								majorDesc,
								majorTitleJap,
								programs: [...deptDiscValueHolder.programs],
							},
						},
					};
				}
				deptCode = localDeptCode;
				deptDiscValueHolder = {
					majorCIP: deptCode,
					majorTitle,
					majorDesc,
					majorTitleJap,
					majorDescJap: "",
					programs: [
						{
							..._extractUsefulData(localProgramCode, program, credDescJapMap),
							nameJap: "",
							descJap: "",
						},
					],
				};
			}
		}
		const majorInfo = _parseAndLookupCIP(parsedCIPData, deptCode) || {major: 'Other', description: '', majorTitleJap: 'その他'}
		majorTitle = majorInfo.major;
		majorDesc = majorInfo.description;
		majorTitleJap = majorInfo.majorTitleJap;
		obj = {
			...obj,
			majors: {
				...obj.majors,
				[`${deptCode}`]: {
					...deptDiscValueHolder,
					majorCIP: deptCode,
					majorTitle,
					majorDesc,
					majorTitleJap,
					programs: [...deptDiscValueHolder.programs],
				},
			},
		};
	}

	const outputFilepath = `./output/majorsJsonUnitidClean/${obj.unitid}.json`;
	_createJsonFile(outputFilepath, {
		...obj,
		programsPerCredLev: tracker,
		majors: {
			...obj.majors,
		},
	});
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
	return target;
}

function _extractUsefulData(localProgramCode, program, credDescJapMap) {
	if (program.credLev === "3" && program.credDesc !== "Bachelor's Degree") {
		program.credDesc = "Bachelor's Degree";
	}

	return {
		code: localProgramCode,
		codeFull: program.cipCode,
		name: program.cipDesc,
		credLev: program.credLev,
		credDesc: program.credDesc,
		credDescJap: credDescJapMap.get(program.credLev),
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
	let arrayHolder = [];

	for (const item of parsedCIPData) {
		arrayHolder.push([item.cipcode, item.major, item.description]);
	}

	_createJsonFile("./output/cip/ciplookupTxt.txt", arrayHolder);
}

module.exports.prettifyParsedMajors = prettifyParsedMajors;
module.exports.cipToTxt = cipToTxt;