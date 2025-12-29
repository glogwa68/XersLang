# Compiler Implementation Details

Internal architecture and implementation of the XersLang compiler.

## Overview

The compiler is structured as a pipeline of phases, each transforming the input into a progressively lower-level representation.

## Source Code Organization

```
xerslang-asm/
├── src/
│   ├── main.asm           # Bootstrap entry point
│   ├── lexer/
│   │   ├── lexer.asm      # Tokenization
│   │   ├── tokens.asm     # Token definitions
│   │   └── string.asm     # String handling
│   ├── parser/
│   │   ├── parser.asm     # Syntax analysis
│   │   ├── expr.asm       # Expression parsing
│   │   ├── stmt.asm       # Statement parsing
│   │   └── ast.asm        # AST definitions
│   ├── typeck/
│   │   ├── typeck.asm     # Type checking
│   │   ├── infer.asm      # Type inference
│   │   ├── types.asm      # Type system
│   │   └── symtab.asm     # Symbol table
│   ├── codegen/
│   │   ├── codegen.asm    # Code generation
│   │   ├── x64.asm        # x64 emitter
│   │   ├── builtins.asm   # Builtin functions
│   │   ├── reloc.asm      # Relocations
│   │   └── pe.asm         # PE generation
│   └── common/
│       ├── io.asm         # I/O utilities
│       ├── alloc.asm      # Memory allocation
│       ├── borrow.asm     # Borrow checking
│       └── project.asm    # Project management
```

## Data Structures

### Tokens

```asm
; Token structure
struct Token {
    type: u32              ; TokenType
    value: *String         ; Token value
    line: i64              ; Line number
    column: i64            ; Column number
}
```

### AST Nodes

Expression AST:
```asm
enum Expr {
    Literal(value: i64),
    Identifier(name: String),
    BinOp(op: String, left: *Expr, right: *Expr),
    Call(func: String, args: *[]*Expr),
    ...
}
```

Statement AST:
```asm
enum Stmt {
    FnDef(name: String, params: *[]*Param, body: *[]*Stmt),
    VarDecl(name: String, type: *Type, init: *Expr),
    Return(*Expr),
    If(cond: *Expr, then_body: *[]*Stmt, else_body: *[]*Stmt),
    While(cond: *Expr, body: *[]*Stmt),
    ...
}
```

### Type System

```asm
enum Type {
    I64,
    U8,
    Bool,
    String,
    Ptr(*Type),
    Array(*Type, len: i64),
    Struct(name: String, fields: *[]*Field),
    Function(params: *[]*Type, return_type: *Type),
    ...
}
```

## Compilation Phases

### Phase 1: Lexical Analysis

The lexer reads the source code and produces a stream of tokens.

**Input**: Source file (String)
**Output**: Token stream ([]*Token)

Key functions:
- `lex_file(path: String) -> []*Token` - Main lexer
- `next_token() -> Token` - Get next token
- `peek_token() -> Token` - Look ahead without consuming

### Phase 2: Parsing

The parser consumes tokens and builds an AST.

**Input**: Token stream
**Output**: Abstract Syntax Tree (Program)

Key functions:
- `parse(tokens: []*Token) -> Program` - Main parser
- `parse_function() -> FnDef` - Parse function definition
- `parse_statement() -> Stmt` - Parse statement
- `parse_expression() -> Expr` - Parse expression

**Parsing strategy**: Recursive descent with precedence climbing for expressions.

### Phase 3: Type Checking

Type checking validates:
- All variables are defined before use
- Types match at assignment and call sites
- Functions return correct types
- Array/struct access is type-safe

**Input**: AST
**Output**: Typed AST (with type information annotated)

Key functions:
- `typecheck(ast: Program) -> TypedProgram`
- `check_function(fn: FnDef) -> TypedFnDef`
- `infer_type(expr: Expr) -> Type`
- `unify(t1: Type, t2: Type) -> Result<Type, Error>`

### Phase 4: Code Generation

Code generation converts the typed AST to x64 assembly.

**Input**: Typed AST
**Output**: Assembly code

Key functions:
- `codegen(program: TypedProgram) -> String` - Main codegen
- `emit_function(fn: TypedFnDef) -> String` - Generate function
- `emit_expr(expr: Expr) -> String` - Generate expression
- `emit_stmt(stmt: Stmt) -> String` - Generate statement

**x64 Details**:
- Calling convention: Microsoft x64 (RCX, RDX, R8, R9 for first 4 args)
- Return values in RAX/RDX
- Function prologue: `push rbp; mov rbp, rsp`
- Stack allocation: Align to 16 bytes

### Phase 5: PE Generation

PE generation creates a Windows PE executable.

**Input**: Assembly code
**Output**: PE executable (.exe)

PE sections:
- `.text` - Code section (RX)
- `.data` - Initialized data (RW)
- `.rdata` - Read-only data (R)
- `.reloc` - Relocations

Key functions:
- `generate_pe(asm: String) -> Vec<u8>` - Create PE file
- `emit_dos_header() -> [u8; 64]`
- `emit_pe_header() -> [u8; 20]`
- `emit_section_header(name: String, ...) -> [u8; 40]`

## Register Allocation

**Current strategy**: Simple linear scan

```asm
; Available registers (Windows x64 calling convention)
RAX - Return value / Accumulator (volatile)
RCX - First argument (volatile)
RDX - Second argument / Result high (volatile)
R8  - Third argument (volatile)
R9  - Fourth argument (volatile)
R10 - Volatile temporary
R11 - Volatile temporary
RBX - Preserved
RSI - Preserved
RDI - Preserved
R12-R15 - Preserved
```

## Memory Layout

Function stack frame:

```
[RSP+16] <- Function arg 5 (if > 4 args)
[RSP+8]  <- Return address
[RSP+0]  <- Previous RBP (after push rbp)
[RBP-8]  <- Local variable 1
[RBP-16] <- Local variable 2
...
```

## Optimization Passes

Currently minimal optimizations:

1. **Dead code elimination** - Remove unused function definitions
2. **Constant folding** - Evaluate constant expressions at compile time
3. **Function inlining** - Inline small functions
4. **Common subexpression elimination** - Reuse computed values

Future optimizations planned:
- SSA form construction
- Data flow analysis
- Loop optimizations
- Vectorization

## Error Handling

Errors are reported with:
- Error message
- Line number
- Column number
- Context (source line)

Example:
```
Error: Type mismatch at line 42, column 15
Expected: i64
Found: String
  let x: i64 = "hello"
                ^^^^^^^
```

## Symbol Table

The symbol table tracks:
- Variable definitions (name -> type)
- Function definitions (name -> signature)
- Type definitions (name -> type)
- Scoping information

## Borrow Checking

Simplified borrow checker validates:
- No move after borrow
- Mutable borrows are exclusive
- Borrows don't outlive referent

## Performance Considerations

- Single-pass lexing and parsing
- No intermediate representation conversion (direct AST -> asm)
- Linear register allocation (fast but not optimal)
- No link-time optimization

Compilation time breakdown (approximate):
- Lexing: 10%
- Parsing: 20%
- Type checking: 30%
- Code generation: 35%
- PE generation: 5%

## Limitations and Known Issues

1. **No incremental compilation** - Always recompiles entire file
2. **Limited generic support** - Generics are monomorphized naively
3. **No whole-program optimization** - Each file is compiled independently
4. **Stack-based allocation** - No local register allocation within functions

## Future Improvements

- SSA-based IR for better optimization
- Incremental compilation support
- Parallel compilation for large projects
- Better register allocation with graph coloring
- LLVM backend for more targets
