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
