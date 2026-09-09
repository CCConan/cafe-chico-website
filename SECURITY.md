# Security Incident: Cloudflare API Token Exposed

**Date detected**: 2026-09-09
**Status**: BLOCKED — push protection active
**Severity**: HIGH — token is in public git history

## What happened

GitHub's secret scanner detected a **Cloudflare Account API Token** in
`planning/05-deployment-completed.md-E` (a vim editor swap file),
committed in `5cf6278` on 2026-09-02. The file is 6552 bytes / 156 lines
and contains the token in plaintext.

This is a real leak — anyone with the public repo URL can clone and
read the token.

## Required actions (in order)

### 1. Revoke the leaked Cloudflare token (URGENT — minutes matter)

- Log into https://dash.cloudflare.com/profile/api-tokens
- Find the leaked token in the list
- Click "Roll" (regenerate same permissions) OR "Delete" + create new
- Update any local/dev environment that used the old token

### 2. Clean git history (BFG approach — safer than filter-branch)

```bash
# 1. Install BFG: brew install bfg  (or download from rtyley.github.io/bfg-repo-cleaner)
# 2. Save the token to a file for BFG to scrub
echo "CLOUDFLARE_TOKEN_TO_REPLACE" > /tmp/leaked-token.txt
# 3. Run BFG
bfg --replace-text /tmp/leaked-token.txt --no-blob-protection
git reflog expire --expire=now --all
git gc --prune=now --aggressive
# 4. Force-push the cleaned history
git push --force
```

After this, the favicon work (currently staged) can also be pushed.

### 3. Prevention (done in this commit)

Added to `.gitignore`:
- `*.md-E`, `*.md-*` — vim/emacs swap and backup files
- `*~` — generic editor backup
- `.*.swp` — vim swap files

These patterns prevent future accidental commits of editor scratch
files that might contain leaked secrets.

## Files involved

- `planning/05-deployment-completed.md` — the actual (sanitized) deploy notes
- `planning/05-deployment-completed.md-E` — the leaked vim swap file
- `.gitignore` — updated to block future editor swap files
