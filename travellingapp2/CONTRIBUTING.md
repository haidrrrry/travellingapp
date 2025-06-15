# Contributing to Traveling App

Thank you for your interest in contributing to Traveling App! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository
- Go to [https://github.com/yourusername/travellingapp](https://github.com/yourusername/travellingapp)
- Click the "Fork" button in the top right corner
- Clone your forked repository to your local machine

### 2. Set Up Development Environment
```bash
# Clone your fork
git clone https://github.com/yourusername/travellingapp.git
cd travellingapp

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Start the development servers
npm run dev
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes
- Follow the existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly
- Ensure responsive design for mobile devices

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

### 6. Push and Create a Pull Request
```bash
git push origin feature/your-feature-name
```
- Go to your fork on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Submit the pull request

## 📋 Pull Request Guidelines

### PR Title Format
Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### PR Description Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Added integration tests

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🎨 Code Style Guidelines

### JavaScript/React
- Use ES6+ features
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Use consistent indentation (2 spaces)
- Use semicolons at the end of statements

### CSS
- Use consistent naming conventions (BEM methodology preferred)
- Organize CSS properties logically
- Use CSS variables for colors and spacing
- Ensure responsive design

### Backend (Node.js/Express)
- Use async/await for asynchronous operations
- Implement proper error handling
- Use meaningful variable names
- Add comments for complex business logic

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] Test on different screen sizes
- [ ] Test all user flows
- [ ] Verify API endpoints work correctly
- [ ] Check for console errors
- [ ] Test authentication flows

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]

## Additional Context
Add any other context about the problem
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Clear and concise description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like to see this implemented?

## Alternative Solutions
Any alternative solutions you've considered?

## Additional Context
Add any other context or screenshots
```

## 📚 Documentation

### Updating Documentation
- Keep README.md up to date
- Update API documentation when endpoints change
- Add comments to complex code
- Update contributing guidelines if needed

## 🔒 Security

### Security Guidelines
- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication and authorization
- Report security vulnerabilities privately

## 🏷️ Issue Labels

We use the following labels to categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 📞 Getting Help

If you need help with contributing:
- Check existing issues and pull requests
- Ask questions in the issues section
- Join our community discussions

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Traveling App! 🌍✈️ 