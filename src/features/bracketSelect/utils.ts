const openBrackets = ['(', '{', '['];
const closedBrackets = [')', '}', ']'];
const openBracketSet = new Set(openBrackets);
const closedBracketSet = new Set(closedBrackets);
const bracketParis = new Map([
    ['(', ')'],
    ['{', '}'],
    ['[', ']'],
]);
const quoteBrackets = new Set(['"', "'", '`']);

export function isBracketsMatch(open: string, close: string): boolean {
    if (isQuoteBracket(open)) {
        return open === close;
    }
    return bracketParis.get(open) === close;
}

export function isOpenBracket(char: string): boolean {
    return openBracketSet.has(char);
}

export function isCloseBracket(char: string): boolean {
    return closedBracketSet.has(char);
}

export function isQuoteBracket(char: string): boolean {
    return quoteBrackets.has(char);
}
