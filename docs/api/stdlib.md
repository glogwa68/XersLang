# Standard Library Reference

XersLang includes a minimal standard library focused on core functionality. All functions are available without explicit imports.

## String Operations

### String Methods

#### `len() -> i64`
Returns the length of a string in bytes.

```xers
let s = "hello"
let length = s.len()  // Returns 5
```

#### `trim() -> String`
Returns a new string with leading and trailing whitespace removed.

```xers
let s = "  hello world  "
let trimmed = s.trim()  // "hello world"
```

#### `starts_with(prefix: String) -> bool`
Checks if the string starts with the given prefix.

```xers
let s = "hello world"
if s.starts_with("hello") {
    println("String starts with 'hello'")
}
```

#### `ends_with(suffix: String) -> bool`
Checks if the string ends with the given suffix.

```xers
let s = "hello.txt"
if s.ends_with(".txt") {
    println("File extension is .txt")
}
```

#### `contains(needle: String) -> bool`
Checks if the string contains a substring.

```xers
let s = "hello world"
if s.contains("world") {
    println("Found 'world'")
}
```

#### `split(delimiter: String) -> Array<String>`
Splits the string by the given delimiter.

```xers
let s = "one,two,three"
let parts = s.split(",")  // ["one", "two", "three"]
```

#### `join(items: Array<String>) -> String`
Joins an array of strings with this string as separator.

```xers
let parts = ["one", "two", "three"]
let result = ",".join(parts)  // "one,two,three"
```

## Memory Operations

### `alloc(size: i64) -> *u8`
Allocate memory on the heap.

```xers
let ptr = alloc(1024)  // Allocate 1024 bytes
```

### `peek(ptr: *u8, offset: i64) -> u8`
Read a single byte from memory at the given offset.

```xers
let ptr = alloc(10)
let byte = peek(ptr, 0)
```

### `poke(ptr: *u8, offset: i64, value: u8)`
Write a single byte to memory at the given offset.

```xers
let ptr = alloc(10)
poke(ptr, 0, 42)
```

## File I/O

### `read_file(path: String) -> String`
Read the entire contents of a file as a string.

```xers
let contents = read_file("input.txt")
```

### `write_file(path: String, contents: String)`
Write a string to a file, creating it if necessary.

```xers
write_file("output.txt", "Hello, World!")
```

### `file_len(path: String) -> i64`
Get the size of a file in bytes.

```xers
let size = file_len("data.bin")
```

## Array Operations

### Array Methods

#### `len() -> i64`
Returns the number of elements in the array.

```xers
let arr = [1, 2, 3, 4, 5]
let count = arr.len()  // 5
```

#### `push(value: T) -> ()`
Adds an element to the end of the array.

```xers
let mut arr = [1, 2, 3]
arr.push(4)
```

#### `pop() -> Option<T>`
Removes and returns the last element, or None if empty.

```xers
let mut arr = [1, 2, 3]
match arr.pop() {
    Some(value) => println(value),
    None => println("Array is empty"),
}
```

#### `get(index: i64) -> Option<T>`
Returns the element at the given index, or None if out of bounds.

```xers
let arr = [1, 2, 3]
match arr.get(1) {
    Some(value) => println(value),  // Prints: 2
    None => println("Index out of bounds"),
}
```

## Type Conversion

### `to_string() -> String`
Convert a value to its string representation.

```xers
let num = 42
let s = num.to_string()  // "42"
```

### `to_i64() -> Option<i64>`
Parse a string as an integer.

```xers
let s = "123"
match s.to_i64() {
    Some(n) => println(n),
    None => println("Parse failed"),
}
```

## Math Functions

### `abs(value: i64) -> i64`
Returns the absolute value.

```xers
let x = -42
let y = abs(x)  // 42
```

### `min(a: i64, b: i64) -> i64`
Returns the minimum of two values.

```xers
let minimum = min(10, 20)  // 10
```

### `max(a: i64, b: i64) -> i64`
Returns the maximum of two values.

```xers
let maximum = max(10, 20)  // 20
```

## Options and Results

### `Option<T>`
Represents an optional value (either `Some(T)` or `None`).

```xers
let maybe_value: Option<i64> = Some(42)

match maybe_value {
    Some(v) => println(v),
    None => println("No value"),
}
```

### `Result<T, E>`
Represents either success (`Ok(T)`) or failure (`Err(E)`).

```xers
fn divide(a: i64, b: i64) -> Result<i64, String> {
    if b == 0 {
        Err("Division by zero")
    } else {
        Ok(a / b)
    }
}
```

## Error Handling

### `unwrap() -> T`
Extract the value from `Option<T>` or `Result<T, E>`. Panics if None/Err.

```xers
let value = Some(42).unwrap()  // 42
```

### `unwrap_or(default: T) -> T`
Extract the value or return a default.

```xers
let maybe = None: Option<i64>
let value = maybe.unwrap_or(0)  // 0
```

### `expect(msg: String) -> T`
Extract the value or panic with a message.

```xers
let value = Some(42).expect("Value should exist")
```
