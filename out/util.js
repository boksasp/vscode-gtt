"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constants = require("./constants");
exports.getCurrentFileDetails = (filePath) => {
    const parts = filePath.split('/');
    const fileNameFull = parts[parts.length - 1];
    const fileName = fileNameFull.split(".")[0];
    const matchRegex = /.*((\.[Ss]pec)|([Tt]est.*).*\.js)/g;
    const isTest = fileNameFull.match(matchRegex);
    return {
        fileName,
        fileNameFull,
        isTest
    };
};
exports.handleSearch = (filesArray) => {
    if (filesArray && filesArray.length > 0) {
        let matches = [];
        filesArray.forEach(uri => {
            matches.push({
                label: uri.fsPath.split('/').slice(-1)[0],
                detail: uri.fsPath
            });
        });
        if (matches.length > 1) {
            vscode.window.showQuickPick(matches, { canPickMany: false, matchOnDetail: true })
                .then(match => {
                if (match) {
                    vscode.workspace.openTextDocument(match.detail)
                        .then(doc => vscode.window.showTextDocument(doc));
                }
            });
        }
        else {
            vscode.workspace.openTextDocument(matches[0].detail)
                .then(doc => vscode.window.showTextDocument(doc));
        }
    }
    else {
        vscode.window.showInformationMessage(constants.TEST_OR_SUBJECT_NOT_FOUND);
    }
};
exports.getTestSubjectPattern = (fileName) => {
    const regex = new RegExp(/^(.+)(?:(?:.[Tt]est)|(?:[Tt]est)|(?:.[Tt]ests)|(?:[Tt]ests)|(?:.[Ss]pec))\.js$/g); // TODO: skriv om til /i
    const testSubjectName = regex.exec(fileName);
    let finalTestSubjectName = "";
    if (testSubjectName !== null) {
        finalTestSubjectName = testSubjectName[1].substring(0, testSubjectName[1].toLowerCase().indexOf('test'));
    }
    else {
        vscode.window.showInformationMessage(constants.TEST_OR_SUBJECT_NOT_FOUND);
    }
    let file = "";
    if (finalTestSubjectName.length > 0) {
        file = finalTestSubjectName;
    }
    else if (testSubjectName !== null && testSubjectName.length > 0) {
        file = testSubjectName[1];
    }
    return `**/${file}.js`;
};
//# sourceMappingURL=util.js.map