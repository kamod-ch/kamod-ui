# Contribute from your existing clone

You do not need collaborator access: push to your own fork and propose a pull
request to `kamod-ch/kamod-ui`. Keep using this cloned folder.

1. [Create your fork on GitHub](https://github.com/kamod-ch/kamod-ui/fork), if needed.
   Inspect the remotes before using them:

   ```bash
   git remote -v
   ```

   In this checkout, `origin` and `fork` point to the contributor's personal fork;
   `upstream` points to `kamod-ch/kamod-ui`. If a remote is missing, add it once:

   ```bash
   git remote add fork https://github.com/YOUR-USERNAME/kamod-ui.git
   git remote add upstream https://github.com/kamod-ch/kamod-ui.git
   ```

2. Start a feature branch. If you have work already, commit it on a separate branch
   or stash it (including untracked files) before updating `main`:

   ```bash
   git fetch upstream
   git switch main
   git pull --ff-only upstream main
   git switch -c feat/application-shell-1
   ```

3. Make the block and docs changes. Run relevant checks; `corepack pnpm check`
   runs the main checks, and `corepack pnpm --filter @kamod-ch/blocks test` runs
   block tests separately. See [.docs/LOCAL-SETUP.md](.docs/LOCAL-SETUP.md).

4. Review and stage only the intended changes, then commit and push:

   ```bash
   git status
   git diff
   git add -p
   # Also git add each intended new file; -p skips untracked files.
   git diff --cached
   git commit -m "feat(blocks): add application shell 1"
   git push -u fork feat/application-shell-1
   ```

5. Open the link GitHub prints, or choose **Compare & pull request** on your fork.
   Set **base repository** to `kamod-ch/kamod-ui`, **base** to `main`, and **head**
   to your fork's feature branch. Describe the change and checks; add screenshots
   for UI work. Push more commits to that branch to update the same PR.

If Git asks for credentials, use your GitHub authentication setup (a token or SSH
key, not your GitHub account password). Keep context/setup changes in a separate
commit or PR when they are not part of the feature. Maintainers review and merge.

References: [repository contribution rules](CONTRIBUTING.md),
[GitHub fork guide](https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo),
[PRs from forks](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork).
