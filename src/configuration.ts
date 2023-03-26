import vscode from 'vscode';

interface Configuration {
    copyWhenSelectBracket: boolean;
}

export const configuration: Configuration = {} as Configuration;
updateConfiguration();

export function updateConfiguration() {
    const extensionConfig = vscode.workspace.getConfiguration('power-edit');
    configuration.copyWhenSelectBracket = extensionConfig.get('copyWhenSelectBracket')!;
}
