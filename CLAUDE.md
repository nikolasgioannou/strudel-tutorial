# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Maintaining this file

- Treat `CLAUDE.md` as a living document. When the user mentions meta-level things about how Claude should write code or collaborate on this codebase, add them here.
- Only capture meta/process guidance — not feature requirements or one-off task details.
- Keep entries concise. Don't include everything the user says, just the durable rules.

## Code style

- Leave comments for yourself as you write code throughout the codebase. Use them to track intent, assumptions, and TODOs so future passes have context.

## Package management

- Always use Bun commands to manage dependencies:
  - `bun add <pkg>` to add a runtime dependency
  - `bun add -d <pkg>` to add a dev dependency
  - `bun remove <pkg>` to remove a dependency
- Never edit `package.json` directly to add/remove packages and then run `bun install`. Always go through the `bun` CLI.

## Workflow

The collaboration loop with the user is:

1. User describes a task.
2. Claude may pause to ask clarifying questions if anything is ambiguous (optional — skip if clear).
3. Claude implements the task.
4. **Before committing**, Claude pauses and:
   - Recaps what changed.
   - Explains how the user can test it.
5. User tests. When the user says it's good, Claude makes the commit, then suggests the next logical step.
6. User accepts, redirects, or proposes something else. Repeat.

**Do not commit until the user has confirmed the change is good.**

## Commits

- Use [Conventional Commits](https://www.conventionalcommits.org/).
- Subject line only. No body, no description.
- Examples:
  - `feat: add interactive editor to first-sounds lesson`
  - `fix: pin @strudel/repl version to avoid breaking change`
  - `docs: expand mini-notation notes with elongation examples`
