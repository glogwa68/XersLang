# XersLang Compiler Extensions

This document describes the language extensions added to the XersLang compiler.

## Overview

The extensions are implemented in `xersc_extensions.xers` and add the following features:

### 1. New Token Types

#### Keywords
| Token | ID | Description |
|-------|-----|-------------|
| `break` | 50 | Break out of loop |
| `continue` | 51 | Skip to next iteration |
| `const` | 52 | Constant declaration |
| `struct` | 53 | Structure definition |
| `enum` | 54 | Enumeration definition |
| `for` | 55 | For loop (future) |
| `match` | 56 | Pattern matching (future) |
| `type` | 57 | Type alias (future) |
| `impl` | 58 | Implementation block (future) |
| `trait` | 59 | Trait definition (future) |

#### Constants
| Token | ID | Value |
|-------|-----|-------|
| `true` | 60 | 1 |
| `false` | 61 | 0 |
| `null` | 62 | 0 |

#### Type Keywords
| Token | ID | Size |
|-------|-----|------|
| `i64` | 70 | 8 bytes |
| `i32` | 71 | 4 bytes |
| `i16` | 72 | 2 bytes |
| `i8` | 73 | 1 byte |
| `u64` | 74 | 8 bytes |
| `u32` | 75 | 4 bytes |
| `u16` | 76 | 2 bytes |
| `u8` | 77 | 1 byte |
| `bool` | 78 | 1 byte |
| `str` | 79 | pointer |
| `ptr` | 80 | pointer |

#### Bitwise Operators
| Token | ID | Operator |
|-------|-----|----------|
| `&` | 90 | Bitwise AND |
| `\|` | 91 | Bitwise OR |
| `^` | 92 | Bitwise XOR |
| `<<` | 93 | Shift left |
| `>>` | 94 | Shift right |
| `~` | 95 | Bitwise NOT |
| `&&` | 96 | Logical AND |
| `\|\|` | 97 | Logical OR |

#### Compound Assignment
| Token | ID | Operator |
|-------|-----|----------|
| `+=` | 100 | Add-assign |
| `-=` | 101 | Sub-assign |
| `*=` | 102 | Mul-assign |
| `/=` | 103 | Div-assign |
| `&=` | 104 | AND-assign |
| `\|=` | 105 | OR-assign |
| `^=` | 106 | XOR-assign |
| `<<=` | 107 | SHL-assign |
| `>>=` | 108 | SHR-assign |

#### Additional Punctuation
| Token | ID | Symbol |
|-------|-----|--------|
| `.` | 110 | Member access |
| `->` | 111 | Arrow |
| `:` | 112 | Type annotation |
| `[` | 113 | Left bracket |
| `]` | 114 | Right bracket |
| `?` | 115 | Optional |
| `!` | 116 | Logical NOT |

### 2. Hexadecimal and Binary Literals

```xers
let hex_value = 0xFF;       // 255
let bin_value = 0b1010;     // 10
let large_hex = 0xDEADBEEF; // 3735928559
```

### 3. Block Comments

```xers
/* Single line block comment */

/*
 * Multi-line
 * block comment
 */

/* Nested /* comments */ are supported */
```

### 4. Bitwise Operations

```xers
let a = 0xFF & 0x0F;    // AND: 0x0F
let b = 0xF0 | 0x0F;    // OR: 0xFF
let c = 0xFF ^ 0x0F;    // XOR: 0xF0
let d = 1 << 4;         // SHL: 16
let e = 16 >> 2;        // SHR: 4
let f = ~0;             // NOT: all 1s
```

### 5. Compound Assignment

```xers
let x = 10;
x += 5;     // x = 15
x -= 3;     // x = 12
x *= 2;     // x = 24
x /= 4;     // x = 6
x &= 0x0F;  // bitwise AND assign
x |= 0xF0;  // bitwise OR assign
x ^= 0xFF;  // bitwise XOR assign
```

### 6. Break and Continue

```xers
fn find_first_even(arr, len) {
    let i = 0;
    while i < len {
        let val = peek(arr, i);
        if val & 1 == 0 {
            return val;  // Found even number
        }
        i += 1;
    }
    return -1;  // Not found
}

fn sum_skip_fives(n) {
    let sum = 0;
    let i = 0;
    while i < n {
        i += 1;
        if i == 5 {
            continue;  // Skip 5
        }
        sum += i;
    }
    return sum;
}

fn find_limit(max) {
    let i = 0;
    while i < 1000 {
        i += 1;
        if i > max {
            break;  // Exit loop
        }
    }
    return i;
}
```

### 7. Constants

```xers
const MAX_SIZE = 1024;
const BUFFER_SIZE = 0x1000;
const FLAGS = 0b11110000;
const ENABLED = true;
const DISABLED = false;

fn main() {
    let buf = alloc(MAX_SIZE);
    // ...
}
```

### 8. Struct Definitions

```xers
struct Point {
    x: i64,
    y: i64
}

struct Rectangle {
    origin: Point,
    width: i32,
    height: i32
}

struct Color {
    r: u8,
    g: u8,
    b: u8,
    a: u8
}
```

Note: Struct instantiation and member access are parsed but not yet fully implemented in codegen.

### 9. Enum Definitions

```xers
enum Status {
    Ok,
    Error,
    Pending
}

enum HttpCode {
    Ok = 200,
    NotFound = 404,
    ServerError = 500
}

enum Flags {
    None = 0,
    Read = 1,
    Write = 2,
    Execute = 4,
    All = 7
}
```

Note: Enum usage in expressions is parsed but not yet fully implemented in codegen.

### 10. Boolean and Null Constants

```xers
let is_valid = true;
let is_empty = false;
let ptr = null;

if is_valid {
    // ...
}

if ptr == null {
    ptr = alloc(100);
}
```

### 11. Logical NOT Operator

```xers
let a = true;
let b = !a;      // b = false

let x = 5;
let y = !x;      // y = 0 (non-zero becomes 0)

let z = 0;
let w = !z;      // w = 1 (zero becomes 1)
```

## Extended State Structure

The extensions add new fields to the compiler state:

| Offset | Name | Description |
|--------|------|-------------|
| 160 | S_LOOP_START | Current loop start address |
| 168 | S_LOOP_END | Current loop end address |
| 176 | S_LOOP_DEPTH | Current loop nesting depth |
| 184 | S_CONST_TAB | Pointer to const table |
| 192 | S_CONSTN | Number of constants |
| 200 | S_STRUCT_TAB | Pointer to struct table |
| 208 | S_STRUCTN | Number of structs |
| 216 | S_ENUM_TAB | Pointer to enum table |
| 224 | S_ENUMN | Number of enums |
| 232 | S_BREAK_PATCHES | Break jump patch array |
| 240 | S_BREAK_COUNT | Number of pending breaks |

## Integration

To use these extensions with the base compiler:

1. Include `xersc_extensions.xers` after `xersc.xers`
2. Call `init_ext_state(st)` after initializing base state
3. Use `next_tok_ext(st)` instead of `next_tok(st)`
4. Use `parse_prog_ext(st)` instead of `parse_prog(st)`
5. Use `parse_while_ext(st)` for while loops with break/continue

## Testing

Run the test file to verify all extensions:

```bash
./xersc test_extensions.xers
./test_extensions.exe
echo $?  # Should be 0
```

## Future Work

- Full struct instantiation and field access codegen
- Enum usage in expressions and match statements
- Type checking with new type keywords
- For loop implementation
- Pattern matching (match expressions)
- Trait system
- Generic types
