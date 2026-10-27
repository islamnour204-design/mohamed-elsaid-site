# v6 plan: Mohamed's feedback of 27 October

Approved by Islam 2026-10-27 ("go"). Debate step skipped by Islam's choice.

## Key points
- Contact: the phone number comes off (on phones it opened WhatsApp). LinkedIn and email stay, and a booking calendar goes under them.
- Booking runs on Cal.com, embedded in the page. The visitor sees times in their own zone, Mohamed gets the request in Munich time and approves it, and the visitor gets a confirmation email.
- New section "AI infrastructure" after Focus, before Career: one AI request followed through the infrastructure, playing by itself with a pause button and clickable steps. No scroll pinning.

## 1. Contact and booking
- Remove `tel:` link. Add email `Mohesam84@gmail.com` (given by Mohamed, 27 Oct). LinkedIn stays the main button.
- "Book a call" block under the links. Cal.com inline embed, dark theme, petrol accent read from tokens at runtime (no raw hex: build check).
- Until Mohamed has a Cal.com account, `data-cal-link` is empty and the block shows a "Request a time by email" button instead. Setting the link is a one-line change.
- Mohamed's setup steps: `docs/v6/CALCOM-SETUP.md`.

## 2. AI infrastructure section
Concept: "One request, through the stack". Drawn as stacked layers, matching the site's descent idea:

1. **Request**: the prompt arrives and splits into tokens.
2. **Placement**: the scheduler sends it to the server with free capacity.
3. **Prefill**: weights stream from memory; AMX tiles process all prompt tokens at once and fill the KV cache.
4. **Decode**: one token at a time; each new token reads the weights again and adds one KV cache entry.
5. **Answer**: tokens stream back to the user as they are made.

Deviation from the chat proposal: "Memory" and "Compute" became "Prefill" and "Decode", because that is how inference really splits (prefill is compute-heavy, decode is memory-heavy). It is truer to Mohamed's whitepaper.

- Section ground: dark (ground-6), between two light sections. My decision (skills silent): the hardest possible boundary, and it reads as the machine room. Islam can ask for light.
- Motion: self-playing loop, Setup, Action, Resolution (motion-design), pauses out of view, pause button (WCAG 2.2.2), steps clickable to jump. Reduced motion: finished still frame.
- No invented performance numbers.
- Nav gains "AI" link.
