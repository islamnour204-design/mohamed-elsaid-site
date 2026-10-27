# Sol 6.1 build review of v7 (2026-10-27)

Read-only, debate lane. Brief: docs/v7/BRIEF-SOL-BUILD.txt

## Key points

- **v7 follows the main approved decisions.** Keep the design. Correct the AI explanation and two undersized navigation targets before sending it to Mohamed.
- **The zoom reads as continuous on desktop.** The six levels, eight tile registers and TMUL engine are credible; the explanation overstates what the illustrated multiplication produces.
- **Phone hierarchy is substantially clearer:** 30px/600 section titles, 64px outer spacing and 2px section boundaries.
- **The phone AI drawing loses essential labels.** The promised phone redraw became the desktop drawing with all internal text hidden.
- **Booking comes before the contact links, as requested.** The opens-soon card is appropriate. Loading recovery lacks Retry, and the public demo remained on a spinner during my inspection.
- **Focus and pause controls worked.** Sampled text contrast passed. Reduced-motion handling looks correct in the source, but I could not verify it through browser emulation.
- **No files changed.** The read-only release scanner and whitespace check passed.

## Must fix before the client sees it

### 1. Correct the AI explanation without changing the Zoom concept

**Where:** [index.html:247](</D:/Business/Clients/Mohamed Essam Website/src/index.html:247>), [index.html:251](</D:/Business/Clients/Mohamed Essam Website/src/index.html:251>), [main.js:487](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:487>).

The hardware hierarchy is sound. Eight tile registers plus TMUL matches Intel’s description. `TILELOADD`, `TDPBF16PS` and `TILESTORED` are valid instruction names; “in one instruction” is also valid and does not mean one clock cycle. [Intel AMX overview](https://www.intel.com/content/www/us/en/products/docs/accelerator-engines/what-is-intel-amx.html)

The remaining problems are:

- **“A: prompt”** suggests that raw prompt text enters the multiplication. It should identify numerical **input activations**, derived from the text.
- **“First word” and “each next word”** should say **token**, explained once as a piece of text.
- **The approved KV-cache explanation is missing.** Saying each next word “repeats the work” can suggest that the server processes the entire prompt again.
- The sequence shows one multiplication followed by an answer. It needs to state that this is **one representative operation among many across the model’s layers**.

**Concrete fix:** Rename the input tile, add the token explanation, and revise the return caption to explain that prompt processing supports selection of the first token; subsequent decoding reuses and extends the KV cache. Retain “memory bandwidth often sets the pace.” Cached keys and values avoid recomputing earlier context. [Hugging Face cache documentation](https://huggingface.co/docs/transformers/main/en/cache_explanation)

The camera pulling back while text streams is a reasonable storytelling device once that qualification is present.

### 2. Make the AI and CV navigation links at least 44px wide

**Where:** [site.css:37](</D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:37>).

At desktop width, I measured:

| Link | Width | Height |
|---|---:|---:|
| AI | 29.8px | 44px |
| CV | 36.3px | 44px |

Both fail DESIGN.md Part A’s explicit 44px target requirement.

**Concrete fix:** Apply the existing `--tap-min` token to minimum width as well as height, and centre the labels.

## Should fix

### 3. Finish the phone treatment of the AI drawing

**Where:** [site.css:901](</D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:901>).

At 390px, the drawing is approximately **335 × 209px**. The stylesheet hides every internal label, including register names, input/weight/result labels and “TMUL engine.” The explanatory paragraph names these things but does not identify their positions.

The pale context shapes also have weak separation: register fill against its background measures approximately **1.13:1**; rack fill approximately **1.26:1**.

**Concrete fix:** Give the phone drawing a small, readable legend or simplified labelled composition. Keep essential labels at a real 16px and strengthen the outlines of meaningful components using the existing palette.

This is a plan gap: the plan promised a phone redraw and readable labels. The shorter phone introduction is also absent; the same paragraph occupies six lines. The former numbered step list has instead become six 15px buttons and a 17px caption.

### 4. Reserve space for the instruction and complete answer

**Where:** [site.css:613](</D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:613>), [site.css:623](</D:/Business/Clients/Mohamed Essam Website/src/styles/site.css:623>).

The caption paragraph reserves space, but the instruction row does not. I measured it changing from **16px empty to 39.25px populated**, moving everything underneath by **23.25px**. The answer can also exceed its two-line reservation on a phone.

**Concrete fix:** Reserve enough room for the longest instruction and complete answer at each width. Keep the prompt and Pause button stationary throughout a loop. This completes the plan’s stable-caption requirement.

### 5. Complete calendar failure and retry states

**Where:** [main.js:725](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:725>), [main.js:732](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:732>), [main.js:759](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:759>).

The normal opens-soon state is clear and correctly placed. The preview switch works, and its hostname guard excludes the base production Pages address and custom domains.

With the demo enabled, I observed:

- The loading message and spinner.
- “The calendar is slow to load” after 15 seconds.
- The direct booking link appearing while email remained available.

However, there is **no Retry control**. The explicit failure handler also gives no failure explanation and leaves “Online booking opens soon,” which would be inaccurate once booking is operational.

**Concrete fix:** Distinguish unconfigured, loading, failed and ready states. Add Retry, announce status changes to screen readers, and preserve the direct link and email recovery routes.

**Uncertainty:** The demo never reached slot selection despite `document.hidden === false`. I cannot determine whether that was Cal.com, this environment or the integration. Successful loading, approval and email delivery remain unverified.

### 6. Move the new motion values into tokens.css

**Where:** [main.js:534](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:534>), [main.js:595](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:595>), [main.js:636](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:636>).

Zoom duration, hold times, return duration and easing choices remain hard-coded in JavaScript. That breaks CLAUDE.md’s values-only rule despite the scanner passing.

**Concrete fix:** Add named motion tokens and read them into the timeline. Preserve the approved pacing.

## Nice to have

### 7. Clarify the technical close-up’s level of precision

**Where:** [main.js:603](</D:/Business/Clients/Mohamed Essam Website/src/scripts/main.js:603>).

The instruction lines combine real instruction names with explanatory notation. Label them **simplified notation**, and identify BF16 inputs with an FP32 accumulated result. The mathematical matrix layout is conceptual; real BF16 operands require specific packing. [Intel instruction reference](https://cdrdv2-public.intel.com/825743/325462-sdm-vol-1-2abcd-3abcd-4.pdf)

### 8. Put Pause beside the phone level controls

**Where:** [index.html:234](</D:/Business/Clients/Mohamed Essam Website/src/index.html:234>).

The AI pause control works, but reaching it on a phone requires scrolling away from the drawing. Place it beside the level controls. Give the two diagrams distinct accessible control names, such as “Pause AI zoom” and “Pause migration.”

I inspected live screenshots at 1440px and 390px, transitions, answer streaming, keyboard focus, pause behaviour and booking loading. I found no orange, navy/brass treatment, decorative confetti or visible em-dashes. The approved light AI ground and LinkedIn footer credit remain appropriate.

Validation returned `check passed (release mode), 9 files scanned`; `git diff --check` also passed. I did not run a build because it would write files. The diff additionally contains `src/public/_headers`, beyond the four files listed in the brief.
