# Memory Safety Mechanisms

XersLang incorporates several mechanisms to ensure memory safety at compile time and runtime.

## Compile-Time Safety

### Ownership System

XersLang enforces a strict ownership model where each value has exactly one owner. When the owner goes out of scope, the value is automatically dropped.

```xers
fn example() {
    let s = "hello"
    // s is owned by this function
}  // s is dropped here
```

#### Move Semantics

When a value is assigned or passed to a function, ownership is transferred:

```xers
let s1 = "hello"
let s2 = s1      // s1 is moved to s2
// s1 is no longer valid - cannot use it
```

### Borrowing

Values can be borrowed temporarily without transferring ownership:

```xers
let s = "hello"
fn process(text: &String) { }
process(&s)      // Borrow s
// s is still valid here
```

#### Immutable Borrowing

Multiple immutable borrows are allowed:

```xers
let s = "hello"
let r1 = &s
let r2 = &s
// Both r1 and r2 can coexist
```

#### Mutable Borrowing

Only one mutable borrow is allowed at a time:

```xers
let mut s = "hello"
let r = &mut s   // First mutable borrow
// let r2 = &mut s  // ERROR: Cannot have second mutable borrow
```

### Type Safety

Strong static typing prevents type errors:

```xers
let x: i64 = 42
let y: i64 = x + 1  // OK: both are i64

// let z = x + "hello"  // ERROR: Cannot add i64 and String
```

### Bounds Checking

Array access is bounds-checked:

```xers
let arr = [1, 2, 3]
let x = arr[0]   // OK
// let y = arr[10]  // ERROR: Out of bounds
```

## Runtime Safety

### Null Pointer Handling

The language prevents null pointer dereferences through the type system:

```xers
// Option type for nullable values
let maybe_value: Option<i64> = Some(42)

match maybe_value {
    Some(v) => println(v),
    None => println("No value"),
}
```

### Stack Allocation

Local variables are stack-allocated and automatically freed:

```xers
fn foo() {
    let x = 42      // Allocated on stack
}  // x automatically freed
```

### Heap Allocation

Heap allocation must be explicit and carefully managed:

```xers
let ptr = alloc(1024)   // Allocate on heap
// Use ptr...
// Note: Currently no automatic deallocation (manual management required)
```

### Bounds Checking on Strings

String operations check bounds:

```xers
let s = "hello"
let sub = s[0:2]    // OK: Valid range
// let bad = s[0:100]  // ERROR: Out of bounds
```

## Type-Level Guarantees

### Result Types

Functions that can fail return `Result<T, E>`:

```xers
fn divide(a: i64, b: i64) -> Result<i64, String> {
    if b == 0 {
        Err("Division by zero")
    } else {
        Ok(a / b)
    }
}

match divide(10, 2) {
    Ok(result) => println(result),
    Err(msg) => println(msg),
}
```

### Option Types

Functions that can return no value use `Option<T>`:

```xers
fn find_first(arr: [i64], target: i64) -> Option<i64> {
    for i in 0..arr.len() {
        if arr[i] == target {
            return Some(i)
        }
    }
    None
}
```

## Borrow Checking Rules

### Rule 1: One Owner
Each value has exactly one owner.

```xers
let s1 = "hello"
let s2 = s1      // s1 moves, s2 now owns
```

### Rule 2: Owner Goes Out of Scope
When the owner goes out of scope, the value is dropped.

```xers
{
    let s = "hello"
}  // s is dropped here
```

### Rule 3: Borrowing

**Immutable borrows**: Multiple allowed, value can still be used.

```xers
let s = "hello"
let r1 = &s
let r2 = &s
// s is still valid
```

**Mutable borrows**: Only one allowed, value cannot be borrowed elsewhere.

```xers
let mut s = "hello"
let r = &mut s
// Cannot borrow s again while r exists
```

### Rule 4: Borrow Lifetime

A borrow cannot outlive the value being borrowed.

```xers
fn dangerous() -> &String {
    let s = "hello"
    &s  // ERROR: s will be dropped when function returns
}
```

## Dynamic Checking

While most safety is enforced at compile time, some runtime checks are performed:

### Array Bounds
```xers
let arr = [1, 2, 3]
let x = arr[10]  // Runtime panic if index >= length
```

### Type Coercion
```xers
let s = "123"
match s.to_i64() {
    Some(n) => println(n),
    None => println("Parse failed"),
}
```

### Stack Overflow
Functions with deep recursion can cause stack overflow:

```xers
fn recurse(n: i64) {
    if n > 0 {
        recurse(n - 1)  // May overflow stack
    }
}
```

## Best Practices

### Use Result for Error Cases
```xers
// Good
fn risky() -> Result<i64, String> {
    if bad {
        Err("Something went wrong")
    } else {
        Ok(42)
    }
}

// Avoid
fn risky() -> i64 {
    // How to signal error?
}
```

### Avoid Raw Pointers When Possible
```xers
// Good
let arr = [1, 2, 3]
let x = arr[0]

// Avoid if possible
let ptr = alloc(8)
// Manual memory management
```

### Use Borrowing for Temporary Access
```xers
// Good
fn process(data: &[i64]) { }
process(&my_array)

// Avoid unnecessary moves
fn process(data: [i64]) { }  // Copies data
process(my_array)
```

### Handle Errors Explicitly
```xers
match operation() {
    Ok(result) => println(result),
    Err(error) => {
        println("Error: " + error)
        exit(1)
    }
}
```

## Known Limitations

1. **No automatic deallocation** - Must manually manage heap allocations
2. **Simplified borrow checking** - Some valid borrows may be rejected
3. **No lifetime parameters** - Lifetimes are inferred and limited
4. **Stack size limit** - Large local arrays can overflow the stack
5. **No access control** - No private/public mechanism yet

## Security Guarantees

XersLang provides the following security guarantees:

- **Memory safety**: No buffer overflows, use-after-free, or double-free
- **Type safety**: All type operations are checked at compile time
- **Null safety**: Null pointers cannot be dereferenced
- **Data races**: Single-threaded execution prevents data races
- **Integer overflow**: Not checked in current version (planned)

## Unsafe Code

Currently, XersLang has no unsafe block. All operations are checked.

Future versions may include unsafe blocks for:
- FFI (Foreign Function Interface)
- Optimized algorithms
- Low-level hardware access

When unsafe code is added, it will be clearly marked and require explicit opt-in.
