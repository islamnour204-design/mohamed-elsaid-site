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
