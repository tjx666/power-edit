import vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const { commands } = vscode;

    const registerTextEditorCommand = (
        commandName: string,
        callback: (
            textEditor: vscode.TextEditor,
            edit: vscode.TextEditorEdit,
            ...args: any[]
        ) => void,
        thisArg?: any,
    ) => {
        const cmd = commands.registerTextEditorCommand(
            `power-edit.${commandName}`,
            callback,
            thisArg,
        );
        context.subscriptions.push(cmd);
        return cmd;
    };

    registerTextEditorCommand('selectBracketContent', (editor: vscode.TextEditor) =>
        import('./features/bracketSelect/index').then((mod) =>
            mod.selectBracketMultiCursor(editor, false),
        ),
    );

    registerTextEditorCommand('selectBracket', (editor: vscode.TextEditor) =>
        import('./features/bracketSelect/index').then((mod) =>
            mod.selectBracketMultiCursor(editor, true),
        ),
    );

    registerTextEditorCommand('selectByIndent', (editor: vscode.TextEditor) =>
        import('./features/selectByIndent').then((mod) => mod.selectByIndentMultiCursor(editor)),
    );
}

export function deactivate() {}
