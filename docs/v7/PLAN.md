# v7 plan: Claude + Sol 6.1, reconciled (2026-10-27)

Sources: CLAUDE-PROPOSAL.md (written before Sol's answer) and SOL-6.1-REVIEW.md (independent). Waiting for Islam's two decisions. Nothing is built yet.

## Key points
- Both agree: the AI animation is too close to the migration one and gets replaced, not tweaked.
- Both agree on the booking order: the calendar comes first, then Contact. Hero main button and the phone navigation shortcut become "Book a call".
- Both agree on a phone pass: bigger section titles, a clear rule at each section edge, and a phone drawing redrawn for the phone.
- They differ on the new animation's idea, and on whether the AI section stays dark. Islam picks.

## Agreed (built once Islam decides)
1. **Science fixes** (Sol's table): AMX shown as 8 tile registers plus the TMUL engine, not a grid of 64 units; "AMX-capable Xeon"; prefill also produces the first answer token; decode reads the KV cache and adds to it; "memory bandwidth often limits decoding", not always; a visible note that it is an illustrative example.
2. **Booking first.** Calendar open on the page, above LinkedIn and email. Hero main button "Book a call". Phone navigation shortcut "Book a call" (Contact stays in Sections). Loading, failure and retry states, plus a direct link to the booking page.
3. **`?cal=` preview switch** works only on preview addresses, never on the live site.
4. **Phone:** section titles 30px weight 600 (from 24px/500); a strong rule at the top edge of each section; fewer inner dividers; AI step text 16px with a 32px number column; stable caption height; drawing labels that land at 16px; shorter intro on phones.
5. **Example prompt** fixed so the answer does not invent a fact (no "revenue grew" without a report).

## Overruled
- Sol: footer credit should link to Instagram. Islam chose LinkedIn for this site on 18 October. Stays LinkedIn.
- Sol: keep outer phone spacing as is (Claude wanted more). Claude concedes: spacing is already 64px; the fix is hierarchy and boundaries.

## Decisions for Islam
1. **The animation idea.**
   (a) Claude: "Zoom": one request from the data centre hall down to a rack, a server, the Xeon chip, one core and the AMX unit. One level on screen at a time. Cinematic.
   (b) Sol: "Serving timeline": three users' requests on a shared server over time, waiting, prompt processing, tokens streaming, one finishing so the next starts. Shows the real infrastructure trade-off (capacity, batching, memory). With an optional "inside the computation" close-up.
2. **AI section ground.** Dark (as now, Claude) or light (Sol: keeps the page's light-to-dark descent; dark returns at Research).

## Blocker outside the build
A Cal.com account (Islam's demo now, Mohamed's later) to show the real calendar on the preview.

## Comparison page (2026-10-27)
Islam asked to see both ideas and both grounds before choosing: samples/v7-compare/index.html (stills of A Zoom and B Timeline, Light/Dark switch). Waiting for his pick.

## Built 2026-10-27 (commit 226815a)
Islam chose A (Zoom) on a light ground. Built: six-level zoom with real AMX structure (8 tile registers, TMUL, TILELOADD / TDPBF16PS / TILESTORED), answer streams back up; booking first in Contact (opens-soon card until a Cal.com link exists; loading/failure states; ?cal only on preview hosts); hero and nav "Book a call"; 2px rule at every section edge; section names 600 weight, 30px on phones. Preview: https://v7.mohamed-elsaid.pages.dev. Checked 1440 and 390, release build, reduced motion, mid-zoom frames; no console errors. Phone page 10,149px (AI section and booking added). Not yet: Sol 6.1 build review, Cal.com account, deploy to main.

## Sol 6.1 build review, fixed 2026-10-27
Review: docs/v7/SOL-6.1-BUILD-REVIEW.md. All 8 findings fixed: token/activations/KV-cache wording and "one of a great many"; nav links 44px wide; phone legend under the drawing, stronger outlines, short phone intro; stable heights for caption, instruction line and answer (measured: prompt box does not move); calendar states with Try again and a live status; zoom pacing in tokens (--zoom-move/-hold/-back); "simplified notation" note; Pause beside the level buttons, distinct screen-reader names for both pauses.

## Bug fixed 2026-10-27 (8853de5)
Islam: the zoom jumped straight to level 6. Cause: the release CSS minifier rewrites 1150ms as 1.15s; ms() in main.js assumed milliseconds and divided by 1000 again, so levels 1-5 lasted about 0.001s. Exposed when the zoom pacing moved into tokens (Sol 6.1 finding 6); the same bug had silently made --d-mid/--d-reveal motion near-instant on every live version. ms() now reads the unit. Verified on the live v7 preview at 1440 and 390: levels 1 to 6 in order. Hero photo and Practice measured identical to v5 (511x424 / 289x239).

## Live on main 2026-10-27
Deployed to https://mohamed-elsaid.pages.dev (deployment 0f88811c). Verified live: zoom plays 1 to 6 at 390, no errors, X-Robots-Tag noindex on the pages.dev address. Waiting for Mohamed: feedback, Cal.com link (docs/v6/CALCOM-SETUP.md), domain.
