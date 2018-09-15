"use strict";

const versionToken = '@{TPIFLOW_VERSION}';

var pjson = require('../../../package.json');
const version = pjson.version;

module.exports = function (contents) {
    var regExp = /\${(.+?[^}])}/g;

    let tempContents = contents;    

    // Static replacement for the version - pulled from package.config
    tempContents = tempContents.replace("@{TPIFLOW_VERSION}", version);
    console.log(`[ConfigSubstitutor] - [INFO]: Replaced version token [${versionToken}] with [${version}]`);

    var result;
    while ((result = regExp.exec(contents))) {
        let token = result[0];
        let variableName = result[1];

        if(!process.env[variableName]) {
            var errorMessage = `[ConfigSubstitutor] - [FATAL]: Cannot substitute token [${token}] because environment variable [${variableName}] does not exist`;
            console.log(errorMessage);
            throw new Error(errorMessage)
        }

        let variableValue = process.env[variableName];
        tempContents = tempContents.replace(new RegExp(`\\${token}`), variableValue);
        console.log(`[ConfigSubstitutor] - [INFO]: Replaced [${token}] with [${variableValue}]`);
    }
    return tempContents;
}