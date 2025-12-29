<p align="center">
  <img src="icons/xerslang-logo.png" alt="XersLang Logo" width="128">
</p>

# XersLang

A minimal, self-hosted systems programming language that compiles directly to x64 Windows PE executables.

[![Release](https://img.shields.io/github/v/release/glogwa68/XersLang)](https://github.com/glogwa68/XersLang/releases/latest)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/xerslang.xerslang?label=VS%20Code)](https://marketplace.visualstudio.com/items?itemName=xerslang.xerslang)

## Overview

XersLang is a self-hosted compiler written in ~3,150 lines of its own language. It generates native Windows executables without external dependencies - no LLVM, no linker, no runtime.

## Quick Start

```bash
# Download from releases
# https://github.com/glogwa68/XersLang/releases/latest

# Compile a program
xslc.exe hello.xers

# Run it
hello.exe
```

## New in v0.1.2: Cargo-style CLI

```bash
xersc build              # Build project from xers.toml
xersc build --release    # Optimized build
xersc new my-project     # Create new project
xersc new my-lib --lib   # Create library
xersc run                # Build and execute
xersc clean              # Clean build directory
```

### Project Structure (xers.toml)

```toml
[package]
name = "my-app"
version = "0.1.0"

[build]
output = "build/my-app.exe"
target = "x64-windows"
```

See [src-exemple/xers.toml](src-exemple/xers.toml) for a complete example.

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

### Module System

```xers
mod utils;              // Import module
use strings::helpers;   // Use nested module
pub fn helper() { }     // Public function
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
| `get_argc()` | Get CLI argument count |
| `get_arg(index)` | Get CLI argument |

## Downloads

| File | Description |
|------|-------------|
| [xslc.exe](https://github.com/glogwa68/XersLang/releases/latest) | XersLang Compiler |
| [xslf.exe](https://github.com/glogwa68/XersLang/releases/latest) | XersLang Source Finder (CLOC) |
| [xerslang-0.3.3.vsix](https://github.com/glogwa68/XersLang/releases/latest) | VSCode Extension |

### VSCode Extension

```bash
code --install-extension xerslang-0.3.3.vsix
```

## Project Structure

```
xerslang-compiler/
  xersc.xers       # Self-hosted compiler (~3150 lines)
  std/
    toml.xers      # TOML parser
    project.xers   # Project detection
    build.xers     # Build system
    fs.xers        # File system
    io.xers        # Input/output
    mem.xers       # Memory operations
    string.xers    # String utilities
```

## Documentation

| Folder | Content |
|--------|---------|
| [docs/guides/](docs/guides/) | Getting started, tutorials |
| [docs/compiler/](docs/compiler/) | Implementation details |
| [docs/modules/](docs/modules/) | Module system |
| [docs/cli/](docs/cli/) | CLI reference |
| [docs/security/](docs/security/) | Security audit |

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
