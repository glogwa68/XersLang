# XersLang VSCode Extension

Official Visual Studio Code extension for the XersLang programming language, providing syntax highlighting, code snippets, and language support.

## Features

### Syntax Highlighting
- Full syntax highlighting for `.xers` files
- Keywords: `fn`, `let`, `mut`, `const`, `if`, `else`, `while`, `return`, `break`, `continue`
- Types: `i64`, `i32`, `i16`, `i8`, `u64`, `u32`, `u16`, `u8`, `f64`, `f32`, `bool`, `char`, `str`, `void`, `ptr`
- Builtin functions: `alloc`, `peek`, `poke`, `strlen`, `streq`, `print_int`, `read_file`, `file_len`, `write_file`, `exit`
- String, number, and comment highlighting
- Operator highlighting

### Hover Documentation
Hover over built-in functions and keywords to see documentation.

### Code Snippets
Ready-to-use snippets for common patterns:

| Trigger | Description |
|---------|-------------|
| `fn` | Function definition |
| `fnv` | Function with no return value |
| `main` | Main function with return |
| `mains` | Simple main function |
| `if` | If statement |
| `ife` | If-else statement |
| `while` | While loop |
| `fori` | For-like loop using while |
| `let` | Variable binding with type |
| `leti` | Variable binding (inferred type) |
| `alloc` | Allocate memory |
| `peek` | Read from memory |
| `poke` | Write to memory |
| `strlen` | Get string length |
| `streq` | Compare strings |
| `printi` | Print integer |
| `readf` | Read file |
| `flen` | Get file length |
| `writef` | Write file |
| `ret` | Return statement |
| `ret0` | Return 0 |
| `exit` | Exit program |
| `buffer` | Buffer allocation template |
| `fib` | Fibonacci function template |

### Language Features
- Bracket matching and auto-closing
- Comment toggling (`//` and `/* */`)
- Automatic indentation
- Code folding support
- Compile and Run commands

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| XersLang: Compile Current File | `Ctrl+Shift+B` | Compile the current .xers file |
| XersLang: Compile and Run | `F5` | Compile and run the current .xers file |

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `xerslang.compilerPath` | `xersc` | Path to the XersLang compiler executable |

## Installation

### From VSIX (Manual Installation)

1. **Package the extension** (requires `vsce`):
   ```bash
   cd tools/xers-vscode
   npm install
   npm run compile
   npm run package
   ```

2. **Install the generated `.vsix` file**:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Click the `...` menu at the top
   - Select "Install from VSIX..."
   - Choose the generated `xerslang-0.1.0.vsix` file

### From Source (Development)

1. **Copy to VS Code extensions folder**:
   ```bash
   # Windows
   xcopy /E tools\xers-vscode %USERPROFILE%\.vscode\extensions\xerslang-0.1.0\

   # Linux/Mac
   cp -r tools/xers-vscode ~/.vscode/extensions/xerslang-0.1.0
   ```

2. **Reload VS Code**:
   - Press `Ctrl+Shift+P`
   - Type "Reload Window"
   - Press Enter

## Usage

1. Open or create a `.xers` file
2. Start typing - autocompletion will suggest keywords and builtins
3. Use snippets by typing the trigger prefix (e.g., `fn` + Tab)
4. Use `Ctrl+/` to toggle line comments
5. Use `Ctrl+Shift+B` to compile
6. Use `F5` to compile and run

## Example

```xers
// Fibonacci calculator in XersLang
fn fibonacci(n: i64) -> i64 {
    if n <= 1 {
        return n;
    }
    let a = 0;
    let b = 1;
    let i = 2;
    while i <= n {
        let temp = a + b;
        a = b;
        b = temp;
        i = i + 1;
    }
    return b;
}

fn main() -> i64 {
    let result = fibonacci(10);
    print_int(result);  // Prints 55
    return 0;
}
```

## Builtin Functions Reference

### Memory Management
- `alloc(size: i64) -> i64` - Allocate memory
- `free(ptr: i64) -> i64` - Free memory
- `peek(ptr: i64) -> i64` - Read byte from memory
- `poke(ptr: i64, value: i64) -> i64` - Write byte to memory

### String Operations
- `strlen(str: i64) -> i64` - Get string length
- `streq(str1: i64, str2: i64) -> i64` - Compare strings (1 if equal)

### I/O Operations
- `print_int(value: i64)` - Print integer to stdout
- `read_file(path: str) -> i64` - Read file contents
- `file_len(path: str) -> i64` - Get file size in bytes
- `write_file(path: str, data: i64, len: i64) -> i64` - Write to file

### Process Control
- `exit(code: i64)` - Exit program with code

## Project Structure
```
xers-vscode/
+-- package.json                  # Extension manifest
+-- README.md                     # This file
+-- language-configuration.json   # Language config (brackets, comments)
+-- syntaxes/
|   +-- xers.tmLanguage.json     # TextMate grammar for syntax highlighting
+-- snippets/
|   +-- xers.json                # Code snippets
+-- src/
|   +-- extension.ts             # Extension entry point
+-- out/
    +-- extension.js             # Compiled extension
```

## License

MIT License - See LICENSE file for details

## Links

- [XersLang Repository](https://github.com/xerslang/XerLang)
- [Report Issues](https://github.com/xerslang/XerLang/issues)
