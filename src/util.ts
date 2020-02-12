import * as vscode from 'vscode';
import * as constants from './constants';

interface Match {
  label: string;
  detail: string;
}

export const getCurrentFileDetails = (filePath: string) => {
  const parts = filePath.split('/');
  const fileNameWithExtension = parts[parts.length - 1];
  const fileName = fileNameWithExtension.split(".")[0];

  const matchRegex = /.*((\.[Ss]pec)|([Tt]est.*).*\.js)/g;
  const match = fileNameWithExtension.match(matchRegex);

  return {
    fileName,
    fileNameWithExtension,
    isTest: match === null ? false : true
  };
};

export const handleSearch = (filesArray: Array<vscode.Uri>) => {
  if (filesArray && filesArray.length > 0) {
    let matches: Array<Match> = [];
    filesArray.forEach(uri => {
      matches.push(
        {
          label: uri.fsPath.split('/').slice(-1)[0],
          detail: uri.fsPath
        }
      );
    });

    if (matches.length > 1) {
      vscode.window.showQuickPick(matches, { canPickMany: false, matchOnDetail: true })
        .then(match => {
          if (match) {
            vscode.workspace.openTextDocument(match.detail)
              .then(doc => vscode.window.showTextDocument(doc));
          }
        });
    } else {
      vscode.workspace.openTextDocument(matches[0].detail)
        .then(doc => vscode.window.showTextDocument(doc));
    }
  } else {
    vscode.window.showInformationMessage(constants.TEST_OR_SUBJECT_NOT_FOUND);
  }
};

export const getTestSubjectPattern = (fileName: string) => {
  const regex = new RegExp(/^(.+)(?:(?:.[Tt]est)|(?:[Tt]est)|(?:.[Tt]ests)|(?:[Tt]ests)|(?:.[Ss]pec))\.js$/g); // TODO: skriv om til /i
  const testSubjectName = regex.exec(fileName);
  let finalTestSubjectName = "";

  if (testSubjectName !== null) {
    finalTestSubjectName = testSubjectName[1].substring(0, testSubjectName[1].toLowerCase().indexOf('test'));
  } else {
    vscode.window.showInformationMessage(constants.TEST_OR_SUBJECT_NOT_FOUND);
  }

  let file = "";

  if (finalTestSubjectName.length > 0) {
    file = finalTestSubjectName;
  } else if (testSubjectName !== null && testSubjectName.length > 0) {
    file = testSubjectName[1];
  }

  return `**/${file}.js`;
};
