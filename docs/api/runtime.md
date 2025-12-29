# Runtime Functions Reference

Low-level runtime functions for memory management and system operations.

## Memory Management

### Allocation

#### `alloc(size: i64) -> *u8`
Allocate `size` bytes on the heap.

**Returns**: Pointer to the allocated memory block.

**Panics**: If allocation fails.

```xers
let buffer = alloc(4096)
// Use buffer...
```

#### `realloc(ptr: *u8, old_size: i64, new_size: i64) -> *u8`
Reallocate a memory block to a new size.

**Parameters**:
- `ptr`: Pointer to existing allocation
- `old_size`: Original size in bytes
- `new_size`: New size in bytes

**Returns**: Pointer to new memory block.

**Note**: Content is preserved up to the minimum of old_size and new_size.

```xers
let ptr = alloc(100)
let new_ptr = realloc(ptr, 100, 200)
```

### Memory Access

#### `peek(ptr: *u8, offset: i64) -> u8`
Read a single byte from memory.

**Parameters**:
- `ptr`: Memory address
- `offset`: Byte offset from ptr

**Returns**: The byte value (0-255).

```xers
let ptr = alloc(10)
let byte = peek(ptr, 0)
```

#### `peek_i64(ptr: *u8, offset: i64) -> i64`
Read a 64-bit signed integer from memory.

**Parameters**:
- `ptr`: Memory address
- `offset`: Byte offset (must be 8-byte aligned for correctness)

**Returns**: 64-bit signed integer value.

```xers
let ptr = alloc(8)
let value = peek_i64(ptr, 0)
```

#### `poke(ptr: *u8, offset: i64, value: u8)`
Write a single byte to memory.

**Parameters**:
- `ptr`: Memory address
- `offset`: Byte offset from ptr
- `value`: Byte value to write (0-255)

```xers
let ptr = alloc(10)
poke(ptr, 0, 42)
```

#### `poke_i64(ptr: *u8, offset: i64, value: i64)`
Write a 64-bit signed integer to memory.

**Parameters**:
- `ptr`: Memory address
- `offset`: Byte offset (should be 8-byte aligned)
- `value`: 64-bit signed integer to write

```xers
let ptr = alloc(16)
poke_i64(ptr, 0, 1234567890)
```

### Memory Copying

#### `memcpy(dest: *u8, src: *u8, size: i64)`
Copy `size` bytes from source to destination.

**Parameters**:
- `dest`: Destination memory address
- `src`: Source memory address
- `size`: Number of bytes to copy

**Note**: Source and destination ranges must not overlap.

```xers
let src = alloc(100)
let dest = alloc(100)
memcpy(dest, src, 100)
```

#### `memset(ptr: *u8, value: u8, size: i64)`
Fill `size` bytes of memory with a value.

**Parameters**:
- `ptr`: Memory address to fill
- `value`: Byte value to fill with
- `size`: Number of bytes to fill

```xers
let buffer = alloc(1024)
memset(buffer, 0, 1024)  // Zero-initialize
```

## Utility Functions

### `print_int(value: i64)`
Print a 64-bit signed integer to stdout.

```xers
print_int(42)
```

### `print_hex(value: i64)`
Print a 64-bit value in hexadecimal format.

```xers
print_hex(255)  // Prints: ff
```

### `strlen(ptr: *u8) -> i64`
Calculate the length of a null-terminated string.

**Parameters**:
- `ptr`: Pointer to string (must be null-terminated)

**Returns**: Length in bytes (not including null terminator).

```xers
let s = "hello"
let len = strlen(s as *u8)
```

## File I/O at Runtime

### `open(path: String, mode: String) -> i64`
Open a file and return a file handle.

**Parameters**:
- `path`: File path
- `mode`: One of "r" (read), "w" (write), "a" (append)

**Returns**: File handle (>= 0 on success, -1 on error).

```xers
let handle = open("data.txt", "r")
if handle >= 0 {
    // File opened successfully
}
```

### `close(handle: i64)`
Close an open file handle.

**Parameters**:
- `handle`: File handle from `open()`

```xers
let handle = open("data.txt", "r")
close(handle)
```

### `read(handle: i64, buffer: *u8, size: i64) -> i64`
Read from a file into a buffer.

**Parameters**:
- `handle`: Open file handle
- `buffer`: Destination buffer
- `size`: Maximum bytes to read

**Returns**: Number of bytes read (-1 on error).

```xers
let handle = open("data.txt", "r")
let buffer = alloc(1024)
let bytes_read = read(handle, buffer, 1024)
```

### `write(handle: i64, buffer: *u8, size: i64) -> i64`
Write from a buffer to a file.

**Parameters**:
- `handle`: Open file handle
- `buffer`: Source buffer
- `size`: Number of bytes to write

**Returns**: Number of bytes written (-1 on error).

```xers
let handle = open("output.txt", "w")
let data = "Hello, World!"
write(handle, data as *u8, data.len())
```

## System Operations

### `exit(code: i32)`
Terminate the program with the specified exit code.

**Parameters**:
- `code`: Exit code (typically 0 for success, non-zero for error)

```xers
exit(0)
```

### `env(name: String) -> Option<String>`
Get an environment variable.

**Parameters**:
- `name`: Environment variable name

**Returns**: Some(value) if set, None otherwise.

```xers
match env("PATH") {
    Some(path) => println(path),
    None => println("PATH not set"),
}
```

## Time Operations

### `time_ms() -> i64`
Get the current time in milliseconds since some reference point.

**Returns**: Time in milliseconds.

```xers
let start = time_ms()
// ... do work ...
let elapsed = time_ms() - start
```

### `sleep(ms: i64)`
Sleep for the specified number of milliseconds.

**Parameters**:
- `ms`: Milliseconds to sleep

```xers
sleep(1000)  // Sleep 1 second
```

## Memory Safety Notes

- **Bounds checking**: Runtime functions do NOT perform bounds checking. Invalid pointers or offsets result in undefined behavior.
- **Alignment**: 64-bit operations (`peek_i64`, `poke_i64`) assume proper alignment. Misaligned access may crash.
- **Null pointers**: Dereferencing null pointers results in a segmentation fault.
- **Use-after-free**: Memory must not be used after it has been freed.
- **Manual management**: The programmer is responsible for tracking and freeing allocations.
