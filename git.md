# Git Workflow & Conventions

This document describes the Git workflow, branching strategy, commit message conventions, and pull request process for the **extension** project (hosted at [Abilash-sync/extension](https://github.com/Abilash-sync/extension)).

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Branching Strategy](#branching-strategy)
3. [Branch Naming Conventions](#branch-naming-conventions)
4. [Commit Message Conventions](#commit-message-conventions)
5. [Pull Request Process](#pull-request-process)
6. [Keeping Your Branch Up to Date](#keeping-your-branch-up-to-date)
7. [Git Tips & Best Practices](#git-tips--best-practices)

---

## Repository Overview

| Item            | Value                                          |
|-----------------|------------------------------------------------|
| Repository      | `Abilash-sync/extension`                       |
| Remote URL      | `https://github.com/Abilash-sync/extension.git`|
| Default Branch  | `main`                                         |

---

## Branching Strategy

This project uses a **feature-branch workflow**:

```
main
 └── feature/your-feature-name
 └── fix/your-bug-fix
 └── docs/your-docs-update
 └── chore/your-chore-task
```

### Key Rules

- **`main` is the protected, stable branch.** No one pushes directly to `main`.
- All work happens on short-lived **feature branches** created from `main`.
- Branches are merged into `main` exclusively through **Pull Requests (PRs)**.
- Delete your feature branch after it has been merged.

---

## Branch Naming Conventions

Use lowercase words separated by hyphens (`kebab-case`). Prefix the branch name with a **type** that matches the nature of the work:

| Type       | When to use                                          | Example                          |
|------------|------------------------------------------------------|----------------------------------|
| `feature/` | New features or enhancements                         | `feature/add-toolbar-button`     |
| `fix/`     | Bug fixes                                            | `fix/popup-alignment-issue`      |
| `docs/`    | Documentation changes only                          | `docs/update-readme`             |
| `chore/`   | Build, config, tooling, or maintenance tasks        | `chore/update-dependencies`      |
| `refactor/`| Code refactoring with no functional change          | `refactor/cleanup-content-script`|
| `test/`    | Adding or updating tests                             | `test/add-unit-tests`            |
| `hotfix/`  | Urgent production patches                            | `hotfix/critical-auth-error`     |

### Creating a Branch

```bash
# Always branch off from an up-to-date main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

---

## Commit Message Conventions

This project follows the **Conventional Commits** specification ([conventionalcommits.org](https://www.conventionalcommits.org/)).

### Format

```
<type>(<optional scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                                  |
|------------|--------------------------------------------------------------|
| `feat`     | A new feature                                                |
| `fix`      | A bug fix                                                    |
| `docs`     | Documentation-only changes                                   |
| `style`    | Formatting, whitespace (no logic change)                     |
| `refactor` | Code change that neither fixes a bug nor adds a feature      |
| `test`     | Adding or updating tests                                     |
| `chore`    | Build process, tooling, or dependency updates               |
| `perf`     | Performance improvement                                      |
| `ci`       | CI/CD configuration changes                                  |
| `revert`   | Reverts a previous commit                                    |

### Rules

- Use the **imperative mood** in the summary: _"add toolbar button"_, not _"added toolbar button"_.
- Keep the summary line **under 72 characters**.
- Do **not** end the summary with a period.
- Separate the body from the summary with a **blank line**.
- Reference relevant issues or PRs in the footer (e.g., `Closes #42`).

### Examples

```bash
# Simple feature commit
git commit -m "feat: add context menu option to copy link"

# Bug fix with scope
git commit -m "fix(popup): correct icon alignment on Windows"

# Documentation update
git commit -m "docs: add git workflow documentation"

# Commit with body and footer
git commit -m "feat(content-script): highlight selected text

Adds a yellow highlight to any text selected by the user
when the extension icon is active.

Closes #17"

# Breaking change (note the '!' and BREAKING CHANGE footer)
git commit -m "feat!: remove legacy manifest v2 support

BREAKING CHANGE: The extension now requires Manifest V3.
Users on Chrome < 88 will need to update their browser."
```

---

## Pull Request Process

### Opening a PR

1. **Push your branch** to the remote:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request on GitHub targeting the `main` branch.
3. Fill in the PR template (title, description, linked issues).

### PR Title

Follow the same **Conventional Commits** format as commit messages:
```
feat(scope): short description of the change
```

### PR Description Checklist

Include the following in every PR description:

- **What**: A clear summary of what was changed and why.
- **How**: A brief explanation of the implementation approach (if non-trivial).
- **Testing**: How the change was tested.
- **Screenshots**: For UI changes, include before/after screenshots.
- **Related issues**: Link any related issues (`Closes #<issue-number>`).

### Review & Merge

- At least **one approving review** is required before merging.
- All CI checks must pass before merging.
- Use **Squash and Merge** for feature branches to keep `main` history clean.
- Delete the feature branch after merging.

---

## Keeping Your Branch Up to Date

Regularly sync your feature branch with `main` to avoid large merge conflicts:

```bash
# Option 1 – Rebase (preferred for a cleaner history)
git fetch origin
git rebase origin/main

# Option 2 – Merge
git fetch origin
git merge origin/main
```

> **Tip:** Prefer `rebase` over `merge` when updating a feature branch to keep the commit history linear and easier to read.

---

## Git Tips & Best Practices

### Useful Daily Commands

```bash
# Check what has changed
git status
git diff

# Stage changes interactively
git add -p

# Amend the last commit (before pushing)
git commit --amend

# View a compact, visual log
git log --oneline --graph --all

# Undo the last commit but keep changes staged
git reset --soft HEAD~1

# Stash work in progress
git stash push -m "WIP: description of work"
git stash pop
```

### .gitignore Reminders

- Never commit secrets, API keys, or credentials.
- Keep OS/editor artifacts (`.DS_Store`, `.idea/`, `*.suo`) out of the repository.
- Extension build artifacts (e.g., `dist/`, `build/`) should be listed in `.gitignore` and not committed.

### Do's and Don'ts

| ✅ Do                                              | ❌ Don't                                        |
|----------------------------------------------------|-------------------------------------------------|
| Make small, focused commits                        | Commit large batches of unrelated changes       |
| Write descriptive commit messages                  | Use vague messages like "fix stuff" or "wip"    |
| Open a PR early as a **Draft** for feedback        | Force-push to `main`                            |
| Rebase feature branches before opening a PR        | Merge `main` into a PR branch unnecessarily     |
| Delete branches after merging                      | Leave stale branches lying around               |

---

*This document was generated based on the repository configuration of `Abilash-sync/extension` and follows widely adopted Git best practices.*
