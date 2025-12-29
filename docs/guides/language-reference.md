# XerLang Language Reference (T173)

## Lexical Structure

### Keywords

```
fn, let, mut, if, else, while, for, in, loop, break, continue,
return, match, struct, enum, impl, trait, pub, use, mod,
const, static, type, where, self, Self, true, false
```

### Operators

| Operator | Description |
|----------|-------------|
| `+` `-` `*` `/` `%` | Arithmetic |
| `==` `!=` `<` `>` `<=` `>=` | Comparison |
| `&&` `\|\|` `!` | Logical |
| `&` `\|` `^` `~` `<<` `>>` | Bitwise |
| `=` | Assignment |
| `?` | Error propagation |
| `&` | Borrow |
| `*` | Dereference |

## Types

### Primitive Types

| Type | Description |
|------|-------------|
| `i8`, `i16`, `i32`, `i64` | Signed integers |
| `u8`, `u16`, `u32`, `u64` | Unsigned integers |
| `f32`, `f64` | Floating point |
| `bool` | Boolean |
| `char` | Unicode character |
| `()` | Unit type |

### Compound Types

```xerlang
// Arrays
let arr: [i32; 5] = [1, 2, 3, 4, 5];

// Tuples
let tuple: (i32, String, bool) = (42, "hello", true);

// Structs
struct Point {
    x: f64,
    y: f64,
}

// Enums
enum Color {
    Red,
    Green,
    Blue,
    Rgb(u8, u8, u8),
}
```

### Special Types

```xerlang
// Option - nullable values
let maybe: Option<i32> = Some(42);
let nothing: Option<i32> = None;

// Result - error handling
let ok: Result<i32, Error> = Ok(42);
let err: Result<i32, Error> = Err(Error::new("failed"));
```

## Ownership System

### Rules

1. Each value has exactly one owner
2. When the owner goes out of scope, the value is dropped
3. Values can be borrowed (immutably or mutably)

### Move Semantics

```xerlang
let s1 = String::from("hello");
let s2 = s1;  // s1 is moved to s2
// s1 is no longer valid
```

### Borrowing

```xerlang
let s = String::from("hello");
let len = calculate_length(&s);  // Immutable borrow
println(s);  // s is still valid

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### Mutable Borrowing

```xerlang
let mut s = String::from("hello");
change(&mut s);  // Mutable borrow

fn change(s: &mut String) {
    s.push_str(", world");
}
```

## Control Flow

### If Expression

```xerlang
let number = if condition {
    5
} else {
    10
};
```

### Match Expression

```xerlang
match value {
    1 => println("one"),
    2 | 3 => println("two or three"),
    4..=10 => println("four to ten"),
    _ => println("something else"),
}
```

### Loops

```xerlang
// Infinite loop
loop {
    break;
}

// While loop
while condition {
    // ...
}

// For loop
for item in collection {
    // ...
}

// Range loop
for i in 0..10 {
    println(i);
}
```

## Functions

### Basic Functions

```xerlang
fn add(a: i32, b: i32) -> i32 {
    a + b  // Implicit return
}

fn greet(name: &str) {
    println("Hello, " + name);
}
```

### Methods

```xerlang
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn new(width: u32, height: u32) -> Self {
        Rectangle { width, height }
    }
}
```

## Error Handling

### Result Type

```xerlang
fn divide(a: f64, b: f64) -> Result<f64, MathError> {
    if b == 0.0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}
```

### Error Propagation

```xerlang
fn compute() -> Result<f64, MathError> {
    let x = divide(10.0, 2.0)?;  // Propagates error
    let y = divide(x, 3.0)?;
    Ok(y)
}
```

## Modules

### Module Declaration

```xerlang
// In lib.xer
pub mod utils;
pub mod math;

// In utils.xer
pub fn helper() {
    // ...
}
```

### Using Modules

```xerlang
use crate::utils::helper;
use std::io::Read;
```

## Attributes

```xerlang
#[inline]
fn fast_function() {
    // ...
}

#[cfg(target_os = "linux")]
fn linux_only() {
    // ...
}

#[must_use]
fn important_result() -> Result<(), Error> {
    // ...
}
```

## Standard Library Functions

XerLang provides a minimal set of built-in functions for I/O and program control:

### I/O Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `print` | `fn print(msg: String)` | Print to stdout without newline |
| `println` | `fn println(msg: String)` | Print to stdout with newline |
| `read_line` | `fn read_line() -> String` | Read a line from stdin |

### Program Control

| Function | Signature | Description |
|----------|-----------|-------------|
| `exit` | `fn exit(code: i32)` | Exit program with status code |
| `panic` | `fn panic(msg: String)` | Terminate with error message |

### Examples

```xerlang
fn main() {
    // Print with and without newline
    print("Enter your name: ");
    let name = read_line();
    println("Hello, " + name);

    // Exit with specific code
    if name == "" {
        exit(1);
    }

    // Panic on error condition
    if some_critical_error {
        panic("Critical error occurred!");
    }
}
```
