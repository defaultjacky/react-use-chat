# Contributing Guide

Thank you for considering contributing to React Use Chat! We welcome any form of contribution, whether it's reporting issues, suggesting new features, or submitting code.

## Development Environment Setup

1.  Fork this repository.
2.  Clone your fork:
    ```bash
    git clone https://github.com/your-username/react-use-chat.git
    cd react-use-chat
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```

## Development Workflow

### Running Tests

```bash
npm test
```

### Building the Project

```bash
npm run build
```

### Running the Example

```bash
cd example
npm install
npm start
```

### Code Linting and Type Checking

```bash
npm run lint
npm run type-check
```

## Submitting Code

1.  Ensure all tests pass: `npm test`
2.  Ensure code conforms to linting rules: `npm run lint`
3.  Ensure type checks pass: `npm run type-check`
4.  Commit your changes:
    ```bash
    git add .
    git commit -m "feat: Add new feature"
    ```
5.  Push to your branch:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  Create a Pull Request.

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

-   `feat:` A new feature
-   `fix:` A bug fix
-   `docs:` Documentation only changes
-   `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
-   `refactor:` A code change that neither fixes a bug nor adds a feature
-   `test:` Adding missing tests or correcting existing tests
-   `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation

## Code Style

-   Use TypeScript.
-   Follow ESLint rules.
-   Add tests for new features.
-   Update relevant documentation.
-   Maintain backward compatibility of APIs.

## Reporting Issues

If you find a bug, please create an issue and include:

1.  A detailed description of the problem.
2.  Steps to reproduce.
3.  Expected behavior.
4.  Actual behavior.
5.  Environment information (Node.js version, React version, etc.).
6.  A minimal reproducible example.

## Feature Requests

If you have an idea for a new feature, please create an issue and include:

1.  A detailed description of the feature.
2.  Use cases and motivation.
3.  Possible implementation solutions.
4.  Example code (if applicable).

## Pull Request Guidelines

1.  Ensure the PR description clearly explains your changes.
2.  Link to relevant issues (if any).
3.  Include sufficient test coverage.
4.  Update relevant documentation.
5.  Ensure CI checks pass.

## Code Review

All Pull Requests will undergo code review. Reviewers will check for:

-   Code quality and readability.
-   Test coverage.
-   Documentation completeness.
-   API design.
-   Performance impact.

## Community Guidelines

-   Be friendly and professional.
-   Respect different opinions and experiences.
-   Provide constructive feedback.
-   Help new contributors.

## License

By contributing your code, you agree to license your contribution under the MIT License.

---

Thank you again for your contribution! If you have any questions, feel free to ask in an issue. 