# Design decisions — Mohamed Elsaid

Decision record. If something here conflicts with an older document, this
wins. Machine values live in `tokens.css`; this file explains why.

Last changed: 18 August 2026.

---

## Palette: 02 Petrol — CONFIRMED

Chosen by Islam from five candidates on 18 August 2026.

| Role | Value |
|---|---|
| Grounds 1–3 (light) | `#F7F7F5` · `#EDEFEC` · `#DDE3E0` |
| Grounds 4–5 (dark) | `#14312F` · `#08191A` |
| Accent on light | `#0E5A5E` |
| Accent on dark | `#5FC7C2` |

**Why petrol.** It reads as infrastructure — cooling, datacenters, deep
technical work — without being literal about it. It is calm at volume,
which suits someone who is not selling. And it is uncommon: consultancies
own blue, startups own purple, almost nobody owns deep teal.

**Why not orange.** Two independent reasons, either sufficient:

1. `#FF5C33` scores **2.95:1** on an off-white ground. That is below the
   3:1 minimum for large text and nowhere near the 4.5:1 for body. On a
   light site it is unreadable, not merely unfashionable.
2. Islam's own brand is dark, orange and white. Mohamed's site in that
   palette would look like Islam's studio rather than like Mohamed.

**Why light.** The previous build used five shades of near-black separated
by a few percent of luminance. Mohamed looked at five distinct sections
and asked for the page to "be in sections" — he could not see the ones
that existed. Light gives a usable range. The ground-3 to ground-4 step is
**10.7:1**: impossible to miss, on any screen, in any light.

---

## Concept: The Stack — UNCHANGED

Scrolling down is descending the technology stack. Five layers, business
outcome at the top, silicon at the base.

| Layer | Name | Ground | Character |
|---|---|---|---|
| 01 | Outcome | light | Large, plain language. A reader stops here. |
| 02 | Advisory | light | The commercial story, sectors served. |
| 03 | Platform | light | Three focus areas in depth. |
| 04 | Research | dark | Publications. |
| 05 | Silicon | darkest | Densest. Patents, career, education. |

Type gets smaller and content gets denser at every level. The colour now
descends with it, so the concept is visible rather than explained.

---

## Structure

- **Fixed navigation at the top** with links to each section. Requested by
  Islam, 18 August. The previous build had no navigation at all and relied
  entirely on scrolling.
- **Hard rules between sections.** The ground change carries the boundary,
  a rule confirms it. Sections must not appear to bleed into one another.
- **Real pages** for the full publication record and the full CV. Not
  dead "view full record" links.

### Portrait treatment — CONFIRMED 18 August

**The portrait is not in a box.** No frame, no border, no rectangle, no
circle. Islam's words: *"this is not a national ID."*

The subject is cut out and sits directly on the ground colour, so the
figure reads as part of the page rather than as an image pasted onto it.
Where the body meets the lower edge of its area it fades into the ground
rather than stopping at a hard line.

Two acceptable implementations, in order of preference:

1. **Cut-out.** Background removed, transparent PNG or WebP, placed on the
   ground colour. Requires a clean matte — check the edges at 200% zoom.
   A halo or a jagged shoulder line is worse than not doing it.
2. **Masked fade.** If the source will not matte cleanly, keep the
   photographic background but mask the image into the ground with a
   gradient at the base and sides. Reads as merged, far more forgiving.

Do not reproduce the reference template's coloured frame around the
subject. The cut-out is the part worth taking from it; the purple rectangle
is not.

### Section layouts — approved in principle, not yet finally signed off

- **Expertise** — three large numbered rows with real explanatory
  sentences, plus a quiet "Also" line. *Not* a grid of eight cells.
- **Patents** — granted patent as a feature panel with a bordered badge;
  three filings as a catalogue list below.
- **Career** — vertical spine grouped by employer, roles nested beneath.
- **Education** — three staggered columns, rule above each, year, degree,
  real description. Certifications as inline chips.

These four internal layouts went through many rounds and stand. What is
**not** yet signed off is the page-level composition — how the sections sit
together and read as a sequence.

Islam has been explicit: he cannot judge the layout until the hard
boundaries between sections and the fixed top navigation are both in place,
because those are the two things that make the sections legible as separate
units. Until then the page reads as one continuous surface and any verdict
on it is premature.

**Therefore:** Phase 1 sign-off is provisional. Final confirmation of the
layout happens at the end of Phase 2, with boundaries and navigation
present. Expect adjustment at that point and do not treat Phase 1 approval
as final.

---

## Motion

One easing curve, three durations. See `tokens.css`.

**The authored moment is the descent** — the ground shifting beneath the
reader as they scroll from business language into silicon. GSAP
ScrollTrigger drives it. Everything else stays quiet so that this reads.

Scattered effects on every section is the failure mode. One moment, done
properly, beats six done adequately.

**Reveal safety net is mandatory.** Anything animating from invisible must
be forced visible if its trigger does not fire:

```js
function revealAll(){
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}
if (!('IntersectionObserver' in window)) revealAll();
window.addEventListener('load', () => setTimeout(revealAll, 2500));
setTimeout(revealAll, 6000);
```

`prefers-reduced-motion` is respected. Already handled in `tokens.css`.

---

## Banned

- Gradient background washes, particle or dot fields
- Gradient text — emphasis comes from weight or size
- **Eyebrow or kicker labels above headings.** Banned by the original
  brief and independently by `impeccable`'s craft floor. The heading
  carries itself.
- The hero-metric template: big number, small label, supporting stats
- Em-dashes in copy
- Emoji, and unicode glyphs standing in for icons
- Fraunces, Instrument Serif — flagged as AI-default serifs
- Navy and brass — earlier rejected palette
- Orange, for the reasons above
- Rounded corners anywhere
- Decorative geometry: floating triangles, confetti, half-circles. This is
  what marks the reference template Mohamed sent as a bought theme.

Section numbers (01/02/03) **are** allowed here. `impeccable` permits them
where the sequence carries information the reader needs. In The Stack it
does — the numbers are the concept.

---

## Content rules

Everything on the site must be verifiable from his CV.

**Do not claim:** "technology executive", "nearly two decades",
board-readiness, or any board seat. His actual role is a senior individual
contributor. Documents in this folder produced by the fraudulent recruiter
say otherwise and are unreliable. A recruiter checking LinkedIn would
catch the mismatch in seconds.

The site may *feel* senior. It must not *claim* seniority he cannot evidence.

**Do not include:** date of birth, marital status, number of children,
nationality. Egyptian CV conventions that read badly in Germany.

### Still outstanding from Mohamed

1. Real figure for the `000` placeholder — enterprise engagements advised
2. Additional credibility numbers (requested 18 Aug)
3. A high-resolution photograph with no AI watermark. The current image
   was cropped to remove one, so it cannot be enlarged. A large portrait
   was his own first request and it is blocked until this arrives.
4. Domain name — `mohamed@elsaid.de` is currently invented
5. What he can say about Intel work under NDA
6. Intel's policy on personal websites and public writing

---

## Working rules

- Render the page in a real browser and look at a screenshot before
  showing Islam anything. Check 1440px and 390px every time.
- Check the rendered result, not the code. Six earlier versions were
  declared finished without anyone looking at them.
- Explain in plain business language. Islam is building this to teach it.
- Show, don't describe. He has said repeatedly he cannot picture things
  from text.
