# Build brief — for Claude Code

You are building a personal site for Dr. Mohamed Esameldin Elsaid.

The owner of this project is **Islam Nour**. He is a business owner, not a
programmer. Explain what you are doing in plain language as you go — he is
building this partly to learn how websites get made. When a step needs the
terminal, give him the exact text to type. Never assume coding knowledge.

**Read `DESIGN.md` and `tokens.css` before anything else.** Every visual
decision is already made and recorded there. Do not relitigate them.

---

## 0. The one rule that matters more than the rest

**Render the page in a real browser and look at it before saying it is done.**

A previous session wrote six versions of this site without ever viewing one.
Every version was wrong in ways a single screenshot would have caught.

Reading the code is not looking at the page. Code that reads perfectly
renders as an empty box more often than you would expect — there is a
documented case of exactly that below.

Check **1440px** and **390px** every time. If you cannot produce a
screenshot, say so plainly rather than guessing.

---

## 1. Who this is for

Dr. Mohamed Elsaid. Senior Cloud and AI Infrastructure Solutions Specialist
at Intel, Munich. Doctorate from the Hasso-Plattner Institute. Four US
patents, thirteen publications, sixteen years across Dell EMC and Intel.

**He is employed and not job-hunting.** This site is for visibility,
credibility and inbound opportunities — speaking, research collaboration,
advisory. It is not a job application and must not read as one.

Content constraints, including what must never be claimed, are in
`DESIGN.md` under *Content rules*. Read them. They are not stylistic
preferences; one of them exists because he was defrauded by someone
impersonating a US executive recruiter, and the documents in this folder
that describe him as a "technology executive" who is "Board Ready" came
from that fraud. They are unreliable. His CV is the only source of truth.

---

## 2. Stack

**Vite, vanilla HTML/CSS/JS, GSAP.** No framework.

Reasons: this is three static pages with one substantial scroll
interaction. React would add a dependency tree and a mental model for
Islam to learn without buying anything the site needs. Vite gives the real
build step that was missing before — npm packages, multiple pages,
optimised images, a dev server with hot reload.

Astro is a reasonable alternative if you find multi-page routing awkward.
Do not switch to React.

```
/src
  index.html          Layer 01–05, the main page
  publications.html   Full publication record
  cv.html             Full CV
  /styles
    tokens.css        already written — do not edit values
    base.css
    layers.css
  /scripts
    main.js
    scroll.js         GSAP ScrollTrigger
  /assets
    /img
```

Initialise Git at the start and commit at every phase gate below. Islam
needs to be able to roll back a bold experiment without losing the good
version.

---

## 3. Skills

These are installed. Use them; do not summarise or work from memory.

| Skill | When |
|---|---|
| `impeccable` | Lead design direction. Read `reference/craft-floor.md` before writing CSS. |
| `taste` | Read `core.md`. Run its checks before every delivery. |
| `ui-ux-pro-max` | Contrast, tap targets, focus states, spacing. Its `design-system` module has an HTML token validator — use it. |
| `gsap` | ScrollTrigger. Read the scrolltrigger module before writing scroll code. |
| `motion-design` | Timing and choreography. |
| `css-inspiration` | Consult `INDEX.md` when a specific effect is needed. |
| `stop-slop` | Any prose written for the site. |

`superpowers` is installed. Let its planning and
verification-before-completion skills run — this project failed previously
from work being declared finished without checking.

Do not use `threejs` on this site. A rotating 3D object on a research
engineer's page reads as decoration, and both `impeccable` and `taste`
treat motion that draws attention to itself as a failure.

---

## 4. Build order

Each phase ends at a gate. **Do not start the next phase until the gate
passes and Islam has seen a screenshot.**

### Phase 1 — Structure and content, no motion

Port the content from `elsaid-stack.html` (the reference build in this
folder — copy is accurate, reuse it) into the new structure. Apply
`tokens.css`. Build all five layers with the approved section layouts
listed in `DESIGN.md`.

No animation at all in this phase. Static page, correct content, correct
colour, correct type.

**Use the existing photograph, not a grey box.** Extract the base64 image
out of `elsaid-stack.html` into a real file in `/assets/img` and use it
from Phase 1 onward. The watermark and the crop are acceptable for now —
Islam has decided that a real face helps Mohamed review the page and a grey
rectangle does not. Phase 5 replaces the file; nothing else has to change.

Apply the portrait treatment from `DESIGN.md`: **cut out, no frame, merged
into the ground.** Not a box, not a circle. If the current image will not
matte cleanly, use the masked-fade fallback described there and say which
one you used.

**Gate:** screenshots at 1440 and 390. No raw hex codes anywhere in the
CSS — every colour reads from a token.

Phase 1 approval is **provisional**. Islam cannot judge the composition
until Phase 2 adds boundaries and navigation. Do not record Phase 1
sign-off as final agreement on the layout.

### Phase 2 — Navigation and boundaries

Fixed navigation at the top with links to each of the five sections, plus
Publications and CV. Active section indicated as you scroll.

Hard rules between sections. Islam's words: sections currently "feel like
they are merging together, like a watercolour painting." The ground change
carries the boundary; a rule confirms it.

**Gate:** screenshots at both widths. Nav must work by keyboard.

### Phase 3 — The descent

This is the single authored moment of the page and the main reason this
project moved into Claude Code. GSAP ScrollTrigger drives the ground
shifting beneath the reader as they descend from business language into
silicon.

Islam asked three separate times for content to **flow** between sections
rather than each section appearing at once. Build that.

Everything else stays quiet. Scattered effects on every section is the
failure mode; one moment done properly beats six done adequately.

Implement the reveal safety net from `DESIGN.md`. It is mandatory.

**Gate:** screenshots at five scroll positions. Test with
`prefers-reduced-motion: reduce` enabled and confirm the page is still
fully readable.

### Phase 4 — Real pages

`publications.html` — the full thirteen-paper record.
`cv.html` — the full CV.

Replace every dead "view full record" link with a real one.

**Gate:** screenshots of both, both widths.

### Phase 5 — Images

Real optimised image files in `/assets/img`. Not base64 stuffed into the
HTML, which is what the previous build did.

WebP with a fallback, correct dimensions, `width` and `height` attributes
set so the page does not jump while loading.

**Swap in the better portrait** once Mohamed sends a high-resolution
original. The Phase 1 image is the old one, watermark and all, used
deliberately so the page could be reviewed with a real face on it. It
cannot be enlarged without showing damage, so a large portrait depends on
the new file arriving. Keep chasing it; do not silently ship the old one at
a size it cannot carry.

Whichever file is in use, the treatment stays the same: cut out, no frame,
merged into the ground. See `DESIGN.md`.

Portrait cropping must be driven by the subject's bounding box, never a
fixed aspect ratio, or heads get cut off.

**Gate:** Lighthouse performance check. Screenshots.

### Phase 6 — Review

Run all of these and report findings before fixing:

1. `taste` pre-flight checks
2. `impeccable/reference/critique.md`
3. `ui-ux-pro-max` — contrast, focus states, tap targets, keyboard path
4. `/security-review`

Mohamed is an AI infrastructure engineer at Intel. He will read the source.
Islam cannot catch a security or code-quality problem himself, and is
relying on this pass to find them first.

**Gate:** all four reports shown to Islam.

### Phase 7 — Deploy

Discuss hosting with Islam before doing anything. The domain is not yet
decided — `mohamed@elsaid.de` is currently invented.

---

## 5. Bugs already found — do not reintroduce

**Clip-path reveals fail silently.** A patent panel animated with
`clip-path: inset(0 100% 0 0)` rendered as an empty box in a real browser
because the scroll trigger never fired. It looked correct in preview.
Prefer opacity and transform.

**Hover effects must animate `transform`,** never `padding` or `margin`,
which force the browser to re-lay-out the page on every mouse movement.

**The depth gauge label overlapped body text.** In the reference build the
current layer's label sits permanently at opacity 1, 72px from the right
edge, on top of the paragraph. This was explicitly rejected once already.
Marks flush to the edge; label on hover only.

**Placeholders must not ship.** `000` is still live in the reference
build, as is the invented email `mohamed@elsaid.de`. Fail the build rather
than publish either.

---

## 6. Working with Islam

- He gives clear, specific creative direction. When he says something is
  wrong, it is wrong — find the actual cause rather than defending the work.
- Show, don't describe. He cannot picture things from text and has said so
  repeatedly.
- Explain the reasoning briefly, not at length.
- Do not ask him to repeat instructions. "Use the full skill chain" is
  standing.
- If you are unsure whether something rendered correctly, check. If you
  cannot check, say so.

---

## 7. How to start

```
cd "C:\Users\Access\OneDrive\Desktop\Business\Mohamed essam website"
claude
```

Then: *"Read DESIGN.md, tokens.css and BUILD-BRIEF.md, then plan Phase 1."*

A local preview server is already in use for this project:

```
python -m http.server 8000
```

Vite provides its own dev server once set up, which is better — it reloads
automatically when a file changes.
