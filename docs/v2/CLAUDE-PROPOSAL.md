# v2 direction: Claude's independent proposal

Written 2026-10-17 by Opus 5.5 **before** reading Sol 6.1's independent review, so the two can be compared honestly.

## Key points
- Keep the codebase and the facts. Rebuild the page itself: new structure, new motion.
- The concept already exists and was diluted: **scrolling descends an AI system, from the business question down to silicon.** Make it literal.
- Each section gets one scroll moment taken from his actual work: AMX tiles, live VM migration, patents.
- The numbers block uses only figures we can prove today. No `000`, no "16 years".

## 1. Critique of what exists

**Works:** the headline ("The question is not whether to adopt AI. It is what the infrastructure underneath it costs."), the petrol palette, the light-to-dark move, the truth rules, the check harness that blocks placeholders.

**Concept problem (the big one):** the August plan was "five layers of a stack". The August 23 restructure renamed sections to Argument / Practice / Focus / Career / Evidence / Contact, which are document headings. The stack survives only as a background colour change. Nobody scrolling it would know they are descending anything.

**Craft problems:**
1. No signature moment a visitor would remember (playbook: "every section needs one moment").
2. Small grey text everywhere. Focus, Career and Evidence are lists of 12–14px lines.
3. Portrait small and boxed in a corner.
4. No credit footer for Islam.

**Truth problems on the page now:**
1. "Sixteen years" (heading and figure). His own career document: Dell EMC from 11/2012, so about 14 years in industry.
2. "Six years at Dell EMC, first as a level two support engineer". His document: 2012–2016, one role, Solutions Architect.
3. Sectors list (Manufacturing, Higher education...) does not match his words: automotive, industrial, financial, telco, public sector.
4. `000` and `00%` placeholders.

## 2. Rebuild or upgrade

Keep: the repo, git history, `tokens.css`, the content files, the check and screenshot tools, Vite and GSAP.
Rebuild: `index.html` structure and all motion. Add Lenis for smooth scroll (playbook stack).

## 3. Direction: "The Stack"

The organising idea is his own thesis: *the cost of AI is decided underneath it.* The page is a cross-section of an AI system. You start at the business question and scroll down through layers until you reach the silicon. A thin stack indicator on the left edge (five slabs) shows which layer you are in and fills as you descend.

| Layer | Content | Its one scroll moment |
|---|---|---|
| 01 The question (hero) | Giant headline, name, role, portrait | Headline rises line by line; on "underneath" the page drops, the stack indicator appears. Portrait large on the right, cut out, fading into the ground, petrol duotone to hide the low-resolution source. |
| 02 Advisory | "Tens of enterprise and government customers, and OEMs, across EMEA", his five sectors | The five sectors stack up as slabs while the proven numbers count up beside them |
| 03 Edge AI | New section from his new text: proofs of concept on edge AI with Intel AMX, plus his 2025 paper | Pinned scene: a grid of matrix tiles (AMX works on tiles) fills in as you scroll |
| 04 Research | Doctorate at HPI, VM live-migration cost modelling, 13 papers | **Signature of the page:** a literal live-migration replay. A virtual machine moves from host A to host B as you scroll, memory pages copy across in rounds that shrink each pass (pre-copy), and the cost figure ticks. This is his doctorate drawn, not described. |
| 05 Patents | 4 US patents | Four patent numbers stamp in one by one, the granted one largest |
| 06 Career | Intel, Dell EMC, GUC, his verbatim text | A timeline drawn downward as you scroll, years marked, logos settle |
| Base: Silicon / Contact | LinkedIn, phone (email unconfirmed) | Ground goes to its darkest; a giant closing word fills with the accent colour. Footer with Islam's credit. |

**Numbers block, built from what we can prove:** 4 US patents · 13 publications · 1 doctorate (HPI) · 5 sectors · 3 working languages · "in industry since 2012". "Tens of customers" stays as a sentence, not a fake number.

**Cut:** the separate Focus section with eight practice areas (folded into Advisory and Edge AI), the long certificate list on the home page (moves to the CV page).

## 4. Top risks

1. **The photo.** Low resolution and watermarked. Large use depends on the duotone hiding it; if it doesn't, it stays medium-sized.
2. **The migration replay is the hardest piece to build well.** If it reads as a generic diagram it fails. It needs a builder who can do a pinned GSAP scene, and a screenshot review at five viewports.
3. **Intel's policy and NDA** on personal sites is unknown. Nothing on the page names a customer or claims a result figure, which keeps us safe.
