# Email Voice Profile — Handoff

**Last updated:** 2026-06-04  
**Owner:** Nick Mills (ngmills@stephengould.com)  
**Canonical profile:** `docs/email-voice-profile.md` (this repo)  
**Also published:** https://github.com/nickmills78-ai/email-voice-profile (private standalone repo)

---

## Purpose

Living voice profile for AI-drafted email replies on behalf of Nick Mills, Project Director at Stephen Gould (packaging supply and sourcing, San Diego). Built through structured interview rounds; profile is the source of truth for drafting.

---

## Session log

| Date | Work |
|------|------|
| 2026-06-04 | Reviewed initial `email-voice-profile.md`. Two interview rounds. Incorporated all answers into canonical profile. Copied into `crm-app` under `docs/`. |

---

## Files

| File | Role |
|------|------|
| `docs/email-voice-profile.md` | **Canonical** — use when drafting any Nick Mills email |
| `docs/email-voice-handoff.md` | Session history, decisions, open items (this file) |

**Standalone repo:** `nickmills78-ai/email-voice-profile` — same profile content; update both when editing.

---

## How to use

1. Load `docs/email-voice-profile.md` before drafting.
2. Match incoming email to an **Email Type** (ack, RFQ, follow-up, negative, cold outreach, internal).
3. Apply **close rule:** `Thank you!` = good news; `Thank you,` = bad news / problems / follow-ups.
4. Always greet (`Hi [Name],`), always append **full signature block**.
5. Never draft pricing or legal commitments without explicit human approval.
6. English only.

---

## Round 1 — Decisions

### Tone & closings

| # | Decision |
|---|----------|
| 1 | Good news default close: **`Thank you!`** |
| 2 | Bad/awkward news: **comma only** — `Thank you,` (no `!`) |
| 3 | Greeting: always **`Hi [Name],`** — never `HI` |

### Follow-ups

| # | Decision |
|---|----------|
| 4 | First unanswered email: still **"Checking in here…"** |
| 5 | 2nd/3rd nudge: **firmer** — add customer impact + reply deadline |
| 6 | Firmer vendor phrases approved (see profile **Firmer follow-up** section) |

### Audience & boundaries

| # | Decision |
|---|----------|
| 7 | **Everyone gets a greeting** (internal included — Option A) |
| 8 | Key customers: **never** blame vendor by name, mention internal cost, or use `asap` without a date |
| 9 | Reply subject lines: **`Re: [original]`** |
| 13 | AI **never** drafts: pricing without approval, legal commitments |

### Approved suggestions (round 1)

- **Negative-reply templates** — delay, partial/compromise, spec-no (profile §6)
- **Cold outreach hooks** — two example structures + avoid list (profile §7)
- **Call vs email table** — when to stay in-thread vs suggest a call (profile § Call vs Email)
- **Draft more/less** — amplify dates/accountability; cut filler and hedging (profile § Draft More / Less)

---

## Round 2 — Decisions

### RFQ formatting

| # | Decision |
|---|----------|
| 1 | Multi-item RFQs: **numbered list** (`1.`, `2.`) |
| 2 | Field order: part/SKU → dimensions → style → board/material → print → QTY → notes |
| 3 | Opener: **`Can you please quote the following...`** |
| 4 | **No** context line before specs (no customer name, rush, repeat-order preamble) |
| 5 | Specs: **inline, attached, or both** |
| 6 | Footnotes/exceptions: **`*` prefix** |
| 7 | Multi-vendor: **separate emails** per vendor |
| 8 | Revisions: subject **`Revised quote request`** |
| 9 | Always ask vendors for **price + lead time + MOQ** in same email |

### Signature rules

| # | Decision |
|---|----------|
| 10 | **Full signature block always** — including one-line acks |
| 11 | **Full signature on every reply** in a thread (no trimming) |
| 12 | Internal mail: **full signature** |
| 13 | Mobile: **same rules** as desktop |
| 14 | Quick acks: **`Thank you!` in body only** — name only in signature block |

### Language

| # | Decision |
|---|----------|
| 15–19 | **English only** — no bilingual email |
| 20 | AI **always defaults to English** |

---

## Changes from original profile

| Area | Before | After |
|------|--------|-------|
| Greeting | Internal could skip greeting; `HI` noted as variation | Everyone greeted; `Hi` only |
| Closings | `!` "frequently"; ambiguous when to use comma | Explicit good-news vs bad-news table |
| Follow-ups | Single "checking in" pattern | Escalation ladder for 2nd/3rd vendor nudge |
| RFQ | One example; "quote the box below" | Full rules + single/multi/attachment examples |
| Negative news | Not covered | Three templates (delay, partial, spec-no) |
| Cold outreach | One generic template | Two hook examples + avoid list |
| Call vs email | Not covered | Decision table |
| Subject lines | Not covered | `Re: [original]` + `Revised quote request` |
| Signature | "Always include" but quick-reply exception unclear | Explicit always-full-block policy |
| Language | Not covered | English only |
| AI boundaries | Not covered | No pricing / legal without approval |
| Key customers | Tone only | Explicit never-do list |

---

## Open / not yet interviewed (round 3 candidates)

- Forwarding / CC etiquette — when to add team, trim quoted text  
- PO placement patterns beyond "PO received"  
- Quote presentation back to customers (format only; pricing still gated)  
- Urgency vocabulary — "rush" / "hot" / "priority" vs dates only  
- Real redacted RFQ or email paste to tune examples to exact layout  

---

## Next step

Optional **round 3** on forwarding/CC, PO placement, customer quote presentation, or urgency words — or paste a redacted real email/RFQ to calibrate examples.

When editing: keep `docs/email-voice-profile.md` in sync with the standalone `email-voice-profile` repo.
