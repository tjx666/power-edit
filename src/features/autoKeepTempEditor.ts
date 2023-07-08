import type { ExtensionContext } from 'vscode';
import vscode from 'vscode';

export function autoKeepTempEditor(context: ExtensionContext) {
    vscode.workspace.onDidOpenTextDocument(
        async (document) => {
            const { uri } = document;
            const isGitErrorEditor = uri.scheme === 'git-output' && /\/git-error-/.test(uri.fsPath);
            if (isGitErrorEditor) {
                await vscode.commands.executeCommand('workbench.action.keepEditor');
            }
        },
        null,
        context.subscriptions,
    );
}
