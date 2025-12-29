# Builtin Functions and Primitives

XerLang provides a minimal set of builtin functions for core functionality. The language is designed to be self-contained, with additional functions available through the standard library.

## I/O Functions

### `print(msg: String)`

Print text to standard output without a trailing newline.

**Example**:
```xerlang
print("Loading...");  // No newline at end
```

**Output**:
```
Loading...
```

### `println(msg: String)`

Print text to standard output with a trailing newline.

**Example**:
```xerlang
println("Hello, XerLang!");
```

**Output**:
```
Hello, XerLang!
```

### `read_line() -> String`

Read a line from standard input, returning it as a String. The newline character is included in the returned string.

**Example**:
```xerlang
fn main() {
    print("Enter your name: ");
    let name = read_line();
    println(format!("Hello, {}!", name));
}
```

**Note**: The returned string includes the trailing newline. Use `.trim()` to remove it:
```xerlang
let input = read_line();
let trimmed = input.trim();
```

## Program Control

### `exit(code: i32)`

Terminate the program with the specified exit code.

**Example**:
```xerlang
fn main() {
    if invalid_input() {
        exit(1);  // Exit with error code
    }
    exit(0);  // Exit with success code
}
```

**Exit Codes**:
- `0` - Success
- `1` - General error
- `2` - Misuse of command
- `126` - Command cannot execute
- `127` - Command not found
- Custom codes 3-255 for application-specific errors

### `panic(msg: String)`

Terminate the program with an error message. Used for unrecoverable errors.

**Example**:
```xerlang
fn critical_operation() {
    if system_corrupted {
        panic("System state corrupted! Aborting.");
    }
}
```

**Note**: `panic!` should be used for truly unrecoverable situations, not for expected error cases. Use `Result<T, E>` for expected errors.

## Memory Operations

### `alloc(size: usize) -> *mut u8`

Allocate a block of memory of the specified size in bytes. Returns a pointer to the allocated memory.

**Example**:
```xerlang
let ptr = alloc(1024);  // Allocate 1024 bytes
// Use ptr...
free(ptr);  // Must free when done
```

**Safety**:
- You must call `free()` to deallocate
- Do not access after `free()`
- The allocated memory is uninitialized

### `free(ptr: *mut u8)`

Deallocate a block of memory previously allocated with `alloc()`.

**Example**:
```xerlang
let ptr = alloc(256);
// ... use memory ...
free(ptr);  // Deallocate
```

**Safety**:
- Only call `free()` on pointers from `alloc()`
- Do not double-free
- Do not use pointer after `free()`

### `poke(addr: *mut u8, value: u8)`

Write a byte to a memory address.

**Example**:
```xerlang
let ptr = alloc(10);
poke(ptr, 42);  // Write 42 to first byte
```

### `peek(addr: *const u8) -> u8`

Read a byte from a memory address.

**Example**:
```xerlang
let ptr = alloc(10);
poke(ptr, 42);
let value = peek(ptr);  // Read back: 42
```

## String Operations

### `len(s: &str) -> usize`

Get the length of a string in bytes.

**Example**:
```xerlang
let s = "Hello";
println(format!("Length: {}", len(s)));  // Length: 5
```

**Note**: Returns byte length, not character count. For UTF-8 strings, use `.chars().count()` for character count.

## Type Conversions

### `to_string(value) -> String`

Convert a value to its string representation. Available for all types.

**Example**:
```xerlang
let num = 42;
let s = num.to_string();  // "42"

let flag = true;
let s = flag.to_string();  // "true"
```

## File I/O

### `read_file(path: &str) -> Result<String, IoError>`

Read entire file contents into a string.

**Example**:
```xerlang
fn main() -> Result<(), Error> {
    let contents = read_file("data.txt")?;
    println(contents);
    Ok(())
}
```

**Errors**:
- `IoError::NotFound` - File doesn't exist
- `IoError::PermissionDenied` - No read permission
- `IoError::Other(msg)` - Other I/O error

### `write_file(path: &str, contents: &str) -> Result<(), IoError>`

Write string contents to a file, creating or overwriting as needed.

**Example**:
```xerlang
fn main() -> Result<(), Error> {
    write_file("output.txt", "Hello, World!")?;
    Ok(())
}
```

### `file_len(path: &str) -> Result<u64, IoError>`

Get the size of a file in bytes.

**Example**:
```xerlang
fn main() -> Result<(), Error> {
    let size = file_len("data.bin")?;
    println(format!("File size: {} bytes", size));
    Ok(())
}
```

## Assertion and Testing

### `assert(condition: bool, msg: &str)`

Assert that a condition is true. Panics if false.

**Example**:
```xerlang
assert(x > 0, "x must be positive");
```

### `assert_eq(left: T, right: T, msg: &str)`

Assert that two values are equal. Panics if not.

**Example**:
```xerlang
assert_eq(2 + 2, 4, "Math is broken");
```

## Numeric Operations

### Arithmetic Operators

All standard arithmetic operators work on numeric types:

```xerlang
let a = 10;
let b = 3;
let sum = a + b;       // 13
let diff = a - b;      // 7
let product = a * b;   // 30
let quotient = a / b;  // 3
let remainder = a % b; // 1
```

### Integer Operations

```xerlang
// Bitwise operations
let a = 5;             // 0101
let b = 3;             // 0011
let and = a & b;       // 0001 = 1
let or = a | b;        // 0111 = 7
let xor = a ^ b;       // 0110 = 6
let not = !a;          // ~0101 = ...1010
let left = a << 1;     // 1010 = 10
let right = a >> 1;    // 0010 = 2
```

### Comparison Operators

```xerlang
5 == 5    // true
5 != 3    // true
5 < 10    // true
5 > 3     // true
5 <= 5    // true
5 >= 5    // true
```

### Logical Operators

```xerlang
true && false   // false
true || false   // true
!true           // false
```

## Type Casting

### `as` Operator

Convert between numeric types:

```xerlang
let x: i32 = 42;
let y: f64 = x as f64;  // 42.0
let z: u8 = (x as u8);  // 42
```

## Advanced Functions

### `size_of<T>() -> usize`

Get the size of a type in bytes.

**Example**:
```xerlang
let i32_size = size_of::<i32>();    // 4
let u64_size = size_of::<u64>();    // 8
let bool_size = size_of::<bool>();  // 1
```

### `align_of<T>() -> usize`

Get the alignment requirement of a type in bytes.

**Example**:
```xerlang
let align = align_of::<u64>();  // Usually 8
```

## Builtin Types

### Arrays

Array operations:

```xerlang
let arr = [1, 2, 3, 4, 5];
let first = arr[0];          // 1
let last = arr[4];           // 5
let len = arr.len();         // 5
```

### Strings

String methods:

```xerlang
let s = "hello";
let len = s.len();           // 5
let chars = s.chars();       // Iterator over characters
let upper = s.to_uppercase(); // "HELLO"
let trimmed = s.trim();      // Remove whitespace
let starts = s.starts_with("hel");  // true
let ends = s.ends_with("lo");       // true
```

### Vectors

Dynamic arrays:

```xerlang
let mut v = vec![1, 2, 3];
v.push(4);                   // Add element
let popped = v.pop();        // Remove last element
let len = v.len();           // 4 (or 3 if popped)
let first = &v[0];          // Access element
```

---

See [Standard Library](./stdlib.md) for additional functions and [Language Reference](../language/language-reference.md) for syntax details.
