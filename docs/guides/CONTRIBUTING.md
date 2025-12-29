# Contributing to XerLang (T181)

Thank you for your interest in contributing to XerLang!

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `cargo test`
5. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/xerlang.git
cd xerlang

# Build
cargo build

# Run tests
cargo test

# Check formatting
cargo fmt -- --check

# Run lints
cargo clippy
```

## Pull Request Guidelines

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic
- Write clear commit messages

## Safety Guidelines

XerLang has strict safety requirements:

- Maximum severity is PC shutdown
- L4 operations are FORBIDDEN
- All L3 operations require safety review
- Test in emulator before any hardware interaction

## Reporting Issues

- Use the issue templates
- Include reproduction steps
- Provide system information
- Check existing issues first

## Questions?

Open a discussion in the GitHub Discussions tab.
