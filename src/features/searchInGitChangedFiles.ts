import cp from 'node:child_process';
import util from 'node:util';

import vscode from 'vscode';

const exec = util.promisify(cp.exec);

export async function searchInGitChangedFiles() {
    let cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!cwd) {
        return vscode.window.showErrorMessage('No workspace is opened');
    }

    // maybe the workspace is in a subdirectory of the git repo
    let { stdout: gitRepoDir } = await exec('git rev-parse --show-toplevel', { cwd });
    gitRepoDir = gitRepoDir.trim();
    if (!gitRepoDir) {
        return vscode.window.showErrorMessage('Not a Git repository');
    }

    cwd = gitRepoDir;
    const outputList = await Promise.all([
        // staged
        exec('git diff --name-only --cached', { cwd }),
        // changed and not staged
        exec('git diff --name-only', { cwd }),
        // new added
        exec('git ls-files --others --exclude-standard', { cwd }),
    ]);
    if (outputList.some(({ stderr }) => stderr)) {
        return vscode.window.showErrorMessage('Failed to detect Git changes');
    }

    let changedFiles = outputList
        .map(({ stdout }) => stdout)
        .join('\n')
        .split(/\r?\n/)
        .filter((line) => line.trim() !== '');
    changedFiles = [...new Set(changedFiles)];

    return vscode.commands.executeCommand('workbench.action.findInFiles', {
        triggerSearch: true,
        searchDetail: true,
        filesToInclude: changedFiles.join(', '),
    });
}
