# Ownership and Borrowing

## The Ownership System

Ownership is XerLang's approach to memory management without garbage collection. Every value has a single owner that controls its lifetime.

### Three Rules of Ownership

1. **Each value has exactly one owner**
2. **When the owner goes out of scope, the value is dropped (deallocated)**
3. **Values can be temporarily borrowed

**Moving Values**: Ownership can be transferred:

```xerlang
let s1 = "hello".to_string();
let s2 = s1;  // s1 is MOVED to s2
println(s1);  // ERROR: s1 is no longer valid!
```

**Why?** String data lives on the heap. If both s1 and s2 owned it, freeing it twice would cause a crash. XerLang prevents this at compile time.

### Scope Example

```xerlang
{
    let s = "hello".to_string();
    // s is valid here
}
// s is OUT OF SCOPE - memory is automatically freed
// println(s);  // ERROR: s is out of scope
```

## Borrowing

Instead of transferring ownership, you can **borrow** values temporarily.

### Immutable Borrowing

An immutable borrow lets you read a value without taking ownership:

```xerlang
fn print_length(s: &String) -> usize {
    s.len()
}

fn main() {
    let s = "hello".to_string();
    let len = print_length(&s);  // Borrow with &
    println(s);  // s is still valid!
    println(len);
}
```

**Key Point**: You can have multiple immutable borrows simultaneously:

```xerlang
let s = "hello".to_string();
let r1 = &s;
let r2 = &s;
let r3 = &s;
println(r1);  // OK - multiple readers
println(r2);
println(r3);
```

### Mutable Borrowing

A mutable borrow lets you modify a value:

```xerlang
fn append_world(s: &mut String) {
    s.push_str(", world!");
}

fn main() {
    let mut s = "hello".to_string();
    append_world(&mut s);  // Mutable borrow
    println(s);  // "hello, world!"
}
```

**Important**: Only ONE mutable borrow at a time:

```xerlang
let mut s = "hello".to_string();
let r1 = &mut s;
let r2 = &mut s;  // ERROR: can't have two mutable borrows
```

**Why?** If two mutable references existed, both could modify the data simultaneously, causing data races and corruption.

### Mixing Immutable and Mutable Borrows

You cannot have mutable and immutable borrows at the same time:

```xerlang
let mut s = "hello".to_string();
let r1 = &s;      // Immutable borrow
let r2 = &mut s;  // ERROR: can't borrow as mutable while immutable borrow exists

println(r1);  // r1 is still being used here
```

**Why?** The mutable borrow could change the data that r1 is pointing to.

After the last use of r1:

```xerlang
let mut s = "hello".to_string();
let r1 = &s;      // Immutable borrow
println(r1);      // Last use of r1
let r2 = &mut s;  // OK: r1 is no longer used
r2.push_str("!");
```

## The Borrow Checker

The compiler's **borrow checker** ensures:

1. **No use-after-free** - Can't use data after it's been freed
2. **No data races** - Only one mutable reference at a time
3. **No dangling pointers** - References can't outlive their data

### Example: Preventing Use-After-Free

```xerlang
fn dangling() -> &String {
    let s = "hello".to_string();
    &s  // ERROR: s goes out of scope, reference becomes invalid
}
```

The compiler rejects this because the reference would outlive the data.

**Fix**: Return the owned value:

```xerlang
fn not_dangling() -> String {
    let s = "hello".to_string();
    s  // Returns ownership, not a reference
}
```

## Move vs Copy

### Types that Implement `Copy`

Small, fixed-size types are copied automatically:

```xerlang
let x = 42;     // i32
let y = x;      // x is COPIED (x still valid)
println(x);     // OK
println(y);
```

**Copy Types**:
- Integers: `i32`, `u64`, etc.
- Floats: `f32`, `f64`
- Booleans: `bool`
- Characters: `char`
- References: `&T`

### Types that Implement `Move`

Heap-allocated types are moved:

```xerlang
let s1 = "hello".to_string();
let s2 = s1;    // s1 is MOVED
// println(s1); // ERROR: s1 is no longer valid
println(s2);    // OK
```

**Move Types**:
- Strings: `String`
- Vectors: `Vec<T>`
- Custom structs with heap data

## Ownership Transfer in Functions

### Taking Ownership

```xerlang
fn consume(s: String) {
    // Function takes ownership
    println(s);
    // s is dropped here
}

let s = "hello".to_string();
consume(s);
// println(s); // ERROR: ownership was transferred
```

### Borrowing

```xerlang
fn borrow(s: &String) {
    // Function borrows, doesn't take ownership
    println(s);
}

let s = "hello".to_string();
borrow(&s);
println(s);  // OK: s is still valid
```

### Returning Values

Ownership can be returned:

```xerlang
fn make_string() -> String {
    "hello".to_string()  // Returns ownership
}

fn double(mut s: String) -> String {
    s.push_str(&s.clone());
    s  // Returns modified ownership
}

let s1 = make_string();
let s2 = double(s1);  // Takes ownership, returns new ownership
```

## Cloning and Copying

### Clone - Deep Copy

```xerlang
let s1 = "hello".to_string();
let s2 = s1.clone();  // Explicit deep copy
println(s1);  // OK: s1 is still valid
println(s2);  // OK: s2 is independent
```

Clone is explicit and can be expensive for large data.

### Copy - Implicit Copy

```xerlang
let x = 42;
let y = x;  // Implicit copy (Copy types only)
println(x);  // OK: x is still valid
println(y);
```

## References in Structs

When a struct contains references, lifetimes specify how long the data must live:

```xerlang
struct Person<'a> {
    name: &'a str,
    age: u32,
}

fn main() {
    let name = "Alice".to_string();
    let person = Person {
        name: &name,
        age: 30,
    };
    println(person.name);
    // name goes out of scope here, person is no longer valid
}
```

The lifetime `'a` says "this Person contains a reference that lives at least as long as the Person itself".

## Common Patterns

### Returning References with Lifetimes

```xerlang
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}

let s1 = "hello";
let s2 = "world";
let result = longest(s1, s2);  // Result borrows from s1 or s2
```

### Taking Optional References

```xerlang
fn maybe_print(s: Option<&String>) {
    match s {
        Some(string) => println(string),
        None => println("No string"),
    }
}

let s = Some(&"hello".to_string());
maybe_print(s);
```

### Mutable Collections

```xerlang
let mut v = vec![1, 2, 3];
v.push(4);
let first = &v[0];
println(first);  // OK
v.push(5);       // OK: no mutable borrow active
```

## Key Takeaways

1. **Every value has one owner** - Prevents double-free
2. **Ownership can be moved or borrowed** - Flexibility without GC
3. **Immutable borrows** - Many readers
4. **Mutable borrows** - One writer at a time
5. **No dangling pointers** - Compiler prevents use-after-free
6. **No data races** - Concurrent access is safe

---

See [Language Reference](./language-reference.md) for syntax details.
