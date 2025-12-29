# XerLang Type System

## Overview

XerLang uses a static, strong type system with comprehensive type inference. The type system enforces memory safety and error handling at compile time.

## Primitive Types

### Numeric Types

#### Signed Integers
| Type | Range | Size |
|------|-------|------|
| `i8` | -128 to 127 | 1 byte |
| `i16` | -32,768 to 32,767 | 2 bytes |
| `i32` | -2,147,483,648 to 2,147,483,647 | 4 bytes |
| `i64` | -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 | 8 bytes |

#### Unsigned Integers
| Type | Range | Size |
|------|-------|------|
| `u8` | 0 to 255 | 1 byte |
| `u16` | 0 to 65,535 | 2 bytes |
| `u32` | 0 to 4,294,967,295 | 4 bytes |
| `u64` | 0 to 18,446,744,073,709,551,615 | 8 bytes |

#### Floating Point
| Type | Format | Size |
|------|--------|------|
| `f32` | IEEE 754 single precision | 4 bytes |
| `f64` | IEEE 754 double precision | 8 bytes |

### Boolean Type
```xerlang
let is_valid: bool = true;
let is_empty: bool = false;
```

### Character Type
```xerlang
let ch: char = 'A';
let emoji: char = '🦀';
```

### Unit Type
```xerlang
let unit: () = ();  // Empty tuple, represents "no value"

fn do_nothing() {
    // Implicitly returns ()
}
```

## Compound Types

### Arrays
Fixed-length sequences of same type:

```xerlang
let arr: [i32; 5] = [1, 2, 3, 4, 5];
let zeros: [i32; 10] = [0; 10];  // Repeat syntax

println(arr[0]);  // 1
```

### Tuples
Fixed-length sequences of different types:

```xerlang
let point: (i32, i32) = (10, 20);
let mixed: (String, i32, bool) = ("hello", 42, true);

println(point.0);  // 10
println(point.1);  // 20
```

### Structures
Named collections of fields:

```xerlang
struct Point {
    x: f64,
    y: f64,
}

struct User {
    name: String,
    age: u32,
    email: Option<String>,
}

let p = Point { x: 10.5, y: 20.3 };
let user = User {
    name: "Alice".to_string(),
    age: 30,
    email: Some("alice@example.com".to_string()),
};
```

### Enums
Variants of different types:

```xerlang
enum Color {
    Red,
    Green,
    Blue,
    Rgb(u8, u8, u8),
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

enum Option<T> {
    Some(T),
    None,
}

// Usage
let color = Color::Rgb(255, 0, 0);
match color {
    Color::Red => println("Red"),
    Color::Green => println("Green"),
    Color::Blue => println("Blue"),
    Color::Rgb(r, g, b) => println(format!("RGB({}, {}, {})", r, g, b)),
}
```

## Special Types

### Option<T>
Represents optional values - either `Some(T)` or `None`:

```xerlang
fn find_user(id: i32) -> Option<User> {
    if id > 0 {
        Some(User { ... })
    } else {
        None
    }
}

// Usage with match
match find_user(123) {
    Some(user) => println(user.name),
    None => println("User not found"),
}

// Usage with if let
if let Some(user) = find_user(123) {
    println(user.name);
}

// Chaining operations
let user_name = find_user(123)
    .map(|u| u.name)
    .unwrap_or("Unknown".to_string());
```

### Result<T, E>
Represents success or failure:

```xerlang
enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

// Usage with match
match divide(10.0, 2.0) {
    Ok(result) => println(format!("Result: {}", result)),
    Err(e) => println(format!("Error: {}", e)),
}

// Usage with ? operator (error propagation)
fn compute() -> Result<f64, String> {
    let x = divide(10.0, 2.0)?;
    let y = divide(x, 3.0)?;
    Ok(y)
}

// Chaining operations
let result = divide(10.0, 2.0)
    .map(|x| x * 2.0)
    .map_err(|e| format!("Computation failed: {}", e));
```

## References and Pointers

### Immutable References
```xerlang
let x = 42;
let r = &x;  // Immutable reference
println(r);  // 42
```

### Mutable References
```xerlang
let mut x = 42;
let r = &mut x;  // Mutable reference
*r = 100;        // Dereference and modify
println(x);      // 100
```

### Pointers
```xerlang
let x = 42;
let ptr = &x as *const i32;  // Raw pointer
```

## Generic Types

### Generic Structs
```xerlang
struct Pair<T> {
    first: T,
    second: T,
}

struct Container<T, E> {
    data: T,
    error: E,
}

let int_pair: Pair<i32> = Pair { first: 1, second: 2 };
let string_pair: Pair<String> = Pair {
    first: "hello".to_string(),
    second: "world".to_string(),
};
```

### Generic Functions
```xerlang
fn first<T>(pair: Pair<T>) -> T {
    pair.first
}

fn swap<T>(pair: &mut Pair<T>) {
    let temp = pair.first;
    pair.first = pair.second;
    pair.second = temp;
}
```

### Generic Bounds
```xerlang
fn print_all<T: ToString>(items: Vec<T>) {
    for item in items {
        println(item.to_string());
    }
}

fn add_numbers<T: Add + Copy>(a: T, b: T) -> T {
    a + b
}
```

## Type Aliases

```xerlang
type UserId = u64;
type Callback = fn(String) -> ();
type Result<T> = Result<T, String>;  // Specialized Result

let id: UserId = 12345;
let callback: Callback = println;
```

## Type Inference

XerLang infers types automatically:

```xerlang
let x = 42;        // Inferred as i32
let y = 3.14;      // Inferred as f64
let s = "hello";   // Inferred as &str
let v = vec![1, 2, 3];  // Inferred as Vec<i32>
```

## Lifetime Parameters

Lifetimes ensure references don't outlive data:

```xerlang
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

fn borrow_and_return<'a>(x: &'a i32) -> &'a i32 {
    x
}
```

## Trait System

Traits define shared behavior:

```xerlang
trait Drawable {
    fn draw(&self);
}

impl Drawable for Point {
    fn draw(&self) {
        println(format!("Point at ({}, {})", self.x, self.y));
    }
}

impl Drawable for Circle {
    fn draw(&self) {
        println(format!("Circle with radius {}", self.radius));
    }
}

// Using trait objects
fn render<T: Drawable>(item: &T) {
    item.draw();
}
```

## Type Conversion

### `as` Casting
```xerlang
let x: i32 = 42;
let y: f64 = x as f64;
let z: u32 = y as u32;
```

### `into()` Trait
```xerlang
let s: String = "hello".into();
let num: i32 = "42".parse().unwrap();
```

### Custom Conversions
```xerlang
impl From<i32> for String {
    fn from(n: i32) -> String {
        n.to_string()
    }
}
```

## Pattern Matching Types

```xerlang
match value {
    0 => println("Zero"),
    1..=10 => println("One to ten"),
    _ => println("Other"),
}

match option {
    Some(x) if x > 0 => println("Positive"),
    Some(x) => println("Negative"),
    None => println("No value"),
}

match pair {
    (1, 2) => println("Specific pair"),
    (x, y) if x == y => println("Equal values"),
    (_, y) => println(format!("Any first, second is {}", y)),
}
```

---

See [Language Reference](./language-reference.md) for more syntax details.
