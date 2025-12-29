# XersLang

A minimal, self-hosted systems programming language that compiles directly to x64 Windows PE executables.

## Overview

XersLang is a self-hosted compiler written in ~3,150 lines of its own language. It generates native Windows executables without external dependencies - no LLVM, no linker, no runtime.

## Quick Start

```bash
# Compile a program
xslc.exe hello.xers

# Run it
hello.exe
```

## Language

```xers
fn main() -> i64 {
    let msg = "Hello, World!";
    print_str(msg);
    return 0;
}

fn factorial(n: i64) -> i64 {
    if n <= 1 { return 1; }
    return n * factorial(n - 1);
}
```

### Types

| Type | Description |
|------|-------------|
| `i64` | 64-bit signed integer |
| `u8` | 8-bit unsigned byte |
| `ptr` | Raw pointer |
| `str` | String (pointer to bytes) |

### Builtins

| Function | Description |
|----------|-------------|
| `alloc(size)` | Allocate heap memory |
| `peek(ptr, offset)` | Read byte at offset |
| `poke(ptr, offset, val)` | Write byte at offset |
| `print_int(n)` | Print integer |
| `print_str(s)` | Print string |
| `read_file(path)` | Read file to buffer |
| `write_file(path, data, len)` | Write buffer to file |

## Project Structure

```
xerslang-compiler/
  xersc.xers       # Self-hosted compiler
  std/
    fs.xers        # File system
    io.xers        # Input/output
    mem.xers       # Memory operations
    string.xers    # String utilities
```

## Self-Hosting

The compiler compiles itself:

```bash
# Stage 1: Bootstrap compiles source
xslc_v0.exe xersc.xers -o xslc_v1.exe

# Stage 2: v1 compiles source
xslc_v1.exe xersc.xers -o xslc_v2.exe

# Verification: v1 == v2 (fixed point)
fc /b xslc_v1.exe xslc_v2.exe
```

## Tools

| Tool | Description |
|------|-------------|
| `xslc` | XersLang Compiler |
| `xslf` | XersLang Finder (line counter) |
| `xerslang-vscode-extension` | VSCode syntax highlighting |

## Architecture

```
Source (.xers) -> Lexer -> Parser -> TypeCheck -> Codegen -> PE Writer -> .exe
```

- Direct x64 machine code emission
- Native Windows PE32+ generation
- No intermediate representation
- Single-pass compilation

## License

Licensed under MIT OR Apache-2.0 (your choice). See [LICENSE](LICENSE).
