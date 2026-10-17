# Standing instructions

Read at the start of every session. These are not suggestions.

## Read these three files before doing anything

1. `DESIGN.md` — every visual decision, already made
2. `tokens.css` — the only source of colour, type, spacing, motion values
3. `BUILD-BRIEF.md` — what to build, in what order, and the gates

## When a skill and this project's files disagree

Read the Precedence section at the top of `DESIGN.md`. Short version:

facts and client instructions first, then the skill, then this project's
aesthetic preferences — and those only where a reason is stated that the
skill could not have known.

**An override without a stated reason is a preference. Follow the skill.**

This applies **inside an approved plan**, to questions of pure craft — how
to set a headline, how to space a row, which of two valid treatments to
use. On those, follow the skill and report what you did rather than
stopping to ask.

It does **not** mean you may start work without an approved plan. Plan
approval is always required. See the section below.

Facts are different. Never override an accessibility measurement, anything
about what can truthfully be said about Mohamed, or a direct instruction
from Islam or the client.

## Load these skills before the work they govern

Do not work from memory or general judgement where a skill exists. Open the
actual file at the actual path.

| Before writing | Load |
|---|---|
| any CSS | `~/.Codex/skills/impeccable/reference/craft-floor.md` |
| any delivery to Islam | `~/.Codex/skills/taste/core.md` |
| any scroll animation | `~/.Codex/skills/gsap/modules/gsap-scrolltrigger.md` |
| any motion timing | `~/.Codex/skills/motion-design/` |
| any prose for the site | `~/.Codex/skills/stop-slop/SKILL.md` |
| any accessibility check | `~/.Codex/skills/ui-ux-pro-max/` |
| a specific visual effect | `~/.Codex/skills/css-inspiration/INDEX.md` |

**When you load one, say so, and quote the specific rule you are applying.**
Islam cannot read the code to check whether a skill was used. Naming the
rule is how he knows.

If you decide a skill is not needed for a piece of work, say that too, and
why. Silence is not an acceptable answer to "did you use it."

Do not use `threejs` on this site.

## Plan mode, every section, without exception

**Use plan mode.** Before starting any section, layer, page or phase, write
the plan and wait for Islam to approve it. Do not begin on the strength of
a previous approval. Finishing layer 01 does not authorise layer 02.

This is not a formality. Islam cannot read the code, so the plan is the
only point at which he can steer before work exists. Skipping it removes
him from his own project.

The plan must be built **from the skills**, not from your own taste, and
must say:

1. **What is being built** — content, in what order
2. **The design direction** — layout, hierarchy, spacing, how it differs
   from the section above it, and **which skill rule drove each choice**
3. **Motion intent** — what will eventually be animated here, what will
   not, and why. Write this even though Phase 1 builds nothing animated.
   Islam wants to approve the motion plan early and see it built later.
4. **What you are unsure about** — with options and a recommendation

Short. Prose and a sketch, not a document.

## On design and style, your preference does not count

When choosing how something looks, you follow `impeccable`, `taste` and
`ui-ux-pro-max`. Not your own judgement, not what seems reasonable, not a
pattern you have seen elsewhere.

State which rule you applied. If the skills are silent on a question, say
so, then decide and name it as your decision so Islam knows it was
unguided.

The exceptions are the facts in the Precedence section above: accessibility
measurements, what can truthfully be said about Mohamed, and direct
instructions from Islam or the client.

## Check your work against the banned list before showing it

`DESIGN.md` has a banned list. Read it and check the rendered page against
it before every delivery, item by item. An eyebrow label reached a
screenshot once already because this check was skipped.

## Motion distances are NOT spacing tokens

Reading travel distance from `--s-1` and `--s-2` produced 8px and 16px
moves. At that distance nothing appears to travel — the eye sees only the
fade, and the result reads as cheap pop-in. Islam rejected it on sight.

Motion distance is a motion decision. Take it from `motion-design` and
`impeccable/reference/animate.md`, size it to the element, and put the
values in `tokens.css` as motion tokens. A display headline and a caption
do not travel the same distance.

Entrances must not all be the same. `craft-floor`: *"one authored moment,
not scattered effects and not one identical entrance on every section."*
One fade-and-rise applied to every block is the thing that rule forbids.

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
