# Skill: go-to

Navigate to a project in the workspace, cloning it if necessary, then get it ready for work.

## Trigger
Use this skill when the user types `go-to <project>` where `<project>` is the project name.

## Inputs
- `project` — the project name (e.g. `trustvc`, `tradetrust`, `opencerts`)

## Steps

### 1. Check if project exists in workspace
- Check if `workspace/<project>/` exists in the Alfred project root

### 2a. Project NOT in workspace — ask for repo URL
- Ask the user: "I don't see `<project>` in the workspace. What's the GitHub URL for this repo?"
- Wait for the user to provide the URL
- Clone the repo: `git clone <url> workspace/<project>/`

### 2b. Project IS in workspace
- Proceed to step 3

### 3. Determine default branch
- Run `git -C workspace/<project> remote show origin` to detect whether the default branch is `main` or `master`

### 4. Switch to default branch and pull latest
- Run `git -C workspace/<project> checkout <default-branch>`
- Run `git -C workspace/<project> pull`

### 5. Resolve Node version
- Check if `workspace/<project>/.nvmrc` exists
  - If yes: run `nvm use` inside the project — it will pick up the version from `.nvmrc`
- If no `.nvmrc`, check `package.json` for an `engines.node` field
  - If found (e.g. `"node": ">=20.0.0"`): extract the major version and run `nvm use <major>`
- If neither is found: ask the user "I can't determine the required Node version for `<project>`. Which version should I use?"
  - Wait for the user to respond, then run `nvm use <version>`

### 6. Install packages
- Run `npm install` inside `workspace/<project>/`

### 7. Confirm ready
- Tell the user: "Ready. You're on `<default-branch>` in `workspace/<project>/` with latest packages installed."
- Wait for the next command

## Output
- Project is cloned (if needed), on the default branch, up to date, and dependencies installed
- User is informed and ready to proceed
