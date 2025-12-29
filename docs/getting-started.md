# Getting Started with XerLang (T172)

XerLang is a systems programming language designed with safety, speed, and cross-platform support.

## Prerequisites

- Rust 1.75 or later
- A system linker:
  - **Windows**: Visual Studio Build Tools or lld-link (comes with Rust)
  - **Linux**: GCC, Clang, or cc
  - **macOS**: Xcode Command Line Tools

## Installation

```bash
# Clone the repository
git clone https://github.com/xerlang/xerlang.git
cd xerlang

# Build the compiler
cargo build --release

# Add to PATH
export PATH=$PATH:$(pwd)/target/release
```

## Your First XerLang Program

Create a file called `hello.xer`:

```xerlang
fn main() {
    println("Hello, XerLang!");
}
```

Compile and run:

```bash
# Compile to native executable
xerc build hello.xer -o hello

# Run the executable
./hello        # On Linux/macOS
hello.exe      # On Windows
```

### Build Options

| Option | Description |
|--------|-------------|
| `-o <file>` | Output file name |
| `-v, --verbose` | Verbose output |
| `--emit obj` | Output object file only |

## Language Features

### Memory Safety

XerLang prevents common memory errors at compile time:

```xerlang
fn example() {
    let x = 42;
    let y = &x;      // Borrow x
    // x is still valid here
    println(y);
}
```

### Error Handling

Errors are explicit and must be handled:

```xerlang
fn read_file(path: String) -> Result<String, IoError> {
    // Returns Result type
}

fn main() -> Result<(), Error> {
    let content = read_file("data.txt")?;  // Propagate errors with ?
    println(content);
    Ok(())
}
```

### Option Types

No null pointer exceptions:

```xerlang
fn find_user(id: i32) -> Option<User> {
    // Returns Some(user) or None
}

fn main() {
    match find_user(123) {
        Some(user) => println(user.name),
        None => println("User not found"),
    }
}
```

## CLI Commands

```bash
xerc build <file>     # Compile source file
xerc check <file>     # Type check without compiling
xerc emulate <file>   # Run in CPU emulator
xerc safety check     # Verify safety system
```

## Next Steps

- Read the [Language Reference](./language-reference.md)
- Explore [Examples](../examples/)
- Check the [Safety Guide](./safety-guide.md)
