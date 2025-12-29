# XersLang Finder (xslf)

A simple line counter tool for XersLang source files.

## Usage

```bash
xslf.exe
```

Reads `test.xers` from the current directory and outputs:
- Total lines
- Blank lines
- Comment lines
- Code lines

## Building from Source

Compile with the XersLang compiler:
```bash
xslc.exe xslf.xers
```

## Output Format

The tool outputs 4 numbers (one per line):
1. Total lines in file
2. Blank lines
3. Comment lines (lines starting with `//`)
4. Code lines
