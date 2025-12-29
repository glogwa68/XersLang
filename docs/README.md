# XersLang ASM Compiler

A complete XersLang compiler implemented in pure x86-64 assembly language (NASM).

## Features

- **Pure Assembly**: Entire compiler written in x86-64 NASM assembly
- **Zero Dependencies**: No external runtime libraries required
- **Native Output**: Generates Windows PE executables directly
- **Full Language Support**: Lexer, parser, type checker, borrow checker, code generator
- **Memory Safe**: Implements ownership and borrowing rules

## Prerequisites

### Required

1. **NASM** (Netwide Assembler) 2.16+
   ```batch
   winget install nasm
   ```

2. **GoLink** (Lightweight Windows Linker)
   - Download from: http://godevtool.com/
   - Add to PATH

### Optional

- **Windows SDK** (for debugging with WinDbg)
- **Make** (for using Makefile instead of batch script)

## Building

### Using Batch Script (Recommended)

```batch
cd xerslang-asm
build.bat
```

### Using Make

```batch
cd xerslang-asm
make
```

### Manual Build

```batch
nasm -f win64 src/main.asm -o build/main.obj
nasm -f win64 src/runtime/alloc.asm -o build/alloc.obj
REM ... assemble all files ...
golink /console /entry:main build/*.obj kernel32.dll /fo xersc.exe
```

## Usage

### Compile a Program

```batch
xersc build hello.xers
hello.exe
```

### Compile with Output Name

```batch
xersc build program.xers -o myprogram.exe
```

### Type-Check Only

```batch
xersc check program.xers
```

### Show Version

```batch
xersc --version
```

### Optimization Levels

```batch
xersc build program.xers -O0   # No optimization (default)
xersc build program.xers -O1   # Basic optimizations
xersc build program.xers -O2   # Standard optimizations
xersc build program.xers -O3   # Aggressive optimizations
```

## Project Structure

```
xerslang-asm/
├── src/
│   ├── main.asm           # Entry point, CLI
│   ├── include/           # Shared definitions
│   │   ├── defines.inc    # Constants, macros
│   │   ├── structs.inc    # Data structures
│   │   └── win64.inc      # Windows API
│   ├── runtime/           # Core runtime
│   │   ├── alloc.asm      # Memory allocator
│   │   ├── string.asm     # String operations
│   │   └── io.asm         # File I/O
│   ├── lexer/             # Tokenizer
│   ├── parser/            # Syntax analysis
│   ├── typeck/            # Type checking
│   └── codegen/           # Code generation
├── tests/                 # Test suite
├── build.bat              # Build script
├── Makefile               # Make build
└── README.md              # This file
```

## Example

### hello.xers

```rust
fn main() {
    println!("Hello, XersLang!");
}
```

### Compile and Run

```batch
xersc build hello.xers
hello.exe
```

Output:
```
Hello, XersLang!
```

## Technical Details

- **Target**: Windows x64 (Windows 10/11)
- **Calling Convention**: Windows x64 ABI
- **Memory Model**: Arena allocator with VirtualAlloc
- **String Handling**: Length-prefixed with interning
- **AST**: Tagged union in contiguous memory pool

## License

MIT OR Apache-2.0
