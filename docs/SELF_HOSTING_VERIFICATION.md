# Self-Hosting Verification Guide

This document provides a comprehensive guide to verify that the XersLang compiler successfully self-hosts.

## What is Self-Hosting?

A **self-hosting compiler** is a compiler written in the language it compiles. For XersLang:

1. The compiler source code is written in XersLang (`xersc.xers`)
2. The compiler can compile its own source code
3. The resulting compiler (Gen 2) should behave identically to the original (Gen 1)

## Verification Procedure

### Prerequisites

1. Windows x64 system
2. NASM assembler (for bootstrap)
3. MSVC linker (for bootstrap)
4. Working directory: `E:\Claude\Speckit-projects\XerLang\xerslang-asm`

### Step 1: Build Bootstrap Compiler (ASM-based)

```bash
cd E:\Claude\Speckit-projects\XerLang\xerslang-asm

# Build the ASM-based bootstrap compiler
build.bat
```

This produces `xersc_asm.exe` (or similar name).

**Verification**: Check that the executable exists and has reasonable size (~50-200KB).

### Step 2: Bootstrap (Generation 1)

Compile the self-hosted compiler using the ASM compiler:

```bash
xersc_asm.exe xersc.xers
```

**Expected output**:
- No error messages
- Creates `out.exe`

**Verification**:
```bash
# Rename to xersc.exe
move out.exe xersc.exe

# Check file size (should be ~1-5KB for minimal PE)
dir xersc.exe
```

### Step 3: Self-Compile (Generation 2)

Compile the compiler with itself:

```bash
xersc.exe xersc.xers
```

**Expected output**:
- No error messages
- Creates `out.exe`

**Verification**:
```bash
# Rename to xersc2.exe
move out.exe xersc2.exe

# Check file size (should be similar to xersc.exe)
dir xersc2.exe
```

### Step 4: Functional Equivalence Test

Both compilers should produce identical results when compiling the same program.

```bash
# Test with minimal program
xersc.exe test_minimal.xers
move out.exe out1.exe

xersc2.exe test_minimal.xers
move out.exe out2.exe

# Run both and check exit codes
out1.exe
echo Gen1 exit code: %ERRORLEVEL%

out2.exe
echo Gen2 exit code: %ERRORLEVEL%
```

**Expected**: Both should return exit code 42.

### Step 5: Binary Comparison (Optional)

For maximum confidence, compare the generated executables:

```bash
# Compile same program with both generations
xersc.exe test_arith.xers
move out.exe test_arith_gen1.exe

xersc2.exe test_arith.xers
move out.exe test_arith_gen2.exe

# Compare file sizes
dir test_arith_gen1.exe test_arith_gen2.exe

# Run both and verify output
test_arith_gen1.exe > gen1_output.txt
test_arith_gen2.exe > gen2_output.txt

fc gen1_output.txt gen2_output.txt
```

**Expected**: Files should be identical (or functionally equivalent).

### Step 6: Third Generation (Optional, for maximum confidence)

Compile the compiler with Gen 2 to create Gen 3:

```bash
xersc2.exe xersc.xers
move out.exe xersc3.exe

# Test Gen 3
xersc3.exe test_minimal.xers
out.exe
echo Gen3 exit code: %ERRORLEVEL%
```

**Expected**: Gen 3 should also work identically.

### Step 7: Test Suite Validation

Run the full test suite with Gen 1 and Gen 2:

```bash
# Run with Gen 1
cd tests
run_tests.bat
cd ..

# Temporarily replace xersc.exe with xersc2.exe
move xersc.exe xersc_gen1_backup.exe
copy xersc2.exe xersc.exe

# Run with Gen 2
cd tests
run_tests.bat
cd ..

# Restore Gen 1
move xersc_gen1_backup.exe xersc.exe
```

**Expected**: All tests should pass with both generations.

## Success Criteria

The self-hosting verification is successful if:

1. ✅ Gen 1 compiles without errors from ASM bootstrap
2. ✅ Gen 1 can compile `xersc.xers` (itself)
3. ✅ Gen 2 compiles without errors
4. ✅ Gen 2 can compile `xersc.xers` (itself)
5. ✅ Gen 1 and Gen 2 produce functionally equivalent executables
6. ✅ All test cases pass with both generations
7. ✅ (Optional) Gen 3 is identical to Gen 2

## Common Issues

### Issue 1: Compilation Hangs

**Symptom**: Compiler runs indefinitely without producing output

**Possible causes**:
- Infinite loop in parser
- Circular dependency
- Memory allocation issue

**Debug**:
- Check compiler is reading correct source file
- Add debug print statements (if available)
- Reduce input to minimal failing case

### Issue 2: Gen 2 Differs from Gen 1

**Symptom**: Gen 2 produces different output than Gen 1

**Possible causes**:
- Non-deterministic code generation
- Uninitialized memory
- Platform-specific behavior

**Debug**:
- Compare file sizes first
- Disassemble both executables and compare
- Check for random number generation or timestamps

### Issue 3: Out of Memory

**Symptom**: Compiler crashes with allocation failure

**Possible causes**:
- Insufficient memory for large source files
- Memory leak
- Buffer overflow

**Debug**:
- Check available system memory
- Reduce buffer sizes if possible
- Test with smaller programs

## Performance Metrics

| Metric | Expected Value | Notes |
|--------|----------------|-------|
| Gen 1 compilation time | < 10 seconds | Compiling xersc.xers |
| Gen 2 compilation time | < 10 seconds | Should be similar to Gen 1 |
| xersc.exe size | 1-10 KB | Minimal PE executable |
| Test suite pass rate | 100% | All tests should pass |

## Limitations

The self-hosted compiler has the following known limitations:

1. **Single-file compilation only** - Cannot handle multiple source files
2. **No optimization** - Generates straightforward x64 code
3. **Limited error messages** - Basic error reporting
4. **Windows x64 only** - Not cross-platform
5. **No debug information** - Generated executables lack debug symbols

These limitations are acceptable for a minimal self-hosted implementation.

## Conclusion

If all verification steps pass, the XersLang compiler is successfully **self-hosting**.

This means:
- The language is expressive enough to implement its own compiler
- The compiler is correct enough to compile non-trivial programs (including itself)
- The implementation is stable and deterministic

**Status of Verification**:

- [ ] Step 1: Build Bootstrap Compiler
- [ ] Step 2: Bootstrap (Gen 1)
- [ ] Step 3: Self-Compile (Gen 2)
- [ ] Step 4: Functional Equivalence Test
- [ ] Step 5: Binary Comparison (Optional)
- [ ] Step 6: Third Generation (Optional)
- [ ] Step 7: Test Suite Validation

**Overall Result**: ⏳ PENDING VERIFICATION

## Next Steps

After successful verification:

1. Document any limitations encountered
2. Archive working binaries (Gen 1, Gen 2)
3. Update README with self-hosting status
4. Create release tag
5. Write announcement / blog post
