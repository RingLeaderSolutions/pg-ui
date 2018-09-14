"use strict";
module.exports = function (contents) {
    var regExp = /\${(.+?[^}])}/g;

    let tempContents = contents;    
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