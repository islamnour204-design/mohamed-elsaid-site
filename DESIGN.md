# Project constraints — Mohamed Elsaid

Rewritten 18 August 2026, and deliberately made much shorter.

An earlier version of this file prescribed layouts, motion philosophy and
section structures. Most of that was not approved by Islam and was not
drawn from any skill — it was one writer's preference wearing the costume
of a rule, and it was blocking better work.

**This file now contains only two things: facts, and instructions Islam or
the client actually gave.** Everything about how the site looks and moves
is decided by `impeccable`, `taste`, `ui-ux-pro-max`, `motion-design`,
`gsap` and `css-inspiration`.

---

# PART A — FIXED

Do not override anything in this part. These are facts, measurements, or
direct client instruction. No skill can know them.

## A1. Palette — chosen by Islam from five candidates

Machine values in `tokens.css`. Do not edit them without telling him.

| Role | Value |
|---|---|
| Grounds 1–3 (light) | `#F7F7F5` · `#EDEFEC` · `#DDE3E0` |
| Grounds 4–5 (dark) | `#14312F` · `#08191A` |
| Accent on light | `#0E5A5E` |
| Accent on dark | `#5FC7C2` |

Two accent values because one cannot serve both ends. Cream on petrol
passes at 6.8:1; dark text on petrol fails at 2.3:1 — never do it.

**Orange is banned.** `#FF5C33` measures 2.95:1 on off-white, below the
minimum even for large text. It is also Islam's own brand colour, and
Mohamed's site must not look like Islam's studio.

## A2. Content — truth, not taste

Everything on the site must be verifiable from his CV.

**Never claim:** "technology executive", "nearly two decades",
board-readiness, or any board seat. His role is a senior individual
contributor.

The CV, bio and dossier in this folder were produced by a genuine and
well-regarded executive search professional, whose identity Islam and
Mohamed have confirmed. **He will review this site.** Those documents
position Mohamed aspirationally, which is ordinary for a private search
dossier. A public website is different: anyone can check it against
LinkedIn in ten seconds. The site may *feel* senior; it must not *claim*
seniority he cannot evidence.

**Never include:** date of birth, marital status, number of children,
nationality. Egyptian CV conventions that read badly in Germany.

**Never ship:** the `000` placeholder, or `mohamed@elsaid.de`, which is
invented. Enforced by the build check.

**Copy source:** `elsaid-stack.html`. The words are accurate and approved.
Port them. The *layout* of that file is not approved — see Part B.

## A3. Accessibility — measured, not argued

Body text 4.5:1 minimum. Large text 3:1. Tap targets 44px. Focus visible
on every interactive element. `prefers-reduced-motion` honoured.

These are floors. Nothing overrides them, including a client request.

## A4. Instructions Islam and Mohamed gave directly

- **Bright palette.** Dark did not reflect Mohamed's character.
- **Portrait cut out, merged into the ground.** No frame, no box, no
  circle. Islam: *"this is not a national ID."*
- **Fixed navigation at the top** with clickable section links.
- **Hard, visible boundaries between sections.** Mohamed could not tell
  the sections apart. Islam: they must not *"merge together like a
  watercolour painting."*
- **The hero must be animated.** Islam, 18 August, rejecting an earlier
  instruction in this file: it is what the client sees first, it must land
  hardest, it is the hook. Supported by `impeccable` animate.md
  ("motion may carry the voice") and `taste`'s Kinetic-Type Hero.
- **The figures animate too.** Placeholder values now, real ones when
  Mohamed sends them.
- **Space to breathe is wanted.** Mohamed asked for "less empty space";
  Islam wants the page to breathe. Both are satisfied by space that frames
  something. Neither is satisfied by a gap where content ran out.

## A5. Still outstanding from Mohamed

1. Real figure for `000`
2. Further credibility numbers
3. High-resolution photograph without an AI watermark
4. Domain name
5. What he can say about Intel work under NDA
6. Intel's policy on personal websites

---

# PART B — OPEN

**Design and motion are yours, decided from the skills.**

## B1. The organising idea

Scrolling down descends a technology stack. Five layers: Outcome,
Advisory, Platform, Research, Silicon. Business language at the top,
silicon at the base. The palette is built around it — three light grounds,
then dark.

The idea stands. **How it is expressed visually is open.**

## B2. What the earlier version of this file wrongly fixed

All of the following are now released to the skills:

- Section layouts. `elsaid-stack.html` is a **content source, not a
  design**. Its arrangements were never signed off. If `impeccable` or
  `taste` produce something better, build that and say what you changed.
- Motion philosophy. This file previously ruled out entrance animation and
  assigned the single focal moment to the descent. Neither came from a
  skill. `impeccable/reference/animate.md`, `motion-design` and `gsap`
  own motion now.
- Density rules, type rhythm, spacing, hierarchy, layout families.
- Anything about "one authored moment" — read the skill, not this file.

## B3. Banned, and why

Only items with a reason survive here. Everything else is enforced by the
skills themselves and does not need repeating.

- **Orange** — see A1
- **Navy and brass** — an earlier palette Islam rejected
- **Decorative geometry** — floating triangles, confetti, half-circles.
  This is what marks the template Mohamed sent as a bought theme, and
  avoiding it is the point of the exercise.
- **Rounded corners** — SUPERSEDED 18 October 2026 (v5): Islam overrode the old `--radius: 0` rule. One token, `--radius: 8px`, for buttons, cards, the diagram panel and the portrait panel; section boundaries, rules, photos and logos stay straight. Enforced by tools/check.mjs (a radius must come from the token).
- **Em-dashes in copy** — enforced by the build check

## B4. The standard

The site must not look like a template. It is reviewed by a well-regarded
search professional and by an Intel infrastructure engineer who will read
the source.

Use the skills to make something distinctive. That is the whole reason
they were installed. Competent and forgettable is a failure.

---

## Working rules

- Render in a real browser and look at it before saying it is done.
  1440px and 390px, every time.
- Plan mode before every section. Islam cannot read code; the plan is the
  only place he can steer.
- Name the skill rule behind each design choice. Where the skills are
  silent, say so and flag the decision as your own.
- Plain business language. Islam is learning this to teach it.
