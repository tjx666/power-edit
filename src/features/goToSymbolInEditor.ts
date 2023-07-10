import type { TextEditor } from 'vscode';
import vscode from 'vscode';

export async function goToSymbolInEditor(editor: TextEditor) {
    const cursorPosition = editor.selection.active;
    const wordRange = editor.document.getWordRangeAtPosition(cursorPosition);
    if (!wordRange) return;

    const currentWord = editor.document.getText(wordRange);
    await vscode.commands.executeCommand('workbench.action.quickOpen', `@ ${currentWord}`);
}
