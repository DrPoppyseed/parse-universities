# 🏫 Parse Univerisity Data

## ❓What is this?
There is an abundance of useful information concerning colleges and universities collected by government agencies. However, you don't need all the info they provide, just the stuff that's really important. So, I parse-universities is an attempt to simplify the process, and also converts csv to json for better ease of implementation in existing js based code bases.

## 🔭 Future Intentions
I intend on writing a more detailed documentation for the different parser functions, and a better quick start guide.

## 🚀 Quick Start
First, install the necessary npm dependencies for the project
```
npm install
```

Then, write the parser functions you wish. An example could be something like the following.
```
const parseSchools = require('./parsers/parseSchools.js')

parseSchools.parseForSchools(1, 10, 1)
```
Run the paser functions you wrote in index.js, and run.
```
node index.js
```
Create a folder named 'output' in the root directory, and write the following.
```
parseMajors.parseMajorsWithMap('./output/majors/schoolsInFile1.json')
```
Run the parser function.
```
node index.js
```

In the end, the index.js file should like below.
```
const parseShools = require('./parsers/parseShools.js')

parseSchools.parseForSchools(1, 10, 1)

parseMajors.parseMajorsWithMap('./output/majors/schoolsInFile1.json')
```

## 🔮 Parsers
I've written a couple different parser functions that serve different uses. 

### Parse CIP CSV and convert to JSON
Check [parsers/parseCIPLookup.js](https://github.com/DrPoppyseed/parse-universities/blob/main/parsers/parseCIPLookup.js).

Parses through [csv/cip/cipraw.csv](#) and outputs json file with the major's cipcode, name, and description, in the following format.
```
[
  ...,
  {
    "cipcode": "52.0305",
    "major": "Accounting and Business/Management",
    "description": "An integrated or combined program in accounting and business administration/management that prepares individuals to function as accountants and business managers."
  },
  ...
]

```

### Parse Majors with Stats
Check [parsers/parseMajors.js](https://github.com/DrPoppyseed/parse-universities/blob/main/parsers/parseMajors.js)

*Documentation coming soon*

### Parse Schools (Run this before using parseMajors)
Check [parsers/parseSchools.js](https://github.com/DrPoppyseed/parse-universities/blob/main/parsers/parseSchools.js)

*Documentation coming soon*