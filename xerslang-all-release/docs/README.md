# XersLang Documentation

## Quick Reference

### Command Line Usage

```batch
# Compile a program
xersc.exe input.xers

# Output is always 'out.exe' in current directory
out.exe
```

### Language Syntax Quick Reference

#### Variables

```xers
let x = 42;          // Declare variable
x = 100;             // Assign new value
let y = x + 10;      // Expression
```

#### Functions

```xers
fn function_name(param1: i64, param2: i64) -> i64 {
    return param1 + param2;
}

fn no_return_value() {
    print_int(42);
}
```

#### Control Flow

```xers
// If statement
if condition {
    // code
}

// If-else
if x > 0 {
    return 1;
} else {
    return 0;
}

// While loop
while condition {
    // code
}
```

#### Operators

**Arithmetic:**
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `%` Modulo

**Comparison:**
- `==` Equal
- `!=` Not equal
- `<` Less than
- `>` Greater than
- `<=` Less than or equal
- `>=` Greater than or equal

**Logical:**
- `&&` AND
- `||` OR

#### Comments

```xers
// Single line comment

// Multi-line comments not yet supported
```

### Built-in Functions Reference

#### alloc(size: i64) -> i64

Allocates memory of the specified size.

```xers
let ptr = alloc(100);  // Allocate 100 bytes
```

Returns: Pointer to allocated memory (i64 address)

#### peek(ptr: i64, offset: i64) -> i64

Read a byte from memory.

```xers
let value = peek(ptr, 0);  // Read byte at ptr[0]
```

Returns: Byte value (0-255)

#### poke(ptr: i64, offset: i64, value: i64)

Write a byte to memory.

```xers
poke(ptr, 0, 65);  // Write 'A' to ptr[0]
```

#### strlen(str: i64) -> i64

Get the length of a null-terminated string.

```xers
let str = "hello";
let len = strlen(str);  // Returns 5
```

#### streq(s1: i64, s2: i64) -> i64

Compare two strings for equality.

```xers
let str1 = "hello";
let str2 = "world";
if streq(str1, str2) {  // Returns 0 (false)
    print_int(1);
} else {
    print_int(0);
}
```

Returns: 1 if equal, 0 if not equal

#### print_int(n: i64)

Print an integer to console.

```xers
print_int(42);  // Outputs: 42
```

#### read_file(path: i64) -> i64

Read entire file contents into memory.

```xers
let path = "input.txt";
let contents = read_file(path);
let len = file_len(path);
```

Returns: Pointer to file contents

#### file_len(path: i64) -> i64

Get file size in bytes.

```xers
let path = "input.txt";
let size = file_len(path);
```

#### write_file(path: i64, data: i64, len: i64)

Write data to a file.

```xers
let path = "output.txt";
let data = "Hello, world!";
write_file(path, data, strlen(data));
```

#### get_argc() -> i64

Get command-line argument count.

```xers
let argc = get_argc();  // Returns number of arguments
```

Returns: Number of arguments (minimum 1)

#### get_arg(index: i64) -> i64

Get command-line argument by index.

```xers
let arg0 = get_arg(0);  // Program name
let arg1 = get_arg(1);  // First argument
```

Returns: Pointer to argument string

#### list_dir(path: i64) -> i64

Open directory for iteration.

```xers
let handle = list_dir(".");
```

Returns: Directory handle (0 if failed)

#### dir_next(handle: i64) -> i64

Get next entry in directory.

```xers
let entry = dir_next(handle);
```

Returns: Pointer to filename, or 0 when done

#### dir_close(handle: i64)

Close directory handle.

```xers
dir_close(handle);
```

#### is_dir(path: i64) -> i64

Check if path is a directory.

```xers
if is_dir(path) { /* ... */ }
```

Returns: 1 if directory, 0 otherwise

#### is_file(path: i64) -> i64

Check if path is a regular file.

```xers
if is_file(path) { /* ... */ }
```

Returns: 1 if file, 0 otherwise

#### str_copy(dest: i64, src: i64)

Copy string from src to dest.

```xers
str_copy(dest, src);
```

#### str_ends_with(s: i64, suffix: i64) -> i64

Check if string ends with suffix.

```xers
if str_ends_with(filename, ".xers") { /* ... */ }
```

Returns: 1 if ends with suffix, 0 otherwise

#### path_join(base: i64, name: i64) -> i64

Join two path components.

```xers
let full = path_join("dir", "file.txt");
```

Returns: Pointer to joined path

#### exit(code: i64)

Terminate program with exit code.

```xers
exit(1);  // Exit with error
```

### Type System

Currently only one type is supported:

- `i64` - 64-bit signed integer

All values are i64, including:
- Integers: `42`, `0`, `-10`
- Pointers: Memory addresses
- Booleans: `1` (true), `0` (false)
- Strings: Pointers to null-terminated byte sequences

### Memory Model

- Stack-allocated local variables
- Heap allocation via `alloc()`
- No garbage collection (manual memory management)
- Pointers are i64 addresses

### String Literals

String literals are null-terminated and stored in the data section:

```xers
let str = "hello";  // str is a pointer (i64)
let len = strlen(str);  // 5
let first = peek(str, 0);  // 104 ('h')
```

### CLI Arguments

#### get_argc() -> i64

Returns the number of command-line arguments.

```xers
fn main() -> i64 {
    let argc = get_argc();
    print_int(argc);  // Prints argument count (includes program name)
    return 0;
}
```

Returns: Number of arguments (minimum 1 for program name)

#### get_arg(index: i64) -> i64

Returns the argument at the specified index as a pointer to a string.

```xers
fn main() -> i64 {
    let argc = get_argc();

    // Print all arguments
    let i = 0;
    while i < argc {
        let arg = get_arg(i);
        // arg is a pointer to null-terminated string
        let len = strlen(arg);
        print_int(len);
        i = i + 1;
    }
    return 0;
}
```

Returns: Pointer to null-terminated string (i64 address)

### Directory Operations

#### list_dir(path: i64) -> i64

Opens a directory for iteration and returns a handle.

```xers
let path = "C:\\MyFolder";
let handle = list_dir(path);
if handle != 0 {
    // Directory opened successfully
    // Use dir_next() to iterate
}
```

Returns: Directory handle (0 if failed)

#### dir_next(handle: i64) -> i64

Returns the next file or folder name in the directory.

```xers
let handle = list_dir(".");
let entry = dir_next(handle);
while entry != 0 {
    // entry is a pointer to the filename string
    let name_len = strlen(entry);
    print_int(name_len);
    entry = dir_next(handle);
}
dir_close(handle);
```

Returns: Pointer to filename string, or 0 when no more entries

#### dir_close(handle: i64)

Closes a directory handle opened by list_dir().

```xers
let handle = list_dir(".");
// ... iterate through directory ...
dir_close(handle);  // Always close when done
```

### File Attributes

#### is_dir(path: i64) -> i64

Checks if a path is a directory.

```xers
let path = "C:\\Windows";
if is_dir(path) {
    print_int(1);  // It's a directory
} else {
    print_int(0);  // Not a directory
}
```

Returns: 1 if directory, 0 otherwise

#### is_file(path: i64) -> i64

Checks if a path is a regular file.

```xers
let path = "test.txt";
if is_file(path) {
    print_int(1);  // It's a file
} else {
    print_int(0);  // Not a file
}
```

Returns: 1 if regular file, 0 otherwise

### String Helpers

#### str_copy(dest: i64, src: i64)

Copies a null-terminated string from src to dest.

```xers
let src = "hello";
let dest = alloc(strlen(src) + 1);
str_copy(dest, src);
// dest now contains "hello"
```

#### str_ends_with(s: i64, suffix: i64) -> i64

Checks if a string ends with a given suffix.

```xers
let filename = "test.xers";
let suffix = ".xers";
if str_ends_with(filename, suffix) {
    print_int(1);  // File has .xers extension
}
```

Returns: 1 if s ends with suffix, 0 otherwise

#### path_join(base: i64, name: i64) -> i64

Joins two path components with the appropriate separator.

```xers
let base = "C:\\Projects";
let name = "myfile.txt";
let full_path = path_join(base, name);
// full_path points to "C:\\Projects\\myfile.txt"
```

Returns: Pointer to newly allocated joined path string

### Process Control

#### exit(code: i64)

Terminates the program immediately with the specified exit code.

```xers
fn main() -> i64 {
    let argc = get_argc();
    if argc < 2 {
        print_int(0);  // No arguments provided
        exit(1);       // Exit with error code
    }
    // Continue processing...
    return 0;
}
```

### Complete Examples

#### Example 1: Factorial

```xers
fn factorial(n: i64) -> i64 {
    if n <= 1 {
        return 1;
    }
    return n * factorial(n - 1);
}

fn main() -> i64 {
    let result = factorial(5);
    print_int(result);  // Prints 120
    return 0;
}
```

#### Example 2: Sum Array

```xers
fn sum_array(size: i64) -> i64 {
    let arr = alloc(size * 8);  // Allocate array
    let i = 0;
    let sum = 0;

    // Fill array
    while i < size {
        poke(arr, i * 8, i);
        i = i + 1;
    }

    // Sum array
    i = 0;
    while i < size {
        sum = sum + peek(arr, i * 8);
        i = i + 1;
    }

    return sum;
}

fn main() -> i64 {
    let result = sum_array(10);
    print_int(result);  // Prints 45
    return 0;
}
```

#### Example 3: File Operations

```xers
fn read_and_print_file() -> i64 {
    let path = "input.txt";
    let len = file_len(path);

    if len <= 0 {
        print_int(0);  // File not found
        return 1;
    }

    let contents = read_file(path);

    // Process file byte by byte
    let i = 0;
    while i < len {
        let byte = peek(contents, i);
        // Process byte here
        i = i + 1;
    }

    print_int(len);
    return 0;
}

fn main() -> i64 {
    return read_and_print_file();
}
```

#### Example 4: String Manipulation

```xers
fn copy_string(src: i64) -> i64 {
    let len = strlen(src);
    let dest = alloc(len + 1);  // +1 for null terminator
    let i = 0;

    while i < len {
        let byte = peek(src, i);
        poke(dest, i, byte);
        i = i + 1;
    }

    poke(dest, len, 0);  // Null terminator
    return dest;
}

fn main() -> i64 {
    let original = "hello";
    let copy = copy_string(original);

    if streq(original, copy) {
        print_int(1);  // Success
    }

    return 0;
}
```

#### Example 5: Command-Line Arguments

```xers
fn main() -> i64 {
    let argc = get_argc();

    // Check if we have at least one argument
    if argc < 2 {
        print_int(0);  // No args provided
        exit(1);
    }

    // Print the length of each argument
    let i = 0;
    while i < argc {
        let arg = get_arg(i);
        let len = strlen(arg);
        print_int(len);
        i = i + 1;
    }

    return 0;
}
```

#### Example 6: Directory Listing

```xers
fn list_xers_files(dir_path: i64) -> i64 {
    let handle = list_dir(dir_path);
    if handle == 0 {
        print_int(0);  // Failed to open directory
        return 1;
    }

    let count = 0;
    let entry = dir_next(handle);

    while entry != 0 {
        // Check if entry ends with .xers
        if str_ends_with(entry, ".xers") {
            // It's a XersLang source file
            let len = strlen(entry);
            print_int(len);
            count = count + 1;
        }
        entry = dir_next(handle);
    }

    dir_close(handle);
    print_int(count);  // Total .xers files found
    return 0;
}

fn main() -> i64 {
    return list_xers_files(".");
}
```

#### Example 7: Recursive Directory Walk

```xers
fn process_directory(path: i64) {
    let handle = list_dir(path);
    if handle == 0 {
        return;
    }

    let entry = dir_next(handle);
    while entry != 0 {
        // Skip . and ..
        if streq(entry, ".") == 0 {
            if streq(entry, "..") == 0 {
                let full_path = path_join(path, entry);

                if is_dir(full_path) {
                    // Recurse into subdirectory
                    process_directory(full_path);
                } else {
                    if is_file(full_path) {
                        // Process file
                        if str_ends_with(entry, ".xers") {
                            let len = strlen(full_path);
                            print_int(len);
                        }
                    }
                }
            }
        }
        entry = dir_next(handle);
    }

    dir_close(handle);
}

fn main() -> i64 {
    let argc = get_argc();
    if argc < 2 {
        process_directory(".");
    } else {
        let dir = get_arg(1);
        process_directory(dir);
    }
    return 0;
}
```

#### Example 8: File Filter Tool

```xers
// Simple tool that filters files by extension
fn main() -> i64 {
    let argc = get_argc();

    if argc < 3 {
        // Usage: filter <directory> <extension>
        print_int(0);
        exit(1);
    }

    let dir = get_arg(1);
    let ext = get_arg(2);

    let handle = list_dir(dir);
    if handle == 0 {
        print_int(0);
        exit(2);
    }

    let count = 0;
    let entry = dir_next(handle);

    while entry != 0 {
        if str_ends_with(entry, ext) {
            let full = path_join(dir, entry);
            if is_file(full) {
                count = count + 1;
            }
        }
        entry = dir_next(handle);
    }

    dir_close(handle);
    print_int(count);
    return 0;
}
```

### Compilation Process

The XersLang compiler performs these steps:

1. **Lexical Analysis** - Tokenize source code
2. **Parsing** - Build Abstract Syntax Tree (AST)
3. **Type Checking** - Verify types and semantics
4. **Code Generation** - Generate x64 machine code
5. **PE Generation** - Create Windows executable

All in one pass, directly from source to executable.

### Compiler Architecture

The self-hosted compiler (`src/xersc.xers`) contains:

- Lexer: Tokenization (~500 lines)
- Parser: AST construction (~1000 lines)
- Type Checker: Type inference and checking (~500 lines)
- Code Generator: x64 code emission (~1000 lines)
- PE Generator: Windows executable format (~500 lines)

Total: ~3500 lines of XersLang code

### Performance Characteristics

- **Compile time:** Very fast (<1 second for most programs)
- **Runtime:** Direct x64 code, no interpreter overhead
- **Binary size:** Minimal (~3KB for simple programs)
- **Memory:** Stack-based with manual heap allocation

### Known Limitations

1. **Windows only:** Generates Windows PE executables
2. **x64 only:** Requires 64-bit Windows
3. **Single type:** Only i64 (no floats, structs, etc.)
4. **No imports:** Single-file programs only
5. **No macros:** No metaprogramming yet
6. **No arrays:** Must use manual memory management
7. **No strings:** String literals only (no string type)
8. **Limited error messages:** Basic syntax error reporting

### Error Messages

Common errors and solutions:

**"Unexpected token"**
- Check syntax, missing semicolons or braces

**"Undefined variable"**
- Variable used before declaration
- Typo in variable name

**"Type mismatch"**
- All values must be i64
- Check function signatures

**Segmentation fault at runtime**
- Invalid memory access
- Null pointer dereference
- Stack overflow (deep recursion)

### Tips and Best Practices

1. **Always check file operations:**
   ```xers
   let len = file_len(path);
   if len <= 0 {
       // Handle error
       return 1;
   }
   ```

2. **Use helper functions:**
   ```xers
   fn is_positive(x: i64) -> i64 {
       if x > 0 {
           return 1;
       }
       return 0;
   }
   ```

3. **Be careful with memory:**
   - Only allocate what you need
   - Track allocated memory
   - No automatic cleanup

4. **Test incrementally:**
   - Start with simple functions
   - Test each function independently
   - Use print_int() for debugging

### Debugging Techniques

Since there's no debugger, use these techniques:

```xers
fn debug_checkpoint(n: i64) {
    print_int(n);
}

fn complex_function() -> i64 {
    debug_checkpoint(1);  // Mark entry

    let x = calculate_something();
    debug_checkpoint(x);  // Print intermediate value

    debug_checkpoint(2);  // Mark exit
    return x;
}
```

### Exit Codes

Programs can return exit codes:

```xers
fn main() -> i64 {
    return 0;  // Success
    // return 1;  // Error
}
```

Check exit code in batch:
```batch
out.exe
echo %ERRORLEVEL%
```

### VSCode Integration

After installing the extension, you get:

- Syntax highlighting for `.xers` files
- Keyword recognition
- Comment highlighting
- String literal highlighting

No autocomplete or error checking yet (planned for future releases).

## Support

For questions, issues, or contributions:

- GitHub Issues: Report bugs or request features
- Documentation: See main repository for full specs
- Examples: Study the examples folder for more patterns

## Version Info

This documentation is for XersLang Self-Hosted Release (2025-12-25).

Compiler version: Spec 007
Bootstrap: x64 Assembly -> XersLang
Target: Windows x64 PE
