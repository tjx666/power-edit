import type { ExtensionContext, TextDocument, TextEditor } from 'vscode';
import vscode, { EndOfLine, TextEditorRevealType } from 'vscode';

export function autoScrollToFirstConflict(context: ExtensionContext) {
    const revealedDocuments = new Set<TextDocument>();

    const goToFirstConflict = (editor: TextEditor | undefined) => {
        if (editor) {
            const { document } = editor;
            if (revealedDocuments.has(document)) return;

            const text = document.getText();

            const lineEnding = document.eol === EndOfLine.LF ? '\n' : '\r\n';
            const currentChangeMark = `<<<<<<< HEAD${lineEnding}`;
            const currentChangeIndex = text.indexOf(currentChangeMark);
            if (currentChangeIndex === -1) return;

            const incomingChangeMark = '>>>>>>> ';
            const incomingChangeIndex = text.indexOf(incomingChangeMark, currentChangeIndex);
            if (incomingChangeIndex === -1) return;

            const start = document.positionAt(currentChangeIndex);
            const end = document.positionAt(incomingChangeIndex + incomingChangeMark.length);
            const range = new vscode.Range(start, end);
            editor.revealRange(range, TextEditorRevealType.InCenter);
        }
    };

    // If the file already open when startup vscode, will not trigger onDidChangeActiveTextEditor
    goToFirstConflict(vscode.window.activeTextEditor);

    vscode.window.onDidChangeActiveTextEditor(goToFirstConflict, null, context.subscriptions);

    vscode.workspace.onDidCloseTextDocument((document) => {
        revealedDocuments.delete(document);
    });
}
