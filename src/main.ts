import * as vscode from 'vscode';
import * as util from './util';
import * as constants from './constants';

/**
 * @param {vscode.ExtensionContext} context
 */
export const activate = (context: vscode.ExtensionContext) => {
  const goToTest = vscode.commands.registerCommand('gtt.goToTest', () => {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (activeTextEditor !== undefined) {
      const { fileName, fileNameWithExtension, isTest } = util.getCurrentFileDetails(activeTextEditor.document.fileName);
      let globPattern;

      if (isTest) {
        globPattern = util.getTestSubjectPattern(fileNameWithExtension);
      } else {
        globPattern = `**/${fileName}{*[Ss]pec,*[Tt]est*}*.js`;
      }

      vscode.workspace.findFiles(globPattern, '**/{node_modules,\.vscode}/*', 10).then(filesArray => util.handleSearch(filesArray));
    } else {
      vscode.window.showInformationMessage(constants.ACTIVE_TEXT_EDITOR_UNDEFINED);
    }
  });
  context.subscriptions.push(goToTest);
};

export const deactivate = () => {};
