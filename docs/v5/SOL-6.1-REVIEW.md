# Sol 6.1 independent review: whole site + phone version

2026-10-18. gpt-6.1-sol, debate lane, read-only. Live build 0f57aed. Brief: pointer only (paths, URL, Islam's words); Sol read nothing under docs/.

## Key points

- **The largest problem is the hero’s composition.** Text and portrait follow different alignment systems; they become increasingly disconnected on taller desktop screens.
- **The phone version needs its own composition and content priorities.** Readability generally survives, but the portrait placement, long sections and repeated spacing weaken the experience.
- At **360×640**, the first hero button starts around **618px down** and is partly cut off; the second sits below the screen. Both buttons fit beside each other at 390px.
- **The research “lag” is chiefly a programmed pause and abrupt restart.** I observed several complete loops at each requested size.
- The numbered research steps change in order, but **phone users cannot comfortably watch the diagram and read the steps together**.
- The mobile menu works, including keyboard navigation and Escape. Its heavy outline and large, undifferentiated dropdown need redesign.
- Publications and CV are useful, but their **11px section headings and small reading links** weaken navigation and hierarchy.
- Keep the palette, factual material, employer logos, section order and research concept. **Improve composition before adding effects.**

I inspected the live pages in Edge at all four requested sizes, plus the hero at 1440×900. No files were changed or committed, and nothing under `docs/` was read.

The recommendations follow `craft-floor`’s “tight groups, generous separation,” `taste`’s consistent corner system, and `ui-ux-pro-max`’s instruction to show core content first on mobile. Exact proposed dimensions below are my recommendations for this content.

## Islam’s points

### 1. Independent review of the website and visuals

**Diagnosis:** The site contains substantial evidence of Mohamed’s work, but gives repeated introductory statements and long employment descriptions considerable space. The strongest evidence often arrives late. The result feels closer to an extended professional record than a deliberately composed introduction.

**Fix:** Give each section a clear purpose: introduce Mohamed, explain his practice, establish current focus, show career progression, demonstrate research, then enable contact. Preserve that order while reducing repetition and strengthening the visual differences between sections.

### 2. “The mobile version looks so bad”

**Diagnosis:** The phone layout mainly stacks desktop content. At 390px, the home page measures approximately **11,100px**; at 360px, approximately **11,600px**. Length alone is acceptable, but much of this journey consists of repeated explanations and generous section scaffolding.

The phone rules retain **88px section padding above and below**, plus substantial heading spacing. See [site.css:571](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:571>).

**Fix:** Recompose the hero, shorten homepage summaries, retain full records on CV/Publications, and reduce mobile section spacing selectively. Keep meaningful space around content rather than giving every section the same large opening and closing gaps.

### 3. Hero symmetry, proportions and portrait placement

**Diagnosis:** On desktop, text sits inside a centred container while the portrait is absolutely positioned against the window’s bottom-right corner. A full-screen hero centres the text vertically while keeping the picture at the bottom. This creates the pronounced separation seen at 1920×960.

See [site.css:101](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:101>) and [site.css:138](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:138>).

On phones, the portrait deliberately comes first, occupies `60vw`, and remains right-aligned. The left-aligned name then starts underneath it. See [site.css:575](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:575>).

**Fix:** Use a shared desktop composition for portrait and copy, with deliberate alignment between the face, name and actions. On phones, show identity first and use a smaller, centred cut-out portrait within the same reading column. Preserve the unframed treatment.

### 4. Research animation lag and numbered steps

**Diagnosis:** The timeline runs for approximately **3.5 seconds**, then explicitly waits **two seconds** before repeating. The reset instantly restores server A and empties server B.

See [main.js:207](<D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:207>).

There are two additional discontinuities:

- The third-step highlight clears at **3.3 seconds**, while the final fade continues until **3.5 seconds**.
- Network packets move during the first copying phase; subsequent copying phases lack equivalent network movement.

See [main.js:213](<D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:213>) and [main.js:235](<D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:235>).

The steps **do activate in sequence**. On phones, their position above the diagram makes that relationship difficult to follow.

**Fix:** Give the sequence an explicit completion state, retain step three until completion, and introduce a short, intentional replay transition. Give each explanatory phase enough reading time while shortening the unexplained idle period. Place the current numbered caption inside the diagram component.

This applies `motion-design`’s “Setup → Action → Resolution” rule. Simply making the entire animation faster would reduce comprehension.

### 5. The mobile Menu button

**Diagnosis:** A strong rectangular border gives a secondary navigation control disproportionate visual weight. Opening it reveals seven equally weighted destinations in a panel occupying roughly half the smaller phone screen.

See [site.css:543](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:543>).

**Fix:** Keep the fixed header. Use a lighter **Sections + chevron** control, with Contact directly accessible. Group the five homepage destinations separately from Publications/CV in a compact disclosure panel. Retain visible focus, expanded-state information and Escape dismissal.

### 6. Sharp corners everywhere

**Diagnosis:** Repeated outlined rectangles make the interface feel rigid. The effect comes from shape, borders and the frequency of boxed controls together.

`DESIGN.md` currently bans rounded corners, and [tokens.css:95](<D:/Business/Clients/Mohamed Essam Website/src/styles/tokens.css:95>) records `--radius: 0`. That is an existing project preference to revise explicitly.

**Fix:** My recommendation is a restrained **8px radius for boxed interactive controls**, fewer outlined secondary buttons, and straight section boundaries. Apply one documented system consistently. This follows `taste`’s shape-consistency rule; rounding alone will not repair the hero or phone layout.

## Task A: problems and proposals, ranked

Ranks below apply to both the problem and its proposed remedy. **S/M/L** indicate relative implementation effort, including responsive verification.

| Rank | Page, section, viewport: problem | Change / why | Impact | Effort |
|---|---|---|---|---|
| 1 | **Home, hero, desktop and phone:** portrait and text lack a shared composition; small-phone actions fall below the first screen. | Rebuild the hero around shared alignment and a separate phone arrangement. Establish identity and an available next action immediately. | High | M |
| 2 | **Home, all sections, phones:** repeated copy and large heading/section gaps create a tiring journey. | Edit homepage summaries and use spacing appropriate to each section. Keep detailed records one tap away. | High | M |
| 3 | **Home, Research, all sizes:** unexplained hold/reset; phone explanation and animation separate. | Rework completion/replay timing and place the current caption beside the animation. Make the diagram teach reliably. | High | M |
| 4 | **All pages, navigation, phones:** all destinations disappear behind one visually heavy control. | Introduce lighter grouped navigation and direct Contact access. Preserve keyboard behaviour and fixed positioning. | High | M |
| 5 | **Home Research and document pages, all sizes:** diagram text scales too small; substantial role text uses 15px; document section headings use 11px. | Use 16–17px reading text, stronger section headings and diagram labels with a readable rendered size. | High | M |
| 6 | **Publications/CV, all sizes:** long records have little internal navigation; publication titles are not links, unlike the homepage. | Add a compact section index, make titles the primary reading links, and provide a clean CV print layout. Improve scanning and consistency. | Medium | M |
| 7 | **Home Practice/Focus/Career and CV:** the same work is explained repeatedly; wording such as “strengthening operational resilience and innovation capabilities” adds little specificity. | Retain concrete activities and trim general promotional language. Standardise “13 publications” rather than calling the whole collection “papers.” | Medium | S–M |
| 8 | **Home, assets and script fallback:** the GUC PNG is about **417KB**, despite its small display size; employer images load eagerly. Mobile navigation also depends on JavaScript. | Optimise logo assets, defer below-fold images and provide usable navigation if scripts fail. These are source findings, not measured loading delays. | Medium | S–M |
| 9 | **All pages, controls:** repeated solid and outlined rectangles give minor actions excessive weight. | Apply the restrained corner system and use quieter text treatments for secondary actions. | Medium | S |
| 10 | **All pages, footer:** the credit is plain text followed by a separate LinkedIn link. | Link the credit line itself to Islam’s required Instagram destination. Preserve its wording. | Low | S |

Additional accessibility findings:

- Sampled body/button colour pairs pass **4.5:1**. Secondary text on the Career ground measures approximately **4.94:1**. The palette does not need replacement.
- At 360px, the diagram’s 22-unit labels scale to approximately **9.3px**. Increasing their SVG font value has not made their final size comfortable.
- Some standalone desktop research-title links measure approximately **26px high**, below the project’s 44px target floor.
- Preserve the existing skip link, visible focus, semantic headings, portrait alternative text and diagram description.

The document-heading treatment comes from [pages.css:15](<D:/Business/Clients/Mohamed Essam Website/src/styles/pages.css:15>). The diagram scaling treatment appears at [site.css:613](<D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:613>).

## Task B: the phone version, section by section

**Overall layout**

Use one reading column with approximately **20px side gutters**, **16–17px body text**, and **1.5–1.6 line spacing**. Start with **48–64px between major sections**, adjusting around their content. Keep clear ground changes and section boundaries.

Use approximately **28–32px section headings**, **20–24px subordinate headings**, and **14–15px metadata**. Avoid repeating a heading, descriptive subtitle and large empty gap before every section’s substance.

These proposed values should become tokens during implementation.

**Hero**

Recommended reading order:

1. Mohamed’s name.
2. His existing role, Intel and Munich.
3. A compact, centred cut-out portrait.
4. Primary contact action.
5. Research link.
6. The longer infrastructure-cost statement, if retained.

Use approximately **40–44px for the name** and a portrait around **150–170px high**. Keep the primary action fully visible at 360×640; place the long statement later when necessary.

Make the primary button deliberately full-width, around **48px high**, with Research as a quieter secondary link. This avoids the current accidental change from side-by-side buttons to unequal stacked rectangles.

Keep an authored hero entrance, but establish the composition immediately and leave actions usable throughout.

**Navigation**

Keep a **56–64px fixed header**. Use a compact name, direct Contact link and a lightly styled Sections control.

The expanded panel should distinguish homepage sections from the two record pages. Use comfortable 44px targets and a clear active location. The existing keyboard focus and Escape behaviour are worth retaining.

**Practice**

Use one short lead statement and a concise explanation of the actual work. Reduce employer-history repetition because Career follows shortly afterwards.

Keep the experience and language facts compact. Remove the inset padding that causes **“3 languages” to wrap awkwardly at 360px**. Use spacing rather than a vertical divider to separate the two facts.

Keep sectors as a plain wrapping list. Preserve the requested number animation, played once.

**Focus**

Lead with AI infrastructure and its existing evidence.

Convert the phone whitepaper treatment into a compact document link, approximately **160–200px high**, with an **18–20px title**, publisher/year and clear destination. It currently consumes too much of a short screen.

Follow with Cloud and datacenter architecture, then Executive advisory. Use **20–22px headings**, readable summaries and approximately **24–32px separation**. Keep the remaining topics compact; “Also” is a weak organising label.

**Career**

Keep all three employer logos and all five role titles/dates visible.

Use a flexible logo/name header with around **16px between them**. Preserve optical differences between the logos rather than forcing identical dimensions.

Give the current role a short **16–17px summary**. Put its longer explanation behind a disclosure. Earlier roles should show title, dates and a brief summary, with details available on demand.

Use roughly **32–40px between employer groups**. Keep the full CV link at the end.

**Research introduction and diagram**

Show a short explanation of the research question, then the diagram.

The phone diagram should contain:

- Readable Server A/Server B labels.
- A current caption such as **Step 1 of 3**, with its explanation.
- Clear running, paused and completed states.
- Nearby Pause/Play control.
- A compact legend.

Keep this component comfortably within the space below the header on a 640px-tall screen. Use HTML labels or a phone-specific drawing arrangement so essential text stays around **14px at its final displayed size**. Fewer illustrative memory cells could make the process easier to follow.

Keep the full three-step explanation available below or through an explicit disclosure. Avoid requiring users to scroll between it and the moving graphic.

**Publications**

Show the existing count and two selected works initially: the recent Intel whitepaper and the migration survey provide useful range.

Keep titles readable and linked. Put venue/year underneath. Offer the full publication record directly; retain the other homepage selections through a disclosure if desired.

**Patents**

Keep **four granted patents** prominent. Use compact linked entries, with the full title/number record expandable where necessary. Avoid turning patent numbers into the main visual feature.

**Education and credentials**

Keep the doctorate and institution visible.

Place additional degrees, certifications and service in clearly named, separate disclosures. Keep their full records on CV. Preserve the required Research subsection order: Publications, Patents, Education.

**Contact**

Use the existing invitation at approximately **24–28px**, followed by location/languages once.

Place the full-width LinkedIn action immediately afterwards, then the phone action. Reduce the large gaps before these controls and before the footer.

The LinkedIn destination is a profile page; the action wording should accurately describe that destination.

**Footer**

Keep the exact credit:

“© 2026 Islam Noor. All rights reserved.”

Link that line to **https://www.instagram.com/islam.noureldin**. Allow intentional two-line wrapping on small phones, with a comfortable tap area. Remove the separate designer LinkedIn link.

**Standalone Publications and CV**

Keep these pages calm and focused on reading.

Use approximately **30–32px page titles**, **22–24px section headings**, **18–20px entry titles**, and readable metadata. Add a small section index near the introduction. Make reading links distinct from author/venue text, and provide a clean print layout for CV.

## What to keep

- The fixed section order and factual boundaries.
- The petrol palette, Geist typeface and restrained visual language.
- The unframed cut-out portrait concept.
- Employer logos on a light background.
- The research diagram’s explanatory purpose and Pause control.
- Working keyboard focus, Escape dismissal and semantic structure.
- The plain HTML/CSS/JS and GSAP stack.
- Islam’s footer credit.

## What you could not check

- These were **resized Edge browser views**, not physical-phone tests. Safari, touch behaviour and mobile browser bars remain unverified.
- Reduced-motion behaviour was inspected in source; the browser tools did not expose a preference override for runtime testing.
- I did not run Lighthouse, network throttling, frame-rate profiling, screen-reader testing or a complete zoom audit. No console warnings/errors appeared in the captured logs.
- I did not open every external publication/patent destination or independently verify Mohamed’s underlying credentials.
- No remaining-usage counter was exposed.