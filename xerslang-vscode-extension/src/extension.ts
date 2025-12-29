/**
 * XersLang VSCode Extension
 *
 * Provides language support for XersLang (.xers) files including:
 * - Syntax highlighting (via TextMate grammar)
 * - Code snippets
 * - Basic language configuration (brackets, comments)
 * - Hover documentation for builtins
 *
 * Future features:
 * - Language Server Protocol support
 * - Diagnostics and error reporting
 * - Go to definition
 */

import * as vscode from 'vscode';

// Language ID constant
const LANGUAGE_ID = 'xerslang';

// Output channel for extension logging
let outputChannel: vscode.OutputChannel;

/**
 * Extension activation function
 * Called when extension is activated (e.g., when a .xers file is opened)
 */
export function activate(context: vscode.ExtensionContext): void {
    // Create output channel for logging
    outputChannel = vscode.window.createOutputChannel('XersLang');
    outputChannel.appendLine('XersLang extension activated');

    // Register commands
    const compileCommand = vscode.commands.registerCommand('xerslang.compile', () => {
        compileCurrentFile();
    });
    context.subscriptions.push(compileCommand);

    const runCommand = vscode.commands.registerCommand('xerslang.run', () => {
        runCurrentFile();
    });
    context.subscriptions.push(runCommand);

    // Register document formatting provider (placeholder for future)
    const formatterProvider = vscode.languages.registerDocumentFormattingEditProvider(LANGUAGE_ID, {
        provideDocumentFormattingEdits(_document: vscode.TextDocument): vscode.TextEdit[] {
            // Placeholder - future implementation will format code
            return [];
        }
    });
    context.subscriptions.push(formatterProvider);

    // Register hover provider for built-in functions
    const hoverProvider = vscode.languages.registerHoverProvider(LANGUAGE_ID, {
        provideHover(document: vscode.TextDocument, position: vscode.Position): vscode.Hover | undefined {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }
            const word = document.getText(wordRange);
            const builtinDoc = getBuiltinDocumentation(word);
            if (builtinDoc) {
                return new vscode.Hover(new vscode.MarkdownString(builtinDoc));
            }
            return undefined;
        }
    });
    context.subscriptions.push(hoverProvider);

    // Watch for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('xerslang')) {
                outputChannel.appendLine('XersLang configuration changed');
            }
        })
    );

    // Status bar item showing XersLang status
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.text = '$(code) XersLang';
    statusBarItem.tooltip = 'XersLang Extension Active';
    statusBarItem.command = 'xerslang.compile';
    context.subscriptions.push(statusBarItem);

    // Show status bar when .xers file is active
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor && editor.document.languageId === LANGUAGE_ID) {
                statusBarItem.show();
            } else {
                statusBarItem.hide();
            }
        })
    );

    // Show if current editor is .xers
    if (vscode.window.activeTextEditor?.document.languageId === LANGUAGE_ID) {
        statusBarItem.show();
    }

    outputChannel.appendLine('XersLang extension setup complete');
}

/**
 * Extension deactivation function
 * Called when extension is deactivated
 */
export function deactivate(): void {
    if (outputChannel) {
        outputChannel.appendLine('XersLang extension deactivated');
        outputChannel.dispose();
    }
}

/**
 * Compile the current .xers file
 */
function compileCurrentFile(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== LANGUAGE_ID) {
        vscode.window.showWarningMessage('No XersLang file is currently open');
        return;
    }

    const filePath = editor.document.uri.fsPath;
    outputChannel.appendLine(`Compiling: ${filePath}`);

    // Save file before compiling
    editor.document.save().then(() => {
        const config = vscode.workspace.getConfiguration('xerslang');
        const compilerPath = config.get<string>('compilerPath', 'xersc');

        const terminal = vscode.window.createTerminal('XersLang Compiler');
        terminal.show();
        terminal.sendText(`"${compilerPath}" "${filePath}"`);
    });
}

/**
 * Compile and run the current .xers file
 */
function runCurrentFile(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== LANGUAGE_ID) {
        vscode.window.showWarningMessage('No XersLang file is currently open');
        return;
    }

    const filePath = editor.document.uri.fsPath;
    const exePath = filePath.replace(/\.xers$/, '.exe');

    outputChannel.appendLine(`Compiling and running: ${filePath}`);

    editor.document.save().then(() => {
        const config = vscode.workspace.getConfiguration('xerslang');
        const compilerPath = config.get<string>('compilerPath', 'xersc');

        const terminal = vscode.window.createTerminal('XersLang');
        terminal.show();
        terminal.sendText(`"${compilerPath}" "${filePath}" && "${exePath}"`);
    });
}

/**
 * Get documentation for built-in functions
 */
function getBuiltinDocumentation(name: string): string | undefined {
    const builtins: { [key: string]: string } = {
        // Memory operations
        'alloc': '```xers\nfn alloc(size: i64) -> i64\n```\nAllocate `size` bytes of memory. Returns pointer to allocated memory.',
        'free': '```xers\nfn free(ptr: i64) -> i64\n```\nFree previously allocated memory at `ptr`.',
        'peek': '```xers\nfn peek(ptr: i64) -> i64\n```\nRead a byte from memory at `ptr`.',
        'poke': '```xers\nfn poke(ptr: i64, value: i64) -> i64\n```\nWrite a byte `value` to memory at `ptr`.',

        // I/O operations
        'print': '```xers\nfn print(value: i64) -> i64\n```\nPrint an integer value to stdout.',
        'print_int': '```xers\nfn print_int(value: i64) -> i64\n```\nPrint an integer value to stdout.',
        'printc': '```xers\nfn printc(char: i64) -> i64\n```\nPrint a character to stdout.',
        'prints': '```xers\nfn prints(str: i64) -> i64\n```\nPrint a null-terminated string to stdout.',
        'println': '```xers\nfn println(value: i64) -> i64\n```\nPrint an integer value followed by newline.',
        'read_file': '```xers\nfn read_file(path: str) -> i64\n```\nRead file contents into buffer. Returns pointer.',
        'write_file': '```xers\nfn write_file(path: str, data: i64, len: i64) -> i64\n```\nWrite data to file.',
        'file_len': '```xers\nfn file_len(path: str) -> i64\n```\nGet file size in bytes.',

        // String operations
        'strlen': '```xers\nfn strlen(str: i64) -> i64\n```\nGet length of null-terminated string.',
        'streq': '```xers\nfn streq(s1: i64, s2: i64) -> i64\n```\nCompare two strings. Returns 1 if equal, 0 otherwise.',

        // Process control
        'exit': '```xers\nfn exit(code: i64) -> i64\n```\nExit program with given exit code.',

        // Keywords
        'fn': '**Keyword**: Define a function\n```xers\nfn name(params) -> RetType { ... }\n```',
        'let': '**Keyword**: Declare a variable\n```xers\nlet x: i64 = value;\n```',
        'mut': '**Keyword**: Declare a mutable variable\n```xers\nlet mut x: i64 = value;\n```',
        'if': '**Keyword**: Conditional statement\n```xers\nif condition { ... } else { ... }\n```',
        'else': '**Keyword**: Else branch of conditional\n```xers\nif condition { ... } else { ... }\n```',
        'while': '**Keyword**: Loop statement\n```xers\nwhile condition { ... }\n```',
        'return': '**Keyword**: Return from function\n```xers\nreturn value;\n```',
        'break': '**Keyword**: Break out of loop\n```xers\nbreak;\n```',
        'continue': '**Keyword**: Continue to next loop iteration\n```xers\ncontinue;\n```',

        // Types
        'i64': '**Type**: 64-bit signed integer',
        'i32': '**Type**: 32-bit signed integer',
        'i16': '**Type**: 16-bit signed integer',
        'i8': '**Type**: 8-bit signed integer',
        'u64': '**Type**: 64-bit unsigned integer',
        'u32': '**Type**: 32-bit unsigned integer',
        'u16': '**Type**: 16-bit unsigned integer',
        'u8': '**Type**: 8-bit unsigned integer',
        'str': '**Type**: String (pointer to null-terminated bytes)',
        'bool': '**Type**: Boolean (true/false)',
        'ptr': '**Type**: Raw pointer',
        'void': '**Type**: Void (no return value)',
    };

    return builtins[name];
}
