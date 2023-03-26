# Power Edit

<div align="center">

[![Version](https://img.shields.io/visual-studio-marketplace/v/YuTengjing.power-edit)](https://marketplace.visualstudio.com/items/YuTengjing.power-edit/changelog) [![Installs](https://img.shields.io/visual-studio-marketplace/i/YuTengjing.power-edit)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.power-edit) [![Downloads](https://img.shields.io/visual-studio-marketplace/d/YuTengjing.power-edit)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.power-edit) [![Rating Star](https://img.shields.io/visual-studio-marketplace/stars/YuTengjing.power-edit)](https://marketplace.visualstudio.com/items?itemName=YuTengjing.power-edit&ssr=false#review-details) [![Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/YuTengjing.power-edit)](https://github.com/tjx666/power-edit)

![test](https://github.com/tjx666/power-edit/actions/workflows/test.yml/badge.svg) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com) [![Github Open Issues](https://img.shields.io/github/issues/tjx666/power-edit)](https://github.com/tjx666/power-edit/issues) [![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg?style=flat-square)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

</div>

## Features

> **NOTE**
> By default, this extension will not set any shortcuts.

### Bracket Select

I just migrate code from [Bracket Select](https://github.com/jhasse/vscode-bracket-select) and make some code optimization.

recommend set following shortcut:

```jsonc
[
  {
    "key": "ctrl+]",
    "command": "power-edit.selectBracketContent",
    "when": "editorTextFocus && editorLangId != 'markdown'"
  },
  {
    "key": "ctrl+shift+]",
    "command": "power-edit.selectBracket",
    "when": "editorTextFocus && editorLangId != 'markdown'"
  }
]
```

## My extensions

- [Open in External App](https://github.com/tjx666/open-in-external-app)
- [Neo File Utils](https://github.com/tjx666/vscode-neo-file-utils)
- [VSCode FE Helper](https://github.com/tjx666/vscode-fe-helper)
- [VSCode archive](https://github.com/tjx666/vscode-archive)
- [Modify File Warning](https://github.com/tjx666/modify-file-warning)
- [Adobe Extension Development Tools](https://github.com/tjx666/vscode-adobe-extension-devtools)
- [Scripting Listener](https://github.com/tjx666/scripting-listener)

Check all here: [publishers/YuTengjing](https://marketplace.visualstudio.com/publishers/YuTengjing)
