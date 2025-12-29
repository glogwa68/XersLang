# CLAUDNET-DELTA Integration Guide

## Overview

This guide explains how to integrate the 10 new builtins (IDs 10-19) into the XersLang compiler.

## New Builtins Summary

| ID | Name | Args | Returns | Purpose |
|----|------|------|---------|---------|
| 10 | `get_argc()` | 0 | i64 | Get number of command-line arguments |
| 11 | `get_arg(index)` | 1 | ptr | Get argument string at index |
| 12 | `list_dir(pattern)` | 1 | handle | Open directory for enumeration |
| 13 | `dir_next(handle)` | 1 | ptr | Get next filename from directory |
| 14 | `dir_close(handle)` | 1 | i64 | Close directory handle |
| 15 | `is_dir(path)` | 1 | bool | Check if path is a directory |
| 16 | `is_file(path)` | 1 | bool | Check if path is a regular file |
| 17 | `path_join(base, name)` | 2 | ptr | Join two path components |
| 18 | `str_ends_with(str, suffix)` | 2 | bool | Check if string ends with suffix |
| 19 | `str_copy(dst, src)` | 2 | i64 | Copy string, return bytes copied |

## Integration Steps

### Step 1: Add is_builtin() Entries

Insert the contents of `NEW_BUILTINS_IS_BUILTIN.xers` into `xersc.xers`:
- Location: After line 923 (before `return 0;` at end of `is_builtin()`)
- This adds name recognition for all 10 new builtins

### Step 2: Add codegen_* Functions

Insert the contents of `NEW_BUILTINS_CODEGEN.xers` into `xersc.xers`:
- Location: After line 1157 (after `codegen_write_file()`, before `codegen_builtin()`)
- This adds 10 new code generation functions

### Step 3: Update codegen_builtin() Dispatch

Replace the existing `codegen_builtin()` function (lines 1160-1171) with the version from `NEW_BUILTINS_DISPATCH.xers`.

### Step 4: Extend IAT (Future Work)

For full functionality, the IAT needs additional Windows API imports:
- `GetCommandLineA` (for get_argc/get_arg)
- `CommandLineToArgvW` (for argument parsing)
- `FindFirstFileA` (for list_dir)
- `FindNextFileA` (for dir_next)
- `FindClose` (for dir_close)
- `GetFileAttributesA` (for is_dir/is_file)

Currently, most new builtins are stubs returning 0. The exceptions are:
- `str_ends_with`: Fully implemented inline
- `str_copy`: Fully implemented inline

## Files Created

```
xerslang-compiler/
  NEW_BUILTINS_CODEGEN.xers      - 10 new codegen_* functions
  NEW_BUILTINS_DISPATCH.xers     - Updated codegen_builtin() function
  NEW_BUILTINS_IS_BUILTIN.xers   - Name recognition code for is_builtin()
  INTEGRATION_GUIDE.md           - This file

tools/xslf/
  xslf.xers                      - XersLang Source Line Counter tool
```

## Testing

After integration, test with:

```xers
fn main() {
    // Test str_copy
    let buf = alloc(100);
    let len = str_copy(buf, "Hello");
    print_int(len);  // Should print 6 (including null)

    // Test str_ends_with
    let result = str_ends_with("test.xers", ".xers");
    print_int(result);  // Should print 1

    return 0;
}
```

## Architecture Notes

The XersLang compiler uses a simple builtin dispatch system:

1. `is_builtin(st, name_pos, name_len)` - Maps function names to IDs
2. `codegen_builtin(st, builtin_id)` - Dispatches to specific codegen functions
3. `codegen_XXX(st)` - Emits x64 machine code for each builtin

Each builtin generates inline x64 machine code using the `emit()` function.
Arguments are passed in Windows x64 calling convention: RCX, RDX, R8, R9.
Return values go in RAX.
