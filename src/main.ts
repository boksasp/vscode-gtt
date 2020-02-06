import * as vscode from 'vscode';
import * as util from './util';
import * as constants from './constants';

/**
 * @param {vscode.ExtensionContext} context
 */
export function activate(context: vscode.ExtensionContext) {
  let goToTest = vscode.commands.registerCommand('gtt.goToTest', () => {
    // Get filename
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor !== undefined) {
      const { fileName, fileNameFull, isTest } = util.getCurrentFileDetails(activeTextEditor.document.fileName);
      let testPattern;
      if (isTest) {
        testPattern = util.getTestSubjectPattern(fileNameFull);
      } else {
        testPattern = `**/${fileName}{.[Ss]pec,[Tt]est*}*.js`;
      }
      vscode.workspace.findFiles(testPattern, '**/{node_modules,\.vscode}/*', 10).then(filesArray => util.handleSearch(filesArray));
    } else {
      vscode.window.showInformationMessage(constants.ACTIVE_TEXT_EDITOR_UNDEFINED);
    }
  });
  context.subscriptions.push(goToTest);
}

export function deactivate() { }
