import cp from 'node:child_process';
import util from 'node:util';

import vscode from 'vscode';

const exec = util.promisify(cp.exec);

export async function searchInGitChangedFiles() {
    let cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!cwd) {
        return vscode.window.showErrorMessage('No workspace is opened');
    }

    let { stdout: gitRepoDir } = await exec('git rev-parse --show-toplevel', { cwd });
    gitRepoDir = gitRepoDir.trim();
    if (!gitRepoDir) {
        return vscode.window.showErrorMessage('Not a Git repository');
    }

    cwd = gitRepoDir;
    // Step 1: Detect Git changes
    const [modifiedFilesOutput, addedFilesOutput] = await Promise.all([
        exec('git diff --name-only', { cwd }),
        exec('git ls-files --others --exclude-standard', { cwd }),
    ]);
    if (modifiedFilesOutput.stderr || addedFilesOutput.stderr) {
        return vscode.window.showErrorMessage('Failed to detect Git changes');
    }

    const changedFiles = `${modifiedFilesOutput.stdout}\n${addedFilesOutput.stdout}`
        .split(/\r?\n/)
        .filter(Boolean);

    return vscode.commands.executeCommand('workbench.action.findInFiles', {
        triggerSearch: true,
        filesToInclude: changedFiles.join(', '),
    });
}
