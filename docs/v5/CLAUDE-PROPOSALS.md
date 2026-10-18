# v5 proposals — Claude (Opus 5.5), written before reading Sol's review

2026-10-18. Live build: https://mohamed-elsaid.pages.dev (commit 0f57aed), checked at 1536x730 and 390x750.
Two tasks: (A) make the whole site better, (B) make the phone version right. Islam's six points are answered first.

## Islam's points: cause and fix
1. **Phone looks bad overall.** The page is about 10,900px tall on a phone (about 15 screens). Each section opens with about 250px of heading, grey subtitle and rule before any content. Career and Research print everything in full. *Fix:* see Task B.
2. **Hero: no symmetry, no dimension.** The portrait is `position:absolute; right:0; bottom:0` against the hero box, not against the content column (site.css:138). On a 1536 screen the text ends at 1292px and the photo runs to 1536px, so the two sides belong to different grids. It is also cut at the bottom of the viewport. On a phone, the photo is pushed right with `margin-left:auto` and the name sits under it, left-aligned (site.css:578). *Fix:* a real two-column hero inside the content column. Copy on the left, vertically centred. Portrait on the right, inside the same right edge as the nav, standing on the hero's bottom rule, with a soft tonal panel behind it for depth (a ground step, not a frame). On a phone: centred, with the portrait on a full-width tonal band, then the name, role and claim centred, and two equal-width buttons.
3. **Research loop lags at the end and the restart.** At 3.3s every step goes un-lit and the picture holds for 2s doing nothing. Then, in one frame, server A snaps back to full, every copied page vanishes and B's label flips (main.js, repeatDelay plus the jumps at time 0). *Fix:* no dead hold and no snap. Step 3 stays lit while the finished state rests about 1.2s. Then a 0.6s reset: B's pages fade out and A brightens back, and round one begins straight after. One continuous motion.
4. **The phone "Menu" box.** A bordered text button, square, the same weight as the logo (site.css:543). *Fix (recommended):* show the section names on the phone as well. A slim second row under the name holds a horizontally scrollable strip: Practice · Focus · Career · Research · Contact | Publications · CV. The current section is underlined and slides into view as you scroll. The Menu button goes away. *Alternative:* a borderless two-line icon that opens a full-screen sheet with large links.
5. **Sharp corners everywhere.** `--radius: 0` is a rule in DESIGN.md ("a house decision, applies site-wide"). Islam now overrides it. *Fix:* a small radius, 6px on buttons and 10px on cards and the diagram panel. Photos and logos stay unframed. It reads finished without looking bubbly. One token, so it is easy to tune.
6. **Duplicate copy** (not raised by Islam, found in the same pass). The AMX proofs-of-concept sentence appears twice, word for word (Focus and Career), and Practice and the Intel role describe the same job twice.

## Task A: the whole site, ranked
| # | Change | Why | Impact | Effort |
|---|---|---|---|---|
| 1 | Hero rebuilt on the content grid (point 2) | First impression; the current one looks unfinished | High | M |
| 2 | Loop reset made continuous (point 3) | The page's one authored moment currently stutters | High | S |
| 3 | Corners token (point 5) | Buttons and cards read as default HTML | Medium | S |
| 4 | Remove the repeated AMX sentence; merge Practice and the Intel role; the Intel role becomes 3 short result lines from the same facts | Repetition reads as filler to a recruiter | High | S |
| 5 | Focus shows the three areas the facts already support (AI infrastructure; private and hybrid cloud; cost of ownership), with the whitepaper card sized to its content | One heading plus a tall empty card looks unfinished | Medium | M |
| 6 | Section heads tighter: name and description on one line on desktop, less space above | Each section loses about half a screen before it starts | Medium | S |
| 7 | Contact: add an email if Mohamed gives one (already on the questions list) | A phone number alone is unusual for a hiring manager | Medium | — |

## Task B: the phone version, section by section
- **Top bar:** name on row one, section strip on row two (point 4). The bar hides when scrolling down and returns when scrolling up, so it costs nothing while reading.
- **Hero:** centred and symmetric (point 2). It fits in one screen at 390x750 and 360x640, buttons included.
- **Section heads:** heading and one-line description only, the rule tighter, spacing about half of today's.
- **Practice:** the statement, then the first paragraph only. The Dell EMC paragraph sits behind "More". The facts become a compact 2x2 grid.
- **Focus:** the three areas as three short stacked blocks, and the whitepaper as a slim full-width card.
- **Career:** one card per employer (logo, name, years). The current role is open; earlier roles are one-line rows that expand. That cuts this section by about two thirds.
- **Research:** on a phone the diagram comes first, with a live caption in the panel ("1 · Copy while running") that changes with the loop. The three steps follow as a plain list. Publications and patents show the top three, then "See all".
- **Contact:** unchanged in content. The LinkedIn button stays full width and gets the new corners.
- **Target:** the home page under about 6,000px on a phone, down from 10,900.

## What to keep
Section order, the type family, the light-to-dark ground progression, the career logos, the migration diagram, and the dark Contact with one clear LinkedIn action.
