const vscode = require('vscode');

const TEST_OR_SUBJECT_NOT_FOUND = 'Could\'t find test/test subject';

const getCurrentFileDetails = filePath => {
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

const handleSearch = filesArray => {
  if (filesArray && filesArray.length > 0) {
    let matches = [];
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
        .then(selectedItem => {
          if (selectedItem) {
            vscode.workspace.openTextDocument(selectedItem.detail)
              .then(doc => {
                vscode.window.showTextDocument(doc)
              });
          }
        });
    } else {
      vscode.workspace.openTextDocument(matches[0].detail)
        .then(doc => vscode.window.showTextDocument(doc));
    }
  } else {
    vscode.window.showInformationMessage(TEST_OR_SUBJECT_NOT_FOUND);
  }
};

const getTestSubjectPattern = fileName => {
  const regex = /^(.+)(?:(?:.[Tt]est)|(?:[Tt]est)|(?:.[Tt]ests)|(?:[Tt]ests)|(?:.[Ss]pec))\.js$/g
  const testSubjectName = regex.exec(fileName);
  let finalTestSubjectName;
  try {
    finalTestSubjectName = testSubjectName[1].substring(0, testSubjectName[1].toLowerCase().indexOf('test'))
  } catch (error) {
    vscode.window.showInformationMessage(TEST_OR_SUBJECT_NOT_FOUND);
  }
  const file = finalTestSubjectName.length > 0 ? finalTestSubjectName : testSubjectName[1];
  return `**/${file}.js`;
};

module.exports = {
  getCurrentFileDetails,
  handleSearch,
  getTestSubjectPattern
}