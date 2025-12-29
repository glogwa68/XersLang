# XersLang - Self-Hosted Systems Programming Language

XersLang is a minimal, self-hosted systems programming language that compiles directly to x64 Windows PE executables. The compiler is written entirely in XersLang itself, demonstrating true self-hosting capability.

## Features

- **Self-hosted compiler** - xersc.xers compiles itself
- **Direct x64 machine code generation** - No LLVM, no external dependencies
- **Windows PE executable generation** - Produces standalone .exe files
- **Minimal runtime** - Core builtins for memory, strings, and file I/O
- **Zero external dependencies** - Completely self-contained

## Project Structure

```
XersLang/
├── xerslang-compiler/
│   ├── xersc.xers          # Self-hosted compiler source (3000+ lines)
│   ├── std/                # Standard library
│   │   ├── fs.xers         # File system operations
│   │   ├── io.xers         # Input/Output
│   │   ├── mem.xers        # Memory management
│   │   └── string.xers     # String utilities
│   ├── build/              # Build artifacts (.obj files)
│   ├── Makefile            # Build configuration
│   └── *.bat               # Build scripts
├── LICENSE
└── README.md
```

## Building

### Prerequisites

- Microsoft Macro Assembler (ML64.exe)
- Microsoft Linker (LINK.exe)
- Windows SDK

### Build the Compiler

```batch
cd xerslang-compiler
build_xersc.bat
```

This produces `build/xersc.exe`.

### Compile a Program

```batch
build\xersc.exe myprogram.xers -o myprogram.exe
```

## Language Syntax

XersLang has a minimal, C-like syntax:

```xers
fn main() {
    let x = 42;
    return x;
}

fn add(a, b) {
    return a + b;
}

fn factorial(n) {
    if n <= 1 {
        return 1;
    }
    return n * factorial(n - 1);
}
```

### Built-in Functions

| Function | Description |
|----------|-------------|
| `alloc(size)` | Allocate memory, returns pointer |
| `peek(ptr, offset)` | Read byte from memory |
| `poke(ptr, offset, value)` | Write byte to memory |
| `strlen(str)` | Get string length |
| `streq(s1, s2)` | Compare strings (1 if equal) |
| `print_int(n)` | Print integer to console |
| `read_file(path)` | Read file contents, returns pointer |
| `file_len(path)` | Get file size in bytes |
| `write_file(path, data, len)` | Write data to file |

### Control Flow

```xers
fn fibonacci(n) {
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
```

## Self-Hosting

The compiler can compile itself:

```batch
:: Stage 0: Use bootstrap compiler
build\xersc_v0.exe xersc.xers -o build\xersc_v1.exe

:: Stage 1: Use v1 to compile itself
build\xersc_v1.exe xersc.xers -o build\xersc_v2.exe

:: Verify: v1 and v2 should be identical
fc /b build\xersc_v1.exe build\xersc_v2.exe
```

## Architecture

XersLang is designed for:

- **Minimal complexity** - Self-contained in ~3000 lines
- **Fast compilation** - Direct to machine code
- **Educational value** - Understand compilation from first principles
- **Bootstrap verification** - Compiler compiles itself identically

### Compilation Pipeline

```
Source (.xers) → Lexer → Parser → Type Check → Codegen → PE Writer → Executable
```

## License

MIT License - See LICENSE file for details.
