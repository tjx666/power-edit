import type { ExtensionContext, TextEditor, TextEditorEdit } from 'vscode';
import { commands } from 'vscode';

export function activate(context: ExtensionContext) {
    import('./features/autoKeepTempEditor').then((mod) => mod.autoKeepTempEditor(context));
    import('./features/autoScrollToFirstConflict').then((mod) =>
        mod.autoScrollToFirstConflict(context),
    );

    const registerTextEditorCommand = (
        commandName: string,
        callback: (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void,
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

    registerTextEditorCommand('selectBracketContent', (editor: TextEditor) =>
        import('./features/bracketSelect/index').then((mod) =>
            mod.selectBracketMultiCursor(editor, false),
        ),
    );

    registerTextEditorCommand('selectBracket', (editor: TextEditor) =>
        import('./features/bracketSelect/index').then((mod) =>
            mod.selectBracketMultiCursor(editor, true),
        ),
    );

    registerTextEditorCommand('selectByIndent', (editor: TextEditor) =>
        import('./features/selectByIndent').then((mod) => mod.selectByIndentMultiCursor(editor)),
    );

    registerTextEditorCommand('goToSymbolInEditor', (editor: TextEditor) =>
        import('./features/goToSymbolInEditor').then((mod) => mod.goToSymbolInEditor(editor)),
    );

    context.subscriptions.push(
        commands.registerCommand('power-edit.searchInGitChangedFiles', () =>
            import('./features/searchInGitChangedFiles').then((mod) =>
                mod.searchInGitChangedFiles(),
            ),
        ),
    );
}

export function deactivate() {}
