/**
 * migrate from https://github.com/jhasse/vscode-bracket-select/blob/master/src/bracketSelectMain.ts
 */

import vscode from 'vscode';

import { isBracketsMatch, isCloseBracket, isOpenBracket, isQuoteBracket } from './utils';
import { configuration } from '../../configuration';

class SearchResult {
    bracket: string;
    offset: number;

    constructor(bracket: string, offset: number) {
        this.bracket = bracket;
        this.offset = offset;
    }
}

function findBackward(text: string, offset: number): SearchResult | void {
    const bracketStack: string[] = [];
    for (let i = offset; i >= 0; i--) {
        const char = text.charAt(i);
        // if it's a quote, we can not infer it is a open or close one
        // so just return, this is for the case current selection is inside a string;
        if (isQuoteBracket(char) && bracketStack.length === 0) {
            return new SearchResult(char, i);
        }

        if (isOpenBracket(char)) {
            if (bracketStack.length === 0) {
                return new SearchResult(char, i);
            } else {
                const top = bracketStack.pop()!;
                if (!isBracketsMatch(char, top)) {
                    throw new Error('Unmatched bracket pair');
                }
            }
        } else if (isCloseBracket(char)) {
            bracketStack.push(char);
        }
    }
}

function findForward(text: string, index: number): SearchResult | void {
    const bracketStack: string[] = [];
    for (let i = index; i < text.length; i++) {
        const char = text.charAt(i);
        if (isQuoteBracket(char) && bracketStack.length === 0) {
            return new SearchResult(char, i);
        }

        if (isCloseBracket(char)) {
            if (bracketStack.length === 0) {
                return new SearchResult(char, i);
            } else {
                const top = bracketStack.pop()!;
                if (!isBracketsMatch(top, char)) {
                    throw new Error('Unmatched bracket pair');
                }
            }
        } else if (isOpenBracket(char)) {
            bracketStack.push(char);
        }
    }
}

function getSearchContext(editor: vscode.TextEditor, selection: vscode.Selection) {
    const selectionStart = editor.document.offsetAt(selection.start);
    const selectionEnd = editor.document.offsetAt(selection.end);
    return {
        backwardStarter: selectionStart - 1,
        forwardStarter: selectionEnd,
        text: editor.document.getText(),
    };
}

export async function selectBracketMultiCursor(editor: vscode.TextEditor, includeBracket: boolean) {
    editor.selections = editor.selections.map((originSelection) => {
        return selectBracket(editor, originSelection, includeBracket) ?? originSelection;
    });
    if (configuration.copyWhenSelectBracket) {
        await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
    }
}

function selectBracket(
    editor: vscode.TextEditor,
    selection: vscode.Selection,
    includeBracket: boolean,
): vscode.Selection | void {
    const searchContext = getSearchContext(editor, selection);
    const { text, backwardStarter, forwardStarter } = searchContext;
    if (backwardStarter < 0 || forwardStarter >= text.length) {
        return;
    }

    let selectionStart: number, selectionEnd: number;
    let backwardResult = findBackward(searchContext.text, searchContext.backwardStarter);
    let forwardResult = findForward(searchContext.text, searchContext.forwardStarter);

    if (backwardResult !== undefined) {
        while (
            forwardResult !== undefined &&
            isQuoteBracket(forwardResult.bracket) &&
            !isBracketsMatch(backwardResult.bracket, forwardResult.bracket)
        ) {
            forwardResult = findForward(searchContext.text, forwardResult.offset + 1);
        }
    }

    if (forwardResult !== undefined) {
        while (
            backwardResult !== undefined &&
            isQuoteBracket(backwardResult.bracket) &&
            !isBracketsMatch(backwardResult.bracket, forwardResult.bracket)
        ) {
            backwardResult = findBackward(searchContext.text, backwardResult.offset - 1);
        }
    }

    if (
        backwardResult === undefined ||
        forwardResult === undefined ||
        !isBracketsMatch(backwardResult.bracket, forwardResult.bracket)
    ) {
        vscode.window.setStatusBarMessage('No matched bracket pairs found', 3000);
        return;
    }

    // we are next to a bracket
    // this is the case for double press select
    if (backwardStarter === backwardResult.offset && forwardResult.offset === forwardStarter) {
        selectionStart = backwardStarter - 1;
        selectionEnd = forwardStarter + 1;
    } else {
        if (includeBracket) {
            selectionStart = backwardResult.offset - 1;
            selectionEnd = forwardResult.offset + 1;
        } else {
            selectionStart = backwardResult.offset;
            selectionEnd = forwardResult.offset;
        }
    }

    return new vscode.Selection(
        editor.document.positionAt(selectionStart + 1),
        editor.document.positionAt(selectionEnd),
    );
}
