> **Superseded 17 October 2026.** Islam rejected the v2 build: it changed the client's section order, dropped the employer logos and pinned a scroll scene. The current plan is docs/v3/CLAUDE-PLAN.md with Sol 6.1's review in docs/v3/SOL-6.1-OLD-VS-NEW.md.

# v2 direction — APPROVED by Islam, 2026-10-17

Merged from Claude's proposal and two Sol 6.1 rounds (files beside this one). This is the build spec.
Builder: Claude (Opus). Reviewer: Sol 6.1 (`debate` lane, read-only). Terra is not used.

## Key points
- Concept: **The Stack**. The page descends layer by layer, from the headline down to Contact on the darkest ground.
- Headline: **A**, kept. "The question is not whether to adopt AI. It is what the infrastructure underneath it costs."
- One pinned signature scene: the **live-migration replay** (his doctorate). Everything else is lighter.
- Build from the data in this folder only. No new client input before shipping. `QUESTIONS-FOR-MOHAMED.md` is sent in parallel; answers are later swaps.

## Facts settled in the debate
- Industry career: Dell-EMC 08/2010 to 12/2016 (Technical Support Engineer level II 08/2010–10/2012, then Solutions Architect), Intel 01/2017 to now. "Sixteen years" and "six years at Dell EMC" are **supported by the PDF CV**. `content/career.md` omits the support role.
- Patents: **1 granted** (US 10,356,005 B1) + **3 applications** (US 15/222,499, 14/853,437, 14/138,756). Never "four US patents".
- Publications: the 2025 Intel item is a **Whitepaper**; do not call all thirteen "peer reviewed".
- Client's new text (verbatim source): AMX edge-AI proofs of concept ("several"); "tens of enterprise and government customers as well as OEMs across EMEA (automotive, industrial, financial, telco, public sector)". Keep "tens" and "several" as words.
- Sectors are his five: automotive, industrial, financial, telco, public sector.
- Portrait: `src/assets/img/mohamed-elsaid.webp` (680×564 cut-out, no watermark). The AI placeholder PNG is removed.

## Structure

| # | Section | Content | One moment |
|---|---|---|---|
| 1 | Hero | Headline A, large name, Intel role, Munich, portrait at **medium** size merged into the ground, buttons | Name letter-rise (overlapping, resolves as one phrase), then one restrained light sweep. Role, text and buttons readable immediately. No page drop. |
| 2 | Advisory | Client's EMEA statement, enterprise / government / OEM, five sectors. Practice + Focus merged here. | The left stack indicator opens into labelled compute, cloud and storage layers. |
| 3 | Edge AI | AMX proofs of concept (client wording) + 2025 Whitepaper | Two labelled input tiles combine into a result tile (how AMX works). **Compact, normal flow, not pinned.** No benchmark implied. |
| 4 | Research & invention | Doctorate (HPI, Prof. Meinel; thesis: VM live migration cost modelling and prediction), selected papers, 1 granted patent + 3 applications | **Signature, pinned:** VM moves host A → host B. Initial memory copy → changed pages copied again in shrinking rounds → brief handover → destination running. Labelled "simplified illustration". No figures. Then patents settle, still and readable. |
| 5 | Career | Compact dated timeline incl. Dell support role. Full verbatim prose on the CV page. | A line connects the positions as you descend. |
| 6 | Contact | LinkedIn, phone, Munich, languages, invitation. Email only when confirmed. | Darkest ground; closing line fills with the accent once. Footer: "© 2026 Islam Noor. All rights reserved." + Instagram link. |

**Stack indicator:** thin, left edge, real section names, clickable; phone equivalent.
**Figures:** no standalone count-up strip. Numerals sit in context (patents with patents, publication count with papers, languages with contact).
**Cut from home:** "Argument" label, duplicate capability catalogue, placeholder metrics, residency line, certificate list, long early-career prose.
**Secondary pages:** `publications.html` (full bibliography) and `cv.html` (dated facts + verbatim wording, no personal data, not the executive PDF) — plain and readable, no scroll spectacle.

## Must-pass
- Fixed navigation, keyboard usable.
- Pinned migration stage fits 1366×657; phone gets a flowing version; `prefers-reduced-motion` shows every final state.
- Fix: phone section headings clipping; `#L1` missing-element error.
- Release check passes (no placeholders, no em-dashes, no invented email).
- Screenshots at 1366×657, 1536×730, 1920×960, 390×750, 360×640; pinned scene at start, middle, end; no horizontal scroll.
- Sol 6.1 review of the rendered site before Islam sees it as final.
- Then deploy to Cloudflare for a shareable review link (domain later).
