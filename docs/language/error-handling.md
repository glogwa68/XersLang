# Error Handling

XerLang enforces explicit error handling at compile time. Errors must be acknowledged by the programmer - you cannot silently ignore them.

## The Problem with Silent Errors

Languages like C return error codes, but developers often ignore them:

```c
// C - error ignored!
FILE *f = fopen("data.txt", "r");
fread(buffer, 1, 100, f);  // What if f is NULL?
```

JavaScript has exceptions, but they can be unhandled:

```javascript
// JavaScript - exception not caught!
try {
    let data = JSON.parse(input);  // What if parse fails?
}
// Missing catch block - error might crash the app
```

XerLang requires explicit error handling using types.

## The `Result<T, E>` Type

```xerlang
enum Result<T, E> {
    Ok(T),      // Success with value of type T
    Err(E),     // Failure with error of type E
}
```

Functions that can fail return `Result<T, E>`:

```xerlang
fn read_file(path: &str) -> Result<String, IoError> {
    // Returns either:
    // - Ok(contents) if file read successfully
    // - Err(error) if something went wrong
}
```

## Pattern Matching on Results

Use `match` to handle both cases:

```xerlang
fn main() {
    match read_file("data.txt") {
        Ok(contents) => println(contents),
        Err(error) => println(format!("Error: {}", error)),
    }
}
```

**Compiler enforces this**: You cannot use the file contents without handling the error case.

## The `Option<T>` Type

`Option<T>` represents optional values:

```xerlang
enum Option<T> {
    Some(T),    // Value exists
    None,       // Value doesn't exist
}
```

**Use Option for values that might not exist**:

```xerlang
fn find_user_by_id(id: u32) -> Option<User> {
    // Returns either:
    // - Some(user) if user found
    // - None if user not found
}

match find_user_by_id(123) {
    Some(user) => println(user.name),
    None => println("User not found"),
}
```

## Error Propagation with `?`

The `?` operator simplifies error propagation:

```xerlang
fn process_file() -> Result<Data, Error> {
    let contents = read_file("data.txt")?;  // Propagate error
    let data = parse_data(&contents)?;      // Propagate error
    Ok(data)
}
```

**This is equivalent to**:

```xerlang
fn process_file() -> Result<Data, Error> {
    let contents = match read_file("data.txt") {
        Ok(c) => c,
        Err(e) => return Err(e),
    };
    let data = match parse_data(&contents) {
        Ok(d) => d,
        Err(e) => return Err(e),
    };
    Ok(data)
}
```

The `?` operator:
- Returns the value if `Ok`
- Returns the error if `Err`
- Requires function to return `Result<T, E>`

## Error Types

### Defining Custom Errors

```xerlang
enum ConfigError {
    MissingField(String),
    InvalidFormat(String),
    IoError(String),
}

fn parse_config(text: &str) -> Result<Config, ConfigError> {
    if !text.contains("=") {
        return Err(ConfigError::InvalidFormat(
            "Config must contain = signs".to_string()
        ));
    }
    // Parse config...
    Ok(config)
}
```

### Standard Library Errors

Common error types are predefined:

```xerlang
fn read_file(path: &str) -> Result<String, IoError> {
    // Returns either file contents or IoError
}

fn parse_number(s: &str) -> Result<i32, ParseError> {
    // Returns either parsed number or ParseError
}
```

## Handling Multiple Error Types

### Using `map_err` to Convert

```xerlang
use std::io::read_file;
use std::parse::parse_int;

fn load_config(path: &str) -> Result<i32, String> {
    let content = read_file(path)
        .map_err(|e| format!("Failed to read file: {}", e))?;

    let number = parse_int(&content)
        .map_err(|e| format!("Failed to parse: {}", e))?;

    Ok(number)
}
```

### Using `?` with Automatic Conversion

If you implement `From<ErrorA> for ErrorB`, the `?` operator converts automatically:

```xerlang
fn convert() -> Result<i32, String> {
    // If read_file returns IoError, it's automatically converted to String
    let content = read_file("file.txt")?;
    Ok(0)
}

// This requires:
impl From<IoError> for String {
    fn from(err: IoError) -> String {
        err.message()
    }
}
```

## Handling Options

### Pattern Matching

```xerlang
let maybe_user = find_user_by_id(123);
match maybe_user {
    Some(user) => println(user.name),
    None => println("Not found"),
}
```

### The `if let` Shorthand

```xerlang
if let Some(user) = find_user_by_id(123) {
    println(user.name);
} else {
    println("Not found");
}
```

### Chaining Operations

```xerlang
let user = find_user_by_id(123)
    .map(|u| u.name)           // Transform Some(user) → Some(name)
    .unwrap_or("Unknown");     // Provide default for None
```

### Methods on Option

```xerlang
let opt: Option<i32> = Some(5);

// is_some / is_none
if opt.is_some() {
    println("Has value");
}

// unwrap (panics if None)
let val = opt.unwrap();

// unwrap_or (use default)
let val = opt.unwrap_or(0);

// map (transform value)
let doubled = opt.map(|x| x * 2);

// and_then (chain operations)
let result = opt.and_then(|x| {
    if x > 0 { Some(x * 2) } else { None }
});
```

## Methods on Result

```xerlang
let result: Result<i32, String> = Ok(5);

// is_ok / is_err
if result.is_ok() {
    println("Success");
}

// unwrap (panics if Err)
let val = result.unwrap();

// unwrap_or (use default)
let val = result.unwrap_or(0);

// map (transform value)
let doubled = result.map(|x| x * 2);

// map_err (transform error)
let converted = result.map_err(|e| format!("Error: {}", e));

// and_then (chain operations that return Result)
let result2 = result.and_then(|x| {
    if x > 0 {
        Ok(x * 2)
    } else {
        Err("Value is not positive".to_string())
    }
});
```

## Panicking

Use `panic!` for unrecoverable errors:

```xerlang
fn critical_operation() {
    if system_corrupted {
        panic("System state is corrupted! Aborting.");
    }
}
```

**panic! is not error handling** - use it for truly unrecoverable situations.

For expected errors, use `Result` and `Option`.

## Writing Functions that Return Results

```xerlang
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() -> Result<(), String> {
    let result = divide(10.0, 2.0)?;
    println(format!("Result: {}", result));
    Ok(())
}
```

## Best Practices

### 1. Use Result for Expected Errors

```xerlang
// Good - function can fail for known reasons
fn parse_config(text: &str) -> Result<Config, ConfigError>

// Bad - hiding failure possibility
fn parse_config(text: &str) -> Config
```

### 2. Use Option for Optional Values

```xerlang
// Good - value might not exist
fn find_user(id: u32) -> Option<User>

// Bad - returning None as error
fn find_user(id: u32) -> Result<User, String>
```

### 3. Propagate Errors Up

```xerlang
// Good - let caller handle the error
fn process_file(path: &str) -> Result<Data, IoError> {
    let content = read_file(path)?;
    parse_data(&content)
}

// Avoid - hiding the error
fn process_file(path: &str) -> Data {
    let content = read_file(path).unwrap();  // Panics if error!
    parse_data(&content).unwrap()
}
```

### 4. Provide Context

```xerlang
// Good - error includes context
Err(ConfigError::Missing {
    field: "database_url",
    path: "config.toml",
})

// Avoid - generic error
Err("Invalid configuration")
```

## Common Patterns

### Collecting Results

```xerlang
let results = vec![1, 2, 3]
    .iter()
    .map(|x| parse_number(&x.to_string()))
    .collect::<Result<Vec<i32>, ParseError>>();

match results {
    Ok(numbers) => println(numbers),
    Err(e) => println(format!("Failed to parse: {}", e)),
}
```

### Try Operator with Multiple Functions

```xerlang
fn main() -> Result<(), String> {
    let config = read_config("config.toml")?;
    let data = load_data(&config)?;
    process_data(data)?;
    Ok(())
}
```

### Default Values

```xerlang
let timeout = get_config_timeout()
    .unwrap_or(Duration::from_secs(30));
```

---

See [Language Reference](./language-reference.md) for syntax details.
