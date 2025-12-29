# XersLang Project Structure

Last updated: 2025-12-25

## Root Directory Organization

### Active Development

| Directory | Purpose | Status |
|-----------|---------|--------|
| `xerslang-asm/` | ASM bootstrap compiler (MASM x64) | ACTIVE - Primary development |
| `xerslang-all/` | Pure XersLang implementation | ACTIVE - Self-hosted version |
| `specs/` | Feature specifications (Speckit) | ACTIVE - Documentation |
| `.claude/` | Agent configurations and commands | ACTIVE - Development tools |

### Supporting Files

| Directory/File | Purpose |
|----------------|---------|
| `docs/` | Project documentation |
| `examples/` | Example XersLang programs |
| `tests/` | Test suite (Rust-based) |
| `archive/` | Archived working files and old versions |
| `README.md` | Main project documentation |
| `CLAUDE.md` | Agent execution strategy |
| `LICENSE` | MIT License |

### Legacy/Archive Directories

These directories are from previous iterations and may be archived:

| Directory | Status | Notes |
|-----------|--------|-------|
| `bootstrap/` | Legacy | Old bootstrap attempt |
| `build/` | Legacy | Rust build artifacts (superseded) |
| `final/` | Archive | Should be in archive/ |
| `xerlang/` | Legacy | Old naming convention |
| `xerlang-release/` | Archive | Old release |
| `xerslang/` | Legacy | Previous version |
| `xerslang-all-release/` | Archive | Old release build |
| `XERS_ACCRED/` | Unknown | To be reviewed |

### Rust Artifacts (Not in use for current spec)

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `Cargo.toml` | Rust project config | LEGACY - From Rust-based compiler |
| `Cargo.lock` | Rust dependencies | LEGACY |
| `src/` | Rust source files | LEGACY |
| `target/` | Rust build output | LEGACY |
| `clippy.toml` | Clippy config | LEGACY |
| `rustfmt.toml` | Rustfmt config | LEGACY |

Note: These are from earlier specs (001-005) that used Rust. Current spec (007) is pure ASM/XersLang.

## xerslang-asm/ Structure (Active)

```
xerslang-asm/
├── src/                    # Assembly source files
│   ├── main.asm            # Entry point and CLI
│   ├── common/             # Shared utilities
│   │   ├── io.asm          # File I/O
│   │   ├── string.asm      # String operations
│   │   ├── source.asm      # Source file handling
│   │   └── symtab.asm      # Symbol table
│   ├── lexer/              # Tokenization
│   │   ├── lexer.asm       # Main lexer
│   │   └── tokens.asm      # Token types
│   ├── parser/             # Parsing
│   │   ├── parser.asm      # Main parser
│   │   ├── ast.asm         # AST structures
│   │   ├── expr.asm        # Expression parsing
│   │   └── stmt.asm        # Statement parsing
│   ├── typeck/             # Type checking
│   │   ├── typeck.asm      # Type checker
│   │   ├── types.asm       # Type system
│   │   ├── infer.asm       # Type inference
│   │   └── borrow.asm      # Borrow checker
│   ├── codegen/            # Code generation
│   │   ├── codegen.asm     # Main codegen
│   │   ├── x64.asm         # x64 instruction emission
│   │   ├── builtins.asm    # Builtin functions
│   │   ├── reloc.asm       # Relocations
│   │   └── project.asm     # Multi-file projects
│   └── pe/                 # PE file generation
│       └── pe.asm          # PE32+ writer
│
├── build/                  # Build artifacts
│   ├── *.obj               # Object files
│   ├── *.map               # Link maps
│   └── xersc.exe           # Bootstrap compiler
│
├── test_*.xers             # Test programs
├── xersc.xers              # Self-hosted compiler (WIP)
├── build_xersc.bat         # Build script
└── link_msvc.bat           # Link script

```

## specs/ Structure

```
specs/
├── 001-core-language-design/       # Initial language design
├── 002-complete-compiler/          # First compiler implementation
├── 003-self-hosting/               # Self-hosting experiments
├── 004-xerslang-secure/            # Security features
├── 005-xerslang-all/               # Pure XersLang approach
└── 007-xerslang-self-hosted/       # CURRENT - Self-hosted compiler
    ├── spec.md                     # Complete specification (299KB)
    ├── plan.md                     # 14-week implementation plan
    ├── tasks.md                    # 180 task breakdown
    ├── data-model.md               # Internal data structures
    ├── research.md                 # Technical research
    ├── quickstart.md               # Getting started guide
    ├── test-suite.md               # Test documentation
    ├── edge-cases.md               # Edge case handling
    └── agent-strategy.md           # Agent execution strategy

```

## .claude/ Structure

```
.claude/
├── agents/                 # Agent definitions
│   ├── recursive-worker.md         # Main worker agent
│   ├── master-task-decomposer.md   # Task decomposition
│   ├── tot-coordinator.md          # Tree-of-thoughts
│   ├── task-executor-*.md          # Executors
│   └── [50+ specialized agents]
│
└── commands/               # Speckit commands
    ├── speckit.specify.md
    ├── speckit.implement.md
    ├── speckit.tasks.md
    └── [other commands]

```

## archive/ Structure

```
archive/
└── working-docs/           # Temporary working files
    ├── todo-claude.txt     # Old task list
    ├── ultime-prompt.txt   # Old prompt
    ├── reprise.txt         # Work resumption notes
    ├── workers.md          # Worker status log
    ├── main.exe            # Old test executable
    └── out.exe             # Old compiler output

```

## Key Files

### Configuration Files

- `.gitignore` - Git ignore rules (updated with XersLang-specific patterns)
- `CLAUDE.md` - Agent execution directives (merged from global and project)
- `CODE_OF_CONDUCT.md` - Community guidelines
- `CONTRIBUTING.md` - Contribution guidelines

### Documentation Files

- `README.md` - Main project documentation (UPDATED)
- `LICENSE` - MIT License
- `PROJECT_STRUCTURE.md` - This file

## File Counts

```
xerslang-asm/src/        ~30 .asm files
xerslang-asm/test_*.xers ~150+ test files
specs/007-*/             ~10 documentation files
.claude/agents/          ~50+ agent definitions
```

## Recent Cleanup Actions (2025-12-25)

### First Wave
1. Moved temporary working files to `archive/working-docs/`:
   - todo-claude.txt
   - ultime-prompt.txt
   - reprise.txt
   - main.exe
   - out.exe

2. Updated `.gitignore` with XersLang-specific patterns:
   - Build artifacts (*.obj, *.exe, *.map)
   - Test files (test_*.xers, xers*.xers)
   - Build scripts (link_*.bat, rebuild_*.bat)
   - Temporary files (*.txt in xerslang-asm/)
   - Archive directories

3. Updated `README.md` with current project status and structure

4. Created `PROJECT_STRUCTURE.md` (this file)

### Second Wave (2025-12-25 19:22 UTC)
1. Organized security documentation:
   - Moved `workers.md` → `specs/010-security-deep-check/workers.md`
   - Moved `SECURITY_PATCHES_C1_C2.md` → `specs/010-security-deep-check/SECURITY_PATCHES_C1_C2.md`

2. Root directory now contains only essential files:
   - `README.md` - Main documentation
   - `CLAUDE.md` - Project instructions and agent strategy
   - `CODE_OF_CONDUCT.md` - Community guidelines
   - `CONTRIBUTING.md` - Contribution guidelines
   - `PROJECT_STRUCTURE.md` - This file

## Recommended Future Cleanups

1. Archive legacy directories:
   - Move `final/`, `xerlang/`, `xerlang-release/`, `xerslang/`, `xerslang-all-release/` to `archive/legacy/`
   - Review `XERS_ACCRED/` and archive if not needed

2. Consider separating Rust artifacts:
   - If Rust compiler is no longer used, move to `archive/rust-compiler/`
   - Keep only if specs 001-005 need to be referenced

3. Consolidate documentation:
   - Ensure all relevant docs are referenced in README.md
   - Create index in `docs/` directory

4. Clean test files:
   - Move test_*.xers to `xerslang-asm/tests/` subdirectory
   - Organize by category (lexer, parser, codegen, etc.)

## Notes

- Current active spec: **007-xerslang-self-hosted**
- Primary development directory: **xerslang-asm/**
- Bootstrap compiler: **xerslang-asm/build/xersc.exe** (ASM-based)
- Target: **xerslang-asm/xersc.xers** (self-hosted compiler in XersLang)
- Branch: **007-xerslang-self-hosted**
