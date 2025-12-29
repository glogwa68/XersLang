# XersLang Tutorial

Learn XersLang basics with this step-by-step guide.

## Lesson 1: Hello, World!

Your first XersLang program:

```xers
fn main() {
    println("Hello, World!")
}
```

Save as `hello.xers` and compile:

```bash
xersc hello.xers -o hello.exe
./hello.exe
```

Output:
```
Hello, World!
```

**What happened?**
- `fn main()` declares the main function (entry point)
- `println()` is a builtin that prints text with a newline

## Lesson 2: Variables

```xers
fn main() {
    let x = 42
    let y = 10
    println(x + y)
}
```

**Output**: `52`

**Key points:**
- `let` declares a variable
- Type is inferred (x and y are i64)
- Variables are immutable by default

### Mutable Variables

```xers
fn main() {
    let mut counter = 0
    counter = counter + 1
    println(counter)
}
```

**Output**: `1`

Use `mut` to make variables mutable.

## Lesson 3: Functions

```xers
fn add(a: i64, b: i64) -> i64 {
    a + b
}

fn main() {
    let result = add(5, 3)
    println(result)
}
```

**Output**: `8`

**Key points:**
- Function parameters must have types
- Return type is specified after `->`
- Last expression is the return value (no semicolon)

### Early Return

```xers
fn max(a: i64, b: i64) -> i64 {
    if a > b {
        return a
    }
    b
}
```

Use `return` to exit early.

## Lesson 4: Control Flow

### If/Else

```xers
fn main() {
    let x = 10
    if x > 5 {
        println("x is greater than 5")
    } else {
        println("x is 5 or less")
    }
}
```

### If/Else If/Else

```xers
fn grade(score: i64) -> String {
    if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else {
        "F"
    }
}
```

### While Loop

```xers
fn main() {
    let mut i = 0
    while i < 5 {
        println(i)
        i = i + 1
    }
}
```

**Output**:
```
0
1
2
3
4
```

### For Loop

```xers
fn main() {
    let arr = [10, 20, 30, 40, 50]
    for x in arr {
        println(x)
    }
}
```

## Lesson 5: Strings

```xers
fn main() {
    let greeting = "Hello"
    let name = "Alice"
    println(greeting + ", " + name + "!")
}
```

**Output**: `Hello, Alice!`

### String Methods

```xers
fn main() {
    let text = "  hello world  "

    println(text.len())           // Length: 15
    println(text.trim())          // "hello world"

    if text.contains("world") {
        println("Found 'world'")
    }
}
```

## Lesson 6: Arrays

```xers
fn main() {
    let numbers = [1, 2, 3, 4, 5]
    println(numbers[0])      // 1
    println(numbers[4])      // 5
    println(numbers.len())   // 5
}
```

## Lesson 7: Error Handling with Option

```xers
fn divide(a: i64, b: i64) -> Option<i64> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    match divide(10, 2) {
        Some(result) => println(result),
        None => println("Cannot divide by zero"),
    }
}
```

**Output**: `5`

## Lesson 8: Error Handling with Result

```xers
fn parse_number(s: String) -> Result<i64, String> {
    match s.to_i64() {
        Some(n) => Ok(n),
        None => Err("Invalid number"),
    }
}

fn main() {
    match parse_number("42") {
        Ok(n) => println(n),
        Err(msg) => println(msg),
    }
}
```

**Output**: `42`

## Lesson 9: Memory with Alloc

```xers
fn main() {
    let ptr = alloc(100)

    // Write to memory
    poke(ptr, 0, 42)
    poke(ptr, 8, 100)

    // Read from memory
    let x = peek(ptr, 0)
    let y = peek(ptr, 8)

    println(x)    // 42
    println(y)    // 100
}
```

## Lesson 10: File I/O

```xers
fn main() {
    // Write a file
    write_file("output.txt", "Hello from XersLang!")

    // Read a file
    let contents = read_file("output.txt")
    println(contents)
}
```

## Complete Example: Temperature Converter

```xers
fn celsius_to_fahrenheit(c: i64) -> i64 {
    c * 9 / 5 + 32
}

fn main() {
    println("Temperature Converter")
    println("====================")

    let temps = [0, 10, 20, 30, 40]

    for celsius in temps {
        let fahrenheit = celsius_to_fahrenheit(celsius)
        println(celsius + " C = " + fahrenheit + " F")
    }
}
```

**Output**:
```
Temperature Converter
====================
0 C = 32 F
10 C = 50 F
20 C = 68 F
30 C = 86 F
40 C = 104 F
```

## Next Steps

- Read the [Language Reference](../language/reference.md) for complete syntax
- Check the [API Reference](../api/builtins.md) for available functions
- Explore the [Getting Started](./getting-started.md) guide
- Look at example programs in the repository

## Common Patterns

### Iterating with Index

```xers
for i in 0..arr.len() {
    println(arr[i])
}
```

### Conditional Assignment

```xers
let x = if condition { 10 } else { 20 }
```

### Function Chaining

```xers
let result = text.trim().to_i64()
```

### Error Propagation

```xers
match operation() {
    Ok(value) => {
        // Process value
    }
    Err(error) => {
        // Handle error
        exit(1)
    }
}
```

## Tips and Tricks

1. **Use let for immutability** - Default to immutable variables for safety
2. **Pattern match** - Use match for safe handling of Option and Result
3. **Function composition** - Break code into small, focused functions
4. **Array iteration** - Use for loops for cleaner iteration
5. **Type inference** - The compiler infers types, reducing boilerplate

## Troubleshooting

### "Type mismatch" error
Check that both sides of an operation have compatible types:
```xers
let x: i64 = "hello"  // ERROR: Cannot assign String to i64
```

### "Undefined variable" error
Make sure the variable is declared before use:
```xers
println(undefined)  // ERROR: undefined not declared
```

### "Cannot move borrowed value" error
Don't move a value while it's borrowed:
```xers
let s = "hello"
let r = &s
// println(s)  // ERROR: s is borrowed
```

Good luck with XersLang!
