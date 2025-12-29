# XerLang Compiler Architecture

## Overview

The XerLang compiler (`xerc`) transforms source code (.xer files) into native executables through a series of transformation phases.

## Compilation Pipeline

```
Input: source.xer
          ↓
    ┌─────────────────┐
    │  LEXER          │  - Tokenization
    │  (Lexical)      │  - Convert source to tokens
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  PARSER         │  - AST Generation
    │  (Syntax)       │  - Parse tokens to Abstract Syntax Tree
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  SEMANTIC       │  - Type Checking
    │  ANALYSIS       │  - Symbol Resolution
    │  (Type Checking)│  - Borrow Checking
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  MIR            │  - Middle-level IR
    │  (Optimization) │  - Control flow analysis
    │                 │  - Dead code elimination
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  CODE GEN       │  - Target Selection
    │  (Target)       │  - Generate native code
    │                 │  - Register allocation
    └────────┬────────┘
             ↓
    ┌─────────────────┐
    │  LINKING        │  - Link object files
    │  (Binary Gen)   │  - Link runtime library
    │                 │  - Produce executable
    └────────┬────────┘
             ↓
    Output: executable.exe
```

## Compiler Phases

### 1. Lexer (Lexical Analysis)

**Input**: Source code as text
**Output**: Stream of tokens

The lexer reads the source code character by character and produces a sequence of tokens.

```
Input:  fn main() { println("Hello"); }
Output: fn main ( ) { println ( "Hello" ) ; }
```

**Token Types**:
- Keywords: `fn`, `let`, `if`, `match`, etc.
- Identifiers: `main`, `x`, `process_data`
- Operators: `+`, `-`, `=`, `->`, etc.
- Literals: `42`, `"string"`, `true`
- Punctuation: `(`, `)`, `{`, `}`, `;`

### 2. Parser (Syntax Analysis)

**Input**: Token stream
**Output**: Abstract Syntax Tree (AST)

The parser reads tokens and builds a tree representing the program structure.

```
AST:
    Function
    ├─ name: "main"
    ├─ parameters: []
    ├─ return_type: ()
    └─ body:
        CallExpression
        ├─ function: "println"
        └─ arguments: ["Hello"]
```

**Grammar Validation**: Ensures tokens follow language grammar rules.

### 3. Semantic Analysis (Type Checking)

**Input**: AST
**Output**: Typed AST, Symbol Table, Errors/Warnings

Checks that the program is semantically valid:

- **Symbol Resolution**: Each identifier refers to a valid declaration
- **Type Checking**: Operations are valid for their types
- **Borrow Checking**: Ownership rules are satisfied
- **Error Handling**: Results and Options are properly handled

**Example Checks**:
```xerlang
fn add(a: i32, b: i32) -> i32 {
    a + b  // OK: both operands are i32
}

fn bad(a: i32) -> String {
    a  // ERROR: cannot return i32 when String expected
}

let x = 5;
let y = &x;
drop(x);
println(y);  // ERROR: y is dangling reference
```

### 4. MIR (Middle-Level IR)

**Input**: Typed AST
**Output**: Middle-level Intermediate Representation

Transforms the AST into a language-independent, optimizable form.

**Optimizations**:
- Constant folding: `2 + 3` → `5`
- Dead code elimination: Unused assignments removed
- Control flow simplification: Unreachable code removed
- Inlining: Small functions expanded at call sites

### 5. Code Generation

**Input**: MIR
**Output**: Platform-specific code (native or IR)

Generates target-specific code:

**For x86-64 (Intel/AMD)**:
- Register allocation
- Instruction selection
- Optimize for performance and size

**For ARM64 (Mobile/Embedded)**:
- ARM-specific instructions
- Different calling conventions

**For WebAssembly**:
- WASM instructions
- Linear memory model

### 6. Linking

**Input**: Object files (.o or .obj), Runtime library
**Output**: Executable binary

The linker:
1. Combines object files
2. Links with runtime library (memory allocator, I/O, etc.)
3. Resolves cross-file references
4. Produces final executable

## Key Compiler Components

### Symbol Table

Tracks all declarations (functions, variables, types):

```
Symbol Table:
├─ println: Function(String → ())
├─ main: Function(() → ())
├─ x: Variable(i32)
└─ Message: Type(struct { text: String, level: i32 })
```

### Type System

Enforces static typing:

```
Type Rules:
├─ i32 + i32 → i32
├─ String + String → String
├─ i32 + String → ERROR
└─ &T borrows T
```

### Borrow Checker

Verifies ownership rules:

```
Rules:
├─ Each value has one owner
├─ Borrowed values are read-only
├─ At most one mutable borrow
└─ Borrows cannot outlive data
```

## Compiler Modes

### Build Mode

Produces optimized executable:
```bash
xerc build myprogram.xer -o myprogram
```

Optimizations enabled, debugging info stripped.

### Debug Mode

Produces executable with debug information:
```bash
xerc build myprogram.xer -o myprogram --debug
```

Less optimization, includes debug symbols.

### Check Mode

Type check without producing executable:
```bash
xerc check myprogram.xer
```

Validates syntax and types. Useful for quick feedback.

### Emit Modes

Generate intermediate files:
```bash
xerc build myprogram.xer --emit obj      # Object file only
xerc build myprogram.xer --emit asm      # Assembly
xerc build myprogram.xer --emit llvm     # LLVM IR
```

## Error Handling

The compiler produces helpful error messages:

```
error[E0308]: mismatched types
  --> main.xer:3:5
   |
 3 |     let x: i32 = "hello";
   |             ---- ^^^^^^^ expected i32, found &str
   |             |
   |             expected due to this type annotation

help: try using a string literal
   |
 3 |     let x: i32 = 42;
   |                  ^^
```

Error messages include:
- Error code (E0308)
- File location (line, column)
- Context (code snippet)
- Suggestion (help text)

## Optimization Passes

The compiler performs multiple optimization passes:

1. **Constant Folding**
   - `2 + 3` → `5`
   - `if true { a } else { b }` → `a`

2. **Dead Code Elimination**
   - Remove unused variables
   - Remove unreachable code

3. **Common Subexpression Elimination**
   - `x + y; z + x + y;` → reuse first result

4. **Loop Unrolling** (optional)
   - Expand small loops at compile time

5. **Inlining** (optional)
   - Replace function calls with function body

## Target Platforms

Xerc supports multiple target platforms:

| Platform | Architecture | Status |
|----------|--------------|--------|
| Windows | x86-64 | Primary |
| Windows | ARM64 | Supported |
| Linux | x86-64 | Supported |
| Linux | ARM64 | Supported |
| macOS | x86-64 | Supported |
| macOS | ARM64 (Apple Silicon) | Supported |
| iOS | ARM64 | Supported |
| Android | ARM64 | Supported |

## Compiler Flags

### Optimization Level
- `-O0` - No optimization (debug)
- `-O1` - Light optimization
- `-O2` - Aggressive optimization (default)
- `-O3` - Maximum optimization (may increase compile time)

### Target
- `--target x86_64-unknown-linux-gnu`
- `--target aarch64-unknown-linux-gnu`
- `--target x86_64-pc-windows-msvc`

### Output
- `-o file` - Output filename
- `--emit obj` - Object file only
- `--emit asm` - Assembly file

### Debugging
- `--debug` - Include debug symbols
- `-g` - Generate debug info

### Security
- `--obfuscate` - Enable obfuscation
- `--sanitize` - Runtime safety checks

## Performance Characteristics

Compilation speed targets (goal: Go-like speeds):

| Code Size | Target Time |
|-----------|------------|
| Hello World | < 1 second |
| 1000 lines | < 2 seconds |
| 10000 lines | < 5 seconds |
| 100000 lines | < 30 seconds |

Memory usage remains constant regardless of code size through incremental compilation.

## Compiler Implementation

XerLang compiler is implemented in Rust:

```
src/
├── lexer/        # Tokenization
├── parser/       # AST generation
├── typeck/       # Type checking & borrowing
├── mir/          # Middle-level IR
├── codegen/      # Code generation
├── linker/       # Linking & binary generation
└── main.rs       # CLI and entry point
```

---

See [CLI Reference](./cli-reference.md) for command-line options.
