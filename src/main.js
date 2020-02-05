const vscode = require('vscode');
const util = require('./util');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let goToTest = vscode.commands.registerCommand('gtt.goToTest', () => {
    // Get filename
    const { fileName, fileNameFull, isTest } = util.getCurrentFileDetails(vscode.window.activeTextEditor.document.fileName);
    let testPattern;
    if (isTest) {
      testPattern = util.getTestSubjectPattern(fileNameFull);
    } else {
      testPattern = `**/${fileName}{.[Ss]pec,[Tt]est*}*.js`;
    }
    vscode.workspace.findFiles(testPattern, '**/{node_modules,\.vscode}/*', 10).then(filesArray => util.handleSearch(filesArray));
  });
  context.subscriptions.push(goToTest);
}
exports.activate = activate;

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
