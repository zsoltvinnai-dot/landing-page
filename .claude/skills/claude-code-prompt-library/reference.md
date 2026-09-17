# Claude Code prompt library — teljes referencia

Forras: https://code.claude.com/docs/en/prompt-library (lementve: 2026-09-17).
52 prompt sablon, SDLC fazis szerint csoportositva. A `{kapcsos}` reszek behelyettesitendo slotok;
a *Pelda* sor a hivatalos peldaertekekkel kitoltott valtozat.

## Tartalom
- Discover — megérteni a kódbázist (7 prompt)
- Design — tervezés, prototípus (6 prompt)
- Build — implementálás, teszt, refaktor (22 prompt)
- Ship — review, git, release (5 prompt)
- Operate — üzemeltetés, debug, adat, automatizálás (12 prompt)

---

## Discover — megérteni a kódbázist

### Get oriented in a new repository

- Kategoria: Onboard

```text
give me an overview of this codebase: architecture, key directories, and how the pieces connect
```

Miert mukodik: Describe what you want to know, not which files to read. Claude explores the project on its own and returns a summary of how it fits together.

Kovetkezo lepes: Run `/init` to set up `CLAUDE.md` so Claude remembers this every session

Forras: Common workflows

### Explain unfamiliar code

- Kategoria: Understand

```text
explain what {path} does and how data flows through it. write it up as {format}
```

Pelda: `explain what src/scheduler/queue.ts does and how data flows through it. write it up as an HTML page with a diagram, then open it in my browser`

Miert mukodik: Name the file and say what format you want the answer in. Swap the HTML page for a diagram, bullet points, or whatever fits how you learn.

Kovetkezo lepes: Set an output style so Claude always explains in your preferred format

Forras: Common workflows

### Find where something happens

- Kategoria: Understand

```text
where do we {behavior}?
```

Pelda: `where do we validate uploaded file types?`

Miert mukodik: Search by behavior instead of by filename. The search works even when you don't know what the file is called or which directory it lives in.

Forras: Common workflows

### Check what breaks before you delete

- Kategoria: Understand

```text
what would break if I deleted {target}?
```

Pelda: `what would break if I deleted the retryWithBackoff helper?`

Miert mukodik: Ask before you remove anything. The list of callers and downstream effects tells you whether you're looking at a one-line cleanup or a change you need to coordinate.

Forras: Common workflows

### Trace how code evolved

- Kategoria: Understand

```text
look through the commit history of {path} and summarize how it evolved and why
```

Pelda: `look through the commit history of internal/auth/session.go and summarize how it evolved and why`

Miert mukodik: Point at commit history when the question is why, not what. Claude reads the log and blame for whatever version control you use and explains the decisions behind the current implementation.

Forras: Best practices

### Scope a change before you start

- Kategoria: Understand · Szerepkor: PM, Design

```text
which files would I need to touch to {change}?
```

Pelda: `which files would I need to touch to add a dark mode toggle to settings?`

Miert mukodik: Size the work before you commit it to a roadmap. The file list tells you whether you're looking at one component or a cross-cutting change.

Forras: How Anthropic teams use Claude Code

### Ask the codebase a product question

- Kategoria: Understand · Szerepkor: PM

```text
I am a {role}. walk me through what happens when a user {action}, from the UI down to the result
```

Pelda: `I am a PM. walk me through what happens when a user clicks Export to PDF, from the UI down to the result`

Miert mukodik: State your role so the answer is pitched at the right level. Claude explains what the product actually does from the source code, without you needing to read it.

Kovetkezo lepes: Set an output style so Claude always pitches answers at this level

Forras: How Anthropic teams use Claude Code

---

## Design — tervezés, prototípus

### Plan a multi-file change before touching code

- Kategoria: Plan · Szerepkor: PM, Design

```text
plan how to refactor the {target} to {goal}. list the files you would change, but don't edit anything yet
```

Pelda: `plan how to refactor the payment module to support multiple currencies. list the files you would change, but don't edit anything yet`

Miert mukodik: Adding "don't edit yet" separates exploration from changes, so you see the approach before any code moves. To make plan-first the default on every prompt, press Shift+Tab for [plan mode](/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode).

Forras: Common workflows

### Draft a spec by interview

- Kategoria: Plan · Szerepkor: PM

```text
I want to build {feature}. interview me about implementation, UX, edge cases, and tradeoffs until we have covered everything, then write the spec to SPEC.md
```

Pelda: `I want to build per-workspace rate limits. interview me about implementation, UX, edge cases, and tradeoffs until we have covered everything, then write the spec to SPEC.md`

Miert mukodik: Ask to be interviewed instead of writing the spec yourself. Claude asks you structured questions until the requirements are complete, then writes the result to a file.

Kovetkezo lepes: Save your interview questions as a `/spec` skill so every spec starts the same way

Forras: Best practices

### Turn a meeting into tickets

- Kategoria: Plan · Szerepkor: PM

```text
read {input} and write up the action items, then create a {tracker} ticket for each with acceptance criteria
```

Pelda: `read @meeting-notes.md and write up the action items, then create a Linear ticket for each with acceptance criteria`

Miert mukodik: Skip the transcription step. Claude pulls action items from the unstructured input and writes them straight into your tracker via [MCP](/docs/en/mcp), so you review the tickets, not the transcript.

Kovetkezo lepes: Save this as a `/tickets` skill

Forras: How Anthropic teams use Claude Code

### Map edge cases before building

- Kategoria: Plan · Szerepkor: Design, PM

```text
list the error states, empty states, and edge cases for {feature} that the design needs to cover
```

Pelda: `list the error states, empty states, and edge cases for the file upload flow that the design needs to cover`

Miert mukodik: Ask for what's missing, not what's there. Claude lists the error states, empty states, and edge cases a happy-path design tends to skip.

Forras: How Anthropic teams use Claude Code

### Turn a mockup into a working prototype

- Kategoria: Prototype · Szerepkor: Design, PM, Marketing

```text
here is a mockup. build a working prototype I can click through, matching the layout and states shown
```

Miert mukodik: A clickable prototype answers questions a static mockup can't. Hand the working code to engineering instead of explaining the interactions in a doc.

Forras: How Anthropic teams use Claude Code

### Implement from a screenshot and self-check

- Kategoria: Prototype · Szerepkor: Design

```text
implement this design, then take a screenshot of the result, compare it to the original, and fix any differences
```

Miert mukodik: This gives Claude a verification loop: it renders, compares against the source image, and iterates without you pointing out each gap.

Kovetkezo lepes: Use `/goal` to keep Claude iterating toward matching screenshots

Forras: Best practices

---

## Build — implementálás, teszt, refaktor

### Follow an existing pattern

- Kategoria: Implement

```text
look at how {example} is implemented to understand the pattern, then build {new} the same way
```

Pelda: `look at how the GitHub webhook handler is implemented to understand the pattern, then build a Stripe webhook handler the same way`

Miert mukodik: Point at code you already like. Without a reference, Claude defaults to general best practices. With one, it matches the conventions your codebase actually uses.

Kovetkezo lepes: Ask Claude to write the pattern it followed into `CLAUDE.md` so future sessions match it without the reference

Forras: Best practices

### Generate docs for undocumented code

- Kategoria: Implement · Szerepkor: Docs

```text
find {scope} without {format} comments and add them, matching the style already used in the file
```

Pelda: `find the public functions in src/auth/ without JSDoc comments and add them, matching the style already used in the file`

Miert mukodik: Name the scope and the format. Claude finds what's missing and matches the comment style already in the file, so the new docs read like the rest.

Forras: Common workflows

### Add a small, well-defined feature

- Kategoria: Implement

```text
add a {endpoint} endpoint that returns {payload}
```

Pelda: `add a /health endpoint that returns the app version and uptime`

Miert mukodik: State the inputs and outputs, not how to build it. Claude finds where similar code lives and adds yours alongside it.

Forras: Common workflows

### Build a small internal tool from scratch

- Kategoria: Implement · Szerepkor: PM, Design, Marketing, Docs

```text
create a {tool} using HTML, CSS, and vanilla JavaScript, then open it in my browser
```

Pelda: `create a drag-and-drop Kanban board with three columns using HTML, CSS, and vanilla JavaScript, then open it in my browser`

Miert mukodik: You don't need a project, a framework, or a build step. Describe the tool and ask Claude to open it so you see it working immediately.

Forras: How Anthropic teams use Claude Code

### Work an issue end to end

- Kategoria: Implement

```text
read issue #{issue}, implement the fix, and run the tests
```

Pelda: `read issue #312, implement the fix, and run the tests`

Miert mukodik: Give the issue number, not a summary. Claude reads the full ticket itself, so requirements you'd forget to mention come through, and it validates the change before reporting back.

Forras: Common workflows

### Find and update copy across the codebase

- Kategoria: Implement · Szerepkor: Design, Docs, Marketing

```text
find every place we say "{copy}" or a close variant, show me each one in context, then update them all to "{new}". leave tests and the changelog alone
```

Pelda: `find every place we say "Sign up free" or a close variant, show me each one in context, then update them all to "Start free trial". leave tests and the changelog alone`

Miert mukodik: Ask for variants and say what to skip. Claude finds phrasings a literal search would miss and leaves test fixtures and history untouched, so you review only the copy users actually see.

Forras: How Anthropic teams use Claude Code

### Draft a document from past examples

- Kategoria: Implement · Szerepkor: Docs, Marketing, PM

```text
read the {examples} in {folder} to learn the structure and voice, then draft a new one for {topic}
```

Pelda: `read the privacy impact assessments in legal/pia/ to learn the structure and voice, then draft a new one for the new analytics integration`

Miert mukodik: Point at a folder of finished work instead of describing your style. Claude learns the structure and voice from what you've already shipped, so the first draft reads like one of yours.

Kovetkezo lepes: Save the voice as a skill so every draft starts there

Forras: How Anthropic uses Claude in Legal

### Write tests, run them, fix failures

- Kategoria: Test

```text
write tests for {path}, run them, and fix any failures
```

Pelda: `write tests for app/parsers/feed.py, run them, and fix any failures`

Miert mukodik: Ask for write, run, and fix together so Claude iterates without stopping for instructions.

Kovetkezo lepes: Run `/init` so Claude learns your test command automatically

Forras: Common workflows

### Drive implementation from tests

- Kategoria: Test

```text
write tests for {feature} first, then implement it until they pass
```

Pelda: `write tests for the password reset flow first, then implement it until they pass`

Miert mukodik: Test-driven development: the tests define when the work is complete, and Claude iterates on the implementation until they pass.

Forras: Scaling agentic coding guide

### Fill gaps from a coverage report

- Kategoria: Test

```text
read {report} and add tests for the lowest-covered files until each is above {target}%
```

Pelda: `read coverage/coverage-summary.json and add tests for the lowest-covered files until each is above 80%`

Miert mukodik: Point at the coverage report instead of guessing what's untested. Claude reads the actual numbers and writes tests for the files that need them most.

Kovetkezo lepes: Set this as a `/goal` so Claude keeps writing tests toward the coverage target

Forras: Common workflows

### Migrate a pattern across the codebase

- Kategoria: Refactor

```text
migrate everything from {from} to {to}: identify every place that needs to change, then make the changes
```

Pelda: `migrate everything from the old logging API to the structured logger: identify every place that needs to change, then make the changes`

Miert mukodik: Describe the old pattern and the new one. Asking Claude to identify every place first means the call sites are listed in the response, so you can check none were missed. For a migration across many files, run [/batch](/docs/en/commands). Claude splits the work into units for you to approve, then background subagents make the changes and open one pull request per unit.

Forras: Common workflows

### Port code to another language

- Kategoria: Refactor

```text
port {source} to {target}, keeping the same {keep}
```

Pelda: `port this Python module to Rust, keeping the same public API and test behavior`

Miert mukodik: Say what to preserve, not just the target language. Naming the API or behavior that must stay the same gives Claude a contract to check the port against.

Forras: How Anthropic teams use Claude Code

### Optimize against a measurable target

- Kategoria: Refactor · Szerepkor: Data

```text
optimize {target} to bring {metric} from {current} down to under {goal}
```

Pelda: `optimize the search query to bring p95 latency from 2s down to under 500ms`

Miert mukodik: Stating the metric and target gives Claude a clear definition of done.

Kovetkezo lepes: Set this as a `/goal` so Claude keeps measuring and iterating toward the number

Forras: Scaling agentic coding guide

### Fix a precise visual bug

- Kategoria: Refactor · Szerepkor: Design

```text
the {element} extends {amount} beyond the {container} on {viewport}. fix it.
```

Pelda: `the login button extends 20px beyond the card border on mobile. fix it.`

Miert mukodik: Precise visual feedback gets a precise fix. State the exact element, measurement, and viewport.

Kovetkezo lepes: Add a preview tool so Claude screenshots and verifies the fix itself

Forras: Scaling agentic coding guide

### Review your changes before you commit

- Kategoria: Review

```text
review my uncommitted changes and flag anything that looks risky before I commit
```

Miert mukodik: Catch problems while they're still cheap to fix. Claude reads the changed files in full, not just the diff lines, so it spots issues a quick self-review misses.

Kovetkezo lepes: Run `/code-review` for the same check in one command

Forras: Common workflows

### Review a pull request

- Kategoria: Review

```text
review PR #{pr} and summarize what changed, then list any concerns
```

Pelda: `review PR #247 and summarize what changed, then list any concerns`

Miert mukodik: Claude reviews with the whole codebase in context, not just the diff. It reads the changed code and what it calls, so it catches problems a diff-only review would miss.

Kovetkezo lepes: Run `/code-review <pr#>` in one command, or turn on Code Review for every PR

Forras: Common workflows

### Review infrastructure changes before applying

- Kategoria: Review · Szerepkor: Security, Ops

```text
here is my Terraform plan output. what is this going to do, and is anything here going to cause problems?
```

Miert mukodik: Plan output is dense and hard to scan. Pasting it gets you a plain-language summary of what's actually going to change before you apply it.

Forras: How Anthropic teams use Claude Code

### Run a security review with a subagent

- Kategoria: Review · Szerepkor: Security

```text
use a subagent to review {path} for security issues and report what it finds
```

Pelda: `use a subagent to review src/api/ for security issues and report what it finds`

Miert mukodik: A [subagent](/docs/en/sub-agents) runs the audit in its own context window and reports back a summary, so a long security review doesn't fill up your main session. The built-in general-purpose subagent handles this without extra setup.

Kovetkezo lepes: Set up a dedicated security-review subagent your whole team can use

Forras: Best practices

### Catch issues before formal review

- Kategoria: Review · Szerepkor: Marketing, Docs

```text
review {file} for {concerns} and list anything I should fix before it goes to {reviewer}
```

Pelda: `review launch-post.md for unsupported claims, missing attributions, and brand-guideline issues and list anything I should fix before it goes to legal`

Miert mukodik: Get a first pass before a human spends time on it. Name the concerns you want checked so the review is focused, then fix what it finds and send a cleaner draft.

Kovetkezo lepes: Capture your review checklist as a skill your whole team can run

Forras: How Anthropic uses Claude in Legal

### Course-correct a wrong approach

- Kategoria: Steer

```text
that is not right: {feedback}. try a different approach
```

Pelda: `that is not right: the function signature needs to stay backward-compatible. try a different approach`

Miert mukodik: Name the constraint Claude missed, not just that it's wrong. A specific reason gives Claude a concrete constraint to satisfy on the retry, instead of guessing again.

Kovetkezo lepes: Press `Esc` twice to open the rewind menu and restore code and conversation so the retry starts clean

Forras: Best practices

### Narrow the scope of a change

- Kategoria: Steer

```text
that is too much. keep only the changes to {scope} and undo your other edits
```

Pelda: `that is too much. keep only the changes to the validation logic in src/forms/ and undo your other edits`

Miert mukodik: When the direction is right but the change went too broad, ask Claude to keep part of it rather than rewinding everything. A stated boundary keeps a small fix from becoming a refactor.

Forras: Best practices

### Turn a correction into a rule

- Kategoria: Steer

```text
you keep {mistake}. add a rule to CLAUDE.md so this stops happening
```

Pelda: `you keep using default exports when this project uses named exports. add a rule to CLAUDE.md so this stops happening`

Miert mukodik: A correction in chat isn't shared with your team. A rule in the project's [CLAUDE.md](/docs/en/memory) is shared once you commit it, and Claude reads it at the start of every session.

Kovetkezo lepes: Open `/memory` to review what Claude wrote

Forras: Best practices

---

## Ship — review, git, release

### Resolve merge conflicts

- Kategoria: Git

```text
resolve the merge conflicts in this branch and explain what you kept from each side
```

Miert mukodik: Say what state you want, not which markers to keep. Asking for the reasoning makes the merge reviewable instead of a black box.

Forras: Common workflows

### Commit with a generated message

- Kategoria: Git

```text
commit these changes with a message that summarizes what I did
```

Miert mukodik: Let Claude derive the message from the diff. It matches your repository's existing commit style.

Forras: Common workflows

### Open a pull request from a ticket

- Kategoria: Git

```text
find the {tracker} ticket about {topic} and open a PR that implements it
```

Pelda: `find the Linear ticket about the login timeout and open a PR that implements it`

Miert mukodik: Skip the context switch between tracker, editor, and GitHub. One prompt reads the spec, makes the change, and opens the PR.

Forras: Common workflows

### Draft release notes from git history

- Kategoria: Release · Szerepkor: PM, Docs, Marketing

```text
compare {from} to {to} and draft release notes grouped by feature, fix, and breaking change
```

Pelda: `compare v2.3.0 to v2.4.0 and draft release notes grouped by feature, fix, and breaking change`

Miert mukodik: Give two reference points and the structure you want. Claude reads the commit log between them and drafts a changelog you can edit.

Kovetkezo lepes: Save this as a `/changelog` skill

Forras: Common workflows

### Write a CI workflow

- Kategoria: Release · Szerepkor: Ops

```text
write a GitHub Actions workflow that {steps} on every push to {branch}
```

Pelda: `write a GitHub Actions workflow that runs the tests and deploys to staging on every push to main`

Miert mukodik: Describe when it should run and what it should do; the YAML is generated for you, matched to your project's build and test commands.

Forras: Common workflows

---

## Operate — üzemeltetés, debug, adat, automatizálás

### Find and fix a failing test

- Kategoria: Debug

```text
the {test} test is failing, find out why and fix it
```

Pelda: `the UserAuth test is failing, find out why and fix it`

Miert mukodik: Describe the symptom; you don't need to know which file is broken. Claude runs the test to see the failure, traces it into source, and fixes it.

Forras: Common workflows

### Investigate a reported error

- Kategoria: Debug · Szerepkor: Ops

```text
users are seeing {symptom} on {where}. investigate and tell me what is going on
```

Pelda: `users are seeing 500 errors on /api/settings. investigate and tell me what is going on`

Miert mukodik: Describe the symptom and location; Claude reads the relevant code path and traces likely causes. Paste stack traces or logs if you have them.

Kovetkezo lepes: Put a deeplink in your runbook that opens Claude with this prompt pre-filled

Forras: Common workflows

### Fix a build error at the root

- Kategoria: Debug · Szerepkor: Ops

```text
here is a build error. fix the root cause and verify the build succeeds
```

Miert mukodik: Asking for root cause and verification prevents surface-level patches that suppress the error without fixing it.

Forras: Best practices

### Investigate a production incident

- Kategoria: Incident · Szerepkor: Ops, Security

```text
{symptom}. check the logs, recent deploys, and config changes, then tell me the most likely cause
```

Pelda: `the checkout endpoint started returning 500s an hour ago. check the logs, recent deploys, and config changes, then tell me the most likely cause`

Miert mukodik: List the evidence sources to correlate, not the steps to take. Claude reads logs, git history, and config together to narrow the cause.

Kovetkezo lepes: Connect Sentry or your log store via MCP

Forras: Common workflows

### Diagnose from a console screenshot

- Kategoria: Incident · Szerepkor: Ops, Data

```text
here is a screenshot of {console}. walk me through why {resource} is failing and give me the exact commands to fix it
```

Pelda: `here is a screenshot of the GCP Kubernetes dashboard. walk me through why this pod is failing and give me the exact commands to fix it`

Miert mukodik: Cloud consoles show you the problem but not the commands to fix it. Claude reads the screenshot and translates the dashboard into the kubectl, gcloud, or aws commands to run.

Forras: How Anthropic teams use Claude Code

### Query logs in plain English

- Kategoria: Incident · Szerepkor: Security, Ops, Data

```text
show me all {events} for {scope} over {timeframe}. write the query, run it, and tell me what stands out
```

Pelda: `show me all failed logins for the auth service over the past 24 hours. write the query, run it, and tell me what stands out`

Miert mukodik: Ask the question instead of writing the SQL. Claude builds the query, runs it against your connected logs, and shows both the query and the result so you can check what ran.

Forras: How Anthropic uses Claude in Cybersecurity

### Analyze a data file

- Kategoria: Data · Szerepkor: Data, PM, Marketing

```text
read {file}, summarize the key patterns, and write the results to {output}
```

Pelda: `read @reports/q1-signups.csv, summarize the key patterns, and write the results to an HTML page with charts, then open it in my browser`

Miert mukodik: A one-off question doesn't need a one-off script. Point at a file in your project folder and Claude reads it directly, finds the patterns, and writes the output where you ask.

Kovetkezo lepes: Connect the data source via MCP instead of exporting files

Forras: How Anthropic teams use Claude Code

### Generate variations from performance data

- Kategoria: Data · Szerepkor: Marketing, Data

```text
read {file}, find the underperforming {items}, and generate {n} new variations that stay under {limit} characters
```

Pelda: `read @ads-performance.csv, find the underperforming headlines, and generate 20 new variations that stay under 90 characters`

Miert mukodik: State the constraint at the start so generation stays within the limit. Claude reads the metrics, picks what to replace, and produces alternatives that fit.

Kovetkezo lepes: Connect the ad platform via MCP instead of exporting a file

Forras: How Anthropic teams use Claude Code

### Turn a recurring task into a skill

- Kategoria: Automate

```text
create a /{name} skill for this project that {steps}
```

Pelda: `create a /ship skill for this project that runs the linter and tests, then drafts a commit message`

Miert mukodik: Name the steps once; reuse them as a command. Claude writes a [skill](/docs/en/skills) anyone on your team can run.

Forras: Common workflows

### Add a hook for repeat behavior

- Kategoria: Automate

```text
write a hook that {action} after every {event}
```

Pelda: `write a hook that runs prettier after every edit to a .ts or .tsx file`

Miert mukodik: Hooks make a behavior automatic instead of something you have to remember to ask for. Describe the trigger and action and Claude writes the [hook](/docs/en/hooks) configuration.

Forras: Best practices

### Connect a tool with MCP

- Kategoria: Automate

```text
set up the {server} MCP server so you can read my {data} directly
```

Pelda: `set up the Sentry MCP server so you can read my error reports directly`

Miert mukodik: Connect the source once instead of pasting data every session. After [MCP](/docs/en/mcp) setup, Claude reads from the tool directly when you ask about it.

Forras: Common workflows

### Capture what to remember for next time

- Kategoria: Automate · Szerepkor: PM, Docs

```text
summarize what we did this session and suggest what to add to CLAUDE.md
```

Miert mukodik: Ask before you forget. Claude knows what it had to figure out this session and proposes [CLAUDE.md](/docs/en/memory) entries so the next session starts with that context.

Forras: How Anthropic teams use Claude Code
