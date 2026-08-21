# Motion intent — layers 01 to 03

Approved by Islam before Phase 1 was built. **Phase 3 builds this and
nothing beyond it.** If Phase 3 wants something not written here, it goes
back to Islam as a plan first.

Nothing in this document is built yet. Phase 1 ships zero animation.

---

## The thesis

`impeccable/reference/animate.md`:

> "Persuade + Experience: motion may carry the voice. Prefer one rehearsed
> focal sequence to repeated section reveals."

> "The focal moment must come from this product and surface concept. A
> generic fade-and-rise, hover lift, parallax layer, or scroll reveal is
> not a thesis."

So the page gets three things and no more:

1. **One focal sequence** — the hero entrance.
2. **Scroll-driven continuity** — the descent through the grounds.
3. **Quiet feedback** — hover and focus.

Everything else stays still. `animate.md`: *"Do not animate a static area
merely because it exists."*

## The vocabulary is already fixed

`tokens.css` defines one easing curve and three durations, which is
exactly what `motion-design` calls a Brand Motion Identity: one signature
easing, a duration palette, one entrance pattern.

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.16, 1, .3, 1)` | every animation |
| `--d-fast` | 150ms | hover, focus, small state changes |
| `--d-base` | 340ms | reveals, local movement |
| `--d-slow` | 760ms | section-scale movement |

`--ease` is character for character the curve `animate.md` recommends:
*"Use natural deceleration such as `cubic-bezier(0.16, 1, 0.3, 1)` for
confident arrivals."* Nothing new gets invented at Phase 3.

Personality is **Premium** from `motion-design`'s archetype table:
*"elegant, minimal, luxury, sophisticated, 0% overshoot."* No bounce, no
elastic, no overshoot anywhere on this site.

---

## Layer 01 — the focal moment

**The figure rises out of the ground.**

The portrait is a cut-out merged into the ground by a mask gradient. The
entrance animates that existing mask: its stop travels from 0% to 62%, so
Mohamed emerges from the ground colour rather than fading in on top of it.

This is the one material idea on the page, and it exists only because of
this page's portrait treatment. `animate.md`, Choose material by meaning:
*"Reveal and composition: masks, clip paths, cropping, or controlled
occlusion."* And: *"One strong material idea, carried through the focal
sequence and quiet supporting states, is usually enough."*

The type assembles **downward**, in the order the reader will descend the
stack. The direction is the concept.

| Element | Property | Duration | Starts at |
|---|---|---|---|
| layer bar, name | opacity + translateY 8px | `--d-base` | 0 |
| headline line 1 | opacity + translateY 16px | `--d-slow` | 80ms |
| headline line 2 | opacity + translateY 16px | `--d-slow` | 200ms |
| portrait mask | mask stop 0% to 62% | `--d-slow` | 120ms |
| lede | opacity + translateY 12px | `--d-base` | 380ms |
| buttons | opacity + translateY 8px | `--d-base` | 500ms |

Sequence completes at about 1.26s. `animate.md` timing table gives
500–800ms for *"a deliberately authored focal entrance"*, which governs
each element; the total stays short enough not to read as page-load
choreography.

**Safety net.** `animate.md`: *"Keep content visible in the default state
so failed scripts do not hide the page."* Every element is visible by
default. The script adds a class to play the entrance. If the script never
runs, the hero is static and correct — it does not disappear.

---

## Layer 02 — the figures rise from behind their rule

**Not a count-up.** `taste` 5, Motion must be motivated: valid reasons are
hierarchy, storytelling, feedback, state transition; *"Invalid answer: it
looked cool."* A counter animates a number without saying anything about
it.

The figures sit beneath a hairline. That rule becomes a horizon: each
figure is clipped by it and translates up from behind it into place. The
site's whole visual language is boundaries between layers — a direct
instruction in `DESIGN.md` A4, where Mohamed could not tell the sections
apart. A number arriving *from* a boundary is this section's own idea
rather than an effect borrowed from elsewhere.

- Material: mask plus transform. `animate.md`, Reveal and composition.
- Fires once, on enter. `--d-base`, `--ease`.
- 90ms between figures, four figures, 270ms total.
  `animate.md`: *"Sibling stagger is appropriate when a list appears as a
  list. Cap the total delay."* `motion-design` standard stagger budget is
  50–100ms per step and under 400ms total.
- The two placeholder figures animate identically. They cannot reach a
  live site: `tools/check.mjs --release` fails the build while any
  `data-placeholder` exists.

Nothing else in layer 02 moves. Not the heading, not the prose, not the
sector list.

---

## Layer 03 — continuity, not a second focal moment

The descent is scroll-driven and earns it, because the scroll relationship
*is* the concept: scrolling down descends the stack. `animate.md`: *"Use
scroll-driven motion only when the scroll relationship itself carries
meaning, with a robust fallback."*

**Expressed in scroll distance, not time.** An earlier draft of this
specified "0 / 80 / 160ms", which cannot work.
`gsap/modules/gsap-scrolltrigger.md`:

> "With `scrub: true`, the animation progresses as the user scrolls
> through the start–end range."

Inside a scrubbed timeline, position is a fraction of a scroll range. A
millisecond value stretches or vanishes depending on how fast the reader
scrolls. So:

- One scrubbed timeline, `start: "top 80%"`, `end: "top 30%"`.
- The three rows are offset by **20% of that range each**: row 1 over
  0–60%, row 2 over 20–80%, row 3 over 40–100%. The overlap is what makes
  it read as a ripple rather than three separate switches.
- `scrub: 1` gives a one second catch-up lag. This is the only true time
  value in the effect, and it is smoothing, not choreography.

Layer 03 is the last light ground, so this ripple is the lead-in to the
largest contrast step on the page. `taste` 4.11 permits a page to change
theme only as *"one full theme switch with a strong transition"* — earning
that word "strong" is this layer's motion job, and Phase 3 will be judged
on it.

---

## Feedback, all layers

Hover and focus only.

Phase 1 ships these as **instant** state changes with no `transition`
property, because a timed fade would be motion. Phase 3 adds `--d-fast`.

`craft-floor.md` Verify: *"States: hover, disabled, loading, error,
empty."* A state is not an animation.

`BUILD-BRIEF` section 5: hover effects animate `transform`, never
`padding` or `margin`, which force the browser to re-lay-out the page on
every mouse movement.

---

## What never animates

Section headings. Body prose. The sector list. The "Also" line. The layer
bars. Any section entrance of its own.

`animate.md`: *"Do not animate a static area merely because it exists"*
and *"never reinterpret every scrolled section as a staggered list."*

## Reduced motion

Under `prefers-reduced-motion: reduce`: no entrance, no ripple, no rise.
Every element at its final state immediately, page fully readable.
Already enforced in `tokens.css`.

## Known trap

`BUILD-BRIEF` section 5: a patent panel animated with
`clip-path: inset(0 100% 0 0)` rendered as an empty box in a real browser
because the scroll trigger never fired. Nothing in this document uses
`clip-path` for a reveal, and every animated element is visible by
default.

---

# Addendum, 21 August — layer 04, and motion on every block

Islam asked for more animation across the page and chose the strongest
option: bigger moments **and** motion on blocks that were deliberately
static. Where this addendum and the sections above disagree, this wins.

**Stated override.** `animate.md` says *"Prefer one rehearsed focal
sequence to repeated section reveals"* and *"Do not animate a static area
merely because it exists."* The page no longer follows that. It follows a
direct instruction from Islam, which DESIGN.md Part A places above a
skill default. Recorded as an override, not as agreement.

## Layer 04 — the ground arrives

`taste` 4.11 permits a page to change theme once, and only as *"one full
theme switch with a strong transition."* This is that transition.

The section owns `--ground-4`. A light veil covers it and slides up and
away, scrubbed to scroll, so the dark is revealed from the bottom edge
upward. `transform` only, never `clip-path`.

**The veil, not a dark panel.** Built first as a dark panel rising over a
light section background. That works visually and is wrong structurally:
the section's declared background was a transient colour, so every
contrast check read layer 04 as light ink on ground-3 and reported
1.11:1. A pseudo-element painting over a background is invisible to
`getComputedStyle`. The tool was right and the implementation was lying
to it.

**Nothing in layer 04 exists until the ground has arrived.** Measured
with the rise ending at `top 55%`: the heading was already on screen at
viewport y=833 while the transition sat at 49% — light ink on a light
ground, about 1.1:1. So the whole section starts hidden and one timeline,
gated on the transition finishing, brings in the layer bar, heading,
lead, the six papers as a staggered list, and the link.

**The descent does not reverse.** A scrub follows scroll both ways, so
scrolling back up sent the ground light again while the text stayed
revealed. `onLeave` adds a class carrying `!important`, which is the only
thing that outranks GSAP's inline value; `kill()` alone reverts the tween
to its start. Conceptually right too: you do not un-descend a stack.

## Motion on every block, by section family

Each section keeps one material and its blocks use variations of it, and
trigger points are spread from `top 90%` to `top 72%`. It was seven
blocks all crossing `top 88%` that made the page read as flashing.

| Layer | Material | Blocks |
|---|---|---|
| 01 | vertical mask travel | layer bar, name, headline lines, portrait mask, lede lines, sub, buttons; the portrait then drifts slower than the text as the hero leaves |
| 02 | horizontal wipe, and counting | heading; each prose paragraph; the sector items as a staggered list; the figures rise and count |
| 03 | the line draws | the heading wipes as its rules draw; three rules draw; the rows settle on a scrubbed ripple; the Also items follow their label |
| 04 | the ground arrives | the veil, then one gated sequence for everything in the section |

## Contrast, which constrained several of these

A scrubbed effect can be stopped anywhere, so every frame of one is a
resting state a reader can sit in. Two effects were changed because of
this, not because of taste:

- The layer 03 ripple carries **no opacity at all**. Its supporting
  sentence measures 2.49:1 at 0.6 opacity on ground-3 and 4.01:1 at 0.85.
  The shallowest passing fade is about 0.92, which is imperceptible.
- Layer 04's content is gated on the ground rather than fading in
  alongside it.

`tools/measure.mjs` now folds ancestor opacity into every contrast
reading, which is how both were caught.
