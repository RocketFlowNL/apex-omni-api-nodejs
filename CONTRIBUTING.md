# Contributing to apex-omni-api

Thank you for your interest in contributing to apex-omni-api! We welcome contributions from the community.

## How to Contribute

### Reporting Issues

1. Check if the issue already exists in our [issue tracker](https://github.com/RocketFlowNL/apex-omni-api-nodejs/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Your environment (Node.js version, OS, etc.)

### Suggesting Features

1. Open a new issue with the label "enhancement"
2. Describe the feature and its use case
3. Provide examples if possible

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/RocketFlowNL/apex-omni-api-nodejs.git
   cd apex-omni-api-nodejs
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Make your changes**
   - Follow the existing code style
   - Add/update tests if applicable
   - Update documentation

5. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `test:` for test additions/changes
   - `refactor:` for code refactoring
   - `chore:` for maintenance tasks

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Submit for review

## Development Setup

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn
- Git

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file from `.env.example` for testing
4. Run tests: `npm test`
5. Run linting: `npm run lint`

### Testing with Real API

To test with the real Apex Omni API:
1. Get API credentials from https://omni.apex.exchange
2. Set environment variables in `.env`
3. Run integration tests (if available)

## Code Style Guidelines

- Use ES6+ features where appropriate
- Follow existing naming conventions
- Add JSDoc comments for public methods
- Keep functions small and focused
- Handle errors properly
- Avoid console.log in production code

### Example Code Style

```javascript
/**
 * Get account balance from Apex Omni
 * @returns {Promise<Object>} Account balance data
 * @throws {Error} If API request fails
 */
async getAccountBalance() {
    try {
        return await this.makeRequest('GET', '/api/v3/account-balance');
    } catch (error) {
        throw new Error(`Failed to get account balance: ${error.message}`);
    }
}
```

## Pull Request Guidelines

- PRs should be focused on a single feature or fix
- Include tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Keep commits clean and atomic
- Reference any related issues

## Questions?

Feel free to:
- Open an issue for questions
- Contact the maintainer: job@rocketflow.nl
- Join discussions in existing issues

## Support the Project

If you appreciate this project and want to support its development:

☕ [Buy Me a Coffee](https://coff.ee/jobwiegant)

## Credits

apex-omni-api is created and maintained by **Job Wiegant** of [RocketFlow](https://rocketflow.nl).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.