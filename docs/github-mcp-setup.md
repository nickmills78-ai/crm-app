# GitHub MCP setup (Nick Mills)

Two different GitHub connections exist in Cursor. You usually want **both**.

| Connection | What it does | Auth |
|---|---|---|
| **Cursor GitHub App** | Cloud Agents clone/push/PRs on connected repos | Install app on GitHub |
| **GitHub MCP server** | Agent tools: create repos, issues, PRs, search, etc. | Personal Access Token (PAT) |

This repo already includes a Desktop/project template at [`.cursor/mcp.json`](../.cursor/mcp.json) that points at GitHub’s hosted MCP endpoint. It expects an environment variable named `GITHUB_PAT` — **no token is stored in git**.

---

## Part A — Create a GitHub Personal Access Token (required for MCP)

1. Open [github.com/settings/tokens](https://github.com/settings/tokens) (classic) — recommended for repo creation.
2. **Generate new token (classic)**.
3. Note / expiry: your choice (90 days is fine to start).
4. Scopes to enable at minimum:
   - **`repo`** — private repos + create repositories
   - **`read:org`** — if you use org/team features (optional but useful)
5. Generate and **copy the token once**. Store it in a password manager.

Fine-grained tokens work for many read/write ops on *existing* repos, but **creating new repos is more reliable with a classic token that has `repo`**.

---

## Part B — Cursor Desktop (local MCP)

### Fast path (one-click)

1. Open GitHub’s Cursor install guide:  
   https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md  
2. Click **Install MCP Server** (remote / recommended).
3. When Cursor opens the config, replace `YOUR_GITHUB_PAT` with your token **or** keep using `${env:GITHUB_PAT}` (see below).
4. Restart Cursor.
5. Settings → **Tools & MCP** — `github` should show a green status.
6. Test in chat: `List my GitHub repositories`.

### Using this project’s template + env var

1. This repo’s `.cursor/mcp.json` is already set to:

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${env:GITHUB_PAT}"
      }
    }
  }
}
```

2. On your Mac, set the env var permanently, then restart Cursor from a shell that sees it (or set it in your login environment):

```bash
# zsh example — add to ~/.zshrc
export GITHUB_PAT="ghp_your_token_here"
```

3. Or put the token directly in **global** `~/.cursor/mcp.json` (not committed):

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ghp_your_token_here"
      }
    }
  }
}
```

4. Restart Cursor and verify the green status.

**Optional local Docker MCP** (OAuth browser login, no PAT): see the same GitHub install guide’s Docker section. Remote HTTP + PAT is simpler for most people.

---

## Part C — Cloud Agents MCP (so cloud agents can create repos)

Desktop `mcp.json` does **not** automatically apply to Cloud Agents. Configure MCP in the agents UI:

1. Go to [cursor.com/agents](https://cursor.com/agents).
2. Open the **MCP** controls / settings for your account (or Team → [Integrations & MCP](https://cursor.com/dashboard/integrations) if on a team plan).
3. Add an HTTP MCP server:

| Field | Value |
|---|---|
| Name | `github` |
| URL | `https://api.githubcopilot.com/mcp/` |
| Header | `Authorization: Bearer <YOUR_GITHUB_PAT>` |

4. Save. Complete any prompts. Secrets are stored by Cursor and redacted after save.
5. Start a new Cloud Agent chat and ask: `List my GitHub repositories` or `Create a private repo named project-context under nickmills78-ai`.

Until this is done, Cloud Agents only have the limited Cursor GitHub App token (clone/push on already-connected repos) — **not** `create_repository`.

---

## Part D — Cursor GitHub App (Cloud Agents on more repos)

Separate from MCP. Needed so Cloud Agents can work inside repos like `project-context`.

1. Open [cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations).
2. GitHub → **Connect** / **Manage**.
3. Prefer **All repositories**, or add **`project-context`** (and any other repos) under selected repos.
4. Also confirm on GitHub: [github.com/settings/installations](https://github.com/settings/installations) → **Cursor** → Repository access.

---

## Part E — Create `project-context` (after MCP works)

Once Cloud Agent GitHub MCP shows as connected (or you use Desktop with MCP):

1. Ask the agent: create private repo `nickmills78-ai/project-context`.
2. Or create empty repo yourself: [github.com/new](https://github.com/new) → name `project-context` → Private → no README.
3. Grant Cursor GitHub App access to it (Part D).
4. Tell the agent to push the prepared context files (`aboutme.md`, email voice profiles, README).

---

## Verify checklist

- [ ] Classic PAT created with `repo`
- [ ] Desktop: Settings → Tools & MCP → `github` green
- [ ] Desktop chat can list your repos
- [ ] Cloud Agents: GitHub MCP added with PAT header
- [ ] Cloud Agent chat can list/create repos
- [ ] Cursor GitHub App includes `project-context` (or all repos)

---

## Security notes

- Never commit a real PAT into this repo.
- Prefer `${env:GITHUB_PAT}` or Cursor’s secret fields.
- Revoke/rotate the token if it leaks: [github.com/settings/tokens](https://github.com/settings/tokens).

## References

- [GitHub MCP → Cursor install](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md)
- [Cursor MCP docs](https://cursor.com/docs/mcp)
- [Cursor GitHub App](https://cursor.com/docs/integrations/github)
