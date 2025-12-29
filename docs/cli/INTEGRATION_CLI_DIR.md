# Integration Guide: CLI & Directory Builtins

## Overview

This document describes how to integrate the new CLI and Directory builtins
into the XersLang compiler (`xersc.xers`).

## New Builtins

| ID | Name | Signature | Description |
|----|------|-----------|-------------|
| 10 | `get_argc` | `() -> i64` | Returns count of CLI arguments |
| 11 | `get_arg` | `(index: i64) -> str` | Returns argument at index |
| 12 | `list_dir` | `(path: str) -> ptr` | Opens directory for iteration |
| 13 | `dir_next` | `(handle: ptr) -> str` | Gets next filename (0 if done) |
| 14 | `dir_close` | `(handle: ptr) -> void` | Closes directory handle |

## New IAT Entries

| Index | API Function | DLL |
|-------|--------------|-----|
| 8 | GetCommandLineA | KERNEL32.dll |
| 9 | FindFirstFileA | KERNEL32.dll |
| 10 | FindNextFileA | KERNEL32.dll |
| 11 | FindClose | KERNEL32.dll |

## Integration Steps

### Step 1: Add Codegen Functions

Copy the following functions from `builtins_cli_dir.xers` to `xersc.xers`
after the existing `codegen_write_file()` function (around line 1158):

- `codegen_get_argc(st)`
- `codegen_get_arg(st)`
- `codegen_list_dir(st)`
- `codegen_dir_next(st)`
- `codegen_dir_close(st)`

### Step 2: Extend is_builtin() Function

Add to `is_builtin()` (around line 763) after the existing builtin checks:

```xers
// get_argc (8 chars)
if name_len == 8 {
    if peek(src, name_pos) == 103 {        // g
        if peek(src, name_pos + 1) == 101 { // e
            if peek(src, name_pos + 2) == 116 { // t
                if peek(src, name_pos + 3) == 95 {  // _
                    if peek(src, name_pos + 4) == 97 { // a
                        if peek(src, name_pos + 5) == 114 { // r
                            if peek(src, name_pos + 6) == 103 { // g
                                if peek(src, name_pos + 7) == 99 { // c
                                    return 10;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// get_arg (7 chars)
if name_len == 7 {
    if peek(src, name_pos) == 103 {        // g
        if peek(src, name_pos + 1) == 101 { // e
            if peek(src, name_pos + 2) == 116 { // t
                if peek(src, name_pos + 3) == 95 {  // _
                    if peek(src, name_pos + 4) == 97 { // a
                        if peek(src, name_pos + 5) == 114 { // r
                            if peek(src, name_pos + 6) == 103 { // g
                                return 11;
                            }
                        }
                    }
                }
            }
        }
    }
}

// list_dir (8 chars)
if name_len == 8 {
    if peek(src, name_pos) == 108 {        // l
        if peek(src, name_pos + 1) == 105 { // i
            if peek(src, name_pos + 2) == 115 { // s
                if peek(src, name_pos + 3) == 116 {  // t
                    if peek(src, name_pos + 4) == 95 { // _
                        if peek(src, name_pos + 5) == 100 { // d
                            if peek(src, name_pos + 6) == 105 { // i
                                if peek(src, name_pos + 7) == 114 { // r
                                    return 12;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// dir_next (8 chars)
if name_len == 8 {
    if peek(src, name_pos) == 100 {        // d
        if peek(src, name_pos + 1) == 105 { // i
            if peek(src, name_pos + 2) == 114 { // r
                if peek(src, name_pos + 3) == 95 {  // _
                    if peek(src, name_pos + 4) == 110 { // n
                        if peek(src, name_pos + 5) == 101 { // e
                            if peek(src, name_pos + 6) == 120 { // x
                                if peek(src, name_pos + 7) == 116 { // t
                                    return 13;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// dir_close (9 chars)
if name_len == 9 {
    if peek(src, name_pos) == 100 {        // d
        if peek(src, name_pos + 1) == 105 { // i
            if peek(src, name_pos + 2) == 114 { // r
                if peek(src, name_pos + 3) == 95 {  // _
                    if peek(src, name_pos + 4) == 99 { // c
                        if peek(src, name_pos + 5) == 108 { // l
                            if peek(src, name_pos + 6) == 111 { // o
                                if peek(src, name_pos + 7) == 115 { // s
                                    if peek(src, name_pos + 8) == 101 { // e
                                        return 14;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### Step 3: Extend codegen_builtin() Dispatcher

Add to `codegen_builtin()` (around line 1160) after the existing cases:

```xers
fn codegen_builtin(st, builtin_id) {
    if builtin_id == 1 { codegen_peek(st); return 0; }
    if builtin_id == 2 { codegen_poke(st); return 0; }
    if builtin_id == 3 { codegen_strlen(st); return 0; }
    if builtin_id == 4 { codegen_streq(st); return 0; }
    if builtin_id == 5 { codegen_alloc(st); return 0; }
    if builtin_id == 6 { codegen_print_int(st); return 0; }
    if builtin_id == 7 { codegen_read_file(st); return 0; }
    if builtin_id == 8 { codegen_file_len(st); return 0; }
    if builtin_id == 9 { codegen_write_file(st); return 0; }
    // NEW: CLI & Directory builtins
    if builtin_id == 10 { codegen_get_argc(st); return 0; }
    if builtin_id == 11 { codegen_get_arg(st); return 0; }
    if builtin_id == 12 { codegen_list_dir(st); return 0; }
    if builtin_id == 13 { codegen_dir_next(st); return 0; }
    if builtin_id == 14 { codegen_dir_close(st); return 0; }
    return 0;
}
```

### Step 4: Extend IAT in write_pe()

This is the most complex change. The IAT needs to be extended from 8 to 12 entries.

#### Current Layout (8 entries + null = 72 bytes for ILT/IAT each):
- ILT at offset +40 (72 bytes)
- IAT at offset +112 (72 bytes)
- Hint/Name table at +184

#### New Layout (12 entries + null = 104 bytes for ILT/IAT each):
- ILT at offset +40 (104 bytes)
- IAT at offset +144 (104 bytes)  <- shifted by 32
- Hint/Name table at +248        <- shifted by 64

The PE writer needs significant modifications. Key changes:

1. Update ILT entries (add 4 more):
```xers
mem_write_i64(pe, idata_file_off + 104, idata_rva + NEW_OFFSET_GETCMDLINE);
mem_write_i64(pe, idata_file_off + 112, idata_rva + NEW_OFFSET_FINDFIRST);
mem_write_i64(pe, idata_file_off + 120, idata_rva + NEW_OFFSET_FINDNEXT);
mem_write_i64(pe, idata_file_off + 128, idata_rva + NEW_OFFSET_FINDCLOSE);
mem_write_i64(pe, idata_file_off + 136, 0);  // null terminator
```

2. Update IAT entries (same as ILT)

3. Add hint/name entries for new APIs

4. Update FirstThunk RVA in import directory

5. Adjust all RVA references

## Testing

After integration, test with this program:

```xers
fn main() {
    let argc = get_argc();
    print_int(argc);

    let dir = list_dir("*.xers");
    if dir != 0 {
        let name = dir_next(dir);
        while name != 0 {
            print_int(strlen(name));
            name = dir_next(dir);
        }
        dir_close(dir);
    }
    return 0;
}
```

## File Locations

- Implementation: `E:\Claude\Speckit-projects\XerLang\xerslang-compiler\builtins_cli_dir.xers`
- Main compiler: `E:\Claude\Speckit-projects\XerLang\xerslang-compiler\xersc.xers`
- This guide: `E:\Claude\Speckit-projects\XerLang\xerslang-compiler\INTEGRATION_CLI_DIR.md`
