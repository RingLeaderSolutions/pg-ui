"use strict";
module.exports = function (contents) {
    var regExp = /\${(.+?[^}])}/g;

    let tempContents = contents;    
    var result;
    while ((result = regExp.exec(contents))) {
        let token = result[0];
        let variableName = result[1];

        if(!process.env[variableName]) throw new Error(`Cannot substitute ${token} because environment variable ${variableName} does not exist`)

        let variableValue = process.env[variableName];
        tempContents = tempContents.replace(new RegExp(`\\${token}`), variableValue);
    }
    return tempContents;
}