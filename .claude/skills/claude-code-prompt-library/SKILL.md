---
name: claude-code-prompt-library
description: Claude Code hivatalos prompt library (52 copy-paste prompt sablon + a 6 promptolasi minta, ami mukodove teszi oket). Hasznald, amikor a felhasznalo azt kerdezi, "hogyan kerjem ezt Claude Code-tol", promptot / sablont / workflow-t ker egy fejlesztoi feladathoz (kodbazis megertes, tervezes, implementalas, teszt, refaktor, code review, git, release, debug, incident, adat, automatizalas), vagy amikor egy megfogalmazott kerest promptta kell alakitani. Triggerek - "prompt library", "milyen promptot", "hogyan kerjem", "sablon prompt", "Claude Code workflow".
---

# Claude Code prompt library

Forras: https://code.claude.com/docs/en/prompt-library (lementve: 2026-09-17).
Teljes szoveg minden prompthoz (slot peldak, "miert mukodik", kovetkezo lepes, forras):
`reference.md` — csak akkor olvasd be, ha konkret promptot keresel vagy adaptalsz.

## A 6 minta, ami a prompteket mukodove teszi

| Minta | Mit jelent | Pelda |
|---|---|---|
| Eredmenyt irj le, ne lepeseket | Mondd meg, mit akarsz; a fajlokat Claude megtalalja | `add rate limiting to the public API and make sure existing tests still pass` |
| Adj onellenorzesi modot | Kerd ugyanabban a promptban a futtatast / tesztet / osszehasonlitast, igy iteral | `write the migration, run it against the dev database, and confirm the schema matches` |
| Mutass referenciat | Nevezz meg meglevo fajlt, tesztet vagy mintat, amit kovetni kell | `add a settings page that follows the same layout as the profile page` |
| Adj merheto celt | Metrika + kuszob, hogy egyertelmu legyen a kesz allapot | `get the bundle size under 200KB and show me what you removed` |
| Add at az artifactot | Hibauzenet, log, screenshot, terv beillesztve vagy `@fajl` hivatkozassal | `why is the build failing? @build.log` |
| Mondd meg a valasz formajat | Formatum, hossz, kozonseg megnevezese (allandositva: output style) | `explain how the payment retry logic works as an HTML page with a diagram, then open it in my browser` |

## Hasznalat

1. Valaszd ki a fazist (Discover / Design / Build / Ship / Operate) es a kategoriat az alabbi tablazatbol.
2. Toltsd ki a `{slot}` reszeket a projekt konkret ertekeivel.
3. Ha egy prompt bevalt: mentsd el skillkent (`/command`), a megtanult konvenciokat pedig a `CLAUDE.md`-be.
4. Nagyobb vagy kockazatosabb valtoztatas elott hasznalj plan mode-ot.

## Prompt index (52)

| Fazis | Kategoria | Cim | Prompt sablon |
|---|---|---|---|
| Discover | Onboard | Get oriented in a new repository | `give me an overview of this codebase: architecture, key directories, and how the pieces connect` |
| Discover | Understand | Explain unfamiliar code | `explain what {path} does and how data flows through it. write it up as {format}` |
| Discover | Understand | Find where something happens | `where do we {behavior}?` |
| Discover | Understand | Check what breaks before you delete | `what would break if I deleted {target}?` |
| Discover | Understand | Trace how code evolved | `look through the commit history of {path} and summarize how it evolved and why` |
| Discover | Understand | Scope a change before you start | `which files would I need to touch to {change}?` |
| Discover | Understand | Ask the codebase a product question | `I am a {role}. walk me through what happens when a user {action}, from the UI down to the result` |
| Design | Plan | Plan a multi-file change before touching code | `plan how to refactor the {target} to {goal}. list the files you would change, but don't edit anything yet` |
| Design | Plan | Draft a spec by interview | `I want to build {feature}. interview me about implementation, UX, edge cases, and tradeoffs until we have covered everything, then write the spec to SPEC.md` |
| Design | Plan | Turn a meeting into tickets | `read {input} and write up the action items, then create a {tracker} ticket for each with acceptance criteria` |
| Design | Plan | Map edge cases before building | `list the error states, empty states, and edge cases for {feature} that the design needs to cover` |
| Design | Prototype | Turn a mockup into a working prototype | `here is a mockup. build a working prototype I can click through, matching the layout and states shown` |
| Design | Prototype | Implement from a screenshot and self-check | `implement this design, then take a screenshot of the result, compare it to the original, and fix any differences` |
| Build | Implement | Follow an existing pattern | `look at how {example} is implemented to understand the pattern, then build {new} the same way` |
| Build | Implement | Generate docs for undocumented code | `find {scope} without {format} comments and add them, matching the style already used in the file` |
| Build | Implement | Add a small, well-defined feature | `add a {endpoint} endpoint that returns {payload}` |
| Build | Implement | Build a small internal tool from scratch | `create a {tool} using HTML, CSS, and vanilla JavaScript, then open it in my browser` |
| Build | Implement | Work an issue end to end | `read issue #{issue}, implement the fix, and run the tests` |
| Build | Implement | Find and update copy across the codebase | `find every place we say "{copy}" or a close variant, show me each one in context, then update them all to "{new}". leave tests and the changelog alone` |
| Build | Implement | Draft a document from past examples | `read the {examples} in {folder} to learn the structure and voice, then draft a new one for {topic}` |
| Build | Test | Write tests, run them, fix failures | `write tests for {path}, run them, and fix any failures` |
| Build | Test | Drive implementation from tests | `write tests for {feature} first, then implement it until they pass` |
| Build | Test | Fill gaps from a coverage report | `read {report} and add tests for the lowest-covered files until each is above {target}%` |
| Build | Refactor | Migrate a pattern across the codebase | `migrate everything from {from} to {to}: identify every place that needs to change, then make the changes` |
| Build | Refactor | Port code to another language | `port {source} to {target}, keeping the same {keep}` |
| Build | Refactor | Optimize against a measurable target | `optimize {target} to bring {metric} from {current} down to under {goal}` |
| Build | Refactor | Fix a precise visual bug | `the {element} extends {amount} beyond the {container} on {viewport}. fix it.` |
| Build | Review | Review your changes before you commit | `review my uncommitted changes and flag anything that looks risky before I commit` |
| Build | Review | Review a pull request | `review PR #{pr} and summarize what changed, then list any concerns` |
| Build | Review | Review infrastructure changes before applying | `here is my Terraform plan output. what is this going to do, and is anything here going to cause problems?` |
| Build | Review | Run a security review with a subagent | `use a subagent to review {path} for security issues and report what it finds` |
| Build | Review | Catch issues before formal review | `review {file} for {concerns} and list anything I should fix before it goes to {reviewer}` |
| Build | Steer | Course-correct a wrong approach | `that is not right: {feedback}. try a different approach` |
| Build | Steer | Narrow the scope of a change | `that is too much. keep only the changes to {scope} and undo your other edits` |
| Build | Steer | Turn a correction into a rule | `you keep {mistake}. add a rule to CLAUDE.md so this stops happening` |
| Ship | Git | Resolve merge conflicts | `resolve the merge conflicts in this branch and explain what you kept from each side` |
| Ship | Git | Commit with a generated message | `commit these changes with a message that summarizes what I did` |
| Ship | Git | Open a pull request from a ticket | `find the {tracker} ticket about {topic} and open a PR that implements it` |
| Ship | Release | Draft release notes from git history | `compare {from} to {to} and draft release notes grouped by feature, fix, and breaking change` |
| Ship | Release | Write a CI workflow | `write a GitHub Actions workflow that {steps} on every push to {branch}` |
| Operate | Debug | Find and fix a failing test | `the {test} test is failing, find out why and fix it` |
| Operate | Debug | Investigate a reported error | `users are seeing {symptom} on {where}. investigate and tell me what is going on` |
| Operate | Debug | Fix a build error at the root | `here is a build error. fix the root cause and verify the build succeeds` |
| Operate | Incident | Investigate a production incident | `{symptom}. check the logs, recent deploys, and config changes, then tell me the most likely cause` |
| Operate | Incident | Diagnose from a console screenshot | `here is a screenshot of {console}. walk me through why {resource} is failing and give me the exact commands to fix it` |
| Operate | Incident | Query logs in plain English | `show me all {events} for {scope} over {timeframe}. write the query, run it, and tell me what stands out` |
| Operate | Data | Analyze a data file | `read {file}, summarize the key patterns, and write the results to {output}` |
| Operate | Data | Generate variations from performance data | `read {file}, find the underperforming {items}, and generate {n} new variations that stay under {limit} characters` |
| Operate | Automate | Turn a recurring task into a skill | `create a /{name} skill for this project that {steps}` |
| Operate | Automate | Add a hook for repeat behavior | `write a hook that {action} after every {event}` |
| Operate | Automate | Connect a tool with MCP | `set up the {server} MCP server so you can read my {data} directly` |
| Operate | Automate | Capture what to remember for next time | `summarize what we did this session and suggest what to add to CLAUDE.md` |
## Kapcsolodo dokumentacio

- Common workflows: https://code.claude.com/docs/en/common-workflows
- Best practices: https://code.claude.com/docs/en/best-practices
- Skills / `/command`: https://code.claude.com/docs/en/skills
- CLAUDE.md memory: https://code.claude.com/docs/en/memory
- Output styles: https://code.claude.com/docs/en/output-styles
- Plan mode: https://code.claude.com/docs/en/permission-modes
- How Anthropic teams use Claude Code: https://claude.com/blog/how-anthropic-teams-use-claude-code
