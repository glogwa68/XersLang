# XersLang CLI - Cargo-style Command Interface

## Overview

This module adds a modern Cargo-style command interface to the xersc compiler while maintaining full backward compatibility with the legacy single-file compilation mode.

## New Commands

```bash
# Build project from xers.toml
xersc build
xersc build --release

# Create new project
xersc new my-project
xersc new my-lib --lib

# Initialize in current directory
xersc init
xersc init --lib

# Build and run
xersc run
xersc run --release

# Clean build directory
xersc clean

# Help and version
xersc --help
xersc help
xersc --version
xersc -V

# Legacy mode (still supported)
xersc file.xers
xersc file.xers -o output.exe
```

## Files

| File | Description |
|------|-------------|
| `cli.xers` | CLI argument parsing, command detection, help/version output, Cargo-style formatting |
| `cli_commands.xers` | TOML parser, project templates (xers.toml, main.xers, lib.xers), path utilities |
| `cli_builtins.xers` | Code generation for get_argc() and get_arg() builtins |
| `cli_main.xers` | New main() function with CLI dispatcher |

## Integration

### Step 1: Add CLI Builtins to is_builtin()

In `xersc.xers`, add before `return 0;` in `is_builtin()` (around line 818):

```xers
// get_argc: 103,101,116,95,97,114,103,99 = "get_argc" (8 chars)
if match_name(src, name_pos, name_len, 8, 103, 101, 116, 95, 97, 114, 103, 99, 0, 0) == 1 { return 10; }

// get_arg: 103,101,116,95,97,114,103 = "get_arg" (7 chars)
if match_name(src, name_pos, name_len, 7, 103, 101, 116, 95, 97, 114, 103, 0, 0, 0) == 1 { return 11; }
```

### Step 2: Add codegen functions

Copy `codegen_get_argc(st)` and `codegen_get_arg(st)` from `cli_builtins.xers` to `xersc.xers`.

### Step 3: Update codegen_builtin()

Add before `return 0;` in `codegen_builtin()` (around line 1063):

```xers
if builtin_id == 10 { codegen_get_argc(st); return 0; }
if builtin_id == 11 { codegen_get_arg(st); return 0; }
```

### Step 4: Extend IAT for GetCommandLineA

In `write_pe()`, add GetCommandLineA at IAT index 8. The `emit_hint_GetCommandLineA()` helper is in `cli_builtins.xers`.

### Step 5: Include CLI modules

After the memory utilities section in `xersc.xers`, include:
1. Content of `cli.xers`
2. Content of `cli_commands.xers`

### Step 6: Replace main()

Replace the existing `main()` function with the one from `cli_main.xers`.

## Project Structure

### xers.toml (Binary)

```toml
[package]
name = "my-app"
version = "0.1.0"

[[bin]]
name = "my-app"
path = "src/main.xers"
```

### xers.toml (Library)

```toml
[package]
name = "my-lib"
version = "0.1.0"

[lib]
path = "src/lib.xers"
```

### Default Project Layout

```
my-project/
  xers.toml
  src/
    main.xers    # or lib.xers for libraries
  build/
    my-project.exe
```

## Output Examples

```
$ xersc build --release
   Compiling my-app v0.1.0
    Finished release [optimized] target(s)

$ xersc new hello-world
     Created binary (application) `hello-world` package
     Creating hello-world/xers.toml
     Creating hello-world/src/main.xers

$ xersc run
   Compiling my-app v0.1.0
    Finished dev target(s)
     Running `build/my-app.exe`

$ xersc clean
    Cleaning build/

$ xersc --version
xersc 0.1.0

$ xersc --help
XersLang Compiler

Usage: xersc <command> [options]

Commands:
  build     Build the current project
  new       Create a new project
  init      Initialize in current directory
  run       Build and run
  clean     Remove build directory

Options:
  --release    Build with optimizations
  --lib        Create a library
  --verbose    Verbose output

Legacy mode: xersc file.xers [-o output.exe]
```

## CLI_ARGS Structure

The parsed CLI arguments are stored in a 64-byte structure:

| Offset | Field | Type | Description |
|--------|-------|------|-------------|
| 0 | command | ptr | Command string ("build", "new", etc.) |
| 8 | target | ptr | Project name or file path |
| 16 | release_mode | i64 | 1 if --release flag |
| 24 | is_lib | i64 | 1 if --lib flag |
| 32 | verbose | i64 | 1 if --verbose flag |
| 40 | output_file | ptr | Custom output file (-o) |
| 48 | is_legacy_mode | i64 | 1 if .xers file passed directly |

## Builtin Reference

| ID | Name | Signature | Description |
|----|------|-----------|-------------|
| 10 | get_argc | `get_argc() -> i64` | Get argument count |
| 11 | get_arg | `get_arg(index) -> ptr` | Get argument at index (0 = program name) |

## Limitations

1. **Directory creation** - `new` and `init` print but don't create directories (needs CreateDirectoryA)
2. **Process execution** - `run` builds but doesn't execute (needs CreateProcessA)
3. **File deletion** - `clean` prints but doesn't delete (needs DeleteFileA)

These can be addressed by adding the corresponding Windows API builtins.

## Backward Compatibility

The CLI automatically detects legacy mode when:
- A single argument ending with `.xers` is passed
- Example: `xersc myfile.xers` compiles to `myfile.exe`

The `-o` flag for custom output is also preserved:
- Example: `xersc myfile.xers -o custom.exe`
