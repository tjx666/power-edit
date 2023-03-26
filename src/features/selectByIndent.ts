import type { TextDocument, TextEditor } from 'vscode';
import { Selection, Range, Position } from 'vscode';

function getLineIndent(document: TextDocument, lineNumber: number) {
    if (lineNumber < 0 || lineNumber >= document.lineCount) return;

    const lineText = document.lineAt(lineNumber).text;
    const trimmedStartText = lineText.trimStart();
    // empty line
    if (trimmedStartText.length === 0) return;

    return lineText.length - lineText.trimStart().length;
}

function getIndentRange(document: TextDocument, currentIndent: number, currentLine: number) {
    let nextIndent: number | undefined;
    let lineNumberTop = currentLine - 1;
    let indentTop = lineNumberTop < 0 ? undefined : getLineIndent(document, lineNumberTop);
    // find up
    while (lineNumberTop >= 0 && (indentTop === undefined || indentTop >= currentIndent)) {
        lineNumberTop--;
        indentTop = getLineIndent(document, lineNumberTop);
    }

    if (indentTop !== undefined && indentTop < currentIndent) {
        nextIndent = indentTop;
    }

    // find down
    let lineNumberBottom = currentLine + 1;
    let indentBottom =
        lineNumberBottom >= document.lineCount
            ? undefined
            : getLineIndent(document, lineNumberBottom);
    while (
        lineNumberBottom < document.lineCount &&
        (indentBottom === undefined || indentBottom >= currentIndent)
    ) {
        lineNumberBottom++;
        indentBottom = getLineIndent(document, lineNumberBottom);
    }

    return {
        range: new Range(
            new Position(lineNumberTop + 1, 0),
            document.lineAt(lineNumberBottom - 1).range.end,
        ),
        nextIndent,
    };
}

export function selectByIndent(editor: TextEditor, selection: Selection) {
    const { document } = editor;
    const cursorLine = selection.anchor.line;
    let indent = getLineIndent(document, cursorLine);
    // cursor at empty line, use the indent of first line not empty
    if (indent === undefined) {
        // find up
        let lineNumberTop = cursorLine - 1;
        let indentTop = getLineIndent(document, lineNumberTop);
        while (lineNumberTop >= 0 && indentTop === undefined) {
            lineNumberTop -= 1;
            indentTop = getLineIndent(document, lineNumberTop);
        }

        // find down
        if (indentTop === undefined) {
            let lineNumberBottom = cursorLine + 1;
            let indentBottom = getLineIndent(document, lineNumberBottom);
            while (lineNumberBottom < document.lineCount && indentBottom === undefined) {
                lineNumberBottom += 1;
                indentBottom = getLineIndent(document, lineNumberBottom);
            }
            indent = indentBottom;
        } else {
            indent = indentTop;
        }
    }

    if (indent === undefined) return;

    let { range, nextIndent } = getIndentRange(document, indent, cursorLine);
    let newSelection = new Selection(range.start, range.end);
    // double select
    if (newSelection.isEqual(selection) && nextIndent !== undefined && range.start.line > 0) {
        range = getIndentRange(document, nextIndent, range.start.line - 1).range;
        newSelection = new Selection(range.start, range.end);
    }
    return newSelection;
}

export function selectByIndentMultiCursor(editor: TextEditor) {
    editor.selections = editor.selections.map((originSelection) => {
        return selectByIndent(editor, originSelection) ?? originSelection;
    });
}
