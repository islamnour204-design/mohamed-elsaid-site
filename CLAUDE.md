# Standing instructions

Read at the start of every session. These are not suggestions.

## Read these three files before doing anything

1. `DESIGN.md` — every visual decision, already made
2. `tokens.css` — the only source of colour, type, spacing, motion values
3. `BUILD-BRIEF.md` — what to build, in what order, and the gates

## Load these skills before the work they govern

Do not work from memory or general judgement where a skill exists. Open the
actual file at the actual path.

| Before writing | Load |
|---|---|
| any CSS | `~/.claude/skills/impeccable/reference/craft-floor.md` |
| any delivery to Islam | `~/.claude/skills/taste/core.md` |
| any scroll animation | `~/.claude/skills/gsap/modules/gsap-scrolltrigger.md` |
| any motion timing | `~/.claude/skills/motion-design/` |
| any prose for the site | `~/.claude/skills/stop-slop/SKILL.md` |
| any accessibility check | `~/.claude/skills/ui-ux-pro-max/` |
| a specific visual effect | `~/.claude/skills/css-inspiration/INDEX.md` |

**When you load one, say so, and quote the specific rule you are applying.**
Islam cannot read the code to check whether a skill was used. Naming the
rule is how he knows.

If you decide a skill is not needed for a piece of work, say that too, and
why. Silence is not an acceptable answer to "did you use it."

Do not use `threejs` on this site.

## Plan before you build, every time

Before starting any new section, layer, page or phase, write the plan and
wait for Islam to approve it. Do not begin work on the strength of a
previous approval.

A plan is: what you will build, what it will look like, which decisions
you are making, and what you are unsure about. Short. Not a document.

This applies within a phase as well as between phases. Finishing layer 01
does not authorise layer 02.

## Check your work against the banned list before showing it

`DESIGN.md` has a banned list. Read it and check the rendered page against
it before every delivery, item by item. An eyebrow label reached a
screenshot once already because this check was skipped.

## Never invent a value

Every colour, size, space and duration comes from `tokens.css`. If you need
one that is not there, add it to `tokens.css` first and tell Islam what you
added and why. Do not put a raw hex code, a magic pixel value, or an ad-hoc
easing curve into a stylesheet.

If a design question is not answered by `DESIGN.md`, ask. Do not decide it
yourself and carry on.

## Never claim something is done without looking at it

Render it in a real browser. Screenshot 1440px and 390px. Look at the
screenshot. A previous session shipped six versions of this site without
viewing one and every version was wrong.

If you cannot produce a screenshot, say so plainly. Do not substitute a
description of what the code should do.

## Talk to Islam in plain business language

He is a business owner, not a programmer, and is learning this in order to
teach it. Explain what a step does and why. Give exact text to type when
the terminal is involved. Never assume coding knowledge, and never use a
technical term without a short translation.
