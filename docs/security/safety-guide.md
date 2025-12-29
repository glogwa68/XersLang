# XerLang Safety Guide (T175)

## Safety Levels

XerLang uses a risk classification system for operations:

| Level | Name | Description |
|-------|------|-------------|
| L0 | Safe | No hardware impact - emulation, analysis |
| L1 | Low Risk | Read-only, logged operations |
| L2 | Moderate | Requires safeguards and rollback |
| L3 | High Risk | Explicit approval, full safety protocol |
| L4 | FORBIDDEN | Hardware damage potential - never execute |

## Core Safety Principle

**Maximum severity is PC shutdown. Hardware damage is NEVER acceptable.**

All L4 operations are rejected at compile time and runtime.

## Memory Safety

### Ownership Rules

1. Each value has exactly one owner
2. Values are dropped when owner goes out of scope
3. Borrowing is checked at compile time

```xerlang
// Safe: Single owner
let data = vec![1, 2, 3];
process(data);  // data moved
// data is no longer valid - compile error if used

// Safe: Borrowing
let data = vec![1, 2, 3];
print_data(&data);  // Borrow
process(data);  // Still valid, borrow ended
```

### No Null Pointers

```xerlang
// Use Option<T> instead of null
fn find_item(id: i32) -> Option<Item> {
    // Returns Some(item) or None
}

// Must handle both cases
match find_item(123) {
    Some(item) => use_item(item),
    None => handle_missing(),
}
```

### No Use-After-Free

```xerlang
// Compiler prevents this:
let ptr = &data;
drop(data);
// ERROR: data was moved, ptr is invalid
```

## Error Handling

### Explicit Errors

All errors must be handled:

```xerlang
// Result<T, E> must be used
let result = file.read();  // WARNING if unused
let content = file.read()?;  // Propagate with ?
```

### Error Context

```xerlang
fn process_file(path: &str) -> Result<(), Error> {
    let content = read_file(path)
        .with_context(|| format!("Failed to read {}", path))?;
    Ok(())
}
```

## CLI Safety Commands

### Check Safety Status

```bash
xerc safety check
```

### Assess Operation Risk

```bash
xerc safety assess microcode_injection
```

### Approve L3 Operations

```bash
xerc safety approve microcode_injection --acknowledge "I understand the risks"
```

## Hardware Operations

### L0: Emulator Only

```bash
xerc emulate program.ucode
```

Safe emulation with no hardware interaction.

### L1-L2: Logged Operations

All operations are logged. L2 requires rollback procedure.

### L3: High Risk

Requires:
- Complete safety checklist
- Explicit acknowledgment
- 10-second countdown
- Kill switch available

### L4: FORBIDDEN

Never executed. Examples:
- Unchecked MSR writes
- Direct hardware manipulation
- Operations that could damage hardware

## Safety Checklist (L3)

Before any L3 operation:

- [ ] Logging enabled
- [ ] Full rollback procedure ready
- [ ] Emulator validation passed
- [ ] Kill switch verified
- [ ] 10-second countdown implemented
- [ ] Explicit user approval obtained
- [ ] System state backed up

## Emergency Procedures

### Kill Switch

Immediately abort any running operation:

```bash
xerc safety kill-switch
```

### Rollback

Restore to previous known-good state:

```bash
xerc safety rollback
```

## Best Practices

1. Always test in emulator first
2. Use the minimum required risk level
3. Document all L2+ operations
4. Keep backups before L3 operations
5. Never attempt to bypass safety checks
