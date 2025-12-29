# XersLang Compiler User Guide

## Overview

The XersLang compiler (xersc) is a self-hosted compiler written in XersLang itself. It compiles XersLang source files directly to Windows PE x64 executables without any external dependencies.

## Installation

### From Binary

Download the latest `xersc.exe` from releases and add it to your PATH.

### From Source

Clone the repository and compile the bootstrap:

```bash
cd xerslang-asm
./build.sh
```

## Basic Usage

### Compiling a File

```bash
xersc input.xers -o output.exe
```

### Options

#### `-o, --output FILE`
Specify the output executable name.

```bash
xersc myprogram.xers -o myprogram.exe
```

#### `-c, --check`
Type check without generating code.

```bash
xersc myprogram.xers -c
```

#### `-v, --verbose`
Print detailed compilation messages.

```bash
xersc myprogram.xers -v
```

#### `--emit-asm`
Emit intermediate assembly code (for debugging).

```bash
xersc myprogram.xers --emit-asm output.asm
```

#### `--verify`
Verify PE format after generation.

```bash
xersc myprogram.xers --verify
```

## Compiler Phases

The compiler operates in five main phases:

### 1. Lexical Analysis (Lexer)
- Tokenizes source code into tokens
- Handles string literals, numbers, identifiers
- Tracks line and column information

### 2. Parsing (Parser)
- Builds an Abstract Syntax Tree (AST)
- Validates syntax
- Reports parse errors with line numbers

### 3. Type Checking & Inference (Type Checker)
- Verifies type correctness
- Performs type inference
- Checks function signatures
- Validates ownership and borrowing

### 4. Code Generation (Codegen)
- Generates x64 assembly code
- Allocates registers and stack space
- Handles calling conventions
- Emits function prologue/epilogue

### 5. Linking & PE Generation
- Combines object code into PE format
- Generates PE header and sections
- Applies relocations
- Outputs final executable

## Compilation Example

```bash
# Write a simple program
echo 'fn main() { print("Hello, World!") }' > hello.xers

# Compile it
xersc hello.xers -o hello.exe

# Run it
./hello.exe
```

## Error Messages

The compiler provides detailed error messages with line and column numbers:

```
Error: Type mismatch at line 5, column 12
Expected: i64
Found: String
```

### Common Errors

#### Undefined variable
```
Error: Undefined variable 'x' at line 3
```

#### Type mismatch
```
Error: Type mismatch at line 7
Expected: String, found: i64
```

#### Borrow check failure
```
Error: Cannot move borrowed value at line 10
```

#### Missing return statement
```
Error: Missing return value in non-void function at line 8
```

## Compiler Flags

### Debug Information

The compiler can generate debug symbols (limited support):

```bash
xersc --debug myprogram.xers -o myprogram.exe
```

### Optimization Levels

Currently, the compiler performs basic optimizations:

```bash
xersc -O2 myprogram.xers -o myprogram.exe
```

### Architecture Targeting

Currently targets x64 Windows:

```bash
xersc --target x64-windows myprogram.xers
```

## Build System Integration

### With shell scripts

```bash
#!/bin/bash
xersc src/main.xers -o bin/myapp.exe
if [ $? -eq 0 ]; then
    echo "Build successful"
    ./bin/myapp.exe
fi
```

### Batch files (Windows)

```batch
@echo off
xersc src\main.xers -o bin\myapp.exe
if %ERRORLEVEL% EQU 0 (
    echo Build successful
    bin\myapp.exe
)
```

## Self-Hosting

The compiler can compile itself:

```bash
# Compile xersc with itself
xersc xersc.xers -o xersc_new.exe

# Verify it works
./xersc_new.exe hello.xers -o test.exe
```

## Troubleshooting

### Compilation fails with no error message
- Ensure the file is valid UTF-8
- Check for unsupported syntax
- Try with `-v` flag for verbose output

### "Cannot find main function"
- Ensure your program has a `fn main()` function
- Check function name spelling

### Linking errors
- This should not happen with the built-in linker
- Report as a bug if you encounter this

### Executable doesn't run
- Ensure you're on Windows x64
- Try running with `--verify` to check PE format
- Check for runtime errors with `-v` flag

## Performance

The compiler generates reasonably efficient code:

- Direct x64 machine code (no intermediate VM)
- Basic register allocation
- Function inlining for small functions
- No runtime type information overhead

### Compile Times

- Simple programs: < 100ms
- Large programs (10K+ lines): ~1-2 seconds
- Self-compilation of xersc: ~3-5 seconds

## Limitations

Currently:

- Windows x64 only
- No cross-compilation targets
- Limited SIMD support
- No async/await
- No dynamic linking

See the specification for planned features.

## Exit Codes

- 0: Successful compilation
- 1: Compilation error
- 2: Command line error
- 3: File I/O error

## Further Reading

- See [Compiler Architecture](./architecture.md) for internal details
- See [Language Reference](../language/reference.md) for syntax
- See [Getting Started](../guides/getting-started.md) for tutorials
