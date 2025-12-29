# XersLang V2 Known Issues

## Issue #1: Function Calls in Binary Expressions

### Description
Function calls inside binary expressions produce incorrect results due to stack corruption.

### Root Cause
V1 (bootstrap compiler) uses `MOV [RSP+offset], RAX` pattern for storing function arguments instead of `PUSH RAX`. When V2 is compiled by V1, this pattern gets embedded in V2's codegen. When there's an outer expression that pushes a value to the stack (e.g., for a `+` operation), the `MOV [RSP], RAX` for the inner function call's argument overwrites that saved value.

### Example
```xers
fn countdown(n) {
    if n <= 0 { return 0; }
    return 1 + countdown(n - 1);  // BUG: Returns wrong value!
}

fn main() {
    return countdown(5);  // Returns 10 instead of 5
}
```

The expression `1 + countdown(n - 1)` generates:
1. Load 1, PUSH (saves 1 for later addition)
2. Evaluate countdown argument `n - 1`
3. MOV [RSP], RAX (stores n-1 - **overwrites the saved 1!**)
4. Load [RSP] to RCX, CALL countdown
5. POP (gets n-1 instead of 1!)
6. ADD RAX, popped_value (wrong result)

### Workaround
Extract function calls to temporary variables:

```xers
fn countdown(n) {
    if n <= 0 { return 0; }
    let r = countdown(n - 1);  // Store result first
    return 1 + r;              // Then add - WORKS!
}

fn main() {
    return countdown(5);  // Correctly returns 5
}
```

### Affected Patterns
- `a + func(b)`
- `a - func(b)`
- `a * func(b)`
- Any binary expression with a function call operand

### Status
Open - requires V1 codegen fix to resolve

## Self-Hosting Chain Status

### Current State
- **V1** (bootstrap ASM compiler): Crashes on large files (xersc.xers)
- **V2** (build/xersc.exe, 73KB): Works for simple programs, has embedded MOV [RSP] bug
- **V3** (compiled by V2): Broken due to V2's codegen bug

### What Works
- V2 can compile simple XersLang programs to working executables
- Programs that avoid function calls in binary expressions work correctly
- The workaround (extracting function calls to temp variables) is effective

### What Doesn't Work
- V2 cannot reliably compile xersc.xers to produce a working V3
- Self-hosting chain is blocked by the function argument passing bug
- V1 needs to be fixed before full self-hosting can be achieved

### Workaround Applied
Line 1237 in xersc.xers was modified to avoid the problematic pattern:
```xers
// Before (buggy):
let rel = foff - code_pos(st);

// After (workaround):
let cp = code_pos(st);
let rel = foff - cp;
```
