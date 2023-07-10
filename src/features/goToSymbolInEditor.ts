import type { TextEditor } from 'vscode';
import vscode from 'vscode';

export async function goToSymbolInEditor(editor: TextEditor) {
    const cursorPosition = editor.selection.active;
    const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
    if (!wordRange) {
        return vscode.commands.executeCommand('workbench.action.gotoSymbol');
    }

    const currentWord = editor.document.getText(wordRange);
    return vscode.commands.executeCommand('workbench.action.quickOpen', `@${currentWord}`);
}
