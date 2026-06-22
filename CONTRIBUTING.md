# Contributing to SoulChain

Thank you for your interest in contributing to SoulChain! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Include detailed reproduction steps
4. Add screenshots if applicable

### Suggesting Features

1. Open a discussion first
2. Describe the feature and use case
3. Explain why it would benefit the project

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/soulchain.git
cd soulchain

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

## Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names

### CSS

- Use CSS modules or inline styles
- Follow BEM naming convention where appropriate
- Keep styles co-located with components

### Commits

- Write clear, concise commit messages
- Reference issues when applicable
- Use conventional commits format:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `test: add tests`
  - `refactor: improve code structure`

## Project Structure

```
src/
├── components/     # React components
├── test/           # Test files
├── App.jsx         # Main app
├── App.css         # Styles
└── main.jsx        # Entry point
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for meaningful coverage

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀
