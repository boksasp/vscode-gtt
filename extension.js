const vscode = require('vscode');

const getFileName = filePath => {
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
    vscode.window.showInformationMessage('Could\'t find test/test subject');
  }
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let goToTest = vscode.commands.registerCommand('extension.goToTest', () => {
    // Get filename
    const { fileName, fileNameFull, isTest } = getFileName(vscode.window.activeTextEditor.document.fileName);
    const testPattern = `**/${fileName}{.[Ss]pec,[Tt]est*}*.js`;

    if (!isTest) {
      // Search for filename in workspace
      vscode.workspace.findFiles(testPattern, '**/{node_modules,\.vscode}/*', 10).then(filesArray => handleSearch(filesArray));
    } else {
      const regex = /^(.+)(?:(?:.[Tt]est)|(?:[Tt]est)|(?:.[Tt]ests)|(?:[Tt]ests)|(?:.[Ss]pec))\.js$/g
      const testSubjectName = regex.exec(fileNameFull);
      const finalTestSubjectName = testSubjectName[1].substring(0, testSubjectName[1].toLowerCase().indexOf('test'))
      const file = finalTestSubjectName.length > 0 ? finalTestSubjectName : testSubjectName[1];
      const testSubjectPattern = `**/${file}.js`;

      vscode.workspace.findFiles(testSubjectPattern, '**/{node_modules,\.vscode}/*', 10).then(filesArray => handleSearch(filesArray));
    }
  });
  context.subscriptions.push(goToTest);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
