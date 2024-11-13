# Contributing Guidelines

## Commit Message Format

To maintain consistency in our commit history, please follow these commit message guidelines:

### Format

type(scope): description

### Type

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Changes that do not affect the code's meaning (formatting, etc)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **test**: Adding or modifying tests
- **chore**: Changes to build process or auxiliary tools

Project-specific types:

- **auth**: Authentication related changes
- **match**: Matching feature related changes
- **message**: Message feature related changes
- **profile**: Profile related changes
- **search**: Search feature related changes

### Scope (Optional)

- **api**: Backend API changes
- **web**: Frontend changes
- **db**: Database changes
- **ui**: UI component changes

## Commit Message Examples

- **feat(api): add new user route**
- **fix(frontend): fix login page**
- **auth(api): add new auth route**

## Branch Strategy

- **main**: Protected production branch.
- **dev**: Main development branch.
- **feature/{name}**: New feature branch.
- **bug/{name}**: Bug fix branch.

## Pull Request Guidelines

1. Before submitting:

   - Ensure all tests pass
   - Code follows project standards
   - Resolve any conflicts

2. PR description should include:
   - Summary of changes
   - Related issue numbers
   - Test results
   - Special notes for reviewers
