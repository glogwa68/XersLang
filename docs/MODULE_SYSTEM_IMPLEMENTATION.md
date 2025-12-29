# XersLang Module System Implementation

## Overview
This document describes the module/import system implementation for the XersLang compiler (xersc.xers).

## Changes Made

### 1. New Token Types Added
Location: SECTION 3 (lines ~118-121, ~139)

```xers
fn T_USE() { return 16; }      // 'use' keyword
fn T_MOD() { return 17; }      // 'mod' keyword
fn T_PUB() { return 18; }      // 'pub' keyword
fn T_COLONCOLON() { return 46; } // '::' operator
```

### 2. New State Fields Added
Location: SECTION 4 (lines ~162-163)

```xers
fn S_MODN() { return 120; }    // Number of modules loaded
fn S_MODBUF() { return 128; }  // Pointer to module tracking buffer
```

### 3. Lexer Modifications

#### 3a. Keyword Recognition (lines ~392-424)
Added recognition for 3-letter keywords in `next_tok()`:
- `use` (ASCII: 117, 115, 101) → T_USE
- `mod` (ASCII: 109, 111, 100) → T_MOD
- `pub` (ASCII: 112, 117, 98) → T_PUB

#### 3b. Double-Colon Operator (lines ~534-545)
Added recognition for `::` operator (ASCII 58, 58):
```xers
if c == 58 {
    if pos + 1 < len {
        let c2 = peek(src, pos + 1);
        if c2 == 58 {
            mem_write_i64(st, S_TOK(), T_COLONCOLON());
            // ... token metadata
            return 0;
        }
    }
}
```

### 4. Module System Functions

#### Location: Insert before SECTION 12 (PE FILE WRITER)

**Function: is_module_loaded(st, path_buf, path_len)**
- Checks if a module path has already been loaded
- Iterates through module buffer (256 bytes per entry)
- Compares path strings byte-by-byte
- Returns 1 if found, 0 otherwise

**Function: register_module(st, path_buf, path_len)**
- Registers a module as loaded
- Copies path string to module buffer at offset (modn * 256)
- Increments module count (S_MODN)

**Function: build_module_path(st, path_buf)**
- Converts token sequence to filesystem path
- Example: `std::io` → `std/io.xers`
- Replaces `::` with `/` (ASCII 47)
- Appends `.xers` extension (ASCII: 46, 120, 101, 114, 115)
- Returns path length

**Function: parse_use_stmt(st)**
- Parses `use path::to::module;` syntax
- Calls build_module_path() to get filesystem path
- Checks if already loaded via is_module_loaded()
- Registers module if not yet loaded
- Note: Currently only tracks paths, doesn't load/compile yet

**Function: parse_mod_decl(st)**
- Parses `mod module_name;` syntax
- Builds simple path: `module_name.xers`
- Checks and registers module
- Consumes semicolon token

### 5. Parser Modifications

#### Modified: parse_prog(st)
Location: SECTION 11

**OLD VERSION:**
```xers
fn parse_prog(st) {
    while mem_read_i64(st, S_TOK()) != T_EOF() {
        if mem_read_i64(st, S_TOK()) == T_FN() {
            parse_fn(st);
        } else {
            next_tok(st);
        }
    }
    return 0;
}
```

**NEW VERSION (to be integrated):**
```xers
fn parse_prog(st) {
    while mem_read_i64(st, S_TOK()) != T_EOF() {
        let tok = mem_read_i64(st, S_TOK());
        if tok == T_USE() {
            parse_use_stmt(st);
        } else {
            if tok == T_MOD() {
                parse_mod_decl(st);
            } else {
                if tok == T_FN() {
                    parse_fn(st);
                } else {
                    if tok == T_PUB() {
                        next_tok(st);  // Skip 'pub'
                        if mem_read_i64(st, S_TOK()) == T_FN() {
                            parse_fn(st);
                        }
                    } else {
                        next_tok(st);
                    }
                }
            }
        }
    }
    return 0;
}
```

### 6. Main Entry Point Modifications

**REQUIRED: Initialize module buffer**

Location: In the main() function or wherever compiler state is initialized

```xers
// Allocate module tracking buffer (16KB for 64 modules)
let mod_buf = alloc(16384);
mem_write_i64(st, S_MODBUF(), mod_buf);
mem_write_i64(st, S_MODN(), 0);
```

## Syntax Supported

### Use Statement
```xers
use std::io;
use utils;
use foo::bar::baz;
```

### Mod Declaration
```xers
mod utils;
mod helpers;
```

### Public Functions
```xers
pub fn public_function() {
    return 42;
}

fn private_function() {
    return 0;
}
```

## Current Limitations

1. **Path Resolution Only**: The current implementation tracks module paths but does NOT yet:
   - Actually read/parse the module files
   - Merge symbols from imported modules
   - Handle symbol namespacing

2. **No Recursive Compilation**: To fully implement modules, you need to add:
   - `compile_module(st, filepath)` function
   - Recursive parser invocation for imported files
   - Symbol table merging logic

3. **No Symbol Visibility**: The `pub` keyword is recognized but not enforced:
   - Need to add `is_public` flag to symbol table entries
   - Need visibility checking when resolving symbols

4. **No Namespace Prefixes**: Imported symbols are not namespaced:
   - Need to implement qualified paths: `utils::add()`
   - Need symbol table lookup with namespace resolution

## Next Steps for Full Implementation

### Step 1: Module File Loading
```xers
fn load_module_file(st, path_buf, path_len) {
    // Read file content using read_file builtin
    let content = read_file(path_buf);
    let len = file_len(path_buf);

    // Save current parser state
    let old_src = mem_read_i64(st, S_SRC());
    let old_len = mem_read_i64(st, S_LEN());
    let old_pos = mem_read_i64(st, S_POS());

    // Set new source
    mem_write_i64(st, S_SRC(), content);
    mem_write_i64(st, S_LEN(), len);
    mem_write_i64(st, S_POS(), 0);

    // Parse module
    next_tok(st);
    parse_prog(st);

    // Restore parser state
    mem_write_i64(st, S_SRC(), old_src);
    mem_write_i64(st, S_LEN(), old_len);
    mem_write_i64(st, S_POS(), old_pos);

    return 0;
}
```

### Step 2: Update parse_use_stmt
```xers
fn parse_use_stmt(st) {
    next_tok(st);
    let path_buf = alloc(512);
    let path_len = build_module_path(st, path_buf);

    if is_module_loaded(st, path_buf, path_len) == 0 {
        register_module(st, path_buf, path_len);
        load_module_file(st, path_buf, path_len);  // ADD THIS
    }

    return 0;
}
```

### Step 3: Symbol Table Enhancement
Add namespace field to symbol entries (currently 32 bytes each):
- Offset 0: name_pos (8 bytes)
- Offset 8: name_len (8 bytes)
- Offset 16: kind (8 bytes)
- Offset 24: offset (8 bytes)
- **NEW** Offset 32: namespace_pos (8 bytes)
- **NEW** Offset 40: namespace_len (8 bytes)
- **NEW** Offset 48: is_public (8 bytes)

Increase symbol entry size from 32 to 56 bytes.

### Step 4: Qualified Symbol Resolution
```xers
// Lookup symbol with namespace: utils::add
fn find_qualified_sym(st, namespace_pos, namespace_len, name_pos, name_len) {
    // Search for symbol matching both namespace and name
    // ...
}
```

## Test Files Created

### test_module_utils.xers
```xers
pub fn add(a, b) {
    return a + b;
}

pub fn multiply(a, b) {
    return a * b;
}

fn private_helper() {
    return 42;
}
```

### test_module_main.xers
```xers
use utils;

fn main() {
    let x = add(5, 3);
    let y = multiply(x, 2);
    return y;
}
```

## Integration Checklist

- [x] Add T_USE, T_MOD, T_PUB, T_COLONCOLON token definitions
- [x] Add S_MODN, S_MODBUF state fields
- [x] Modify lexer to recognize 'use', 'mod', 'pub' keywords
- [x] Modify lexer to recognize '::' operator
- [x] Implement is_module_loaded() function
- [x] Implement register_module() function
- [x] Implement build_module_path() function
- [x] Implement parse_use_stmt() function
- [x] Implement parse_mod_decl() function
- [ ] **MANUAL STEP**: Replace parse_prog() with new version
- [ ] **MANUAL STEP**: Initialize module buffer in main()
- [ ] Add load_module_file() for actual compilation
- [ ] Enhance symbol table with namespace/visibility
- [ ] Implement qualified symbol lookup
- [ ] Add error handling for missing modules

## File Locations

- **Main compiler**: `E:\Claude\Speckit-projects\XerLang\xerslang-asm\xersc.xers`
- **Module functions**: `E:\Claude\Speckit-projects\XerLang\xerslang-asm\module_system_code.xers`
- **Test utils**: `E:\Claude\Speckit-projects\XerLang\xerslang-asm\test_module_utils.xers`
- **Test main**: `E:\Claude\Speckit-projects\XerLang\xerslang-asm\test_module_main.xers`
- **This document**: `E:\Claude\Speckit-projects\XerLang\xerslang-asm\MODULE_SYSTEM_IMPLEMENTATION.md`

## Summary

The module system foundation has been implemented with:
1. ✅ Lexer support for module keywords and syntax
2. ✅ Token tracking and path resolution
3. ✅ Duplicate module detection
4. ⚠️ **Partial** parser integration (needs manual merge of parse_prog)
5. ❌ **TODO**: Actual file loading and compilation
6. ❌ **TODO**: Symbol merging and namespace resolution
7. ❌ **TODO**: Visibility enforcement

The current implementation provides the **lexical and syntactic foundation** for a module system. To complete it, implement the recursive compilation and symbol table enhancements described in "Next Steps."
