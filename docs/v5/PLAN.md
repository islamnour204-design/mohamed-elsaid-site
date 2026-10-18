# v5 plan: Claude + Sol 6.1, reconciled

2026-10-18. Sources: `CLAUDE-PROPOSALS.md` and `SOL-6.1-REVIEW.md`, both written independently of each other. Waiting for Islam's approval. Nothing is built yet.

## Key points
- Claude and Sol agree on the big four: rebuild the hero on one shared grid; fix the research loop's dead pause and snap restart; replace the boxed phone Menu; add a small corner radius.
- They also agree on: putting a live step caption inside the diagram on phones, removing repeated copy, collapsing older career roles on phones, and roughly halving the phone section spacing.
- They differ on two things: **how the phone navigation looks**, and **the order of the phone hero**. Islam picks.
- Sol found real problems Claude missed: at 360x640 the hero buttons fall off the first screen; the diagram labels shrink to about 9px on small phones; the CV and Publications pages use 11px section headings; the GUC logo file is 417KB.
- Sol said the footer should link to Instagram. That is overruled: Islam chose LinkedIn on 18 October.

## Agreed: will be built once Islam approves
1. **Hero rebuilt on the content grid.** Copy and portrait share the same column edges. A tonal panel sits behind the portrait for depth (a ground step, not a frame). The phone version gets its own composition (decision 2 below).
2. **Research loop made continuous.** Step 3 stays lit until the picture is complete. A short rest follows, then a 0.6s visible reset (B's pages fade, A brightens), and round one starts. No dead 2 seconds and no one-frame snap. Packets also move during round two.
3. **Diagram caption on phones.** "Step 1 of 3" and its text sit inside the diagram panel, using HTML text so it stays about 14px or larger. The full three-step list stays below.
4. **Corners.** One token: 8px on buttons and cards (both reviews landed within 6–10px). Section boundaries, photos and logos stay straight. DESIGN.md's "radius 0" rule is updated as Islam's decision.
5. **Copy edits, facts only.** Remove the repeated AMX sentence. Practice and the Intel role stop describing the same job twice. Trim filler phrases.
6. **Phone length.** Section spacing drops from 88px to about 48–64px. Career keeps all three logos and all five titles and dates; the current role is open and earlier roles expand on tap. Publications and patents show a short selection on the home page, with "See all". Target: the home page about half its current phone height (11,100px now).
7. **Readability.** Phone body text 16–17px. The CV and Publications section headings go up from 11px. Research title links get 44px tap targets. "3 languages" stops wrapping at 360px.
8. **Speed.** Shrink the 417KB GUC logo and lazy-load the images below the first screen.

## Decisions for Islam
1. **Phone navigation.** (a) A swipeable strip of section names under the header, like desktop: Claude's proposal. (b) A light "Sections ⌄" control plus a direct Contact link, opening a compact grouped panel: Sol's proposal.
2. **Phone hero order.** (a) Portrait first, centred, then the name, title, claim and two buttons: Claude. (b) Name and title first, then a smaller portrait (150–170px), one full-width Contact button with Research as a text link, and the long claim moved lower: Sol.

**Islam decided, 2026-10-18:** navigation **(b)**, Sol's "Sections ⌄" plus a direct Contact link. Hero **(a)**, Claude's centred layout with the photo first. On short phones (360x640) the photo shrinks so both buttons stay on the first screen (Sol's finding).

## Built 2026-10-18 (Islam approved: "go")
All eight agreed items, plus both decisions. Deviations from the plan, stated plainly:
- **Copy:** the Career text is Mohamed's verbatim CV wording (marked "not rewritten" in the source), so it was not reworded. The repeated AMX sentence moved behind "Read role details" in the Intel role and stays visible in Focus.
- **Phone length:** 11,100px → 8,200px at 390 wide (−26%), not the ~6,000 targeted. The rest is real content (the Intel role text, Focus areas, four patents); cutting further means hiding facts, which is Islam's call.
- **Phone Practice:** the Dell EMC paragraph is hidden on phones only. Career repeats it two screens below.
- **Desktop hero:** the name runs on one line across both columns; the portrait (up to 560px) rises beside it on its panel.
- The checker (`tools/check.mjs`) now requires every radius to come from the token, instead of banning radius.

## Later, not in this round
A section index on the CV and Publications pages, and a print layout for the CV (Sol, medium impact). An email in Contact if Mohamed sends one.

## How it will be checked
Rendered at 1366x657, 1536x730, 1920x960, 390x750 and 360x640, with the hero and the diagram checked at each size. Several loops of the diagram are watched frame by frame. Then the build is deployed to mohamed-elsaid.pages.dev and Sol 6.1 reviews the result (pipeline step 5).
