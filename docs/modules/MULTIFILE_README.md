# Multi-File Compilation for XersLang

## Overview

The XersLang self-hosted compiler now supports multi-file compilation and linking. This allows you to split your code across multiple `.xers` files and have them compiled together into a single executable.

## Architecture

The multi-file compilation system works in two passes:

### Pass 1: Compilation
- Each source file is read and parsed sequentially
- Functions are added to a global symbol table
- Machine code is generated and accumulated in a single code buffer
- Forward references (calls to functions not yet defined) are tracked in a relocation table

### Pass 2: Linking
- All unresolved function calls are patched using the complete symbol table
- Relative call offsets are calculated and inserted into the code
- A single PE executable is generated with all code combined

## Key Implementation Details

### Relocation Table
Each unresolved call is stored as a 24-byte entry:
- `[0-7]`: Code offset where the call instruction's displacement is located
- `[8-15]`: Position in source of function name
- `[16-23]`: Length of function name

### Modified Components

1. **State Structure Extensions**:
   - `S_RELOC()`: Pointer to relocation table (offset 136)
   - `S_RELOCN()`: Number of relocations (offset 144)
   - `S_FILEN()`: Number of files (offset 152)

2. **Modified `parse_id()` Function**:
   - Instead of erroring on undefined functions, adds them to relocation table
   - Allows forward references to functions defined in later files

3. **New Functions**:
   - `add_reloc()`: Adds entry to relocation table
   - `resolve_relocs()`: Patches all forward references after compilation
   - `count_files()`: Counts files in null-terminated list
   - `get_filename()`: Extracts filename from list by index
   - `main_multi()`: Main entry point for multi-file compilation

## File Format

The `main_multi()` function expects a null-terminated list of filenames:
```
"file1.xers\0file2.xers\0file3.xers\0\0"
```

Currently, the file list is hardcoded in `main_multi()` to compile `mod1.xers` and `mod2.xers`.

## Example Usage

### mod1.xers
```xers
fn add(a, b) {
    return a + b;
}

fn multiply(x, y) {
    return x * y;
}
```

### mod2.xers
```xers
fn main() {
    let x = add(5, 3);      // Calls function from mod1.xers
    let y = multiply(x, 4);  // Calls function from mod1.xers
    return y;
}
```

When compiled together, `mod2.xers` can call functions defined in `mod1.xers` even though they haven't been seen yet during parsing.

## Memory Layout

```
State struct:        256 bytes
Source buffer:       1 MB (reused for each file)
Code buffer:         512 KB (accumulates across all files)
Symbol table:        64 KB (global, persistent)
Relocation table:    128 KB
PE output buffer:    512 KB
```

## Compilation Process

1. Allocate all buffers
2. Initialize compiler state
3. **For each source file**:
   - Read file into source buffer
   - Reset parser position/line/column
   - Parse file, generating code and adding symbols
   - Unresolved calls are added to relocation table
4. **After all files parsed**:
   - Call `resolve_relocs()` to patch forward references
5. Generate PE executable with all code
6. Write output to `out.exe`

## Limitations

- File list is currently hardcoded (no command-line arguments yet)
- No duplicate function detection (last definition wins)
- No module/namespace system (all symbols are global)
- Unresolved symbols at end of linking are left as offset 0 (will crash at runtime)

## Future Enhancements

- Command-line argument parsing for file list
- Error reporting for unresolved symbols
- Module system with explicit imports/exports
- Separate compilation (compile to object files, then link)
- Link-time optimization across modules

## Testing

Test files are provided:
- `mod1.xers`: Helper functions (add, multiply, compute)
- `mod2.xers`: Main function that calls mod1 functions

Expected result: Program returns 24 (exit code)
- `compute(7)` = `(7 * 2) + 10` = 24

## Implementation Files

- `xersc.xers`: Main compiler with multi-file support (integrated)
- `xersc_multi.xers`: Standalone multi-file extension (reference)
- `mod1.xers`, `mod2.xers`: Test files
