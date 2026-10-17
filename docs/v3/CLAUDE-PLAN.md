# Mohamed Elsaid site, v3 plan (Claude, written before reading Sol's answer)

## Key points
- Base = the old version (f97d6ec), in its section order: Hero, Practice, Focus, Career, Evidence, Contact.
- Carry over from v2 only what is better: facts, Mohamed's new text, the real portrait, Publications and CV pages, accessibility fixes.
- Motion: small, self-playing, triggered once when a section enters. Nothing pinned, nothing scrubbed to the scroll.

## Section by section (order unchanged)

1. **Hero (01).** Keep the old layout and claim. Swap the AI placeholder portrait for the real one (`mohamed-elsaid.webp`). Keep the v2 letter-rise on the name, played once on load. Drop the light sweep.
2. **Practice (02).** Keep the old text and figures. Replace the two `000` / `00%` placeholders with Mohamed's new text: "Tens of enterprise and government customers advised across EMEA" and "Edge AI proofs of concept on Intel AMX". Numbers count up once when seen. Sectors list follows his new text: automotive, industrial, financial, telco, public sector.
3. **Focus (03).** Keep the three practice rows plus "Also". Add an Edge AI / AMX line from his new text inside the AI infrastructure row. No AMX tile animation.
4. **Career (04).** Light ground, as before. Logos back, large and faint, merged into the background behind each employer (Intel, Dell EMC, GUC). Animation: each employer block fades and rises in turn, the logo settles from slightly larger to rest. No scroll-drawn line. Roles verbatim, plus the Dell support role from the PDF.
5. **Evidence (05).** Back to three clearly labelled groups: Publications, United States patents (1 granted, 3 applications), Foundations (education, certification, service). Each with a link to the full Publications page. The migration story becomes at most a small self-playing diagram beside the intro line, or is cut. Recommend: cut it for this round.
6. **Contact (06).** Keep. LinkedIn and phone, no invented email. Footer credit unchanged.

## Carried over from v2
- Fact fixes: Dell support role 08/2010 to 10/2012, patents as 1 granted plus 3 applications, AMX wording.
- `publications.html` and `cv.html` pages.
- Keyboard: skip link, focus after menu jumps, Escape closes menu, 44px tap targets, contrast fixes.
- Phone menu.

## Dropped from v2
- The Stack concept and left-edge layer indicator, the depth bar.
- Pinned migration scene, AMX tile scrub, timeline line, contact clip fill.
- Lenis smooth scroll (part of the stutter feeling). Use native scroll.

## Cost
Build: my own work, no Codex. Then one Sol 6.1 review of the result: about 150-230k Codex tokens.
