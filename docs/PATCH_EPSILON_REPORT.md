# PATCH-EPSILON: Low Priority Code Quality Improvements

## Summary

This document describes the 13 low-priority patches for improving code quality in the XersLang ASM compiler.

## Patches Applied

### LOW-004: Replace Magic Numbers with Constants (PARTIAL)
Added to `defines.inc`:
- `BUFFER_SIZE_256`, `BUFFER_SIZE_1K`, `BUFFER_SIZE_4K`, `BUFFER_SIZE_64K`
- `MAX_LOCALS_PER_FUNC` (64)
- `MAX_PARAMS_PER_FUNC` (4)
- `MAX_SCOPE_DEPTH` (64)
- `MAX_STRING_LENGTH` (65536)

### LOW-008: PE/COFF Constants (NEW)
Added to `defines.inc`:
- `PE_DOS_MAGIC`, `PE_SIGNATURE`, `PE_OPT_MAGIC_64`
- `PE_MACHINE_AMD64`
- `PE_SCN_CNT_CODE`, `PE_SCN_CNT_INIT`, `PE_SCN_MEM_*`
- `PE_SUBSYS_CONSOLE`, `PE_SUBSYS_WINDOWS`
- `PE_FILE_ALIGN`, `PE_SECTION_ALIGN`
- `PE_TEXT_RVA`, `PE_IDATA_RVA`, `PE_DATA_RVA`

### LOW-009: Register Usage Conventions (NEW)
Added to `defines.inc`:
- `REG_RAX` through `REG_R15` (register indices)
- `SHADOW_SPACE` (32)
- `DEFAULT_FRAME_SIZE` (128)
- `INST_SIZE_*` constants for instruction lengths
- Comments documenting Windows x64 ABI conventions

### LOW-010: Debug Assertions (NEW)
Added `ASSERT` macro to `defines.inc`:
```nasm
%macro ASSERT 2
%ifdef DEBUG
    %1 %%ok
    int3
%%ok:
%endif
%endmacro
```

### LOW-013: Version Information (PARTIAL)
- `XERSC_VERSION_STRING "1.0.0"` added to defines.inc
- Banner already present in main.asm

## Patches Requiring Manual Application

### LOW-001: Function Header Comments
Add detailed headers to functions. Example format:
```nasm
; ============================================================================
; function_name - Brief description
; ============================================================================
; PURPOSE:
;   Detailed explanation of what the function does.
;
; PARAMETERS:
;   RCX - Description of first parameter
;   RDX - Description of second parameter
;
; RETURNS:
;   EAX - Return value description
;
; SIDE EFFECTS:
;   - List any global state modified
;   - List any files created/modified
;
; REGISTER USAGE:
;   R12 - Description of preserved value
;   R13 - Description of preserved value
; ============================================================================
```

### LOW-002: Document Global Variables
For each `.bss` and `.data` section, add comments:
```nasm
section .bss
    ; Input filename from command line (pointer to string)
    input_file:     resq 1

    ; Output filename, defaults to "out.exe" (pointer to string)
    output_file:    resq 1
```

### LOW-003: Standardize Error Messages
Change error messages to format: `"Error: [context] description"`
Example:
```nasm
err_undefined:  db "Error: [resolve] Undefined variable", 10, 0
err_type:       db "Error: [typeck] Type mismatch", 10, 0
```

### LOW-005: Consolidate Error Handlers
Create shared error handling functions:
```nasm
; error_report - Report error and return failure code
; RCX = error message
; Returns: EAX = 1
error_report:
    push rbp
    mov rbp, rsp
    sub rsp, 32
    extern io_write_stderr
    call io_write_stderr
    mov eax, 1
    add rsp, 32
    pop rbp
    ret
```

### LOW-006: Optimize Symbol Table Search
Current `symtab_lookup` uses O(n) linear search. Options:
1. Add hash table for O(1) average lookup
2. Keep sorted and use binary search for O(log n)
3. Add scope-local caches

### LOW-007: Token Buffer Reuse
In `lexer.asm`, maintain a token buffer pool:
```nasm
section .bss
    token_buffer_pool:  resb TOKEN_BUFFER_POOL_SIZE
    token_buffer_pos:   resd 1
```

### LOW-008: Dead Code Removal
Search for patterns like:
```nasm
    jmp .label
    ; Dead code here - should be removed
    mov eax, 1
.label:
```

### LOW-011: Inline Comments
Add comments for complex instruction sequences:
```nasm
    ; Emit MOV [RBP+offset], RAX
    ; Encoding: 48 89 45 XX where XX is signed offset
    mov cl, 0x48            ; REX.W prefix for 64-bit operand
    call x64_emit_byte
    mov cl, 0x89            ; MOV r/m64, r64 opcode
    call x64_emit_byte
    mov cl, 0x45            ; ModR/M: mod=01 (disp8), reg=RAX, rm=RBP
    call x64_emit_byte
```

### LOW-012: Code Formatting
Standardize:
- 4-space indentation for instructions
- Labels at column 0
- Comments aligned at column 40
- Blank line between logical sections

## Files Modified

1. `src/include/defines.inc` - Added constants and macros
2. `src/include/defines.inc.backup` - Backup of original

## Files to Review

1. `src/main.asm` - Main entry point
2. `src/lexer/lexer.asm` - Tokenization
3. `src/parser/parser.asm` - Parsing
4. `src/codegen/codegen.asm` - Code generation
5. `src/typeck/symtab.asm` - Symbol table

## Verification

After applying patches, verify the compiler still builds and works:
```powershell
cd xerslang-asm
./link_fresh.ps1
./build/xersc.exe test.xers -o test.exe
./test.exe
echo $LASTEXITCODE
```
